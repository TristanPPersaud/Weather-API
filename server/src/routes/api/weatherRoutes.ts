import { Router } from 'express';
import HistoryService from '../../service/historyService.js';
import WeatherService from '../../service/weatherService.js';

const router = Router();

// POST Request with city name to retrieve weather data
router.post('/', async (req, res) => {
  const { city } = req.body;

  // Validate city
  if (!city) {
    return res.status(400).json({ message: 'City name is required' });
  }

  try {
    // Fetch weather data for the city
    const weather = await WeatherService.getWeatherForCity(city);

    // Handle case where weather data is empty
    if (!weather || weather.length === 0) {
      return res.status(404).json({ message: 'Weather data not found for this city' });
    }

    // Add city to search history
    const newCity = await HistoryService.addCity(city);

    res.json({ weather, newCity });
  } catch (error) {
    console.error('Error fetching weather:', error);
    res.status(500).json({ message: 'Could not fetch weather data' });
  }
  return;
});

// GET search history
router.get('/history', async (_req, res) => {
  try {
    const cities = await HistoryService.getCities();
    res.json(cities);
  } catch (error) {
    console.error('Error fetching search history:', error);
    res.status(500).json({ message: 'Could not fetch search history' });
  }
});

// DELETE city from search history by ID
router.delete('/history/:id', async (req, res) => {
  const { id } = req.params;

  try {
    await HistoryService.removeCity(id);
    res.json({ message: 'City removed from history' });
  } catch (error) {
    console.error('Error removing city:', error);
    res.status(500).json({ message: 'Could not remove city from history' });
  }
});

export default router;