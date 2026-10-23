# One smiley, a lot of RAM

A five-minute PyBeach 2026 lightning talk by [Bernát Gábor](https://bernat.tech/). One smiley makes a CPython string
about four times larger. The talk follows that same text through CPython storage, UTF-8 encoding, and slicing, then
shows how turbohtml picks a tokenizer by string width.

The [speaker script](STORY.md) has the narration for each slide.

## Slides

```sh
npm ci
npm run dev
```

Open <http://localhost:3031/#/1> on the projector and <http://localhost:3031/#/presenter/1> on your screen, in the same
browser; the presenter view shows the notes and drives the slides window. The supply-chain talk uses a separate
repository and port 3030. Use the Slidev toolbar to switch between light and dark themes. The memory recording holds
before the four-megabyte result until you click; invite the guess first.

To present from the published deck instead, with nothing installed, open
<https://gaborbernat.github.io/pybeach-2026-lightning/#/1> and
<https://gaborbernat.github.io/pybeach-2026-lightning/#/presenter/1> in the same browser. The page and recordings then
load from GitHub Pages, so open both and step through the recordings once before the talk. Set the displays to extend,
not mirror.

The five terminal recordings autoplay, loop, and use the current slide theme. Each recording holds its final output
before restarting. PDFs use that final frame.

## Exports

- [Light slides](pdf/pybeach-lightning-light.pdf)
- [Dark slides](pdf/pybeach-lightning-dark.pdf)
- [Speaker copy](pdf/pybeach-lightning-speaker.pdf)

With the preview running, regenerate all three with `npm run export:all`. Build a static site with `npm run build`.

## Sources and credits

- [CPython's flexible string representation, PEP 393](https://peps.python.org/pep-0393/)
- [Python's Unicode HOWTO](https://docs.python.org/3/howto/unicode.html)
- [What sys.getsizeof measures](https://docs.python.org/3/library/sys.html#sys.getsizeof)
- [How turbohtml makes Python HTML work faster](https://bernat.tech/posts/blazing-fast-html-parser/)
- [turbohtml documentation](https://turbohtml.readthedocs.io/)
- [turbohtml logo](https://github.com/tox-dev/turbohtml/blob/main/docs/_static/turbohtml.svg), copied unchanged under
  the [MIT license](public/turbohtml-LICENSE.txt)
- [PyBeach](https://2026.pybeach.org/) logo by [Chloe Ezra](https://bsky.app/profile/ccezra.bsky.social), reused from
  the conference website without modification

The memory figures come from CPython 3.15.0 on Linux x86-64. They include the string object's overhead, rather than the
whole process. MB means one million bytes.

The QR codes on the slides link to the published slides at <https://gaborbernat.github.io/pybeach-2026-lightning/>.
