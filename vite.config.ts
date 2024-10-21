import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';

// https://vitejs.dev/config/
export default defineConfig({
	plugins: [ react() ],
	css: {
		preprocessorOptions: {
			scss: {
				api: 'modern-compiler',
			},
		},
	},
	resolve: {
		alias: {
			'webmidi': 'webmidi/dist/esm/webmidi.esm.js',
		},
	},
});
