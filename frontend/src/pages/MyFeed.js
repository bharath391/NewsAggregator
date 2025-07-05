import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import axios from 'axios';
import ArticleModal from '../components/ArticleModal';

const MyFeed = () => {
  const { user } = useAuth();
  const [personalizedNews, setPersonalizedNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [bookmarkedArticles, setBookmarkedArticles] = useState([]);
  const [selectedArticle, setSelectedArticle] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const filters = [
    { value: 'all', label: 'All News' },
    { value: 'interests', label: 'My Interests' },
    { value: 'sources', label: 'My Sources' },
    { value: 'recent', label: 'Recently Read' }
  ];

  useEffect(() => {
    loadPersonalizedFeed();
    loadBookmarks();
  }, [filter, user]);

  const loadPersonalizedFeed = async () => {
    try {
      setLoading(true);
      let params = { page: 1, pageSize: 10, country: 'us' };
      if (user?.preferences?.categories?.length) {
        params.category = user.preferences.categories.join(',');
      }
      const response = await axios.get('/api/news/top-headlines', { params });
      setPersonalizedNews(response.data.articles || []);
    } catch (error) {
      console.error('Error loading personalized feed:', error);
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
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading your personalized feed...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="section animate-fade-in">
      <div className="mb-8 bg-gradient-to-r from-purple-50 to-indigo-50 p-6 rounded-lg transform hover:scale-105 transition-transform duration-300">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-serif font-bold text-gray-900 flex items-center">
              <span className="text-purple-500 mr-2">👤</span>
              My Feed
            </h1>
            <p className="text-gray-600 mt-2">Personalized news based on your interests</p>
          </div>
          <div className="flex items-center space-x-4">
            <label className="text-sm font-medium text-gray-700">Filter:</label>
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white transition-all duration-200 hover:border-purple-300"
            >
              {filters.map(f => (
                <option key={f.value} value={f.value}>{f.label}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* User Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-4 rounded-lg transform hover:scale-105 transition-transform duration-300">
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">{personalizedNews.length}</div>
            <div className="text-sm text-gray-600">Articles Today</div>
          </div>
        </div>
        <div className="bg-gradient-to-r from-green-50 to-green-100 p-4 rounded-lg transform hover:scale-105 transition-transform duration-300">
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">{user?.preferences?.categories?.length || 0}</div>
            <div className="text-sm text-gray-600">Interests</div>
          </div>
        </div>
        <div className="bg-gradient-to-r from-orange-50 to-orange-100 p-4 rounded-lg transform hover:scale-105 transition-transform duration-300">
          <div className="text-center">
            <div className="text-2xl font-bold text-orange-600">{bookmarkedArticles.length}</div>
            <div className="text-sm text-gray-600">Bookmarks</div>
          </div>
        </div>
      </div>

      <div className="space-y-6">
        {personalizedNews.map((article, index) => (
          <div 
            key={article.id} 
            className="bg-white rounded-lg shadow-lg overflow-hidden transform hover:scale-105 transition-all duration-300 animate-slide-up border-l-4 border-purple-500"
            style={{ animationDelay: `${index * 0.1}s` }}
          >
            <div className="flex">
              <img 
                src={article.image || 'https://via.placeholder.com/300x200'} 
                alt={article.title}
                className="w-64 h-40 object-cover"
              />
              <div className="p-6 flex-1">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      article.category && typeof article.category === 'object' && article.category !== null && !Array.isArray(article.category)
                        ? article.category.name === 'technology' ? 'bg-blue-100 text-blue-800' :
                          article.category.name === 'politics' ? 'bg-red-100 text-red-800' :
                          'bg-gray-100 text-gray-800'
                        : article.category === 'technology' ? 'bg-blue-100 text-blue-800' :
                          article.category === 'politics' ? 'bg-red-100 text-red-800' :
                          'bg-gray-100 text-gray-800'
                    }`}>
                      {article.category && typeof article.category === 'object' && article.category !== null && !Array.isArray(article.category)
                        ? article.category.name : (typeof article.category === 'string' ? article.category : '')}
                    </span>
                    <span className="text-gray-500 text-sm">{article.source && typeof article.source === 'object' && article.source !== null && !Array.isArray(article.source)
                      ? article.source.name : (typeof article.source === 'string' ? article.source : '')}</span>
                    <span className="text-purple-600 text-sm font-medium">{article.relevanceScore}% match</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-xs text-gray-500">{article.readTime}</span>
                    <button
                      onClick={() => handleBookmark(article)}
                      className={`p-2 rounded-full transition-colors ${
                        isArticleBookmarked(article.id) ? 'text-purple-600 bg-purple-50' : 'text-gray-400 hover:text-purple-600'
                      }`}
                    >
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M17 3H7c-1.1 0-2 .9-2 2v16l7-3 7 3V5c0-1.1-.9-2-2-2z"/>
                      </svg>
                    </button>
                  </div>
                </div>
                <h3 className="text-xl font-serif font-semibold text-gray-900 mb-3">{article.title}</h3>
                <p className="text-gray-600 mb-4">{article.description}</p>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">{article.publishedAt}</span>
                  <button 
                    onClick={() => handleReadMore(article)}
                    className="text-purple-600 hover:text-purple-800 text-sm font-medium transition-colors"
                  >
                    Read More
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {personalizedNews.length === 0 && (
        <div className="text-center py-16">
          <div className="text-gray-400 text-6xl mb-4">📱</div>
          <h3 className="text-xl font-serif font-semibold text-gray-900 mb-2">No Personalized Content</h3>
          <p className="text-gray-600 mb-6">Update your preferences to see personalized news</p>
          <button
            onClick={() => window.location.href = '/profile'}
            className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-6 py-3 rounded-md hover:from-purple-700 hover:to-indigo-700 transition-all duration-300"
          >
            Update Preferences
          </button>
        </div>
      )}

      <ArticleModal
        article={selectedArticle}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
      />
    </div>
  );
};

export default MyFeed;
