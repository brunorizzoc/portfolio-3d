import tailwindcss from '@tailwindcss/vite';
import path from 'path';
import {defineConfig, type Plugin} from 'vite';

function routeV2Plugin(): Plugin {
  const rewriteV2 = (
    req: {url?: string},
    _res: unknown,
    next: () => void,
  ) => {
    if (req.url) {
      const [pathname, search] = req.url.split('?');
      if (pathname === '/2' || pathname === '/2/') {
        req.url = '/2/index.html' + (search ? `?${search}` : '');
      }
    }
    next();
  };

  return {
    name: 'route-v2-subpage',
    configureServer(server) {
      server.middlewares.use(rewriteV2);
    },
    configurePreviewServer(server) {
      server.middlewares.use(rewriteV2);
    },
  };
}

export default defineConfig(() => {
  return {
    plugins: [tailwindcss(), routeV2Plugin()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    build: {
      rollupOptions: {
        input: {
          main: path.resolve(__dirname, 'index.html'),
          v2: path.resolve(__dirname, '2/index.html'),
        },
      },
    },
    server: {
      allowedHosts: true as const,
      hmr: process.env.DISABLE_HMR !== 'true',
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
    preview: {
      allowedHosts: true as const,
    },
  };
});

