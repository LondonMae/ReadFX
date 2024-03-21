import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { VitePWA } from 'vite-plugin-pwa'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    VitePWA({
      manifest: {
        name: "Vite + Vue PWA project",
        short_name: "Vue PWA",
        theme_color: "#ffffff",
        start_url: "/",
        display: "standalone",
        background_color: "#ffffff",
        icons: [
          {
              "src": "vite.svg",
              "sizes": "any",
              "type": "image/svg+xml",
              "purpose": "maskable any"
          }
        ],
      },
    }),
  ],
})
