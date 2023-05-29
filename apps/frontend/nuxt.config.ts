// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  srcDir: 'src/',
  modules: ['@sidebase/nuxt-auth', '@nuxtjs/tailwindcss', '@nuxtjs/color-mode'],
  build: {
    transpile: ['trpc-nuxt'],
  },
  typescript: {
    shim: false,
  },
  colorMode: { classSuffix: '' },
});
