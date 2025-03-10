import dotenv from 'dotenv';
import express from 'express';
import path from 'path'; // For serving static files
import { fileURLToPath } from 'node:url'; // For getting the current directory in ES modules

dotenv.config();

// Get __dirname in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

import routes from './routes/index.js';

const app = express();
const PORT = process.env.PORT || 3001;

// Serve static files from the 'client/dist' folder
// This includes serving files from the 'assets' folder
app.use(express.static(path.join(__dirname, 'client', 'dist'))); // Static assets

// Middleware for parsing JSON and urlencoded form data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Middleware to connect API routes
app.use(routes);

// Catch-all route for all non-API requests (SPA support)
// Ensures index.html is served for routes handled by the frontend
app.get('*', (_req, res) => {
  res.sendFile(path.join(__dirname, 'client', 'dist', 'index.html'));
});

// Start the server on the port
app.listen(PORT, () => console.log(`Listening on PORT: ${PORT}`));