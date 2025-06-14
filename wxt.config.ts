import { defineConfig } from "wxt";
import tailwindcss from "@tailwindcss/vite";
import { ViteImageOptimizer } from "vite-plugin-image-optimizer";

// See https://wxt.dev/api/config.html
export default defineConfig({
  vite: () => ({
    plugins: [tailwindcss(), ViteImageOptimizer()],
    build: {
      assetsInlineLimit: 0,
      cssMinify: "lightningcss",
      emptyOutDir: true,
      target: "esnext",
      rollupOptions: {
        treeshake: "recommended",
        cache: true
      }
    }
  }),
  srcDir: "src",
  modules: ["@wxt-dev/module-react", "@wxt-dev/auto-icons"],
  manifest: {
    name: "Startify",
    default_locale: "en",
    browser_specific_settings: {
      gecko: {
        id: "{d5e5fe42-da08-4573-8ffd-6075ae68c834}"
      }
    },
    host_permissions: [
      "https://*/*",
      "http://*/*",
      "https://api.weatherapi.com/"
    ],
    permissions: ["storage", "unlimitedStorage", "activeTab", "downloads"]
  }
});
