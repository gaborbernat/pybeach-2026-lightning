<script setup lang="ts">
import { useIsSlideActive, useNav, useSlideContext } from "@slidev/client";

const { $clicks } = useSlideContext();
const { isPrintMode } = useNav();
const active = useIsSlideActive();
</script>

<template>
  <div class="representation-compare" :class="{ decoding: active && !isPrintMode && $clicks >= 2 }" aria-label="The same one million a characters and one smiley in both rows. CPython uses four bytes for every code point: 4,000,004 payload bytes. UTF-8 uses one byte per a and four for the smiley: 1,000,004 bytes. UTF-8 is smaller for this mostly-ASCII input, not for every string. Ellipses abbreviate repeated a characters.">
    <div class="representation-input"><code>friendly</code> = 1,000,000 × <code>"a"</code> + <span class="emoji">🙂</span></div>
    <div class="representation-row orange">
      <div class="representation-label"><code>CPython str</code><span>In memory</span></div>
      <div class="representation-slots">
        <template v-for="(character, index) in ['a', 'a', '…', 'a', '🙂']" :key="index">
          <span v-if="character === '…'" class="representation-ellipsis">…</span>
          <div v-else class="representation-slot" style="--bytes: 4">
            <span :class="{ emoji: character === '🙂' }">{{ character }}</span><small>4 bytes</small>
          </div>
        </template>
      </div>
      <strong v-click="2">4,000,004<small>payload bytes</small></strong>
    </div>
    <div v-click="1" class="representation-row green">
      <div class="representation-label"><code>UTF-8 bytes</code><span>After encoding</span></div>
      <div class="representation-slots">
        <template v-for="(character, index) in ['a', 'a', '…', 'a', '🙂']" :key="index">
          <span v-if="character === '…'" class="representation-ellipsis">…</span>
          <div v-else class="representation-slot" :style="{ '--bytes': character === '🙂' ? 4 : 1 }">
            <span :class="{ emoji: character === '🙂' }">{{ character }}</span><small>{{ character === '🙂' ? '4 bytes' : '1' }}</small>
          </div>
        </template>
        <div class="decode-flight" aria-hidden="true">
          <template v-for="(character, index) in ['a', 'a', '…', 'a', '🙂']" :key="index">
            <span v-if="character === '…'" class="representation-ellipsis">…</span>
            <div v-else class="flight-slot" :class="{ 'smiley-slot': character === '🙂' }">
              <span class="flight-hex">{{ character === '🙂' ? 'F0 9F 99 82' : '61' }}</span>
              <span class="flight-character" :class="{ emoji: character === '🙂' }">{{ character }}</span>
              <small>4 bytes</small>
            </div>
          </template>
        </div>
      </div>
      <strong v-click="2">1,000,004<small>payload bytes</small></strong>
    </div>
    <div v-click="1" class="representation-ascii"><span class="green">UTF-8 is smaller here: mostly-ASCII text.</span><br><small>Other text can be smaller in CPython's fixed-width slots.</small></div>
    <div v-click="2" class="representation-roundtrip"><DemoVideo v-if="$clicks >= 2 || isPrintMode" name="decode" :start-at="2" /></div>
  </div>
</template>

<style scoped>
.representation-compare { margin-top: 20px; }
.emoji { font-family: 'Noto Color Emoji', sans-serif; }
.representation-input { font-size: 26px; margin-bottom: 16px; }
.representation-row { display: grid; grid-template-columns: 170px 1fr 165px; align-items: center; gap: 16px; margin-bottom: 18px; }
.representation-label { display: flex; gap: 5px; flex-direction: column; }
.representation-label code { font-size: 22px; font-weight: 650; }
.representation-label span { color: var(--muted); font-size: 18px; }
.representation-slots { position: relative; display: flex; gap: 7px; align-items: center; }
.representation-slot { width: calc(var(--bytes) * 28px); height: 70px; display: flex; flex-direction: column; align-items: center; justify-content: center; border-bottom: 3px solid currentColor; background: color-mix(in srgb, currentColor 12%, transparent); }
.representation-slot > span { font-size: 29px; line-height: 34px; }
.representation-slot small { font-size: 16px; line-height: 23px; }
.representation-ellipsis { width: 26px; text-align: center; font-size: 30px; }
.representation-row strong { font-size: 26px; font-variant-numeric: tabular-nums; }
.representation-row strong small { display: block; font-size: 17px; font-weight: 400; }
.representation-ascii { font-size: 22px; margin-top: 12px; }
.representation-roundtrip { width: 820px; margin-top: 10px; }
.representation-roundtrip :deep(.demo-video) { aspect-ratio: 35 / 6; }
.decode-flight { position: absolute; left: 0; top: 0; display: flex; align-items: center; gap: 7px; color: var(--orange); pointer-events: none; opacity: 0; z-index: 2; }
.flight-slot { position: relative; width: 112px; height: 70px; border: 2px solid currentColor; background: var(--terminal); text-align: center; }
.flight-character { font-size: 29px; line-height: 34px; }
.flight-slot small { display: block; font-size: 16px; line-height: 23px; }
.flight-hex { position: absolute; inset: 0; display: grid; place-items: center; font: 16px 'Adwaita Mono', monospace; }
.decoding .decode-flight { animation: unpack-flight 1.7s ease-in-out both; }
.decoding .flight-slot:not(.smiley-slot) { animation: unpack-slot 1.7s ease-in-out both; }
.decoding .flight-hex { animation: hex-to-text 1.7s both; }
.decoding .flight-character, .decoding .flight-slot small { animation: decoded-text 1.7s both; }
@keyframes unpack-flight { 0% { opacity: 0; transform: none; } 12%, 82% { opacity: 1; } 82%, 100% { transform: translateY(-88px); } 100% { opacity: 0; } }
@keyframes unpack-slot { 0%, 18% { width: 28px; } 82%, 100% { width: 112px; } }
@keyframes hex-to-text { 0%, 22% { opacity: 1; } 55%, 100% { opacity: 0; } }
@keyframes decoded-text { 0%, 22% { opacity: 0; } 55%, 100% { opacity: 1; } }
@media print, (prefers-reduced-motion: reduce) { .decode-flight { display: none; } }
</style>
