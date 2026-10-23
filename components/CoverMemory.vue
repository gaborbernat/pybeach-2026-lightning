<script setup lang="ts">
import { useIsSlideActive, useNav, useSlideContext } from "@slidev/client";
import { computed } from "vue";

const active = useIsSlideActive();
const { isPrintMode } = useNav();
const { $renderContext } = useSlideContext();
const running = computed(() => active.value && !isPrintMode.value && ["slide", "presenter"].includes($renderContext.value));
</script>

<template>
  <div class="cover-memory" :class="{ running }" role="img" aria-label="One smiley joins a string, and the character slots in RAM become wider.">
    <div class="cover-smile" aria-hidden="true">🙂</div>
    <div class="teaser-ram">
      <div class="ram-label"><mdi-memory /><span>RAM</span></div>
      <div class="teaser-characters"><div v-for="(character, index) in ['a', 'a', '🙂']" :key="index" class="teaser-character" :class="{ 'smiley-slot': index === 2 }"><span>{{ character }}</span><div class="teaser-bytes"><i v-for="byte in 4" :key="byte" /></div></div></div>
      <div class="teaser-pins"><i v-for="pin in 16" :key="pin" /></div>
    </div>
  </div>
</template>

<style scoped>
.cover-memory { width: 245px; height: 196px; position: relative; }
.cover-smile { width: 80px; margin: 0 auto; font-family: 'Noto Color Emoji', sans-serif; font-size: 62px; line-height: 1.15; text-align: center; }
.teaser-ram { position: absolute; left: 0; right: 0; bottom: 7px; border: 2px solid currentColor; border-radius: 5px; padding: 8px 10px 10px; color: var(--orange); background: color-mix(in srgb, currentColor 7%, transparent); }
.ram-label { display: flex; justify-content: center; align-items: center; gap: 7px; font-size: 15px; margin-bottom: 7px; }
.ram-label > svg { font-size: 22px; }
.teaser-characters { display: flex; justify-content: center; gap: 7px; height: 40px; }
.teaser-character { flex: 0 0 auto; width: 64px; height: 40px; border: 1px solid currentColor; background: color-mix(in srgb, currentColor 10%, transparent); display: flex; flex-direction: column; align-items: center; justify-content: space-between; overflow: hidden; }
.teaser-character > span { font: 18px/29px 'Adwaita Mono', monospace; }
.smiley-slot > span { font-family: 'Noto Color Emoji', sans-serif; font-size: 22px; }
.teaser-bytes { display: flex; width: 100%; height: 8px; border-top: 1px solid currentColor; }
.teaser-bytes > i { flex: 1; }
.teaser-bytes > i + i { border-left: 1px solid currentColor; }
.teaser-pins { position: absolute; bottom: -7px; left: 15px; right: 15px; display: flex; gap: 5px; height: 5px; }
.teaser-pins > i { flex: 1; background: currentColor; }
.running .cover-smile { animation: friendly-guest 7.5s ease-in-out infinite both; }
.running .teaser-ram { animation: friendlier-memory 7.5s ease-in-out infinite both; }
.running .teaser-character:not(.smiley-slot) { animation: wider-seats 7.5s ease-in-out infinite both; }
.running .smiley-slot { animation: smiley-seat 7.5s ease-in-out infinite both; }
.running .teaser-bytes { animation: extra-bytes 7.5s ease-in-out infinite both; }
@keyframes friendly-guest { 0%, 15%, 55%, 100% { transform: none; } 30% { transform: translateY(9px) rotate(7deg); } 42% { transform: translateY(-3px) rotate(-3deg); } }
@keyframes friendlier-memory { 0%, 25%, 100% { color: var(--green); } 50%, 82% { color: var(--orange); } }
@keyframes wider-seats { 0%, 28%, 100% { width: 16px; } 52%, 82% { width: 64px; } }
@keyframes smiley-seat { 0%, 20%, 100% { width: 0; opacity: 0; border-width: 0; } 30%, 90% { width: 64px; opacity: 0; border-width: 1px; } 40%, 82% { width: 64px; opacity: 1; border-width: 1px; } }
@keyframes extra-bytes { 0%, 30%, 100% { opacity: 0; } 55%, 82% { opacity: 1; } }
@media print, (prefers-reduced-motion: reduce) { .cover-memory * { animation: none !important; } }
</style>
