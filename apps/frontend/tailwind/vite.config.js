import {defineConfig} from 'vite';
import vue from '@vitejs/plugin-vue';

import { miracleTailwindPlugin } from './plugins/vite-plugin-tailwind';

import { miracleVitePluginEmoji } from './plugins/vite-plugin-emoji';

export default defineConfig({
    plugins:[vue(), miracleTailwindPlugin(),miracleVitePluginEmoji()]
})