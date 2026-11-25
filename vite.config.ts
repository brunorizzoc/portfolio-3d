import tailwindcss from '@tailwindcss/vite';
import path from 'path';
import {defineConfig, type Plugin} from 'vite';

function routePortfolioPlugin(): Plugin {
  const rewriteRoutes = (
    req: {url?: string},
    res: {writeHead: (status: number, headers: Record<string, string>) => void; end: () => void},
    next: () => void,
  ) => {
    if (req.url) {
      const [pathname, search] = req.url.split('?');
      const qs = search ? `?${search}` : '';
      if (pathname === '/3d/') {
        res.writeHead(302, {Location: '/3d' + qs});
        res.end();
        return;
      }
      if (pathname === '/3d') {
        req.url = '/3d/index.html' + qs;
      } else if (pathname === '/3' || pathname === '/3/') {
        req.url = '/3/index.html' + qs;
      } else if (pathname === '/2' || pathname === '/2/') {
        req.url = '/index.html' + qs;
      }
    }
    next();
  };

  return {
    name: 'route-portfolio-subpages',
    configureServer(server) {
      server.middlewares.use(rewriteRoutes);
    },
    configurePreviewServer(server) {
      server.middlewares.use(rewriteRoutes);
    },
  };
}

export default defineConfig(() => {
  return {
    plugins: [tailwindcss(), routePortfolioPlugin()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    build: {
      rollupOptions: {
        input: {
          main: path.resolve(__dirname, 'index.html'),
          v3d: path.resolve(__dirname, '3d/index.html'),
          v3: path.resolve(__dirname, '3/index.html'),
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
