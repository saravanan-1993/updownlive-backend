import axios from 'axios';
import mongoose from 'mongoose';

// GET /api/crypto/news
export const getCryptoNews = async (req, res) => {
  try {
    const db = mongoose.connection.db;
    const setting = await db.collection('settings').findOne({ key: 'cryptoApiKey' });
    const apiKey = setting?.value;

    if (!apiKey) {
      return res.status(500).json({ error: 'Crypto API key not configured. Set it in Admin → API Integration.' });
    }

    const { data } = await axios.get('https://forexnewsapi.com/api/v1/category', {
      params: { section: 'general', items: 100, page: 1, topic: 'Cryptocurrency', token: apiKey },
      timeout: 10000,
    });

    const articles = (data?.data || []).map((item, i) => ({
      id: `crypto-${i}-${Date.now()}`,
      title: item.title || 'Untitled',
      text: item.text || '',
      source_name: item.source_name || 'Unknown',
      date: item.date ? new Date(item.date).toISOString() : new Date().toISOString(),
      image_url: item.image_url || '',
      news_url: item.news_url || '#',
      topics: Array.isArray(item.topics) ? item.topics : [],
      sentiment: item.sentiment || '',
      currency: Array.isArray(item.currency) ? item.currency : [],
      type: item.type || 'Article',
    }));

    res.json({ success: true, count: articles.length, articles });
  } catch (error) {
    console.error('Error fetching crypto news:', error.response?.data || error.message);
    res.status(500).json({ error: 'Failed to fetch crypto news', message: error.message });
  }
};
