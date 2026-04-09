import express from 'express';
import { MongoClient } from 'mongodb';

const router = express.Router();

let client;
const getDb = async () => {
  if (!client) {
    client = new MongoClient(process.env.DATABASE_URI);
    await client.connect();
  }
  return client.db();
};

// GET current news API key
router.get('/news-api-key', async (req, res) => {
  try {
    const db = await getDb();
    const settings = await db.collection('settings').findOne({ key: 'newsApiKey' });
    res.json({ apiKey: settings?.value || null });
  } catch (error) {
    res.status(500).json({ error: 'Error fetching setting' });
  }
});

// POST to update the news API key
router.post('/news-api-key', async (req, res) => {
  try {
    const { apiKey } = req.body;
    
    if (!apiKey) {
      return res.status(400).json({ error: 'API key is required' });
    }

    const db = await getDb();
    await db.collection('settings').updateOne(
      { key: 'newsApiKey' },
      { $set: { value: apiKey.trim(), updatedAt: new Date() } },
      { upsert: true }
    );
    res.json({ success: true, message: 'API key updated successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Error updating setting' });
  }
});

// ─── Generic API Key Route Factory ─────────────────────────────────────────
function addApiKeyRoutes(router, routePath, dbKey) {
  router.get(`/${routePath}`, async (req, res) => {
    try {
      const db = await getDb();
      const settings = await db.collection('settings').findOne({ key: dbKey });
      res.json({ apiKey: settings?.value || null });
    } catch (error) {
      res.status(500).json({ error: `Error fetching ${dbKey}` });
    }
  });
  router.post(`/${routePath}`, async (req, res) => {
    try {
      const { apiKey } = req.body;
      if (!apiKey) return res.status(400).json({ error: 'API key is required' });
      const db = await getDb();
      await db.collection('settings').updateOne(
        { key: dbKey },
        { $set: { value: apiKey.trim(), updatedAt: new Date() } },
        { upsert: true }
      );
      res.json({ success: true, message: `${dbKey} updated successfully` });
    } catch (error) {
      res.status(500).json({ error: `Error updating ${dbKey}` });
    }
  });
}

// Forex — ExchangeRate-API
addApiKeyRoutes(router, 'forex-api-key', 'forexApiKey');

// Forex News — MarketAux API
addApiKeyRoutes(router, 'forex-news-api-key', 'forexNewsApiKey');

// Crypto — CoinGecko
addApiKeyRoutes(router, 'crypto-api-key', 'cryptoApiKey');

// Gold / Precious Metals — Metals.live
addApiKeyRoutes(router, 'metals-api-key', 'metalsApiKey');

// Stocks
addApiKeyRoutes(router, 'stocks-api-key', 'stocksApiKey');

// GET social media links
router.get('/social-media', async (req, res) => {
  try {
    const db = await getDb();
    const settings = await db.collection('settings').findOne({ key: 'socialMedia' });
    res.json({ links: settings?.value || {} });
  } catch (error) {
    res.status(500).json({ error: 'Error fetching social media settings' });
  }
});

// POST to update social media links
router.post('/social-media', async (req, res) => {
  try {
    const { links } = req.body;
    
    if (!links || typeof links !== 'object') {
      return res.status(400).json({ error: 'Valid links object is required' });
    }

    const db = await getDb();
    await db.collection('settings').updateOne(
      { key: 'socialMedia' },
      { $set: { value: links, updatedAt: new Date() } },
      { upsert: true }
    );
    res.json({ success: true, message: 'Social media links updated successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Error updating social media settings' });
  }
});

// GET general info (office address, company address, contact info)
router.get('/general-info', async (req, res) => {
  try {
    const db = await getDb();
    const settings = await db.collection('settings').findOne({ key: 'generalInfo' });
    res.json({ info: settings?.value || {} });
  } catch (error) {
    res.status(500).json({ error: 'Error fetching general info' });
  }
});

// POST to update general info
router.post('/general-info', async (req, res) => {
  try {
    const { info } = req.body;
    if (!info || typeof info !== 'object') {
      return res.status(400).json({ error: 'Valid info object is required' });
    }
    const db = await getDb();
    await db.collection('settings').updateOne(
      { key: 'generalInfo' },
      { $set: { value: info, updatedAt: new Date() } },
      { upsert: true }
    );
    res.json({ success: true, message: 'General info updated successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Error updating general info' });
  }
});

// GET SEO settings
router.get('/seo', async (req, res) => {
  try {
    const db = await getDb();
    const settings = await db.collection('settings').findOne({ key: 'seoSettings' });
    res.json({ seo: settings?.value || {} });
  } catch (error) {
    res.status(500).json({ error: 'Error fetching SEO settings' });
  }
});

// POST to update SEO settings
router.post('/seo', async (req, res) => {
  try {
    const { seo } = req.body;
    if (!seo || typeof seo !== 'object') {
      return res.status(400).json({ error: 'Valid SEO object is required' });
    }
    const db = await getDb();
    await db.collection('settings').updateOne(
      { key: 'seoSettings' },
      { $set: { value: seo, updatedAt: new Date() } },
      { upsert: true }
    );
    res.json({ success: true, message: 'SEO settings updated successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Error updating SEO settings' });
  }
});

export default router;

