const express = require('express');
const router = express.Router();
const axios = require('axios');

const GOOGLE_API_KEY = 'AIzaSyCj31-zTOgsFh7A3m4NQ2FCw1X5ylcMyEQ';

// Get address autocomplete suggestions
router.get('/autocomplete', async (req, res) => {
  try {
    const { input } = req.query;

    if (!input || input.length < 3) {
      return res.json({ predictions: [] });
    }

    const response = await axios.get(
      `https://maps.googleapis.com/maps/api/place/autocomplete/json`,
      {
        params: {
          input: input,
          key: GOOGLE_API_KEY,
          components: 'country:uk',
          types: 'address'
        }
      }
    );

    res.json(response.data);
  } catch (error) {
    console.error('Places autocomplete error:', error);
    res.status(500).json({ 
      error: 'Failed to fetch address suggestions',
      details: error.message 
    });
  }
});

// Get place details
router.get('/details', async (req, res) => {
  try {
    const { placeId } = req.query;

    if (!placeId) {
      return res.status(400).json({ error: 'Place ID is required' });
    }

    const response = await axios.get(
      `https://maps.googleapis.com/maps/api/place/details/json`,
      {
        params: {
          place_id: placeId,
          key: GOOGLE_API_KEY,
          fields: 'name,formatted_address,address_components,geometry'
        }
      }
    );

    res.json(response.data);
  } catch (error) {
    console.error('Place details error:', error);
    res.status(500).json({ 
      error: 'Failed to fetch place details',
      details: error.message 
    });
  }
});

module.exports = router;