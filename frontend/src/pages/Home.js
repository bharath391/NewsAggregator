import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import NewsCard from '../components/NewsCard';
import ArticleModal from '../components/ArticleModal';
import axios from 'axios';

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
      // Always send at least one required param (country=us)
      const params = { country: 'us', page: 1, pageSize: 12 };
      const response = await axios.get('/api/news/top-headlines', { params });
      setArticles(response.data.articles || []);
      // For featured, just pick the first 3 articles for now
      setFeaturedArticles((response.data.articles || []).slice(0, 3));
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
                  article={{
                    ...featuredArticles[0],
                    source: featuredArticles[0].source && typeof featuredArticles[0].source === 'object' && featuredArticles[0].source !== null && !Array.isArray(featuredArticles[0].source)
                      ? (featuredArticles[0].source.name || '')
                      : (typeof featuredArticles[0].source === 'string' ? featuredArticles[0].source : ''),
                    category: featuredArticles[0].category && typeof featuredArticles[0].category === 'object' && featuredArticles[0].category !== null && !Array.isArray(featuredArticles[0].category)
                      ? (featuredArticles[0].category.name || '')
                      : (typeof featuredArticles[0].category === 'string' ? featuredArticles[0].category : '')
                  }}
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
                        (article.category && typeof article.category === 'object' && article.category !== null && !Array.isArray(article.category)
                          ? article.category.name : (typeof article.category === 'string' ? article.category : '')) === 'politics' ? 'bg-red-100 text-red-800' :
                        (article.category && typeof article.category === 'object' && article.category !== null && !Array.isArray(article.category)
                          ? article.category.name : (typeof article.category === 'string' ? article.category : '')) === 'sports' ? 'bg-green-100 text-green-800' :
                        'bg-blue-100 text-blue-800'
                      }`}>
                        {article.category && typeof article.category === 'object' && article.category !== null && !Array.isArray(article.category)
                          ? article.category.name : (typeof article.category === 'string' ? article.category : '')}
                      </span>
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
                    {/* Show source name if available */}
                    {article.source && (
                      <p className="text-xs text-gray-400 mt-2">Source: {article.source && typeof article.source === 'object' && article.source !== null && !Array.isArray(article.source)
                        ? article.source.name : (typeof article.source === 'string' ? article.source : '')}</p>
                    )}
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
            article={{
              ...article,
              source: article.source && typeof article.source === 'object' && article.source !== null && !Array.isArray(article.source)
                ? (article.source.name || '')
                : (typeof article.source === 'string' ? article.source : ''),
              category: article.category && typeof article.category === 'object' && article.category !== null && !Array.isArray(article.category)
                ? (article.category.name || '')
                : (typeof article.category === 'string' ? article.category : '')
            }}
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
