import { defineConfig } from 'vitest/config';
import path from 'path';
import { svelte } from '@sveltejs/vite-plugin-svelte';

export default defineConfig({
	plugins: [svelte()],
	resolve: {
		alias: {
			$lib: path.resolve('./src/lib'),
			$components: path.resolve('./src/components')
			// Add more aliases as needed
		}
	},
	test: {
		silent: false,
		environment: 'jsdom' // if you're testing DOM
	}
});
