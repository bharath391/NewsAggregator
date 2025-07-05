import React, { useState, useEffect } from 'react';
import NewsCard from '../components/NewsCard';

const Search = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [bookmarkedArticles, setBookmarkedArticles] = useState([]);
  const [searchHistory, setSearchHistory] = useState([]);

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

      // Commented out API call - replace with actual backend later
      /*
      const response = await axios.get(`/api/news/search?q=${encodeURIComponent(query)}`, {
        headers: { Authorization: `Bearer ${user.token}` }
      });
      setSearchResults(response.data.articles);
      */

      // Dummy search results for frontend testing
      const dummyResults = [
        {
          id: 1001,
          title: `Breaking: ${query} Development Announced`,
          description: `Major developments in ${query} have been announced by leading experts in the field, promising significant implications for the future.`,
          image: 'https://via.placeholder.com/400x250',
          category: 'technology',
          source: 'News Today',
          publishedAt: '1 hour ago',
          url: '#'
        },
        {
          id: 1002,
          title: `Global Impact of ${query} Research`,
          description: `New research on ${query} reveals surprising findings that could reshape our understanding of the topic.`,
          image: 'https://via.placeholder.com/400x250',
          category: 'science',
          source: 'Research Weekly',
          publishedAt: '3 hours ago',
          url: '#'
        },
        {
          id: 1003,
          title: `${query} Market Trends Show Growth`,
          description: `Market analysis shows significant growth in ${query} sector, with investors showing increased interest.`,
          image: 'https://via.placeholder.com/400x250',
          category: 'business',
          source: 'Market Report',
          publishedAt: '5 hours ago',
          url: '#'
        },
        {
          id: 1004,
          title: `Government Policy on ${query}`,
          description: `New government policies regarding ${query} have been introduced to address current challenges.`,
          image: 'https://via.placeholder.com/400x250',
          category: 'politics',
          source: 'Policy News',
          publishedAt: '8 hours ago',
          url: '#'
        }
      ];

      setSearchResults(dummyResults);
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
                  article={article}
                  viewMode="grid"
                  onBookmark={handleBookmark}
                  isBookmarked={isArticleBookmarked(article.id)}
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
    </div>
  );
};

export default Search;
