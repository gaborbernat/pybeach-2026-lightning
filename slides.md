---
theme: default
favicon: /pybeach-logo.svg
title: 'One smiley, a lot of RAM'
author: 'Bernát Gábor'
info: 'A five-minute Python lightning talk about string memory, Unicode, and one expensive smiley.'
titleTemplate: '%s'
canvasWidth: 1080
aspectRatio: 16/9
colorSchema: auto
routerMode: hash
download: false
exportFilename: pybeach-lightning
selectable: true
drawings:
  enabled: false
transition: slide-left
duration: 5min
timer: countdown
wakeLock: true
---

<div class="talk-cover">
<div>
<h1>One smiley,<br><span class="orange">a lot of RAM</span></h1>
<div class="subtitle">The cost of making a string friendlier</div>
<div class="byline"><a href="https://bernat.tech/">Bernát Gábor</a></div>
<a href="https://2026.pybeach.org/" class="conference">PyBeach 2026 <img src="/pybeach-logo.svg" alt="PyBeach" /></a>
</div>
<div>
<a class="cover-conference" href="https://2026.pybeach.org/"><img src="/pybeach-logo.svg" alt="PyBeach 2026" /></a>
<CoverMemory />
<a class="cover-qr" href="https://gaborbernat.github.io/pybeach-2026-lightning/" style="display:block"><QRCode data="https://gaborbernat.github.io/pybeach-2026-lightning/" :size="120" /></a>
<div class="qr-label">Slides</div>
</div>
</div>

<!--
[00:00–00:15]

You know the feature request. Everything works, the tests pass, and somebody says: could we make it a little friendlier?
Absolutely. One smiley. What could that possibly cost?
I'm Bernát. I work on Python tools. Let's look at the memory bill.

[Pause for a beat before advancing.]
-->

---
transition: fade
clicks: 1
---

<div class="terminal-slide">
<h1>“Just add <span class="orange">one smiley</span>”</h1>
<DemoVideo name="memory" :reveal="{ pause: 19, resume: 22 }" />
<div class="terminal-caption"><span><a href="https://docs.python.org/3/library/sys.html#sys.getsizeof"><code>sys.getsizeof</code></a> counts this object's bytes.</span><span class="muted">Recorded CPython 3.15.0 / Linux x86-64</span></div>
</div>

<!--
[00:15–00:55]

Here are a million lowercase "a" characters. A very boring document, but the requirements didn't say it had to be good.
Python reports about one megabyte. Add one smiley. Have a guess: four extra bytes? A little object overhead? Who thinks we're about to regret this?

[Give the room three seconds. The recording holds before the result. Click when ready.]

Four megabytes.

[Hold the number for a beat.]

We gave it emotional support. It asked for more RAM.

[Pause; continue when the room settles.]

That's the size of the string object itself. Something happened to all the perfectly innocent "a" characters already there.
-->

---

# Friendliness <span class="green">+1</span>. Memory <span class="orange">×4</span>.

<div class="subtitle">Same million "a" characters. One added smiley.</div>
<div class="bill">
<div class="bill-row green"><div class="label">Before</div><div class="bill-track"><div class="bill-bar" style="width:25%"></div></div><div class="bill-value">1.00 MB</div></div>
<div v-click="1" class="bill-row orange"><div class="label">After 🙂</div><div class="bill-track"><div class="bill-bar" style="width:100%"></div></div><div class="bill-value">4.00 MB</div></div>
</div>
<div v-click="1" class="bill-note">One smiley. <span class="orange">About 3 MB</span> of hospitality.</div>
<div class="refs">Measured: 1,000,041 and 4,000,064 bytes. Decimal MB. Includes object overhead. <a href="https://docs.python.org/3/library/sys.html#sys.getsizeof">sys.getsizeof</a></div>

<!--
[00:55–01:15]

Here's the itemized bill. Original text: roughly one megabyte.

[Click: the hospitality bill.]

Friendlier text: roughly four. That's about three megabytes of hospitality for one guest.

[Pause on the longer bar.]
The expensive part is the storage for every character. Our new guest has changed the seating arrangement for the whole document.
-->

---

# How CPython <span class="blue">stores your text</span>

<MemoryLanes />
<div class="memory-key">Each row is a separate string. One width <strong>for every code point in it</strong>.</div>
<div class="refs"><a href="https://peps.python.org/pep-0393/">PEP 393</a>: up to U+00FF uses 1 byte, up to U+FFFF uses 2, above that uses 4. Character storage only.</div>

<!--
[01:15–02:05]

Each row shows a different string. A Unicode code point is a number that identifies a character. CPython picks one, two, or four bytes to hold the highest code point in the string, then uses that width throughout.
The letter "a" only needs one byte.

[Click: accented letter.]

So does the "á" in my name. Still flying economy.
[Click: euro. Let the slots widen.]

The euro sign needs two bytes. Every "a" now gets two as well.

[Click: the smiley arrives, then every slot widens. Keep the earlier rows visible.]

Our smiley needs four bytes. Every "a" gets four. One passenger needs a wider seat, so everyone gets upgraded to business class.

[Let the comparison land. Point along the four-byte row.]

Fixed-width slots let CPython locate a value by its index without walking through the earlier ones. That width applies to the whole string, including the boring passengers.
-->

---

# <span class="blue">Unicode text</span> comes first

<StringConcat :count="1_000_000" />
<div v-click="1" class="encoding-result"><DemoVideo name="isascii" :start-at="1" /></div>
<div class="refs"><a href="https://docs.python.org/3.15/library/stdtypes.html#text-sequence-type-str">Python 3 str contains Unicode text</a>. ASCII covers 128 code points; adding a smiley goes beyond them.</div>

<!--
[02:05–02:25]

Both inputs are Unicode strings. The million "a" characters happen to fit in ASCII, a small character set covering basic English letters, digits, and punctuation. The smiley doesn't.

[Click: combined string and interpreter recording. The result is not ASCII-only.]

Adding them gives another Unicode string. Python picks its memory layout from the characters it contains.

-->

---

# Same text. <span class="blue">How many bytes?</span>

<EncodingJourney />
<div class="refs"><a href="https://docs.python.org/3.15/howto/unicode.html#encodings">Text encodings</a> / <a href="https://docs.python.org/3.15/library/pathlib.html#pathlib.Path.write_bytes">File bytes</a> / <a href="https://docs.python.org/3.15/library/socket.html#socket.socket.sendall">Socket bytes</a>. File/network overhead excluded. Hex bytes.</div>

<!--
[02:25–02:35]

Files and network connections carry bytes. We choose UTF-8. Will sending this text cost four megabytes too?

[Follow the automatic animation from characters to bytes.]

Let's measure it.
-->

---

<div class="terminal-slide">
<h1>Same text, encoded as <span class="green">UTF-8</span></h1>
<DemoVideo name="encoding" />
<div class="terminal-caption"><span><a href="https://docs.python.org/3.15/howto/unicode.html#converting-to-bytes"><code>encode("utf-8")</code></a> creates a separate <code>bytes</code> object.</span><span class="muted">Same million "a" characters and smiley.</span></div>
</div>

<!--
[02:35–02:55]

Here's the same friendly string. Get-size-of still reports about four megabytes for the Python object.

[Point to the encoding argument.]

We choose UTF-8, producing a separate bytes object. The original string stays unchanged.

[Point to the final result.]

The encoded payload is one million and four bytes, about one megabyte. We kept every character; only the byte layout changed. No compression, and nobody confiscated the smiley.
-->

---

# <span class="green">Economy</span> in transit. <span class="orange">Business</span> in RAM.

<RepresentationCompare />
<div class="refs"><a href="https://peps.python.org/pep-0393/">CPython storage</a> / <a href="https://docs.python.org/3.15/howto/unicode.html#encodings">ASCII and UTF-8</a>. Payload bytes only; object headers and terminators excluded.</div>

<!--
[02:55–03:25]

Same text in both rows. CPython uses four bytes for every code point, including every "a".

[Click: UTF-8 row.]

UTF-8 uses one byte for each "a" and four for this smiley. Mostly ASCII, so UTF-8 wins. Write the novel in Chinese and the maths flips.

[Click: the byte copies rise into RAM and widen; the decode recording starts. Pause on the comparison.]

About four megabytes versus one. Decoding those UTF-8 bytes restores the wider Python string.
It travels economy. In RAM, it's back in business class.

[Pause; continue when the room settles.]
-->

---
transition: fade
---

<div class="terminal-slide">
<h1><span class="green">Refund approved</span></h1>
<DemoVideo name="refund" />
<div class="terminal-caption"><span>Slicing creates a <strong class="green">new string</strong> that can use narrower storage.</span><span class="muted">The original string is unchanged.</span></div>
</div>

<!--
[03:25–03:50]

Naturally, my first cost-saving proposal is to remove the happiness.
Slice off the last character. The new string comes back at roughly one megabyte. Refund approved.

[Pause. Point to the new variable.]

Python strings are immutable. Slicing creates another string, and this one contains only "a" characters. CPython can choose one-byte slots again.

-->

---

# A smaller result. <span class="orange">Two live objects</span>.

<div class="subtitle"><code>plain = friendly[:-1]</code></div>
<LiveObjects />
<div class="refs"><a href="https://docs.python.org/3.15/reference/datamodel.html#objects-values-and-types">Object lifetimes</a>. These two string objects only; other objects and process memory excluded. Decimal MB.</div>

<!--
[03:50–04:10]

Friendly still refers to the original four-megabyte string.

[Click: characters copy into the smaller allocation. The original stays.]

Plain refers to the new one-megabyte string.

[Click: the total rises from four to five megabytes.]

Five megabytes. My cost-saving proposal has cost us another megabyte.

[Pause on the total before explaining the lifetime.]

Both objects are still alive. The original can be reclaimed once nothing refers to it. Until then, producing a smaller result can mean a higher memory peak.
-->

---

# The smiley can <span class="green">stay</span>

<div class="subtitle"><code>friendly = "a" * 1_000_000 + "<span class="emoji">🙂</span>"</code></div>
<div class="metrics">
<div class="metric blue"><code>len(friendly)</code><span>Code points</span><strong>1,000,001</strong></div>
<div v-click="1" class="metric green"><code>len(encoded)</code><span>UTF-8 payload bytes</span><strong>1,000,004</strong></div>
<div v-click="2" class="metric orange"><code>sys.getsizeof(friendly)</code><span>String object bytes</span><strong>4,000,064</strong></div>
</div>
<div v-click="2" class="metric-takeaway">Three questions. Three perfectly reasonable bills.</div>
<div class="refs"><a href="https://docs.python.org/3/library/stdtypes.html#text-sequence-type-str">str</a> / <a href="https://docs.python.org/3/howto/unicode.html">Unicode HOWTO</a> / <a href="https://docs.python.org/3/library/sys.html#sys.getsizeof">sys.getsizeof</a></div>

<!--
[04:10–04:25]

Please don't take this to work as a proposal to ban emojis. We have enough meetings already.

[Give the joke a beat before pointing to the first measurement.]

Length counts code points.

[Click: encoded payload.]

Encoding counts bytes.

[Click: string object.]

Get-size-of counts this object. Three questions. Three perfectly reasonable bills.
-->

---

<TurboTeaser />

<!--
[04:25–04:45]

I use this in turbohtml, my fast HTML toolkit: parse, query, clean, and rewrite HTML from Python. Its tokenizer splits HTML into tags and text.

[Click: the four-byte string selects its tokenizer, which emits a start tag, text, and an end tag.]

The string's width selects a matching tokenizer once, avoiding the width check for every character.

[Click: article, slides QR code, and closing line.]

More string tricks are in the article. Keep the smiley. Measure the bill. Thank you.

[Sources: https://bernat.tech/posts/blazing-fast-html-parser/#one-machine-becomes-three and https://turbohtml.readthedocs.io/. Logo: tox-dev/turbohtml docs/_static/turbohtml.svg, MIT license, copied unchanged.]

[Leave the conclusion and QR code visible.]
-->
