import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import fs from 'fs';
import {defineConfig, Plugin} from 'vite';

const storeApiPlugin = (): Plugin => ({
  name: 'store-api-plugin',
  configureServer(server) {
    const dataDir = path.resolve(__dirname, 'data');
    const dataFile = path.resolve(dataDir, 'store.json');

    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
    }

    server.middlewares.use((req, res, next) => {
      if (req.url === '/api/diva/data' && req.method === 'GET') {
        res.setHeader('Content-Type', 'application/json');
        if (fs.existsSync(dataFile)) {
          const content = fs.readFileSync(dataFile, 'utf-8');
          res.end(content);
        } else {
          res.end(JSON.stringify({ products: [], initialized: false }));
        }
        return;
      }

      if (req.url === '/api/diva/data' && req.method === 'POST') {
        let body = '';
        req.on('data', chunk => {
          body += chunk;
        });
        req.on('end', () => {
          try {
            fs.writeFileSync(dataFile, body, 'utf-8');
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({ success: true }));
          } catch (err: any) {
            res.statusCode = 500;
            res.end(JSON.stringify({ error: err.message }));
          }
        });
        return;
      }

      next();
    });
  },
});

export default defineConfig(() => {
  return {
    plugins: [react(), tailwindcss(), storeApiPlugin()],
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
