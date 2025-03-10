import path from 'node:path';
import { fileURLToPath } from 'node:url';
import express, { Router } from 'express';

const __filename = fileURLToPath(import.meta.url); 
const __dirname = path.dirname(__filename); 

const router = Router();  

// Serve static files from the "dist" folder (or wherever your build folder is located)
router.use(express.static(path.join(__dirname, 'dist')));  

router.get('/', (_req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html')); 
});


export default router;