import { Router } from 'express';
const router = Router();

import apiRoutes from './api/index.js';
import htmlRoutes from './api/index.js'
import weatherRoutes from './api/weatherRoutes.js';  // Add this line to import the weather routes

// Use the routes
router.use('/api', apiRoutes);
router.use('/api/weather', weatherRoutes);  // Connect weather routes under /api/weather
router.use('/', htmlRoutes);  // Handle the HTML routes

export default router;
