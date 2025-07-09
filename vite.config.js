import { defineConfig } from "vite";
import { resolve } from "path";
import { viteStaticCopy } from "vite-plugin-static-copy";

export default defineConfig({
  build: {
    outDir: "dist",
    emptyOutDir: true,
    rollupOptions: {
      input: {
        background: resolve(__dirname, "extension/background.js"),
        options: resolve(__dirname, "extension/options.js"),
      },
      output: {
        entryFileNames: "[name].js",
      },
    },
  },
  plugins: [
    viteStaticCopy({
      targets: [
        { src: "extension/manifest.json", dest: "." },
        { src: "extension/options.html", dest: "." },
        { src: "extension/logos/*", dest: "logos" },
      ],
    }),
  ],
});
