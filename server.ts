import express from 'express';
import fs from 'node:fs';
import http from 'node:http';
import path from 'node:path';
import {
  ensureDbInitialized,
  getDb,
  resolveDb,
  type D1Database,
} from './server/db.ts';
import { createAdminRouter } from './server/routes/admin.ts';
import { createAuthRouter } from './server/routes/auth.ts';
import { createContentRouter } from './server/routes/content.ts';
import { createGamificationRouter } from './server/routes/gamification.ts';
import { createUserRouter } from './server/routes/user.ts';
import { attachAuth, csrfProtection } from './server/security.ts';

const isCloudflareRuntime =
  typeof navigator !== 'undefined' && navigator.userAgent === 'Cloudflare-Workers';

if (!isCloudflareRuntime) {
  try {
    const dotenvPkg = 'dotenv/config';
    await import(/* @vite-ignore */ dotenvPkg);
  } catch {
    // dotenv optional in production/edge
  }
}

const app = express();
const httpServer = http.createServer(app);
const PORT = Number((typeof process !== 'undefined' && process.env?.PORT) || 3000);

app.set('trust proxy', 1);

// Security headers
app.use((_req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  res.setHeader('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');
  next();
});

app.use(express.json({ limit: '1mb' }));

// Lazy D1 Database proxy ensuring all I/O is dispatched inside active request handlers
const dbProxy: D1Database = {
  prepare(query: string) {
    return getDb().prepare(query);
  },
  batch(statements: any) {
    return getDb().batch(statements);
  },
  exec(query: string) {
    return getDb().exec(query);
  },
};

// Populate Cloudflare Worker bindings/secrets and ensure D1 database is resolved & initialized per request
app.use(async (_req, _res, next) => {
  try {
    if (isCloudflareRuntime) {
      try {
        const cfWorkers = await import('cloudflare:workers');
        if (cfWorkers?.env) {
          (globalThis as any).__CF_ENV__ = cfWorkers.env;
        }
      } catch {
        // ignore if unavailable
      }
    }
    const db = await resolveDb((globalThis as any).__CF_ENV__);
    await ensureDbInitialized(db);
    next();
  } catch (err) {
    next(err);
  }
});

// Health check endpoint (returns exact JSON required by specification)
app.get('/api/health', (_req, res) => {
  res.json({ ok: true, service: 'sprachwerk-api' });
});

// Attach authenticated session user if present
app.use('/api', attachAuth(dbProxy));
// Protect all mutating API endpoints against CSRF
app.use('/api', csrfProtection);

app.use('/api/auth', createAuthRouter(dbProxy));
app.use('/api/admin', createAdminRouter(dbProxy));
app.use('/api/user', createUserRouter(dbProxy));
app.use('/api', createGamificationRouter(dbProxy));
app.use('/api', createContentRouter(dbProxy));

// Serve static assets or mount Vite dev middleware when running under Node.js (outside Cloudflare Workers)
async function setupNodeFrontend() {
  if (isCloudflareRuntime) return;

  if (process.env.NODE_ENV !== 'production') {
    const vitePkg = 'vite';
    const { createServer: createViteServer } = await import(/* @vite-ignore */ vitePkg);
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
}

if (!isCloudflareRuntime) {
  setupNodeFrontend().catch((err) => {
    console.error('Failed to setup Node frontend middleware:', err);
  });
}

// Bind HTTP server to port (virtual routing key inside Cloudflare Workers, TCP port in Node.js)
httpServer.listen(PORT, '0.0.0.0', () => {
  if (!isCloudflareRuntime) {
    console.log(`SPRACHWERK server listening on http://0.0.0.0:${PORT}`);
  }
});

// Export Cloudflare Worker entry point using official httpServerHandler
let cfHandler: unknown = null;
try {
  const { httpServerHandler } = await import('cloudflare:node');
  cfHandler = httpServerHandler({ port: PORT });
} catch {
  // Running in standard Node.js runtime
}

export default cfHandler;
