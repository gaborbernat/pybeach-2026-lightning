<script setup lang="ts">
defineProps<{ count: number }>();
</script>

<template>
  <div class="string-concat" aria-label="Concatenating one million a characters with a smiley. The original a characters use one-byte slots. The result uses four-byte slots for every a and the smiley. Arrows span the a characters only.">
    <div v-for="(width, index) in [1, 4]" :key="width" v-click="index ? 1 : false" class="concat-row" :class="index ? 'orange' : 'green'">
      <div class="concat-label">
        <code v-if="index === 0">text + "<span class="emoji">🙂</span>"</code>
        <code v-else>friendly</code>
        <span>{{ index ? 'Unicode str' : 'Unicode str + str' }}</span>
      </div>
      <div class="concat-storage">
        <div class="counted-characters">
          <div class="memory-cells">
            <template v-for="(character, position) in ['a', 'a', '…', 'a']" :key="position">
              <span v-if="character === '…'" class="concat-ellipsis">…</span>
              <div v-else class="memory-cell" :style="{ width: `${width * 39}px` }">
                <span>{{ character }}</span>
                <div class="byte-ticks"><i v-for="byte in width" :key="byte" /></div>
              </div>
            </template>
          </div>
          <div class="count-span"><span>{{ count.toLocaleString('en-US') }} × "a"</span></div>
        </div>
        <span v-if="index === 0" class="concat-plus">+</span>
        <div class="memory-cell orange concat-smiley">
          <span class="emoji">🙂</span>
          <div class="byte-ticks"><i v-for="byte in 4" :key="byte" /></div>
        </div>
      </div>
    </div>
    <div class="concat-legend">Each small compartment is one byte. <code>…</code> abbreviates repeated <code>"a"</code> characters.</div>
  </div>
</template>

<style scoped>
.string-concat { margin-top: 28px; }
.concat-row { display: grid; grid-template-columns: 190px 1fr; gap: 18px; align-items: start; margin-bottom: 22px; }
.concat-label { display: flex; flex-direction: column; gap: 10px; padding-top: 12px; }
.concat-label code { font-size: 24px; }
.concat-label > span { font-size: 18px; color: var(--muted); }
.emoji { font-family: 'Noto Color Emoji', sans-serif; }
.concat-storage { display: flex; gap: 12px; align-items: start; }
.concat-storage .memory-cell { flex-shrink: 0; }
.concat-smiley { width: 156px; }
.concat-ellipsis { width: 26px; height: 66px; display: flex; align-items: center; justify-content: center; font-size: 30px; }
.concat-plus { width: 44px; height: 66px; display: flex; justify-content: center; align-items: center; font-size: 32px; color: var(--muted); }
.count-span { position: relative; border-top: 2px solid currentColor; margin-top: 10px; padding-top: 4px; text-align: center; font-size: 18px; }
.count-span::before, .count-span::after { content: ''; position: absolute; top: -5px; width: 8px; height: 8px; border-top: 2px solid currentColor; }
.count-span::before { left: 0; border-left: 2px solid currentColor; transform: rotate(-45deg); }
.count-span::after { right: 0; border-right: 2px solid currentColor; transform: rotate(45deg); }
.concat-legend { font-size: 18px; color: var(--muted); }
</style>
