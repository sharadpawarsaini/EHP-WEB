import { Request, Response } from 'express';
import axios from 'axios';

export const getNearbyHospitals = async (req: Request, res: Response): Promise<void> => {
  try {
    const { lat, lng } = req.query;

    if (!lat || !lng) {
      res.status(400).json({ message: 'Latitude and Longitude are required' });
      return;
    }

    // Hospitals can be nodes, ways, or relations in OpenStreetMap.
    // 'out center' gives us a single coordinate for areas.
    const query = `
      [out:json][timeout:25];
      (
        node["amenity"="hospital"](around:10000, ${lat}, ${lng});
        way["amenity"="hospital"](around:10000, ${lat}, ${lng});
        relation["amenity"="hospital"](around:10000, ${lat}, ${lng});
      );
      out center;
    `;

    // Overpass API prefers POST for complex queries and needs a User-Agent
    const response = await axios.post('https://overpass-api.de/api/interpreter', 
      `data=${encodeURIComponent(query)}`,
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'User-Agent': 'EHP-Health-Passport-App'
        }
      }
    );
    
    if (!response.data || !response.data.elements) {
      res.json([]);
      return;
    }

    const results = response.data.elements.map((el: any) => {
      // For ways/relations, coordinates are in 'center'
      const latVal = el.lat || (el.center ? el.center.lat : null);
      const lngVal = el.lon || (el.center ? el.center.lon : null);

      return {
        id: el.id,
        name: el.tags.name || 'Unnamed Hospital',
        address: el.tags['addr:street'] || el.tags['addr:full'] || el.tags['addr:city'] || 'Address not available',
        phone: el.tags.phone || el.tags['contact:phone'] || 'N/A',
        lat: latVal,
        lng: lngVal
      };
    }).filter((h: any) => h.lat && h.lng); // Filter out any that don't have coords

    res.json(results);
  } catch (error: any) {
    console.error('Overpass API Error:', error.response?.data || error.message);
    res.status(500).json({ 
      message: 'Failed to fetch hospital data',
      error: error.message 
    });
  }
};
