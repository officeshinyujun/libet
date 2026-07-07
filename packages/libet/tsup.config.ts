import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/index.ts"],
  format: ["esm", "cjs"],
  dts: {
    compilerOptions: {
      composite: false,
    },
  },
  sourcemap: true,
  splitting: false,
  clean: true,
  external: ["react", "@react-three/fiber", "three", "@dimforge/rapier3d-compat", "@react-three/drei", "@react-three/rapier"]
});
