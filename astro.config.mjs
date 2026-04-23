// @ts-check
import { defineConfig } from "astro/config";
import mdx from "@astrojs/mdx";

export default defineConfig({
	site: "https://adrismate.com",
	integrations: [mdx()],
	vite: {
		assetsInclude: ["**/*.jpg", "**/*.jpeg", "**/*.png", "**/*.mp4"],
		build: {
			rollupOptions: {
				output: {
					assetFileNames: "assets/[name]-[hash][extname]",
				},
			},
		},
	},
});
