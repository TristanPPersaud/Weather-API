import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { Router } from 'express';
import express from 'express';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const router = Router();

// Serve static files from the "public" folder (or wherever you place your index.html)
router.use(express.static(path.join(__dirname, 'public')));

export default router;