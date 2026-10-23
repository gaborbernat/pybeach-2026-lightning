<script setup lang="ts">
import { useIsSlideActive, useNav, useSlideContext } from "@slidev/client";
import { computed } from "vue";

const active = useIsSlideActive();
const { isPrintMode } = useNav();
const { $renderContext } = useSlideContext();
const running = computed(() => active.value && !isPrintMode.value && ["slide", "presenter"].includes($renderContext.value));
</script>

<template>
  <div class="utf8-boundaries" :class="{ running }" role="img" aria-label='The final "a" and smiley in our UTF-8 bytes. Hex 61 starts with binary 0 and is one complete character. F0 starts with 11110: four bytes total. 9F, 99, and 82 each start with 10 and continue that character.'>
    <div class="byte-caption">The last <code>"a"</code> + <span class="emoji">🙂</span>: <a href="https://www.rfc-editor.org/rfc/rfc3629#section-3">hex above, boundary bits highlighted below</a></div>
    <div class="byte-stream">
      <div class="byte-group ascii-group green">
        <div class="wire-byte"><span class="hex-byte">61</span><code><b>0</b>1100001</code></div>
        <div class="group-label">1 byte → <code>"a"</code></div>
      </div>
      <div class="byte-group emoji-group orange">
        <div class="emoji-bytes">
          <div class="wire-byte"><span class="hex-byte">F0</span><code><b>11110</b>000</code></div>
          <div v-for="byte in [{ hex: '9F', bits: '011111' }, { hex: '99', bits: '011001' }, { hex: '82', bits: '000010' }]" :key="byte.hex" class="wire-byte continuation"><span class="hex-byte">{{ byte.hex }}</span><code><b>10</b>{{ byte.bits }}</code></div>
        </div>
        <div class="group-label">4 bytes together → <span class="emoji">🙂</span></div>
      </div>
      <div class="byte-key"><span><b class="green">0</b> = complete in 1 byte</span><span><b class="orange">11110</b> = 4 bytes total</span><span><b class="blue">10</b> = continuation</span></div>
    </div>
  </div>
</template>

<style scoped>
.utf8-boundaries { margin-top: 10px; }
.byte-caption { font-size: 17px; margin-bottom: 8px; }
.emoji { font-family: 'Noto Color Emoji', sans-serif; }
.byte-stream { display: grid; grid-template-columns: 130px 536px 1fr; gap: 14px; align-items: start; }
.byte-group { outline: 2px solid transparent; outline-offset: 4px; border-radius: 2px; }
.emoji-bytes { display: flex; gap: 8px; }
.wire-byte { width: 128px; height: 58px; display: flex; flex-direction: column; align-items: center; justify-content: center; background: color-mix(in srgb, currentColor 8%, transparent); }
.hex-byte { font: 16px 'Adwaita Mono', monospace; }
.wire-byte code { font-size: 19px; letter-spacing: 1px; color: var(--muted); background: transparent; padding: 0; }
.wire-byte b { color: var(--orange); }
.ascii-group b { color: var(--green); }
.continuation b { color: var(--blue); }
.group-label { border-top: 2px solid currentColor; margin-top: 5px; padding-top: 3px; text-align: center; font-size: 17px; }
.byte-key { display: flex; flex-direction: column; gap: 7px; padding-top: 2px; font-size: 15px; }
.byte-key b { font-family: 'Adwaita Mono', monospace; }
.running .ascii-group { animation: read-ascii 5s ease-in-out infinite; }
.running .emoji-group { animation: read-smiley 5s ease-in-out infinite; }
@keyframes read-ascii { 0%, 36%, 100% { outline-color: transparent; } 8%, 28% { outline-color: currentColor; } }
@keyframes read-smiley { 0%, 36%, 96%, 100% { outline-color: transparent; } 46%, 84% { outline-color: currentColor; } }
@media print, (prefers-reduced-motion: reduce) { .utf8-boundaries * { animation: none !important; } }
</style>
