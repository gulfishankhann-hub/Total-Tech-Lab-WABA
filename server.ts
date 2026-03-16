import express from 'express';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = parseInt(process.env.PORT || '3000', 10);

// Path to the built Vite app
const distPath = path.join(__dirname, 'dist');
const indexPath = path.join(distPath, 'index.html');

// Serve static files EXCEPT index.html
app.use(express.static(distPath, { index: false }));

// For all other routes, inject environment variables into index.html
app.get('*', (req, res) => {
  fs.readFile(indexPath, 'utf8', (err, htmlData) => {
    if (err) {
      console.error('Error reading index.html', err);
      return res.status(500).send('Error loading application');
    }
    
    // Grab environment variables at runtime
    const envVars = {
      VITE_META_ACCESS_TOKEN: process.env.VITE_META_ACCESS_TOKEN || process.env.META_ACCESS_TOKEN || '',
      VITE_META_PHONE_NUMBER_ID: process.env.VITE_META_PHONE_NUMBER_ID || process.env.META_PHONE_NUMBER_ID || '',
      VITE_META_WABA_ID: process.env.VITE_META_WABA_ID || process.env.META_WABA_ID || '',
      VITE_META_APP_ID: process.env.VITE_META_APP_ID || process.env.META_APP_ID || '',
    };
    
    // Inject them into the <head> of the HTML
    const injectedHtml = htmlData.replace(
      '<head>',
      `<head><script>window.__ENV__ = ${JSON.stringify(envVars)};</script>`
    );
    
    res.send(injectedHtml);
  });
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server listening on port ${PORT}`);
});
