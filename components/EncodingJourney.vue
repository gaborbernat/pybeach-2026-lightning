<script setup lang="ts">
import { useDarkMode, useIsSlideActive, useNav } from "@slidev/client";
import { computed, useId } from "vue";

const id = useId();
const { isDark } = useDarkMode();
const { isPrintMode } = useNav();
const isSlideActive = useIsSlideActive();
const running = computed(() => isSlideActive.value && !isPrintMode.value);
const routes = ["M 245 217 L 350 217", "M 480 217 C 620 217 620 105 790 105", "M 480 217 C 590 217 590 293 700 293"];
</script>

<template>
  <div class="encoding-journey" :class="{ running }" :style="{ '--packet-text': isDark ? '#111' : '#fff' }" role="img" aria-label="A RAM module holds the Unicode string. UTF-8 encoding produces bytes that flow into a file or across a network connection. The original string stays in memory.">
    <svg class="journey-wires" viewBox="0 0 1000 420" aria-hidden="true">
      <defs>
        <linearGradient :id="`${id}-gradient`"><stop stop-color="var(--orange)" /><stop offset="1" stop-color="var(--green)" /></linearGradient>
        <marker :id="`${id}-arrow`" viewBox="0 0 12 12" refX="10" refY="6" markerWidth="8" markerHeight="8" orient="auto-start-reverse"><path d="M 2 2 L 10 6 L 2 10" fill="none" stroke="var(--green)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" /></marker>
      </defs>
      <path v-for="route in routes" :key="route" :d="route" class="wire-shadow" />
      <path v-for="route in routes" :key="`${route}-flow`" :d="route" :stroke="`url(#${id}-gradient)`" :marker-end="`url(#${id}-arrow)`" class="wire" />
      <g class="travelling-bytes">
        <g v-for="(route, index) in routes" :key="route">
          <g v-for="(item, packet) in [{ character: 'a', bytes: ['61'], tone: 'blue' }, { character: '🙂', bytes: ['F0', '9F', '99', '82'], tone: 'orange' }]" :key="item.character" class="travelling-byte" :class="[item.tone, { 'character-packet': !index, 'emoji-packet': !index && packet }]" :style="{ offsetPath: `path('${index === 0 ? 'M 245 217 L 331 217' : index === 1 ? `M 552 180 C 620 170 630 105 ${packet ? 724 : 772} 105` : `M 552 252 C 590 270 592 293 ${packet ? 634 : 682} 293`}')`, animationDelay: `${packet * .875 + (index ? .6 : 0)}s` }">
            <template v-if="index">
              <g v-for="(byte, position) in item.bytes" :key="position" class="wire-byte" :transform="`translate(${position * 34 - (item.bytes.length - 1) * 17} 0)`"><rect x="-15" y="-18" width="30" height="36" rx="4" /><text text-anchor="middle" y="7">{{ byte }}</text></g>
            </template>
            <template v-else><rect x="-18" y="-18" width="36" height="36" rx="6" /><text text-anchor="middle" y="7">{{ item.character }}</text></template>
          </g>
        </g>
      </g>
    </svg>

    <div class="memory-device">
      <div class="device-label orange">Python <code>str</code></div>
      <div class="ram-board">
        <div class="ram-traces" />
        <div class="ram-chips"><i v-for="chip in 4" :key="chip"><span>RAM</span></i></div>
        <div class="ram-pins"><i v-for="pin in 24" :key="pin" /></div>
      </div>
      <div class="memory-content"><code>friendly</code><div><span>a</span><span>a</span><b>…</b><span>a</span><span class="emoji">🙂</span></div></div>
      <div class="device-size orange">4.00 MB <small>Python object</small></div>
      <div class="device-note">The original stays in memory.</div>
    </div>

    <div class="encoder">
      <code class="encode-call">.encode("utf-8")</code>
      <div class="encoder-wheel"><div class="encoder-core">UTF-8</div><i /><i /><i /></div>
      <div class="encoding-labels">UTF-8 examples (hex)</div>
      <div class="encoding-map blue"><span>"a"</span><b>→</b><code>61</code></div>
      <div class="encoding-map orange"><span class="emoji">🙂</span><b>→</b><code>F0 9F 99 82</code></div>
    </div>

    <div class="file-destination">
      <div class="file-stack"><div class="file-page"><span class="file-fold" /><span class="file-heading">message.txt</span><div class="file-bytes"><code v-for="line in ['61 61 61 61', '61 61 … 61', 'F0 9F 99 82']" :key="line">{{ line }}</code></div><div class="file-save"><span class="i-carbon-save" /> saved</div></div></div>
      <div class="destination-caption purple"><strong>File</strong><span>? bytes</span><small>UTF-8 payload</small></div>
    </div>

    <div class="network-destination">
      <div class="network-machines">
        <div class="laptop"><div class="laptop-screen"><span class="i-carbon-terminal" /><code>61 … 82</code></div><div class="laptop-base" /></div>
        <div class="network-cable"><i /><i /><i /></div>
        <div class="laptop receiving"><div class="laptop-screen"><span class="i-carbon-cloud" /><code>61 … 82</code></div><div class="laptop-base" /></div>
      </div>
      <div class="destination-caption blue"><strong>Network</strong><span>? bytes</span><small>UTF-8 payload</small></div>
    </div>
  </div>
</template>

<style scoped>
.encoding-journey { position: relative; width: 1000px; height: 420px; margin-top: 18px; }
.journey-wires { position: absolute; inset: 0; width: 100%; height: 100%; overflow: visible; }
.wire-shadow { fill: none; stroke: color-mix(in srgb, var(--blue) 12%, transparent); stroke-width: 15; }
.wire { fill: none; stroke-width: 3; stroke-linecap: round; }
.travelling-byte { offset-rotate: 0deg; animation: move-byte 1.75s linear infinite; animation-play-state: paused; opacity: 0; }
.running .travelling-byte { animation-play-state: running; }
.travelling-byte rect { fill: currentColor; stroke: currentColor; stroke-width: 2; }
.travelling-byte text { fill: var(--packet-text); font: 16px 'Adwaita Mono', monospace; font-weight: 650; }
.character-packet text { font-size: 24px; }
.emoji-packet text { font-family: 'Noto Color Emoji', sans-serif; }
.memory-device { position: absolute; left: 0; top: 68px; width: 250px; text-align: center; }
.device-label { font-size: 25px; font-weight: 600; }
.ram-board { position: relative; height: 90px; margin: 25px 6px 24px; border: 2px solid #3f9679; border-radius: 5px; background: linear-gradient(145deg, #276f55, #133f35); transform: perspective(600px) rotateX(24deg) rotateZ(-6deg); box-shadow: 0 6px 0 #0e332a, 0 15px 22px #0003; }
.ram-traces { position: absolute; inset: 9px; background: repeating-linear-gradient(0deg, transparent 0 8px, #71c09f77 8px 9px), repeating-linear-gradient(90deg, transparent 0 13px, #71c09f66 13px 14px); }
.ram-chips { position: absolute; inset: 13px 12px 21px; display: flex; gap: 9px; }
.ram-chips i { flex: 1; background: linear-gradient(135deg, #394344, #151d22); border: 1px solid #748887; border-radius: 3px; box-shadow: 2px 3px 0 #081f19; display: grid; place-items: center; }
.ram-chips span { font: 9px 'Adwaita Mono', monospace; color: #b5c6c0; }
.ram-pins { position: absolute; bottom: -2px; left: 12px; right: 12px; display: flex; gap: 3px; height: 15px; }
.ram-pins i { flex: 1; background: linear-gradient(90deg, #b18c42, #f4d78b, #b18c42); }
.memory-content { color: var(--orange); }
.memory-content > code { font-size: 21px; }
.memory-content > div { display: flex; justify-content: center; gap: 5px; margin-top: 12px; }
.memory-content span { font-size: 23px; width: 42px; border-bottom: 4px solid currentColor; background: color-mix(in srgb, var(--orange) 12%, transparent); }
.memory-content b { font-size: 22px; font-weight: 400; }
.emoji { font-family: 'Noto Color Emoji', sans-serif; }
.device-size { font-size: 27px; font-weight: 650; margin-top: 9px; }
.device-size small { display: block; color: var(--muted); font-size: 15px; font-weight: 400; }
.destination-caption { display: grid; grid-template-columns: auto auto; justify-content: center; gap: 3px 16px; font-size: 24px; }
.destination-caption strong { font-weight: 500; }
.destination-caption span { font-weight: 650; }
.destination-caption small { grid-column: 1 / -1; font-size: 16px; color: var(--muted); }
.device-note { color: var(--muted); font-size: 15px; margin-top: 8px; }
.encoder { position: absolute; left: 310px; top: 111px; width: 210px; text-align: center; }
.encode-call { font-size: 20px; color: var(--green); white-space: nowrap; }
.encoder-wheel { position: relative; width: 114px; height: 114px; margin: 18px auto 0; border: 3px dashed var(--green); border-radius: 50%; box-shadow: 0 0 0 9px color-mix(in srgb, var(--green) 8%, transparent); }
.encoder-core { position: absolute; inset: 11px; display: grid; place-items: center; border: 2px solid var(--green); border-radius: 50%; font-size: 23px; font-weight: 650; color: var(--green); background: var(--terminal); }
.encoder-wheel > i { position: absolute; inset: -4px; border: 4px solid transparent; border-top-color: var(--green); border-radius: 50%; animation: encode-spin .75s linear infinite; animation-play-state: paused; }
.encoder-wheel > i:nth-of-type(2) { animation-delay: -.25s; }
.encoder-wheel > i:nth-of-type(3) { animation-delay: -.5s; }
.running .encoder-wheel > i { animation-play-state: running; }
.encoding-labels { margin-top: 20px; color: var(--muted); font-size: 15px; }
.encoding-map { display: grid; grid-template-columns: 35px 20px 1fr; gap: 6px; align-items: center; text-align: left; margin-top: 7px; }
.encoding-map > span { font-size: 21px; text-align: center; }
.encoding-map b { font-size: 20px; font-weight: 400; }
.encoding-map code { font-size: 18px; padding: 2px 4px; white-space: nowrap; }
.file-destination { position: absolute; top: 6px; left: 765px; width: 220px; text-align: center; }
.file-stack { position: relative; width: 144px; margin: 0 auto 16px; transform: perspective(650px) rotateY(-15deg) rotateZ(5deg); }
.file-stack::before { content: ''; position: absolute; inset: 7px -7px -7px 7px; border: 1px solid #a997c0; background: #d9d0e7; border-radius: 5px; }
.file-page { position: relative; height: 171px; text-align: left; background: linear-gradient(130deg, #fff, #ebe5f5); color: #633395; padding: 33px 12px 12px; border: 1px solid #bba6d4; border-radius: 5px; box-shadow: 8px 12px 17px #0002; overflow: hidden; }
.file-fold { position: absolute; right: 0; top: 0; width: 27px; height: 27px; background: linear-gradient(45deg, #d3c1e6 48%, #f8f5fc 50%); box-shadow: -2px 2px 3px #0002; }
.file-heading { font: 14px 'Adwaita Mono', monospace; font-weight: 650; }
.file-bytes { display: grid; gap: 7px; margin-top: 14px; }
.file-bytes code { font-size: 12px; padding: 0; background: transparent; }
.file-save { display: flex; gap: 5px; align-items: center; font-size: 12px; color: #18734f; margin-top: 13px; }
.file-save > span { display: inline-block; }
.network-destination { position: absolute; left: 716px; top: 253px; width: 280px; text-align: center; }
.network-machines { display: flex; align-items: center; height: 90px; margin-bottom: 5px; }
.laptop { width: 108px; perspective: 400px; }
.laptop-screen { height: 66px; border: 5px solid #647384; border-bottom-width: 7px; border-radius: 6px 6px 2px 2px; background: linear-gradient(135deg, #15263a, #234766); box-shadow: inset 0 0 12px #0c162b; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 7px; transform: rotateY(12deg); }
.laptop-screen > span { display: block; width: 24px; height: 24px; color: #8dc5ff; }
.laptop-screen code { color: #a3ead0; font-size: 12px; background: none; padding: 0; }
.laptop-base { height: 8px; margin: 0 -6px; background: linear-gradient(#cbd5df, #7d8fa3); border-radius: 1px 1px 8px 8px; box-shadow: 0 6px 9px #0002; }
.receiving .laptop-screen { transform: rotateY(-12deg); }
.network-cable { flex: 1; height: 3px; background: var(--blue); position: relative; margin: 0 5px; }
.network-cable i { position: absolute; top: -3px; left: 0; width: 9px; height: 9px; background: var(--blue); border-radius: 50%; animation: network-packet .5s linear infinite; animation-play-state: paused; opacity: 0; }
.network-cable i:nth-child(2) { animation-delay: .15s; }
.network-cable i:nth-child(3) { animation-delay: .3s; }
.running .network-cable i { animation-play-state: running; }
@keyframes move-byte { 0% { offset-distance: 0%; opacity: 0; } 1%, 42% { opacity: 1; } 43%, 100% { offset-distance: 100%; opacity: 0; } }
@keyframes encode-spin { to { transform: rotate(360deg); } }
@keyframes network-packet { 0% { left: 0; opacity: 0; } 10%, 85% { opacity: 1; } 100% { left: 90%; opacity: 0; } }
@media print, (prefers-reduced-motion: reduce) { .travelling-bytes, .network-cable i, .encoder-wheel > i { display: none; } }
</style>
