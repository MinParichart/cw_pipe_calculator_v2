export default defineNuxtConfig({
  compatibilityDate: '2024-04-03',
  devtools: { enabled: false },

  devServer: {
    port: 3003, // Frontend runs on 3003
    host: 'localhost'
  },

  modules: [
    '@nuxtjs/tailwindcss',
    '@pinia/nuxt',
  ],

  css: ['~/assets/css/main.css'],

  app: {
    head: {
      title: 'CW Pipe Calculator',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      ],
      link: [
        { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
        { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' },
        {
          rel: 'stylesheet',
          href: 'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Sarabun:wght@300;400;500;600;700&display=swap'
        },
      ],
    },
  },

  runtimeConfig: {
    public: {
      // Backend API runs on port 3004
      apiBase: process.env.NUXT_PUBLIC_API_BASE_URL || 'http://localhost:3004/api',
    },
  },

  plugins: ['~/plugins/axios.ts'],

  vite: {
    optimizeDeps: {
      include: ['@vue-flow/core', '@vue-flow/background'],
    },
    server: {
      // เอา hmr.port: 3001 ออกไปครับ เพื่อให้ Vite ใช้ Port มาตรฐานสำหรับ HMR (ไม่ทับหน้าเว็บ)
      hmr: {
        protocol: 'ws',
        host: 'localhost',
      },
      watch: {
        usePolling: true, // ตัวนี้ดีแล้วครับ ช่วยให้ Windows ตรวจจับการเซฟไฟล์ได้แม่นขึ้น
      },
      // Proxy uploads folder to backend
      proxy: {
        '/uploads': {
          target: 'http://localhost:3004',
          changeOrigin: true,
        },
      },
    },
  },
})