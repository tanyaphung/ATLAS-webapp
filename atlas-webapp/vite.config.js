import { defineConfig } from 'vite';
import laravel from 'laravel-vite-plugin';
import { bunny } from 'laravel-vite-plugin/fonts';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
    plugins: [
        laravel({
            input: ['resources/css/app.css', 
                    'resources/js/app.js',
                    'resources/js/traitDB.js',
                    'resources/js/global.js',
                    'resources/js/traitView.js',
                    'resources/js/sweetalert.min.js',
                    'resources/js/stats.js',
                    'resources/js/sidebar.js',
                    'resources/js/reportGWAS.js',
                    'resources/js/odometer.min.js',
                    'resources/js/multiGWAS.js',
                    'resources/js/jquery.tabletoCSV.js',
                    'resources/js/google_analytics.js',
                    'resources/js/PheWAS.js',
                    'resources/js/HoldOn.min.js'
                ],
            refresh: true,
            fonts: [
                bunny('Instrument Sans', {
                    weights: [400, 500, 600],
                }),
            ],
        }),
        tailwindcss(),
    ],
    server: {
        host: true,
        port: 5173,
        hmr: {
            host: 'localhost',
        },
        watch: {
            usePolling: true,
        },
        cors: true
    },
});
