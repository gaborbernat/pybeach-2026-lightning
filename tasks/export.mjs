import { mkdirSync } from 'node:fs';
import { chromium } from 'playwright-chromium';
import { spawnSync } from 'node:child_process';

mkdirSync('pdf', { recursive: true });
const browser = await chromium.launch({ executablePath: '/usr/bin/google-chrome' });
try {
  for (const theme of ['light', 'dark']) {
    const context = await browser.newContext({ viewport: { width: 1440, height: 810 }, colorScheme: theme });
    await context.addInitScript(value => localStorage.setItem('slidev-color-schema', value), theme);
    const page = await context.newPage();
    await page.goto('http://localhost:3031/#/export', { waitUntil: 'networkidle' });
    await page.evaluate(() => document.fonts.ready);
    await page.locator('.qr-code canvas').evaluateAll(async codes => Promise.all(codes.map(async canvas => {
      const image = new Image();
      image.src = canvas.toDataURL();
      image.width = canvas.clientWidth;
      image.height = canvas.clientHeight;
      await image.decode();
      canvas.replaceWith(image);
    })));
    await page.locator('video').evaluateAll(async videos => Promise.all(videos.map(async video => {
      const poster = document.createElement('img');
      poster.src = video.poster;
      poster.className = video.className;
      await poster.decode();
      video.replaceWith(poster);
    })));
    await page.pdf({ path: `pdf/pybeach-lightning-${theme}.pdf`, printBackground: true, preferCSSPageSize: true });
    await context.close();
  }
} finally {
  await browser.close();
}
const speaker = spawnSync(process.execPath, ['tasks/export-speaker.mjs'], { stdio: 'inherit' });
if (speaker.status !== 0) throw new Error('Speaker export failed');
