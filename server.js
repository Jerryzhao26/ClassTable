import express from 'express';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const app = express();

app.disable('x-powered-by');
app.use((_req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  next();
});

// Only built frontend assets are public. Never expose source, config, or build scripts.
app.use('/assets', express.static(path.join(__dirname, 'assets'), { index: false, dotfiles: 'deny' }));
app.get('/', (_req, res) => res.sendFile(path.join(__dirname, 'index.html')));
app.get('*', (req, res) => {
  if (req.path.startsWith('/assets/') || path.posix.extname(req.path)) {
    return res.sendStatus(404);
  }
  return res.sendFile(path.join(__dirname, 'index.html'));
});

const requestedPort = process.env.PORT ?? '3000';
const PORT = Number(requestedPort);
if (!Number.isInteger(PORT) || PORT < 0 || PORT > 65535) {
  throw new Error('PORT must be an integer between 0 and 65535');
}

if (process.argv[1] && path.resolve(process.argv[1]) === __filename) {
  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

export default app;
