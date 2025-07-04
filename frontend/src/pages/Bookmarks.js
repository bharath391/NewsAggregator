import React, { useState, useEffect } from 'react';
import NewsCard from '../components/NewsCard';

const Bookmarks = () => {
  const [bookmarkedArticles, setBookmarkedArticles] = useState([]);
  const [viewMode, setViewMode] = useState('grid');

  useEffect(() => {
    loadBookmarks();
  }, []);

  const loadBookmarks = () => {
    const saved = localStorage.getItem('bookmarkedArticles');
    if (saved) {
      setBookmarkedArticles(JSON.parse(saved));
    }
  };

  const handleRemoveBookmark = (article) => {
    const updatedBookmarks = bookmarkedArticles.filter(b => b.id !== article.id);
    setBookmarkedArticles(updatedBookmarks);
    localStorage.setItem('bookmarkedArticles', JSON.stringify(updatedBookmarks));
  };

  const clearAllBookmarks = () => {
    setBookmarkedArticles([]);
    localStorage.removeItem('bookmarkedArticles');
  };

  const groupedBookmarks = bookmarkedArticles.reduce((acc, article) => {
    const category = article.category || 'other';
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(article);
    return acc;
  }, {});

  return (
    <div className="section">
      <div className="flex justify-between items-center mb-8 bg-gradient-to-r from-yellow-50 to-orange-50 p-6 rounded-lg">
        <div>
          <h1 className="text-3xl font-serif font-bold text-gray-900">Bookmarked Articles</h1>
          <p className="text-gray-600 mt-2">Your saved articles for later reading</p>
        </div>
        <div className="flex items-center space-x-4">
          {bookmarkedArticles.length > 0 && (
            <button
              onClick={clearAllBookmarks}
              className="text-red-600 hover:text-red-700 text-sm font-medium"
            >
              Clear All
            </button>
          )}
          <div className="flex items-center space-x-2">
            <label className="text-sm font-medium text-gray-700">View:</label>
            <select
              value={viewMode}
              onChange={(e) => setViewMode(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="grid">Grid</option>
              <option value="list">List</option>
              <option value="magazine">Magazine</option>
            </select>
          </div>
        </div>
      </div>

      {bookmarkedArticles.length === 0 ? (
        <div className="text-center py-16">
          <div className="text-gray-400 text-6xl mb-4">📚</div>
          <h3 className="text-xl font-serif font-semibold text-gray-900 mb-2">No Bookmarked Articles</h3>
          <p className="text-gray-600 mb-6">Start bookmarking articles you want to read later</p>
          <button
            onClick={() => window.location.href = '/'}
            className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-md hover:from-blue-700 hover:to-purple-700 transition-all duration-300"
          >
            Browse News
          </button>
        </div>
      ) : (
        <div className="space-y-8">
          {Object.entries(groupedBookmarks).map(([category, articles]) => (
            <div key={category}>
              <h2 className="text-xl font-serif font-semibold text-gray-900 mb-4 capitalize flex items-center">
                <span className="mr-2">
                  {category === 'technology' ? '💻' :
                   category === 'politics' ? '🏛️' :
                   category === 'sports' ? '⚽' :
                   category === 'business' ? '📊' :
                   category === 'entertainment' ? '🎬' :
                   category === 'health' ? '🏥' :
                   category === 'science' ? '🔬' :
                   category === 'world' ? '🌍' : '📰'}
                </span>
                {category} ({articles.length})
              </h2>
              <div className={`${
                viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6' :
                viewMode === 'list' ? 'space-y-6' :
                'grid grid-cols-1 lg:grid-cols-2 gap-8'
              }`}>
                {articles.map((article) => (
                  <div key={article.id} className="relative">
                    <NewsCard
                      article={article}
                      viewMode={viewMode}
                      onBookmark={handleRemoveBookmark}
                      isBookmarked={true}
                    />
                    <div className="absolute top-2 right-2 bg-blue-600 text-white px-2 py-1 rounded text-xs">
                      Saved
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Bookmarks;
