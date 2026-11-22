import 'dotenv/config';
import express from 'express';
import fs from 'node:fs';
import http from 'node:http';
import path from 'node:path';
import { getDb } from './server/db.ts';
import { createAdminRouter } from './server/routes/admin.ts';
import { createAuthRouter } from './server/routes/auth.ts';
import { createContentRouter } from './server/routes/content.ts';
import { createGamificationRouter } from './server/routes/gamification.ts';
import { createUserRouter } from './server/routes/user.ts';
import { attachAuth, csrfProtection } from './server/security.ts';

async function startServer() {
  const app = express();
  const httpServer = http.createServer(app);
  const PORT = Number(process.env.PORT || 3000);
  const db = getDb();

  app.set('trust proxy', 1);

  // Security headers
  app.use((_req, res, next) => {
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
    res.setHeader('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');
    next();
  });

  app.use(express.json({ limit: '1mb' }));

  // Attach authenticated session user if present
  app.use('/api', attachAuth(db));
  // Protect all mutating API endpoints against CSRF
  app.use('/api', csrfProtection);

  app.get('/api/health', (_req, res) => {
    res.json({ ok: true, service: 'sprachwerk-api' });
  });

  app.use('/api/auth', createAuthRouter(db));
  app.use('/api/admin', createAdminRouter(db));
  app.use('/api/user', createUserRouter(db));
  app.use('/api', createGamificationRouter(db));
  app.use('/api', createContentRouter(db));

  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: {
        middlewareMode: true,
        allowedHosts: true,
        ws: { server: httpServer },
        hmr: process.env.DISABLE_HMR !== 'true',
      },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distDir = path.resolve(process.cwd(), 'dist');
    app.use(express.static(distDir));
    app.get('*', (_req, res) => {
      const indexFile = path.join(distDir, 'index.html');
      if (fs.existsSync(indexFile)) {
        res.sendFile(indexFile);
      } else {
        res.status(404).send('Build output not found.');
      }
    });
  }

  httpServer.listen(PORT, '0.0.0.0', () => {
    console.log(`SPRACHWERK server listening on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start SPRACHWERK server:', err);
  process.exit(1);
});
