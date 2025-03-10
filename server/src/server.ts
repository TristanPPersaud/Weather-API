import dotenv from 'dotenv';
import express from 'express';
import path from 'path';
import { fileURLToPath } from 'node:url';

dotenv.config();

// Get __dirname in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

import routes from './routes/index.js';

const app = express();
const PORT = process.env.PORT || 3001;

// Serve static files from the 'dist' folder (after the client is built)
app.use(express.static(path.join(__dirname, 'dist')));

// Middleware to parse JSON and urlencoded form data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Middleware to connect API routes
app.use(routes);

// Catch-all route for all non-API requests (SPA support)
app.get('*', (_req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

// Start the server
app.listen(PORT, () => console.log(`Server listening on port ${PORT}`));