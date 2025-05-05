import { defineConfig } from 'vitest/config';

export default defineConfig({
	test: {
		environment: 'jsdom' // ✅ enable document/window/etc.
	}
});
