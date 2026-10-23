<script setup lang="ts">
import { useDarkMode, useIsSlideActive, useNav, useSlideContext } from "@slidev/client";

const { isDark } = useDarkMode();
const base = import.meta.env.BASE_URL;
const { $clicks } = useSlideContext();
const { isPrintMode } = useNav();
const active = useIsSlideActive();
</script>

<template>
  <div class="turbo-teaser" :style="{ '--tag-color': isDark ? '#6fd7e0' : '#087985', '--text-color': isDark ? '#f3a4cd' : '#a52a67' }" :class="{ tokenizing: active && !isPrintMode && $clicks >= 1 }">
    <div class="turbo-brand">
      <a href="https://turbohtml.readthedocs.io/"><img :src="`${base}turbohtml.svg`" alt="turbohtml logo" /></a>
      <div><h1><a href="https://turbohtml.readthedocs.io/">turbohtml</a></h1><div class="turbo-pitch">Fast HTML tools for Python. Typed API, C core.</div></div>
    </div>
    <div class="turbo-capabilities"><a href="https://turbohtml.readthedocs.io/en/stable/how-to/parsing.html">Parse</a> · <a href="https://turbohtml.readthedocs.io/en/stable/how-to/selecting.html">query</a> · <a href="https://turbohtml.readthedocs.io/en/stable/how-to/sanitizing.html">clean</a> · <a href="https://turbohtml.readthedocs.io/en/stable/how-to/rewriting.html">rewrite HTML</a></div>
    <div class="turbo-body">
      <div>
        <div class="turbo-purpose">The tokenizer splits HTML into <span class="tag-token">tags</span> and <span class="text-token">text</span>.</div>
        <div class="html-source"><span>HTML</span><code><span class="tag-token">&lt;p&gt;</span><span class="emoji">🙂</span><span class="tag-token">&lt;/p&gt;</span></code><span class="orange">4 bytes / code point</span></div>
        <div v-click="1" class="turbo-routing" aria-label="The example contains a smiley, so its four-byte string selects the four-byte tokenizer. It produces a start tag, text, and an end tag.">
          <svg class="tokenizer-routes" viewBox="0 0 720 36" aria-hidden="true">
            <path d="M 360 0 V 12 H 120 V 35" class="green" />
            <path d="M 360 0 V 35" class="purple" />
            <path d="M 360 0 V 12 H 600 V 35" class="selected-route orange" />
            <circle r="5" class="route-dot" />
          </svg>
          <div class="turbo-widths">
            <div v-for="item in [{ bytes: 1, character: 'a', tone: 'green' }, { bytes: 2, character: '€', tone: 'purple' }, { bytes: 4, character: '🙂', tone: 'orange' }]" :key="item.bytes" :class="[item.tone, { selected: item.bytes === 4 }]">
              <div class="memory-cell" :style="{ width: `${item.bytes * 24}px` }"><span :class="{ emoji: item.bytes === 4 }">{{ item.character }}</span><div class="byte-ticks"><i v-for="byte in item.bytes" :key="byte" /></div></div>
              <strong>{{ item.bytes }}-byte tokenizer</strong>
            </div>
          </div>
          <div class="turbo-tokens"><span>Tokens</span><div v-for="(token, index) in [{ text: '<p>', kind: 'start tag', tone: 'tag-token' }, { text: '🙂', kind: 'text', tone: 'text-token' }, { text: '</p>', kind: 'end tag', tone: 'tag-token' }]" :key="token.kind" class="html-token" :class="token.tone" :style="{ '--token': index }"><code :class="{ emoji: index === 1 }">{{ token.text }}</code><small>{{ token.kind }}</small></div><svg class="token-output-arrow orange" viewBox="0 0 100 38" aria-hidden="true"><path d="M 50 0 V 15 Q 50 28 37 28 H 2 M 10 20 L 2 28 L 10 36" /></svg></div>
        </div>
        <div v-click="1" class="turbo-payoff">Choose once. Skip the width check for each character.</div>
        <div v-click="2" class="turbo-story"><a href="https://bernat.tech/posts/blazing-fast-html-parser/">https://bernat.tech/posts/blazing-fast-html-parser/</a></div>
      </div>
      <div v-click="2" class="turbo-qr"><a href="https://gaborbernat.github.io/pybeach-2026-lightning/" class="cover-qr" style="display:block"><QRCode data="https://gaborbernat.github.io/pybeach-2026-lightning/" :size="145" /></a><span>Slides</span></div>
    </div>
    <div v-click="2" class="turbo-close">Keep the <span class="orange">smiley</span>. Measure the <span class="green">bill</span>.</div>
  </div>
</template>

<style scoped>
.turbo-teaser { line-height: 1.3; }
.tag-token { color: var(--tag-color); }
.text-token { color: var(--text-color); }
.turbo-brand { display: flex; gap: 24px; align-items: center; }
.turbo-brand img { width: 88px; height: 90px; object-fit: contain; }
.turbo-brand h1 { margin: 0 0 7px; font-size: 50px; color: var(--green); }
.turbo-pitch { font-size: 25px; }
.turbo-capabilities { font-size: 23px; color: var(--blue); margin-top: 8px; }
.turbo-body { display: grid; grid-template-columns: 720px 185px; gap: 45px; margin-top: 18px; }
.turbo-purpose { font-size: 24px; margin-bottom: 8px; }
.html-source { display: grid; grid-template-columns: 1fr auto 1fr; align-items: center; gap: 14px; font-size: 18px; color: var(--muted); }
.html-source > span:first-child { text-align: right; }
.html-source code { font-size: 25px; }
.turbo-routing { position: relative; }
.tokenizer-routes { display: block; width: 720px; height: 36px; overflow: visible; }
.tokenizer-routes path { stroke: currentColor; fill: none; stroke-width: 2; }
.tokenizer-routes .selected-route { stroke-width: 4; }
.route-dot { fill: var(--orange); opacity: 0; offset-path: path('M 360 0 L 360 12 L 600 12 L 600 35'); }
.turbo-widths { display: grid; grid-template-columns: repeat(3, 1fr); }
.turbo-widths > div { display: flex; flex-direction: column; align-items: center; gap: 5px; padding: 4px 0; }
.turbo-widths .selected { outline: 2px solid var(--orange); background: color-mix(in srgb, var(--orange) 8%, transparent); border-radius: 5px; }
.turbo-widths .memory-cell { height: 38px; }
.turbo-widths .memory-cell > span { font-size: 23px; line-height: 26px; }
.turbo-widths .byte-ticks { height: 8px; }
.turbo-widths strong { font-size: 20px; font-weight: 500; }
.emoji { font-family: 'Noto Color Emoji', sans-serif; }
.turbo-tokens { display: flex; position: relative; justify-content: center; align-items: center; gap: 18px; margin-top: 10px; height: 52px; }
.turbo-tokens > span:first-child { font-size: 18px; color: var(--muted); }
.html-token { min-width: 96px; text-align: center; }
.html-token code { display: block; font-size: 24px; line-height: 28px; background: transparent; padding: 0; }
.html-token small { display: block; font-size: 15px; margin-top: 3px; }
.token-output-arrow { position: absolute; right: 70px; top: -10px; width: 100px; height: 38px; fill: none; stroke: currentColor; stroke-width: 2; stroke-linecap: round; stroke-linejoin: round; }
.turbo-payoff { font-size: 21px; margin-top: 14px; }
.turbo-story { font-size: 21px; color: var(--blue); margin-top: 10px; }
.turbo-qr { text-align: center; }
.turbo-qr .cover-qr { margin-top: 12px; }
.turbo-qr > span { font-size: 17px; color: var(--muted); }
.turbo-close { font-size: 28px; margin-top: 16px; }
.tokenizing .route-dot { animation: select-tokenizer .8s ease-in-out both; }
.tokenizing .selected { animation: select-width 1s both; }
.tokenizing .html-token { animation: emit-token .5s ease-out both; animation-delay: calc(.9s + var(--token) * .25s); }
@keyframes select-tokenizer { 0% { opacity: 0; offset-distance: 0%; } 10%, 85% { opacity: 1; } 100% { opacity: 0; offset-distance: 100%; } }
@keyframes select-width { 0%, 65% { outline-color: transparent; background: transparent; } 100% { outline-color: var(--orange); } }
@keyframes emit-token { from { opacity: 0; transform: translate(65px, -16px) scale(.75); } to { opacity: 1; transform: none; } }
@media print, (prefers-reduced-motion: reduce) { .route-dot { display: none; } .tokenizing .selected, .tokenizing .html-token { animation: none; } }
</style>
