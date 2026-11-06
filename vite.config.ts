import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import {defineConfig, Plugin} from 'vite';

const geocodeProxyPlugin = (): Plugin => ({
  name: 'api-geocode-proxy',
  configureServer(server) {
    server.middlewares.use('/api/geocode', async (req, res) => {
      const url = new URL(req.url || '', `http://${req.headers.host || 'localhost'}`);
      const query = url.searchParams.get('q') || '';
      const key = process.env.VITE_GOOGLE_MAPS_API_KEY || '';

      if (!query) {
        res.statusCode = 400;
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify({ status: 'INVALID_REQUEST', error_message: 'Missing address query' }));
        return;
      }

      if (!key) {
        res.statusCode = 500;
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify({ status: 'REQUEST_DENIED', error_message: 'No Google Maps API key found' }));
        return;
      }

      try {
        const upstream = await fetch(
          `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(query)}&language=ko&region=kr&key=${key}`
        );
        const data = await upstream.json();
        res.statusCode = upstream.status;
        res.setHeader('Content-Type', 'application/json');
        res.setHeader('Cache-Control', 'public, max-age=3600');
        res.end(JSON.stringify(data));
      } catch (err: unknown) {
        res.statusCode = 502;
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify({ status: 'UNKNOWN_ERROR', error_message: String(err) }));
      }
    });
  }
});

export default defineConfig(() => {
  return {
    plugins: [react(), tailwindcss(), geocodeProxyPlugin()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modify—file watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
      // Disable file watching when DISABLE_HMR is true to save CPU during agent edits.
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});
