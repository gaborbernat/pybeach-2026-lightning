<script setup lang="ts">
const base = import.meta.env.BASE_URL;
</script>

<template>
  <footer class="absolute bottom-0 right-0 p-2">
    <div class="bloomberg" :style="{ '--bloomberg-black': `url(${base}bb_black.webp)`, '--bloomberg-white': `url(${base}bb_white.webp)` }" />
    <p class="trademark">©{{ new Date().getFullYear() }} Bloomberg Finance L.P.</p>
    <p class="trademark">All rights reserved.</p>
  </footer>
</template>

<style>
.bloomberg {
  height: 14.5px;
  margin: 1px auto;
  background-size: contain;
  background-repeat: no-repeat;
  background-position: center;
  background-image: var(--bloomberg-black);
}

.dark .bloomberg {
  background-image: var(--bloomberg-white);
}
.bottom-0 {
  padding-bottom: 1px;
}

.right-0 {
  padding-right: 6px;
}

.trademark {
  font-size: 5px;
  font-weight: 600;
  color: black;
  text-align: center;
  line-height: 0.9;
}

.dark .trademark {
  color: white;
}
</style>
