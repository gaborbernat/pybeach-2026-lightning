<script setup lang="ts">
const targets = ['&', '<', '>', '"', "'"];
</script>

<template>
  <div class="block-scan">
    <div v-click="1" class="scan-label"><strong class="blue">One CPU instruction</strong> compares all 16 positions together.</div>
    <div class="scan-grid">
      <div class="scan-lane"><span class="scan-row-label">16 ASCII bytes</span><span v-for="(character, index) in [...'Hi from PyBeach!']" :key="index" class="scan-cell">{{ character === ' ' ? '·' : character }}</span></div>
      <div v-click="1" class="scan-lane"><span class="scan-row-label blue">Compare with</span><span v-for="index in 16" :key="index" class="scan-cell scan-target">&amp;</span></div>
      <div v-click="2" class="scan-lane"><span class="scan-row-label green">Matches ↓</span><span v-for="index in 16" :key="index" class="scan-cell scan-bit">0</span></div>
    </div>
    <div class="scan-legend muted">One byte per column; · is a space. <span v-click="2">Matches: 0 = no, 1 = yes.</span></div>
    <div v-click="2" class="scan-combine">Also check <code>&lt;</code> <code>&gt;</code> <code>"</code> <code>'</code>. No matches? <strong class="green">Skip this block.</strong></div>
    <div v-click="3" class="pass-comparison">
      <div>
        <div><a href="https://github.com/python/cpython/blob/v3.15.0/Lib/html/__init__.py">stdlib: five scans of the input</a></div>
        <div v-for="target in targets" :key="target" class="pass-track orange"><code>{{ target }}</code><span></span><b>→</b></div>
      </div>
      <div>
        <div class="green"><a href="https://bernat.tech/posts/blazing-fast-html-parser/">turbohtml: one scan of clean input</a></div>
        <div class="combined-targets blue">Each block checks <code>&amp; &lt; &gt; " '</code></div>
        <div class="pass-track green"><span></span><b>→</b></div>
        <div class="pass-reuse muted">Both reuse the original when nothing changes.</div>
      </div>
    </div>
  </div>
</template>
