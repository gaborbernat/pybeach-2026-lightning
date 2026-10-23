<script setup lang="ts">
import { useIsSlideActive, useNav, useSlideContext } from "@slidev/client";

const { $clicks } = useSlideContext();
const { isPrintMode } = useNav();
const active = useIsSlideActive();
</script>

<template>
  <div class="memory-lanes" aria-label="String storage diagram. Every code point uses the same width within a string.">
    <div v-for="(row, index) in [{ suffix: 'a', width: 1, tone: 'green', label: 'U+0061' }, { suffix: 'á', width: 1, tone: 'blue', label: 'U+00E1' }, { suffix: '€', width: 2, tone: 'purple', label: 'U+20AC' }, { suffix: '🙂', width: 4, tone: 'orange', label: 'U+1F642' }]" :key="row.label" v-click="index || false" class="memory-row" :class="row.tone">
      <div class="memory-label"><span>{{ row.suffix }}</span><small>{{ row.label }}</small></div>
      <div class="memory-cells" :class="{ widening: active && !isPrintMode && index > 0 && $clicks === index }" :style="{ '--slot-width': `${row.width * 39}px` }">
        <div v-for="(character, index) in ['a', 'a', 'a', row.suffix]" :key="index" class="memory-cell">
          <span>{{ character }}</span>
          <div class="byte-ticks"><i v-for="byte in row.width" :key="byte" /></div>
        </div>
      </div>
      <div class="memory-width">{{ row.width }} <small>{{ row.width === 1 ? 'byte' : 'bytes' }} / code point</small></div>
    </div>
  </div>
</template>

<style scoped>
.memory-cell { width: var(--slot-width); }
.widening .memory-cell { animation: widen-slot 1.6s ease-in-out both; }
.widening .memory-cell:last-child > span { animation: guest-arrives .5s ease-out both; }
.widening .byte-ticks { animation: show-ticks 1.6s ease-in-out both; }
@keyframes widen-slot { 0%, 28% { width: 39px; } 85%, 100% { width: var(--slot-width); } }
@keyframes guest-arrives { from { opacity: 0; transform: translate(36px, -16px) rotate(15deg); } to { opacity: 1; transform: none; } }
@keyframes show-ticks { 0%, 28% { opacity: .15; } 85%, 100% { opacity: 1; } }
@media print, (prefers-reduced-motion: reduce) { .widening .memory-cell, .widening .memory-cell:last-child > span, .widening .byte-ticks { animation: none; } }
</style>
