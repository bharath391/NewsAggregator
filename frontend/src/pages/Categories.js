import React, { useState, useEffect } from 'react';
import axios from 'axios';
import NewsCard from '../components/NewsCard';
import ArticleModal from '../components/ArticleModal';

const Categories = () => {
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [categoryNews, setCategoryNews] = useState([]);
  const [loading, setLoading] = useState(false);
  const [bookmarkedArticles, setBookmarkedArticles] = useState([]);
  const [selectedArticle, setSelectedArticle] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const categories = [
    { id: 'technology', name: 'Technology', icon: '💻', color: 'blue', bgColor: 'from-blue-400 to-blue-600' },
    { id: 'politics', name: 'Politics', icon: '🏛️', color: 'red', bgColor: 'from-red-400 to-red-600' },
    { id: 'sports', name: 'Sports', icon: '⚽', color: 'green', bgColor: 'from-green-400 to-green-600' },
    { id: 'business', name: 'Business', icon: '📊', color: 'yellow', bgColor: 'from-yellow-400 to-orange-500' },
    { id: 'entertainment', name: 'Entertainment', icon: '🎬', color: 'purple', bgColor: 'from-purple-400 to-purple-600' },
    { id: 'health', name: 'Health', icon: '🏥', color: 'pink', bgColor: 'from-pink-400 to-pink-600' },
    { id: 'science', name: 'Science', icon: '🔬', color: 'indigo', bgColor: 'from-indigo-400 to-indigo-600' },
    { id: 'world', name: 'World', icon: '🌍', color: 'gray', bgColor: 'from-gray-400 to-gray-600' },
  ];

  useEffect(() => {
    loadBookmarks();
  }, []);

  const loadBookmarks = () => {
    const saved = localStorage.getItem('bookmarkedArticles');
    if (saved) {
      setBookmarkedArticles(JSON.parse(saved));
    }
  };

  const loadCategoryNews = async (categoryId) => {
    try {
      setLoading(true);
      // Always send at least one required param (country=us)
      const params = { category: categoryId, country: 'us', page: 1, pageSize: 12 };
      const response = await axios.get('/api/news/top-headlines', { params });
      setCategoryNews(response.data.articles || []);
    } catch (error) {
      console.error('Error loading category news:', error);
    } finally {
      setLoading(false);
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

  const hideCategoryNews = () => {
    setSelectedCategory(null);
    setCategoryNews([]);
  };

  return (
    <div className="section bg-gradient-to-br from-blue-50 via-white to-purple-50 min-h-screen">
      <div className="mb-8 bg-white rounded-lg shadow-lg p-6 bg-gradient-to-r from-purple-50 to-pink-50">
        <h1 className="text-3xl font-serif font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">Categories</h1>
        <p className="text-gray-600 mt-2">Explore news by category</p>
      </div>

      {!selectedCategory ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {categories.map((category) => (
            <div
              key={category.id}
              onClick={() => loadCategoryNews(category.id)}
              className={`bg-gradient-to-br ${category.bgColor} rounded-lg p-6 text-center hover:shadow-xl transition-all duration-300 cursor-pointer transform hover:scale-105`}
            >
              <div className="text-white text-4xl mb-4">
                {category.icon}
              </div>
              <h3 className="font-serif font-semibold text-white mb-2">
                {category.name}
              </h3>
              <p className="text-sm text-white opacity-90">
                Latest {category.name.toLowerCase()} news and updates
              </p>
            </div>
          ))}
        </div>
      ) : (
        <div>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-serif font-semibold text-gray-900">
              {categories.find(c => c.id === selectedCategory)?.name} News
            </h2>
            <button
              onClick={hideCategoryNews}
              className="text-gray-500 hover:text-gray-700 p-2"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
            </button>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                <p className="mt-4 text-gray-600">Loading {selectedCategory} news...</p>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {categoryNews.map((article) => (
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
                  viewMode="grid"
                  onBookmark={handleBookmark}
                  isBookmarked={isArticleBookmarked(article.id)}
                  onReadMore={handleReadMore}
                />
              ))}
            </div>
          )}
          
          {!loading && categoryNews.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-600">No news articles found for this category.</p>
            </div>
          )}
        </div>
      )}

      {/* Article Modal */}
      <ArticleModal
        article={selectedArticle}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
      />
    </div>
  );
};

export default Categories;
