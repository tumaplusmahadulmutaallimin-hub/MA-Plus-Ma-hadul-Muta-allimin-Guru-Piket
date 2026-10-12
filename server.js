import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = parseInt(process.env.PORT || '3000', 10);
const host = '0.0.0.0';

const distPath = path.join(__dirname, 'dist');

// Serve static assets from the production build
if (fs.existsSync(distPath)) {
  app.use(express.static(distPath));
} else {
  console.warn('Notice: dist directory not found at startup. Please run npm run build.');
}

// Health check endpoints for Cloud Run and container probes
app.get('/_healthz', (_req, res) => {
  res.status(200).send('OK');
});

app.get('/healthz', (_req, res) => {
  res.status(200).send('OK');
});

// SPA fallback: return index.html for client-side routing
app.get('*', (_req, res) => {
  const indexPath = path.join(distPath, 'index.html');
  if (fs.existsSync(indexPath)) {
    res.sendFile(indexPath);
  } else {
    res.status(200).send('Application server is running.');
  }
});

app.listen(port, host, () => {
  console.log(`Application server running on http://${host}:${port}`);
});
