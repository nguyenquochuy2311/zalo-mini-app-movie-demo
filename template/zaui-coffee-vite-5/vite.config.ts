import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import zaloMiniApp from "zmp-vite-plugin";
import path from "path";

// https://vitejs.dev/config/
export default () => {
  return defineConfig({
    root: "./src",
    base: "",
    plugins: [zaloMiniApp(), react()],
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
        pages: path.resolve(__dirname, "./src/pages"),
        utils: path.resolve(__dirname, "./src/utils"),
        hooks: path.resolve(__dirname, "./src/hooks"),
        state: path.resolve(__dirname, "./src/state"),
        components: path.resolve(__dirname, "./src/components"),
        types: path.resolve(__dirname, "./src/types"),
        static: path.resolve(__dirname, "./src/static"),
      },
    },
  });
};
