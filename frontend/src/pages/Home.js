import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import NewsCard from '../components/NewsCard';
import ArticleModal from '../components/ArticleModal';

const Home = () => {
  const { user } = useAuth();
  const [articles, setArticles] = useState([]);
  const [featuredArticles, setFeaturedArticles] = useState([]);
  const [viewMode, setViewMode] = useState('grid');
  const [bookmarkedArticles, setBookmarkedArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedArticle, setSelectedArticle] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    loadNews();
    loadBookmarks();
  }, []);

  const loadNews = async () => {
    try {
      setLoading(true);
      
      // Commented out API call - replace with actual backend later
      /*
      const response = await axios.get('/api/news/latest', {
        headers: { Authorization: `Bearer ${user.token}` }
      });
      setArticles(response.data.articles);
      setFeaturedArticles(response.data.featured);
      */

      // Dummy data for frontend testing
      const dummyArticles = [
        {
          id: 1,
          title: 'Revolutionary AI System Transforms Healthcare',
          description: 'A groundbreaking artificial intelligence system has been developed that can diagnose diseases with unprecedented accuracy, potentially revolutionizing medical care worldwide.',
          image: 'https://via.placeholder.com/400x250',
          category: 'technology',
          source: 'Tech News Daily',
          publishedAt: '2 hours ago',
          url: '#'
        },
        {
          id: 2,
          title: 'Global Climate Summit Reaches Historic Agreement',
          description: 'World leaders have reached a comprehensive agreement on climate action, setting ambitious targets for carbon reduction and renewable energy adoption.',
          image: 'https://via.placeholder.com/400x250',
          category: 'politics',
          source: 'World Report',
          publishedAt: '4 hours ago',
          url: '#'
        },
        {
          id: 3,
          title: 'Championship Finals Set for This Weekend',
          description: 'The two top teams will face off in what promises to be the most exciting championship game in years, with millions expected to watch.',
          image: 'https://via.placeholder.com/400x250',
          category: 'sports',
          source: 'Sports Central',
          publishedAt: '6 hours ago',
          url: '#'
        },
        {
          id: 4,
          title: 'Market Reaches New All-Time High',
          description: 'Stock markets continue their upward trajectory as investors remain optimistic about economic recovery and growth prospects.',
          image: 'https://via.placeholder.com/400x250',
          category: 'business',
          source: 'Financial Times',
          publishedAt: '8 hours ago',
          url: '#'
        },
        {
          id: 5,
          title: 'New Space Mission Launches Successfully',
          description: 'A groundbreaking space mission has launched successfully, carrying advanced scientific instruments to explore the outer reaches of our solar system.',
          image: 'https://via.placeholder.com/400x250',
          category: 'science',
          source: 'Space News',
          publishedAt: '10 hours ago',
          url: '#'
        },
        {
          id: 6,
          title: 'Breakthrough in Renewable Energy Storage',
          description: 'Scientists have developed a revolutionary battery technology that could solve the energy storage challenge for renewable power sources.',
          image: 'https://via.placeholder.com/400x250',
          category: 'technology',
          source: 'Energy Today',
          publishedAt: '12 hours ago',
          url: '#'
        }
      ];

      const dummyFeatured = [
        {
          id: 7,
          title: 'Major Tech Breakthrough Announced',
          description: 'Scientists have made a groundbreaking discovery that could revolutionize the way we interact with technology and reshape our digital future.',
          image: 'https://via.placeholder.com/800x400',
          category: 'breaking',
          source: 'Innovation Weekly',
          publishedAt: '1 hour ago',
          url: '#'
        },
        {
          id: 8,
          title: 'Global Peace Initiative Launched',
          description: 'World leaders unite to launch an unprecedented peace initiative aimed at resolving conflicts and promoting international cooperation.',
          image: 'https://via.placeholder.com/400x200',
          category: 'politics',
          source: 'Global News',
          publishedAt: '3 hours ago',
          url: '#'
        },
        {
          id: 9,
          title: 'Olympic Records Shattered',
          description: 'Athletes continue to push the boundaries of human performance, breaking multiple Olympic records in spectacular fashion.',
          image: 'https://via.placeholder.com/400x200',
          category: 'sports',
          source: 'Olympic Watch',
          publishedAt: '5 hours ago',
          url: '#'
        }
      ];

      setArticles(dummyArticles);
      setFeaturedArticles(dummyFeatured);
    } catch (error) {
      console.error('Error loading news:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadBookmarks = () => {
    const saved = localStorage.getItem('bookmarkedArticles');
    if (saved) {
      setBookmarkedArticles(JSON.parse(saved));
    }
  };

  const handleBookmark = (article) => {
    const isBookmarked = bookmarkedArticles.some(b => b.id === article.id);
    let updatedBookmarks;
    
    if (isBookmarked) {
      updatedBookmarks = bookmarkedArticles.filter(b => b.id !== article.id);
    } else {
      updatedBookmarks = [...bookmarkedArticles, article];
    }
    
    setBookmarkedArticles(updatedBookmarks);
    localStorage.setItem('bookmarkedArticles', JSON.stringify(updatedBookmarks));
  };

  const isArticleBookmarked = (articleId) => {
    return bookmarkedArticles.some(b => b.id === articleId);
  };

  const handleReadMore = (article) => {
    setSelectedArticle(article);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedArticle(null);
  };

  if (loading) {
    return (
      <div className="section flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading latest news...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="section">
      {/* Header */}
      <div className="flex justify-between items-center mb-8 bg-gradient-to-r from-blue-50 to-purple-50 p-6 rounded-lg">
        <div>
          <h1 className="text-3xl font-serif font-bold text-gray-900">Latest News</h1>
          <p className="text-gray-600 mt-2">Stay updated with the latest headlines from around the world</p>
        </div>
        <div className="flex items-center space-x-4">
          <label className="text-sm font-medium text-gray-700">View:</label>
          <select
            value={viewMode}
            onChange={(e) => setViewMode(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
          >
            <option value="grid">Grid</option>
            <option value="list">List</option>
            <option value="magazine">Magazine</option>
          </select>
        </div>
      </div>

      {/* Featured News */}
      <div className="mb-12">
        <h2 className="text-2xl font-serif font-semibold text-gray-900 mb-6 flex items-center">
          <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mr-2">✨</span>
          Featured Stories
        </h2>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            {featuredArticles[0] && (
              <div className="bg-gradient-to-br from-blue-50 to-indigo-100 rounded-lg p-2">
                <NewsCard
                  article={featuredArticles[0]}
                  viewMode="magazine"
                  onBookmark={handleBookmark}
                  isBookmarked={isArticleBookmarked(featuredArticles[0].id)}
                  onReadMore={handleReadMore}
                />
              </div>
            )}
          </div>
          <div className="space-y-6">
            {featuredArticles.slice(1).map((article, index) => (
              <div key={article.id} className={`bg-gradient-to-br ${
                index === 0 ? 'from-green-50 to-emerald-100' : 'from-orange-50 to-red-100'
              } rounded-lg p-2`}>
                <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                  <img 
                    src={article.image || 'https://via.placeholder.com/400x200'} 
                    alt={article.title}
                    className="w-full h-32 object-cover"
                  />
                  <div className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                        article.category === 'politics' ? 'bg-red-100 text-red-800' :
                        article.category === 'sports' ? 'bg-green-100 text-green-800' :
                        'bg-blue-100 text-blue-800'
                      }`}>{article.category}</span>
                      <button
                        onClick={() => handleBookmark(article)}
                        className={`p-1 rounded-full transition-colors ${
                          isArticleBookmarked(article.id) ? 'text-blue-600 bg-blue-50' : 'text-gray-400 hover:text-blue-600'
                        }`}
                      >
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M17 3H7c-1.1 0-2 .9-2 2v16l7-3 7 3V5c0-1.1-.9-2-2-2z"/>
                        </svg>
                      </button>
                    </div>
                    <h3 className="font-serif font-semibold text-gray-900 mb-2">{article.title}</h3>
                    <p className="text-sm text-gray-600">{article.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* News Grid */}
      <div className={`${
        viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6' :
        viewMode === 'list' ? 'space-y-6' :
        'grid grid-cols-1 lg:grid-cols-2 gap-8'
      }`}>
        {articles.map((article) => (
          <NewsCard
            key={article.id}
            article={article}
            viewMode={viewMode}
            onBookmark={handleBookmark}
            isBookmarked={isArticleBookmarked(article.id)}
            onReadMore={handleReadMore}
          />
        ))}
      </div>

      {/* Article Modal */}
      <ArticleModal
        article={selectedArticle}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
      />
    </div>
  );
};

export default Home;
