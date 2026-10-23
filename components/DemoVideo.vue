<script setup lang="ts">
import { useDarkMode, useIsSlideActive, useNav, useSlideContext } from "@slidev/client";
import { computed, onMounted, onUnmounted, ref, watch } from "vue";

const props = defineProps<{
  name: "memory" | "isascii" | "encoding" | "decode" | "refund" | "escape";
  startAt?: number;
  reveal?: { pause: number; resume: number };
}>();
const { isDark } = useDarkMode();
const { isPrintMode } = useNav();
const { $renderContext, $clicks } = useSlideContext();
const isSlideActive = useIsSlideActive();
const active = computed(() => isSlideActive.value && $clicks.value >= (props.startAt ?? 0) && !isPrintMode.value
  && ["slide", "presenter"].includes($renderContext.value));
const source = computed(() => `${import.meta.env.BASE_URL}demos/${props.name}${isDark.value ? "" : "-light"}`);
const poster = computed(() => isPrintMode.value || !["slide", "presenter"].includes($renderContext.value)
  ? `${source.value}.png` : undefined);
const video = ref<HTMLVideoElement>();

onMounted(() => {
  watch($clicks, () => {
    if (!video.value || !props.reveal) return;
    if ($clicks.value > 0) {
      video.value.currentTime = Math.max(video.value.currentTime, props.reveal.resume);
      resume();
    } else holdForGuess();
  });
  watch([active, video], () => {
    if (!video.value) return;
    if (active.value) resume();
    else {
      video.value.pause();
      video.value.currentTime = 0;
    }
  }, { immediate: true, flush: "post" });

  let previousTime = -1;
  const recovery = window.setInterval(() => {
    if (!active.value || document.hidden || !video.value || waitingForClick()) return;
    if (video.value.error || (!video.value.paused && video.value.currentTime === previousTime)) video.value.load();
    previousTime = video.value.currentTime;
    resume();
  }, 3000);
  document.addEventListener("visibilitychange", resume);
  onUnmounted(() => {
    window.clearInterval(recovery);
    document.removeEventListener("visibilitychange", resume);
  });
});

function waitingForClick() {
  return props.reveal && $clicks.value === 0 && video.value && video.value.currentTime >= props.reveal.pause;
}

function holdForGuess() {
  if (!waitingForClick()) return;
  video.value!.pause();
  if (video.value!.currentTime > props.reveal!.pause) video.value!.currentTime = props.reveal!.pause;
}

async function resume() {
  if (!active.value || document.hidden || !video.value || !video.value.paused || waitingForClick()) return;
  try {
    await video.value.play();
  } catch (error) {
    if (!(error instanceof DOMException && error.name === "AbortError")) console.warn("Demo playback failed", error);
  }
}
</script>

<template>
  <video ref="video" :key="source" :src="`${source}.webm`" :poster="poster"
    :autoplay="active" muted loop playsinline preload="auto" class="demo-video"
    :controls="false" disablepictureinpicture @canplay="resume" @pause="resume" @ended="resume" @timeupdate="holdForGuess" />
</template>
