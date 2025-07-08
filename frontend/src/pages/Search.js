import React, { useState, useEffect } from 'react';
import axios from 'axios';
import NewsCard from '../components/NewsCard';
import ArticleModal from '../components/ArticleModal';

const Search = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [bookmarkedArticles, setBookmarkedArticles] = useState([]);
  const [searchHistory, setSearchHistory] = useState([]);
  const [selectedArticle, setSelectedArticle] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const popularSearches = [
    'climate change',
    'artificial intelligence',
    'space exploration',
    'cryptocurrency',
    'renewable energy',
    'healthcare technology',
    'global economy',
    'cybersecurity'
  ];

  useEffect(() => {
    loadBookmarks();
    loadSearchHistory();
  }, []);

  const loadBookmarks = () => {
    const saved = localStorage.getItem('bookmarkedArticles');
    if (saved) {
      setBookmarkedArticles(JSON.parse(saved));
    }
  };

  const loadSearchHistory = () => {
    const saved = localStorage.getItem('searchHistory');
    if (saved) {
      setSearchHistory(JSON.parse(saved));
    }
  };

  const saveSearchHistory = (query) => {
    const updatedHistory = [query, ...searchHistory.filter(h => h !== query)].slice(0, 10);
    setSearchHistory(updatedHistory);
    localStorage.setItem('searchHistory', JSON.stringify(updatedHistory));
  };

  const searchNews = async (query = searchQuery) => {
    if (!query.trim()) return;

    try {
      setLoading(true);
      setHasSearched(true);
      saveSearchHistory(query);

      // Always send at least one required param (q=searchTerm)
      const params = { q: query, page: 1, pageSize: 12 };
      const response = await axios.get('/api/news/everything', { params });
      setSearchResults(response.data.articles || []);
    } catch (error) {
      console.error('Search error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      searchNews();
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

  const clearSearchHistory = () => {
    setSearchHistory([]);
    localStorage.removeItem('searchHistory');
  };

  const handleReadMore = (article) => {
    setSelectedArticle(article);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedArticle(null);
  };

  return (
    <div className="section">
      <div className="mb-8 bg-gradient-to-r from-green-50 to-blue-50 p-6 rounded-lg">
        <h1 className="text-3xl font-serif font-bold text-gray-900">Search News</h1>
        <p className="text-gray-600 mt-2">Find articles by keyword or topic</p>
      </div>

      {/* Search Bar */}
      <div className="bg-gradient-to-r from-white to-blue-50 rounded-lg shadow-lg p-6 mb-8 border border-blue-100">
        <div className="flex space-x-4">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Enter keywords..."
            className="flex-1 px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-lg"
          />
          <button
            onClick={() => searchNews()}
            disabled={loading}
            className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-3 rounded-md hover:from-blue-700 hover:to-purple-700 transition-all duration-300 disabled:opacity-50"
          >
            {loading ? 'Searching...' : 'Search'}
          </button>
        </div>

        {/* Popular Searches */}
        <div className="mt-6">
          <h3 className="text-sm font-medium text-gray-700 mb-3">Popular Searches:</h3>
          <div className="flex flex-wrap gap-2">
            {popularSearches.map((search) => (
              <button
                key={search}
                onClick={() => {
                  setSearchQuery(search);
                  searchNews(search);
                }}
                className="text-sm bg-gradient-to-r from-gray-100 to-gray-200 text-gray-700 px-3 py-1 rounded-full hover:from-blue-100 hover:to-purple-100 hover:text-blue-700 transition-all duration-300"
              >
                {search}
              </button>
            ))}
          </div>
        </div>

        {/* Search History */}
        {searchHistory.length > 0 && (
          <div className="mt-6">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-medium text-gray-700">Recent Searches:</h3>
              <button
                onClick={clearSearchHistory}
                className="text-xs text-gray-500 hover:text-gray-700"
              >
                Clear
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {searchHistory.map((search, index) => (
                <button
                  key={index}
                  onClick={() => {
                    setSearchQuery(search);
                    searchNews(search);
                  }}
                  className="text-sm bg-gradient-to-r from-blue-50 to-purple-50 text-blue-700 px-3 py-1 rounded-full hover:from-blue-100 hover:to-purple-100 transition-all duration-300"
                >
                  {search}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Search Results */}
      {loading && (
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Searching for "{searchQuery}"...</p>
          </div>
        </div>
      )}

      {hasSearched && !loading && (
        <div>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-serif font-semibold text-gray-900">
              Search Results for "{searchQuery}" ({searchResults.length} found)
            </h2>
          </div>

          {searchResults.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-gray-400 text-6xl mb-4">🔍</div>
              <h3 className="text-xl font-serif font-semibold text-gray-900 mb-2">No Results Found</h3>
              <p className="text-gray-600 mb-6">Try different keywords or check the spelling</p>
              <div className="space-y-2">
                <p className="text-sm text-gray-500">Suggestions:</p>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Try broader keywords</li>
                  <li>• Check for spelling errors</li>
                  <li>• Use different search terms</li>
                </ul>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {searchResults.map((article) => (
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
        </div>
      )}

      {/* Default state when no search has been performed */}
      {!hasSearched && !loading && (
        <div className="text-center py-16">
          <div className="text-gray-400 text-6xl mb-4">🔍</div>
          <h3 className="text-xl font-serif font-semibold text-gray-900 mb-2">Start Your Search</h3>
          <p className="text-gray-600 mb-6">Enter keywords to find news articles on any topic</p>
          <div className="max-w-md mx-auto">
            <div className="grid grid-cols-2 gap-2">
              {popularSearches.slice(0, 6).map((search) => (
                <button
                  key={search}
                  onClick={() => {
                    setSearchQuery(search);
                    searchNews(search);
                  }}
                  className="text-sm bg-blue-50 text-blue-700 px-4 py-2 rounded-md hover:bg-blue-100 transition-colors"
                >
                  {search}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Article Modal */}
      {selectedArticle && (
        <ArticleModal
          article={selectedArticle}
          isOpen={isModalOpen}
          onClose={handleCloseModal}
        />
      )}
    </div>
  );
};

export default Search;
