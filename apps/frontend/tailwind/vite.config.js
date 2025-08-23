import {defineConfig} from 'vite';
import vue from '@vitejs/plugin-vue';

import { miracleTailwindPlugin } from './plugins/vite-plugin-tailwind';

export default defineConfig({
    plugins:[vue(), miracleTailwindPlugin()]
})