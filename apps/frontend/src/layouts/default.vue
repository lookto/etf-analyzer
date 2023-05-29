<script setup lang="ts"></script>
<template>
  <div class="h-full flex flex-col">
    <DarkModeToggle />
    <div class="flex-grow flex flex-col items-center px-2 sm:p-0">
      <slot />
    </div>
  </div>
</template>
