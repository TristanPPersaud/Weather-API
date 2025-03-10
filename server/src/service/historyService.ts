import fs from 'fs/promises';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';

class City {
  constructor(public name: string, public id: string = uuidv4()) {}
}

class HistoryService {
  private filePath = path.join(__dirname, 'searchHistory.json'); // Using __dirname to resolve path

  // Read from the JSON file
  private async read(): Promise<City[]> {
    try {
      const data = await fs.readFile(this.filePath, 'utf-8');
      return JSON.parse(data) as City[];
    } catch (error) {
      if (error instanceof Error && (error as NodeJS.ErrnoException).code === 'ENOENT') {
        // If file doesn't exist, return an empty array
        return [];
      }
      throw error; // Rethrow other errors
    }
  }

  // Write to the JSON file
  private async write(cities: City[]): Promise<void> {
    await fs.writeFile(this.filePath, JSON.stringify(cities, null, 2));
  }

  // Get all cities from the search history
  async getCities(): Promise<City[]> {
    return await this.read();
  }

  // Add a new city to the search history
  async addCity(cityName: string): Promise<City> {
    const cities = await this.read();
    const newCity = new City(cityName);
    
    // Avoid duplicates
    if (!cities.some((city) => city.name.toLowerCase() === cityName.toLowerCase())) {
      cities.push(newCity);
      await this.write(cities);
    }

    return newCity;
  }

  // Remove a city from the search history by ID
  async removeCity(id: string): Promise<void> {
    let cities = await this.read();
    cities = cities.filter(city => city.id !== id);
    await this.write(cities);
  }
}

export default new HistoryService();
