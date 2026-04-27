import { Request, Response } from 'express';
import axios from 'axios';

export const getNearbyHospitals = async (req: Request, res: Response): Promise<void> => {
  try {
    const { lat, lng } = req.query;

    if (!lat || !lng) {
      res.status(400).json({ message: 'Latitude and Longitude are required' });
      return;
    }

    const query = `
      [out:json];
      node["amenity"="hospital"](around:10000, ${lat}, ${lng});
      out body;
    `;

    const response = await axios.get(`https://overpass-api.de/api/interpreter?data=${encodeURIComponent(query)}`);
    
    const results = response.data.elements.map((el: any) => ({
      id: el.id,
      name: el.tags.name || 'Unnamed Hospital',
      address: el.tags['addr:street'] || el.tags['addr:full'] || 'Address not available',
      phone: el.tags.phone || el.tags['contact:phone'] || 'N/A',
      lat: el.lat,
      lng: el.lon
    }));

    res.json(results);
  } catch (error) {
    console.error('Overpass API Error:', error);
    res.status(500).json({ message: 'Failed to fetch hospital data' });
  }
};
