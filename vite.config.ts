import path from "path";
import { defineConfig } from "vite";
import dts from "vite-plugin-dts";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    dts({
      include: [path.resolve(__dirname, "src/useGridQueryFeatures.ts")],
    }),
  ],
  build: {
    lib: {
      entry: path.resolve(__dirname, "src/useGridQueryFeatures.ts"),
      name: "useGridQueryFeatures",
      fileName: (format) => `useGridQueryFeatures.${format}.js`,
    },
    rollupOptions: {
      external: ["react", "react-dom"],
      output: {
        globals: {
          react: "React",
        },
      },
    },
  },
});
