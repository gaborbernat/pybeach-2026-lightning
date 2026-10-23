import { mkdirSync, readFileSync } from 'node:fs'
import { parse } from '@slidev/parser'
import MarkdownIt from 'markdown-it'
import { chromium } from 'playwright-chromium'

const { slides } = await parse(readFileSync('slides.md', 'utf8'))
const markdown = new MarkdownIt()
const browser = await chromium.launch({ executablePath: '/usr/bin/google-chrome' })
mkdirSync('pdf', { recursive: true })

try {
  const context = await browser.newContext({ viewport: { width: 1440, height: 810 }, colorScheme: 'light' })
  await context.addInitScript(() => localStorage.setItem('slidev-color-schema', 'light'))
  const page = await context.newPage()
  const sections = []
  for (const [index, slide] of slides.entries()) {
    const number = index + 1
    await page.goto(`http://localhost:3031/?print=true#/${number}?clicks=99`, { waitUntil: 'networkidle' })
    const visible = page.locator(`.slidev-page-${number}`)
    await visible.waitFor({ state: 'visible' })
    await page.evaluate(() => document.fonts.ready)
    await page.evaluate(() => Promise.all(document.getAnimations()
      .filter(animation => animation.effect?.getComputedTiming().iterations !== Infinity)
      .map(animation => animation.finished.catch(() => undefined))))
    await page.addStyleTag({ content: '.pointer-events-none > .stroke-white { display: none !important; }' })
    await visible.locator('.qr-code canvas').evaluateAll(async codes => Promise.all(codes.map(async canvas => {
      const image = new Image()
      image.src = canvas.toDataURL()
      image.width = canvas.clientWidth
      image.height = canvas.clientHeight
      await image.decode()
      canvas.replaceWith(image)
    })))
    await visible.locator('video').evaluateAll(async videos => Promise.all(videos.map(async video => {
      const poster = document.createElement('img')
      poster.src = video.poster
      poster.className = video.className
      await poster.decode()
      video.replaceWith(poster)
    })))
    const links = await visible.evaluate(element => {
      const bounds = element.getBoundingClientRect()
      return [...element.querySelectorAll('a[href]')].flatMap(anchor => [...anchor.getClientRects()]
        .filter(rect => rect.width && rect.height)
        .map(rect => ({
          href: anchor.href,
          label: anchor.getAttribute('aria-label') ?? anchor.textContent.trim(),
          left: (rect.left - bounds.left) / bounds.width * 100,
          top: (rect.top - bounds.top) / bounds.height * 100,
          width: rect.width / bounds.width * 100,
          height: rect.height / bounds.height * 100,
        })))
    })
    const image = await visible.screenshot()
    sections.push(`<section><header>Slide ${number} / ${slides.length}</header>
      <div class="slide"><img alt="Slide ${number}" src="data:image/png;base64,${image.toString('base64')}">
      ${links.map(link => `<a href="${markdown.utils.escapeHtml(link.href)}"
        aria-label="${markdown.utils.escapeHtml(link.label)}"
        style="left:${link.left}%;top:${link.top}%;width:${link.width}%;height:${link.height}%"></a>`).join('')}</div>
      <div class="notes">${markdown.render(slide.note ?? '')}</div></section>`)
  }
  const documentPage = await context.newPage()
  await documentPage.setContent(`<!doctype html><html><head><meta charset="utf-8">
    <title>One smiley, a lot of RAM - Speaker notes</title><style>
    @page { size: A4; margin: 40px; }
    * { box-sizing: border-box; }
    body { margin: 0; color: #182536; font: 13px/1.4 Arial, sans-serif; }
    section { width: 714px; break-after: page; }
    section:last-child { break-after: auto; }
    header { margin-bottom: 10px; color: #506078; font-size: 11px; }
    .slide { position: relative; outline: 1px solid #dce3eb; }
    .slide a { position: absolute; }
    img { display: block; width: 100%; }
    .notes { margin-top: 18px; }
    p { margin: 0 0 9px; }
    a { color: #2165b1; text-decoration: none; }
    code { font-size: 0.93em; }
  </style></head><body>${sections.join('')}</body></html>`)
  const overflow = await documentPage.locator('section').evaluateAll(sections => sections
    .map((section, index) => ({ slide: index + 1, height: section.getBoundingClientRect().height }))
    .filter(section => section.height > 1042))
  if (overflow.length) throw new Error(`Speaker pages exceed A4: ${JSON.stringify(overflow)}`)
  await documentPage.pdf({ path: 'pdf/pybeach-lightning-speaker.pdf', printBackground: true, preferCSSPageSize: true })
} finally {
  await browser.close()
}
