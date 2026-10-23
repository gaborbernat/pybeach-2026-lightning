<template>
  <div class="escape-write">
    <div class="write-input"><span class="muted">16 input bytes</span><code>Hi <strong class="orange">&amp;</strong> my PyBeach!</code></div>
    <div v-click="1" class="size-scan">
      <strong class="blue">First scan: count the growth</strong>
      <div><code>&amp;</code> → <code>&amp;amp;</code> <strong class="orange">+4 bytes</strong></div>
      <div>Allocate space for <strong class="green">20 payload bytes</strong>.</div>
    </div>
    <div v-click="2" class="write-scan">
      <strong class="blue">Second scan: write the output</strong>
      <div class="write-segments">
        <div class="green"><code>Hi<span class="muted">·</span></code><span>Copy 3 bytes</span></div>
        <div class="orange"><code>&amp;amp;</code><span>Write 5 bytes</span></div>
        <div class="green"><code><span class="muted">·</span>my<span class="muted">·</span>PyBeach!</code><span>Copy 12 bytes</span></div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.escape-write { margin-top: 28px; font-size: 23px; }
.write-input { display: flex; gap: 28px; align-items: baseline; font-size: 30px; }
.write-input > span { font-size: 22px; }
.size-scan { display: grid; grid-template-columns: 1fr 1fr; margin-top: 30px; gap: 14px 30px; }
.size-scan > strong { grid-column: 1 / -1; }
.write-scan { margin-top: 30px; }
.write-segments { display: grid; grid-template-columns: 3fr 5fr 12fr; gap: 8px; margin-top: 16px; }
.write-segments > div { border-top: 3px solid currentColor; background: color-mix(in srgb, currentColor 10%, transparent); padding: 12px 16px; }
.write-segments code { display: block; font-size: 30px; white-space: nowrap; }
.write-segments > div > span { display: block; font-size: 18px; margin-top: 9px; }
</style>
