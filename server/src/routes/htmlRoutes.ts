import path from 'node:path';
import { fileURLToPath } from 'node:url';
import express, { Router } from 'express';

const __filename = fileURLToPath(import.meta.url); // Get the current file path
const __dirname = path.dirname(__filename); // Get the current directory path

const router = Router();  // Create a router instance (instead of using 'app' directly)

// Serve static files from the "dist" folder (or wherever your build folder is located)
router.use(express.static(path.join(__dirname, 'dist')));  // This will serve files from 'dist'

router.get('/', (_req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html')); // Serving index.html
});

// Export router instead of app (assuming you're using this as part of a larger app)
export default router;