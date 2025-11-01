import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = process.env.PORT || 8080;

const distPath = path.join(__dirname, 'dist');

// Serve static files from dist folder with explicit configuration
app.use(express.static(distPath, {
  index: 'index.html',
  extensions: ['html']
}));

// Handle SPA routing - send all requests to dist/index.html
app.get('*', (req, res) => {
  res.sendFile(path.join(distPath, 'index.html'), (err) => {
    if (err) {
      console.error('Error sending file:', err);
      res.status(500).send('Error loading application');
    }
  });
});

app.listen(port, '0.0.0.0', () => {
  console.log(`Server is running on port ${port}`);
  console.log(`Serving files from: ${distPath}`);
});
