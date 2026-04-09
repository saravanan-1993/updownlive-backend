import axios from 'axios';

const NEWS_API_KEY = process.env.NEWS_API_KEY || '6051c0bce9804d68a81b5adbda112904';

export const getBusinessNews = async (req, res) => {
  try {
    const { category = 'business', search = '', page = 1, limit = 12 } = req.query;

    // Build query based on category or search term
    let query = search || '';
    if (!search) {
      switch (category) {
        case 'business':
          query = 'forex OR crypto OR gold OR stocks OR market OR economy';
          break;
        case 'technology':
          query = 'technology OR tech OR innovation OR AI OR blockchain';
          break;
        case 'general':
          query = 'business OR finance OR trading OR investment';
          break;
        default:
          query = category;
      }
    }

    const response = await axios.get('https://newsapi.org/v2/everything', {
      params: {
        q: query,
        apiKey: NEWS_API_KEY,
        pageSize: limit,
        page: page,
        sortBy: 'publishedAt',
        language: 'en'
      },
      timeout: 10000,
    });

    if (response.status === 401 || response.status === 403) {
      return res.status(401).json({
        success: false,
        message: 'Invalid API key',
        articles: []
      });
    }

    const rawArticles = response.data?.articles || [];
    
    const articles = rawArticles.map((article, index) => ({
      id: `${Buffer.from(article.url || `article-${index}`).toString('base64').substring(0, 12)}-${index}`,
      title: article.title || 'Untitled',
      subtitle: article.description || article.content?.substring(0, 200) || '',
      author: article.author || article.source?.name || 'Unknown',
      publishedAt: article.publishedAt || new Date().toISOString(),
      imageUrl: article.urlToImage || 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=800&q=80',
      url: article.url || '#',
      body: article.content || article.description || '',
      source: article.source?.name || 'Global News',
    }));

    res.json({
      success: true,
      articles,
      total: response.data?.totalResults || articles.length,
      page: parseInt(page),
      category: query
    });

  } catch (error) {
    console.error('News API Error:', error.message);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch news',
      articles: []
    });
  }
};
