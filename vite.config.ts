import react from "@vitejs/plugin-react-swc";
import path from "path";
import { defineConfig } from "vite";
import dts from "vite-plugin-dts";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    dts({
      include: [path.resolve(__dirname, "src/hooks/useGridQueryFeatures.ts")],
    }),
  ],
  build: {
    lib: {
      entry: path.resolve(__dirname, "src/hooks/useGridQueryFeatures.ts"),
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
