import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { resolve } from "path";
import dts from "vite-plugin-dts";

// https://vitejs.dev/config/
export default defineConfig({
	build: {
		lib: {
		  entry: resolve(__dirname, "./lib/index.ts"),
		  name: "@bigfootds/react-gamepad-utils",
		  fileName: (format) => `index.${format}.js`,
		},
		rollupOptions: {
		  external: ["react", "react-dom", "prop-types"],
		  output: {
			globals: {
			  react: "React",
			  "react-dom": "ReactDOM",
			  "prop-types": "PropTypes",
			},
		  },
		},
		sourcemap: true,
		emptyOutDir: true,
	  },
	  plugins: [react(), dts({ rollupTypes: true })],
});
