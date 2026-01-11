<script setup lang="ts">

defineProps({
  text: String
})

</script>

<template>

  <button class="px-3 py-1 bg-white/20 hover:bg-white/40 cursor-pointer transition rounded-md">
    {{ text }}
  </button>

</template>

<style scoped>

</style>