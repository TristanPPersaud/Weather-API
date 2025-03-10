import dotenv from 'dotenv';
import express from 'express';
import path from 'path'; // For serving static files
dotenv.config();

// Import the routes
import routes from './routes/index.js';

const app = express();

const PORT = process.env.PORT || 3001;

// Serve static files of the entire client dist folder
app.use(express.static(path.join(__dirname, 'dist'))); // Adjust if your dist folder is elsewhere

// Middleware for parsing JSON and urlencoded form data
app.use(express.json()); // For parsing application/json
app.use(express.urlencoded({ extended: true })); // For parsing application/x-www-form-urlencoded

// Middleware to connect the routes
app.use(routes);

// Start the server on the port
app.listen(PORT, () => console.log(`Listening on PORT: ${PORT}`));