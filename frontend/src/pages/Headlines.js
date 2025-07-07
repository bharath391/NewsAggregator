import React, { useState, useEffect } from 'react';
import axios from 'axios';
import NewsCard from '../components/NewsCard';
import ArticleModal from '../components/ArticleModal';
import { useAuth } from '../contexts/AuthContext';

const Headlines = () => {
  const { user } = useAuth();
  const [headlines, setHeadlines] = useState([]);
  const [region, setRegion] = useState('global');
  const [loading, setLoading] = useState(true);
  const [bookmarkedArticles, setBookmarkedArticles] = useState([]);
  const [selectedArticle, setSelectedArticle] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const pageSize = 12;

  const regions = [
    { value: 'global', label: 'Global', flag: '🌍' },
    { value: 'us', label: 'United States', flag: '🇺🇸' },
    { value: 'uk', label: 'United Kingdom', flag: '🇬🇧' },
    { value: 'eu', label: 'Europe', flag: '🇪🇺' },
    { value: 'asia', label: 'Asia', flag: '🌏' }
  ];

  useEffect(() => {
    loadHeadlines();
    loadBookmarks();
  }, [region, page, user]);

  const loadHeadlines = async () => {
    try {
      setLoading(true);
      let countryParam = region === 'global' ? (user?.country || 'us') : region;
      let params = { country: countryParam, page, pageSize, rand: Math.random() };
      if (user?.preferences?.categories?.length) {
        params.category = user.preferences.categories[0];
      } else if (user?.preferences?.sources?.length) {
        params.sources = user.preferences.sources.join(',');
      }
      const response = await axios.get('/api/news/top-headlines', { params });
      // Shuffle articles to change their order on each fetch
      const articles = response.data.articles || [];
      for (let i = articles.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [articles[i], articles[j]] = [articles[j], articles[i]];
      }
      setHeadlines(articles);
      if (response.data.totalResults) {
        setTotalPages(Math.ceil(response.data.totalResults / pageSize));
      } else {
        setTotalPages(1);
      }
    } catch (error) {
      console.error('Error loading headlines:', error);
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
    // Only allow one bookmarked article at a time
    const isBookmarked = bookmarkedArticles.some(b => b.id === article.id);
    let updatedBookmarks;
    if (isBookmarked) {
      updatedBookmarks = [];
    } else {
      updatedBookmarks = [article];
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
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading headlines...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="section animate-fade-in">
      <div className="mb-8 bg-gradient-to-r from-orange-50 to-yellow-50 p-6 rounded-lg transform hover:scale-105 transition-transform duration-300">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-serif font-bold text-gray-900 flex items-center">
              <span className="text-orange-500 mr-2">📰</span>
              Breaking Headlines
            </h1>
            <p className="text-gray-600 mt-2">Latest breaking news from around the world</p>
          </div>
          <div className="flex items-center space-x-4">
            <label className="text-sm font-medium text-gray-700">Region:</label>
            <select
              value={region}
              onChange={(e) => setRegion(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 bg-white transition-all duration-200 hover:border-orange-300"
            >
              {regions.map(r => (
                <option key={r.value} value={r.value}>
                  {r.flag} {r.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>
      <div className="space-y-6">
        {headlines.map((article, index) => (
          <div 
            key={article.id} 
            className="transform hover:scale-105 transition-all duration-300 animate-slide-up"
            style={{ animationDelay: `${index * 0.1}s` }}
          >
            <div className="relative">
              <NewsCard
                article={{
                  ...article,
                  source: article.source && typeof article.source === 'object' && article.source !== null && !Array.isArray(article.source)
                    ? (article.source.name || '')
                    : (typeof article.source === 'string' ? article.source : ''),
                  category: article.category && typeof article.category === 'object' && article.category !== null && !Array.isArray(article.category)
                    ? (article.category.name || '')
                    : (typeof article.category === 'string' ? article.category : '')
                }}
                viewMode="list"
                onBookmark={handleBookmark}
                isBookmarked={isArticleBookmarked(article.id)}
              />
              {article.priority === 'high' && (
                <div className="absolute top-2 left-2 bg-red-500 text-white px-2 py-1 rounded-full text-xs font-bold animate-pulse">
                  🚨 URGENT
                </div>
              )}
              <div className="absolute top-2 right-2 bg-gradient-to-r from-orange-500 to-red-500 text-white px-2 py-1 rounded text-xs">
                {regions.find(r => r.value === region)?.flag} {regions.find(r => r.value === region)?.label}
              </div>
            </div>
          </div>
        ))}
      </div>
      {/* Pagination Controls */}
      <div className="flex justify-center mt-8">
        <button
          className="px-4 py-2 mx-1 bg-gray-200 rounded disabled:opacity-50"
          onClick={() => setPage(page - 1)}
          disabled={page === 1}
        >
          Previous
        </button>
        <span className="px-4 py-2 mx-1">Page {page} of {totalPages}</span>
        <button
          className="px-4 py-2 mx-1 bg-gray-200 rounded disabled:opacity-50"
          onClick={() => setPage(page + 1)}
          disabled={page === totalPages}
        >
          Next
        </button>
      </div>
      <ArticleModal
        article={selectedArticle}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
      />
    </div>
  );
};

export default Headlines;
