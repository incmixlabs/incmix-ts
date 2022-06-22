import solid from "solid-start";
import { defineConfig } from "vite";
import tsrPlugin from "@incmix/vite-plugin-tsr";

export default defineConfig({
  plugins: [tsrPlugin(), solid({ ssr: false })],
});
