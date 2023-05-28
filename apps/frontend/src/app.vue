<script setup lang="ts">
useHead({
  bodyAttrs: {
    class: 'bg-white dark:bg-zinc-900 text-zinc-800 dark:text-zinc-100',
  },
});
</script>
<template>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>
<style>
html,
body {
  height: 100%;
}

#__nuxt {
  height: 100%;
}
</style>

