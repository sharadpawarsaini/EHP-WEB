import { Request, Response } from 'express';
import axios from 'axios';

export const getNearbyFacilities = async (req: Request, res: Response): Promise<void> => {
  try {
    const { lat, lng, type = 'hospital' } = req.query;

    if (!lat || !lng) {
      res.status(400).json({ message: 'Latitude and Longitude are required' });
      return;
    }

    // Define tags to search for based on type
    let tags: string[] = [];
    if (type === 'hospital') {
      tags = ['"amenity"="hospital"'];
    } else if (type === 'pharmacy') {
      tags = ['"amenity"="pharmacy"'];
    } else if (type === 'lab') {
      tags = ['"healthcare"="laboratory"', '"amenity"="clinic"', '"healthcare"="diagnostic_centre"'];
    }

    // Build the Overpass query union
    const queryParts = tags.map(tag => `
      node[${tag}](around:10000, ${lat}, ${lng});
      way[${tag}](around:10000, ${lat}, ${lng});
      relation[${tag}](around:10000, ${lat}, ${lng});
    `).join('');

    const query = `
      [out:json][timeout:25];
      (
        ${queryParts}
      );
      out center;
    `;

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
      const latVal = el.lat || (el.center ? el.center.lat : null);
      const lngVal = el.lon || (el.center ? el.center.lon : null);

      return {
        id: el.id,
        name: el.tags.name || `Unnamed ${type}`,
        address: el.tags['addr:street'] || el.tags['addr:full'] || el.tags['addr:city'] || el.tags['addr:district'] || 'Address not available',
        phone: el.tags.phone || el.tags['contact:phone'] || 'N/A',
        lat: latVal,
        lng: lngVal,
        isOpen24: el.tags['opening_hours'] === '24/7'
      };
    }).filter((h: any) => h.lat && h.lng);

    res.json(results);
  } catch (error: any) {
    console.error('Overpass API Error:', error.response?.data || error.message);
    res.status(500).json({ 
      message: 'Failed to fetch facility data',
      error: error.message 
    });
  }
};
