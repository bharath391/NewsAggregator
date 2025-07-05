const NewsAPI = require('newsapi');
const newsapi = new NewsAPI(process.env.NEWS_API_KEY);

// Utility function to validate date format (YYYY-MM-DD)
const isValidDate = (dateString) => {
  const regex = /^\d{4}-\d{2}-\d{2}$/;
  if (!regex.test(dateString)) return false;
  const date = new Date(dateString);
  return date instanceof Date && !isNaN(date);
};

// Utility function to validate page number
const validatePage = (page) => {
  const pageNum = parseInt(page);
  return pageNum > 0 && pageNum <= 15; // NewsAPI limit is 100 pages
};

// Controller 1: Top Headlines
const getTopHeadlines = async (req, res) => {
  try {
    const {
      q,                    // Search query
      sources,              // Comma-separated source IDs
      category,             // Category (business, entertainment, general, health, science, sports, technology)
      language,             // Language code (ar, de, en, es, fr, he, it, nl, no, pt, ru, sv, ud, zh)
      country,              // Country code (ae, ar, at, au, be, bg, br, ca, ch, cn, co, cu, cz, de, eg, fr, gb, gr, hk, hu, id, ie, il, in, it, jp, kr, lt, lv, ma, mx, my, ng, nl, no, nz, ph, pl, pt, ro, rs, ru, sa, se, sg, si, sk, th, tr, tw, ua, us, ve, za)
      page = 1,             // Page number
      pageSize = 10         // Number of articles per page (max 100)
    } = req.query;

    // Validation
    if (!q && !sources && !category && !country) {
      return res.status(400).json({
        error: 'At least one parameter is required: q, sources, category, or country'
      });
    }

    if (page && !validatePage(page)) {
      return res.status(400).json({
        error: 'Page must be between 1 and 15'
      });
    }

    if (pageSize && (pageSize < 1 || pageSize > 15)) {
      return res.status(400).json({
        error: 'Page size must be between 1 and 15'
      });
    }

    // Valid categories
    const validCategories = ['business', 'entertainment', 'general', 'health', 'science', 'sports', 'technology'];
    if (category && !validCategories.includes(category)) {
      return res.status(400).json({
        error: `Invalid category. Valid options: ${validCategories.join(', ')}`
      });
    }

    // Valid languages
    const validLanguages = ['ar', 'de', 'en', 'es', 'fr', 'he', 'it', 'nl', 'no', 'pt', 'ru', 'sv', 'ud', 'zh'];
    if (language && !validLanguages.includes(language)) {
      return res.status(400).json({
        error: `Invalid language. Valid options: ${validLanguages.join(', ')}`
      });
    }

    // Valid countries
    const validCountries = ['ae', 'ar', 'at', 'au', 'be', 'bg', 'br', 'ca', 'ch', 'cn', 'co', 'cu', 'cz', 'de', 'eg', 'fr', 'gb', 'gr', 'hk', 'hu', 'id', 'ie', 'il', 'in', 'it', 'jp', 'kr', 'lt', 'lv', 'ma', 'mx', 'my', 'ng', 'nl', 'no', 'nz', 'ph', 'pl', 'pt', 'ro', 'rs', 'ru', 'sa', 'se', 'sg', 'si', 'sk', 'th', 'tr', 'tw', 'ua', 'us', 've', 'za'];
    if (country && !validCountries.includes(country)) {
      return res.status(400).json({
        error: `Invalid country code. Valid options: ${validCountries.join(', ')}`
      });
    }

    // Build query object
    const queryParams = {};
    if (q) queryParams.q = q;
    if (sources) queryParams.sources = sources;
    if (category) queryParams.category = category;
    if (language) queryParams.language = language;
    if (country) queryParams.country = country;
    if (page) queryParams.page = parseInt(page);
    if (pageSize) queryParams.pageSize = parseInt(pageSize);

    // Make API call
    const response = await newsapi.v2.topHeadlines(queryParams);

    // Enhanced response with metadata
    const result = {
      status: 'success',
      totalResults: response.totalResults,
      currentPage: parseInt(page),
      pageSize: parseInt(pageSize),
      totalPages: Math.ceil(response.totalResults / parseInt(pageSize)),
      articles: response.articles.map(article => ({
        source: article.source,
        author: article.author,
        title: article.title,
        description: article.description,
        url: article.url,
        urlToImage: article.urlToImage,
        publishedAt: article.publishedAt,
        content: article.content
      })),
      query: queryParams
    };

    res.json(result);

  } catch (error) {
    console.error('Top Headlines Error:', error);
    res.status(500).json({
      error: 'Failed to fetch top headlines',
      message: error.message
    });
  }
};

// Controller 2: Everything (Search all articles)
const getEverything = async (req, res) => {
  try {
    const {
      q,                    // Search query
      qInTitle,             // Search query in title only
      sources,              // Comma-separated source IDs
      domains,              // Comma-separated domains
      excludeDomains,       // Comma-separated domains to exclude
      from,                 // Date from (YYYY-MM-DD)
      to,                   // Date to (YYYY-MM-DD)
      language,             // Language code
      sortBy = 'publishedAt', // Sort by (relevancy, popularity, publishedAt)
      page = 1,             // Page number
      pageSize = 20         // Number of articles per page
    } = req.query;

    // Validation - at least one parameter required
    if (!q && !qInTitle && !sources && !domains) {
      return res.status(400).json({
        error: 'At least one parameter is required: q, qInTitle, sources, or domains'
      });
    }

    // Validate dates
    if (from && !isValidDate(from)) {
      return res.status(400).json({
        error: 'Invalid from date format. Use YYYY-MM-DD'
      });
    }

    if (to && !isValidDate(to)) {
      return res.status(400).json({
        error: 'Invalid to date format. Use YYYY-MM-DD'
      });
    }

    // Validate date range (max 1 month for free tier)
    if (from && to) {
      const fromDate = new Date(from);
      const toDate = new Date(to);
      const diffTime = Math.abs(toDate - fromDate);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      
      if (diffDays > 29) {
        return res.status(400).json({
          error: 'Date range cannot exceed 1 month for free tier'
        });
      }
    }

    // Validate page
    if (!validatePage(page)) {
      return res.status(400).json({
        error: 'Page must be between 1 and 15'
      });
    }

    // Validate page size
    if (pageSize < 1 || pageSize > 100) {
      return res.status(400).json({
        error: 'Page size must be between 1 and 15'
      });
    }

    // Valid sort options
    const validSortBy = ['relevancy', 'popularity', 'publishedAt'];
    if (!validSortBy.includes(sortBy)) {
      return res.status(400).json({
        error: `Invalid sortBy. Valid options: ${validSortBy.join(', ')}`
      });
    }

    // Valid languages
    const validLanguages = ['ar', 'de', 'en', 'es', 'fr', 'he', 'it', 'nl', 'no', 'pt', 'ru', 'sv', 'ud', 'zh'];
    if (language && !validLanguages.includes(language)) {
      return res.status(400).json({
        error: `Invalid language. Valid options: ${validLanguages.join(', ')}`
      });
    }

    // Build query object
    const queryParams = {};
    if (q) queryParams.q = q;
    if (qInTitle) queryParams.qInTitle = qInTitle;
    if (sources) queryParams.sources = sources;
    if (domains) queryParams.domains = domains;
    if (excludeDomains) queryParams.excludeDomains = excludeDomains;
    if (from) queryParams.from = from;
    if (to) queryParams.to = to;
    if (language) queryParams.language = language;
    queryParams.sortBy = sortBy;
    queryParams.page = parseInt(page);
    queryParams.pageSize = parseInt(pageSize);

    // Make API call
    const response = await newsapi.v2.everything(queryParams);

    // Enhanced response with metadata
    const result = {
      status: 'success',
      totalResults: response.totalResults,
      currentPage: parseInt(page),
      pageSize: parseInt(pageSize),
      totalPages: Math.ceil(response.totalResults / parseInt(pageSize)),
      articles: response.articles.map(article => ({
        source: article.source,
        author: article.author,
        title: article.title,
        description: article.description,
        url: article.url,
        urlToImage: article.urlToImage,
        publishedAt: article.publishedAt,
        content: article.content
      })),
      query: queryParams
    };

    res.json(result);

  } catch (error) {
    console.error('Everything Error:', error);
    res.status(500).json({
      error: 'Failed to fetch articles',
      message: error.message
    });
  }
};

// Controller 3: Sources
const getSources = async (req, res) => {
  try {
    const {
      category,             // Category filter
      language,             // Language filter
      country              // Country filter
    } = req.query;

    // Valid categories
    const validCategories = ['business', 'entertainment', 'general', 'health', 'science', 'sports', 'technology'];
    if (category && !validCategories.includes(category)) {
      return res.status(400).json({
        error: `Invalid category. Valid options: ${validCategories.join(', ')}`
      });
    }

    // Valid languages
    const validLanguages = ['ar', 'de', 'en', 'es', 'fr', 'he', 'it', 'nl', 'no', 'pt', 'ru', 'sv', 'ud', 'zh'];
    if (language && !validLanguages.includes(language)) {
      return res.status(400).json({
        error: `Invalid language. Valid options: ${validLanguages.join(', ')}`
      });
    }

    // Valid countries
    const validCountries = ['ae', 'ar', 'at', 'au', 'be', 'bg', 'br', 'ca', 'ch', 'cn', 'co', 'cu', 'cz', 'de', 'eg', 'fr', 'gb', 'gr', 'hk', 'hu', 'id', 'ie', 'il', 'in', 'it', 'jp', 'kr', 'lt', 'lv', 'ma', 'mx', 'my', 'ng', 'nl', 'no', 'nz', 'ph', 'pl', 'pt', 'ro', 'rs', 'ru', 'sa', 'se', 'sg', 'si', 'sk', 'th', 'tr', 'tw', 'ua', 'us', 've', 'za'];
    if (country && !validCountries.includes(country)) {
      return res.status(400).json({
        error: `Invalid country code. Valid options: ${validCountries.join(', ')}`
      });
    }

    // Build query object
    const queryParams = {};
    if (category) queryParams.category = category;
    if (language) queryParams.language = language;
    if (country) queryParams.country = country;

    // Make API call
    const response = await newsapi.v2.sources(queryParams);

    // Enhanced response with metadata
    const result = {
      status: 'success',
      totalSources: response.sources.length,
      sources: response.sources.map(source => ({
        id: source.id,
        name: source.name,
        description: source.description,
        url: source.url,
        category: source.category,
        language: source.language,
        country: source.country
      })),
      query: queryParams,
      availableFilters: {
        categories: validCategories,
        languages: validLanguages,
        countries: validCountries
      }
    };

    res.json(result);

  } catch (error) {
    console.error('Sources Error:', error);
    res.status(500).json({
      error: 'Failed to fetch sources',
      message: error.message
    });
  }
};

const getCountries = (req, res) => {
  const countries = [
    { code: 'ae', name: 'United Arab Emirates' },
    { code: 'ar', name: 'Argentina' },
    { code: 'at', name: 'Austria' },
    { code: 'au', name: 'Australia' },
    { code: 'be', name: 'Belgium' },
    { code: 'bg', name: 'Bulgaria' },
    { code: 'br', name: 'Brazil' },
    { code: 'ca', name: 'Canada' },
    { code: 'ch', name: 'Switzerland' },
    { code: 'cn', name: 'China' },
    { code: 'co', name: 'Colombia' },
    { code: 'cu', name: 'Cuba' },
    { code: 'cz', name: 'Czech Republic' },
    { code: 'de', name: 'Germany' },
    { code: 'eg', name: 'Egypt' },
    { code: 'fr', name: 'France' },
    { code: 'gb', name: 'United Kingdom' },
    { code: 'gr', name: 'Greece' },
    { code: 'hk', name: 'Hong Kong' },
    { code: 'hu', name: 'Hungary' },
    { code: 'id', name: 'Indonesia' },
    { code: 'ie', name: 'Ireland' },
    { code: 'il', name: 'Israel' },
    { code: 'in', name: 'India' },
    { code: 'it', name: 'Italy' },
    { code: 'jp', name: 'Japan' },
    { code: 'kr', name: 'South Korea' },
    { code: 'lt', name: 'Lithuania' },
    { code: 'lv', name: 'Latvia' },
    { code: 'ma', name: 'Morocco' },
    { code: 'mx', name: 'Mexico' },
    { code: 'my', name: 'Malaysia' },
    { code: 'ng', name: 'Nigeria' },
    { code: 'nl', name: 'Netherlands' },
    { code: 'no', name: 'Norway' },
    { code: 'nz', name: 'New Zealand' },
    { code: 'ph', name: 'Philippines' },
    { code: 'pl', name: 'Poland' },
    { code: 'pt', name: 'Portugal' },
    { code: 'ro', name: 'Romania' },
    { code: 'rs', name: 'Serbia' },
    { code: 'ru', name: 'Russia' },
    { code: 'sa', name: 'Saudi Arabia' },
    { code: 'se', name: 'Sweden' },
    { code: 'sg', name: 'Singapore' },
    { code: 'si', name: 'Slovenia' },
    { code: 'sk', name: 'Slovakia' },
    { code: 'th', name: 'Thailand' },
    { code: 'tr', name: 'Turkey' },
    { code: 'tw', name: 'Taiwan' },
    { code: 'ua', name: 'Ukraine' },
    { code: 'us', name: 'United States' },
    { code: 've', name: 'Venezuela' },
    { code: 'za', name: 'South Africa' }
  ];
  res.json({ countries });
};

const getLanguages = (req, res) => {
  const languages = [
    { code: 'ar', name: 'Arabic' },
    { code: 'de', name: 'German' },
    { code: 'en', name: 'English' },
    { code: 'es', name: 'Spanish' },
    { code: 'fr', name: 'French' },
    { code: 'he', name: 'Hebrew' },
    { code: 'it', name: 'Italian' },
    { code: 'nl', name: 'Dutch' },
    { code: 'no', name: 'Norwegian' },
    { code: 'pt', name: 'Portuguese' },
    { code: 'ru', name: 'Russian' },
    { code: 'sv', name: 'Swedish' },
    { code: 'ud', name: 'Urdu' },
    { code: 'zh', name: 'Chinese' }
  ];
  
  res.json({ languages });
};

const getCategories = (req, res) => {
  const categories = [
    'business',
    'entertainment',
    'general',
    'health',
    'science',
    'sports',
    'technology'
  ];
  
  res.json({ categories });
};

module.exports = {
  getTopHeadlines,
  getEverything,
  getSources,
  getCountries,
  getLanguages,
  getCategories
};

// Usage Examples:

/*
1. Top Headlines Examples:
   GET /api/news/top-headlines?country=us&category=technology&page=1&pageSize=10
   GET /api/news/top-headlines?q=bitcoin&language=en&page=1&pageSize=20
   GET /api/news/top-headlines?sources=bbc-news,cnn&page=1

2. Everything Examples:
   GET /api/news/everything?q=artificial intelligence&from=2025-06-01&to=2025-06-30&sortBy=popularity&page=1&pageSize=15
   GET /api/news/everything?domains=techcrunch.com,wired.com&q=startup&language=en&page=1
   GET /api/news/everything?qInTitle=climate change&from=2025-06-01&sortBy=publishedAt&page=1

3. Sources Examples:
   GET /api/news/sources?category=technology&language=en&country=us
   GET /api/news/sources?category=business&country=gb
   GET /api/news/sources

4. Utility Examples:
   GET /api/news/countries
   GET /api/news/languages
   GET /api/news/categories
*/