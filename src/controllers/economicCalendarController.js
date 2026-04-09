import axios from 'axios';

const RAPIDAPI_KEY = '24f675efc2msh4882a8a0d8f050cf182293jsr9758d8c3ab0c';
const RAPIDAPI_HOST = 'economic-calendar-api.p.rapidapi.com';

export const getEconomicEvents = async (req, res) => {
  try {
    const { countryCode, limit = 50 } = req.query;

    const params = { limit: parseInt(limit) };
    if (countryCode) params.countryCode = countryCode;

    const response = await axios.get(
      `https://${RAPIDAPI_HOST}/calendar`,
      {
        params,
        headers: {
          'X-RapidAPI-Key': RAPIDAPI_KEY,
          'X-RapidAPI-Host': RAPIDAPI_HOST,
        },
        timeout: 15000,
      }
    );

    const raw = response.data;
    const events = Array.isArray(raw) ? raw
      : Array.isArray(raw?.data) ? raw.data
      : Array.isArray(raw?.result) ? raw.result
      : [];

    res.json({ success: true, events });
  } catch (error) {
    console.error('Economic calendar error:', error.response?.data || error.message);
    res.status(500).json({ success: false, events: [], message: 'Failed to fetch economic events' });
  }
};
