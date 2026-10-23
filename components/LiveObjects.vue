<script setup lang="ts">
import { useIsSlideActive, useNav, useSlideContext } from "@slidev/client";
import { onMounted, onUnmounted, ref, watch } from "vue";

const { $clicks } = useSlideContext();
const { isPrintMode } = useNav();
const active = useIsSlideActive();
const total = ref(5);
let frame = 0;

onMounted(() => {
  watch([active, $clicks, isPrintMode], () => {
    cancelAnimationFrame(frame);
    total.value = 5;
    if (!active.value || $clicks.value < 2 || isPrintMode.value || matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const start = performance.now();
    total.value = 4;
    function count(now: number) {
      const progress = Math.min((now - start) / 1200, 1);
      total.value = 4 + progress;
      if (progress < 1) frame = requestAnimationFrame(count);
    }
    frame = requestAnimationFrame(count);
  }, { immediate: true });
});
onUnmounted(() => cancelAnimationFrame(frame));
</script>

<template>
  <div class="live-objects" :class="{ slicing: active && !isPrintMode && $clicks >= 1, counting: active && !isPrintMode && $clicks >= 2 }" aria-label="friendly still references the original four-megabyte string. plain references a new one-megabyte string. Both remain alive, about five megabytes total.">
    <div class="object-row orange">
      <code>friendly</code><span class="reference-arrow" aria-hidden="true">→</span>
      <div class="object-track"><div class="object-bar original"><code>a a a … <span class="emoji">🙂</span></code><span>original · ≈4 MB</span></div></div>
    </div>
    <div v-click="1" class="object-row green">
      <code>plain</code><span class="reference-arrow" aria-hidden="true">→</span>
      <div class="object-track"><div class="object-bar sliced"><code>a a a …</code></div><span class="new-label">new · ≈1 MB</span></div>
    </div>
    <div class="copy-stream" aria-hidden="true"><span v-for="copy in 3" :key="copy" :style="{ '--copy': copy - 1 }">a</span></div>
    <div v-click="2" class="object-total">These two objects: <strong>≈{{ total.toFixed(2) }} MB together</strong><span class="muted">while both names reference them.</span><div class="total-track" aria-hidden="true"><i /><i /></div></div>
  </div>
</template>

<style scoped>
.live-objects { position: relative; margin-top: 54px; }
.object-bar .emoji { font-family: 'Noto Color Emoji', sans-serif; font-size: 21px; }
.object-row { display: grid; grid-template-columns: 125px 30px 1fr; gap: 14px; align-items: center; margin-bottom: 32px; }
.object-row > code { font-size: 24px; }
.reference-arrow { font-size: 28px; }
.object-track { display: flex; align-items: center; gap: 17px; }
.object-bar { height: 74px; border-bottom: 3px solid currentColor; background: color-mix(in srgb, currentColor 14%, transparent); display: flex; align-items: center; justify-content: space-between; padding: 0 12px; }
.object-bar code { font-size: 21px; }
.object-bar span, .new-label { font-size: 19px; }
.original { width: 600px; }
.sliced { width: 150px; }
.object-total { display: flex; gap: 10px; flex-wrap: wrap; align-items: baseline; font-size: 27px; margin-top: 42px; }
.object-total .muted { width: 100%; font-size: 21px; }
.object-total strong { font-variant-numeric: tabular-nums; }
.copy-stream { position: absolute; left: 183px; top: 15px; display: flex; gap: 8px; pointer-events: none; }
.copy-stream > span { display: grid; place-items: center; width: 39px; height: 44px; color: var(--green); background: var(--terminal); border: 2px solid currentColor; font: 24px 'Adwaita Mono', monospace; opacity: 0; }
.slicing .copy-stream > span { animation: copy-character 1.3s ease-in-out both; animation-delay: calc(var(--copy) * .12s); }
.slicing .sliced { animation: allocate-string 1.6s ease-out both; }
.slicing .sliced code, .slicing .new-label { animation: allocated-label 1.6s both; }
.total-track { display: flex; width: 750px; height: 16px; margin-top: 4px; }
.total-track i:first-child { width: 600px; background: var(--orange); }
.total-track i:last-child { width: 150px; background: var(--green); border-left: 3px solid var(--terminal); }
.counting .total-track i:last-child { animation: add-allocation 1.2s linear both; transform-origin: left; }
@keyframes copy-character { 0% { opacity: 0; } 15%, 65% { opacity: 1; } 85%, 100% { transform: translateY(106px) scaleX(.7); opacity: 0; } }
@keyframes allocate-string { from { clip-path: inset(0 100% 0 0); } to { clip-path: inset(0); } }
@keyframes allocated-label { 0%, 65% { opacity: 0; } 100% { opacity: 1; } }
@keyframes add-allocation { from { transform: scaleX(0); } to { transform: scaleX(1); } }
@media print, (prefers-reduced-motion: reduce) { .copy-stream { display: none; } .slicing .sliced, .slicing .sliced code, .slicing .new-label, .counting .total-track i:last-child { animation: none; } }
</style>
