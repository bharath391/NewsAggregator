import React, { useState, useEffect } from 'react';
import NewsCard from '../components/NewsCard';
import ArticleModal from '../components/ArticleModal';

const Trending = () => {
  const [trendingNews, setTrendingNews] = useState([]);
  const [timeframe, setTimeframe] = useState('today');
  const [loading, setLoading] = useState(true);
  const [bookmarkedArticles, setBookmarkedArticles] = useState([]);
  const [selectedArticle, setSelectedArticle] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const timeframes = [
    { value: 'today', label: 'Today' },
    { value: 'week', label: 'This Week' },
    { value: 'month', label: 'This Month' }
  ];

  useEffect(() => {
    loadTrendingNews();
    loadBookmarks();
  }, [timeframe]);

  const loadTrendingNews = async () => {
    try {
      setLoading(true);
      
      // Dummy trending data
      const dummyTrending = [
        {
          id: 2001,
          title: 'AI Revolution: ChatGPT Successor Announced',
          description: 'The next generation of AI technology promises to revolutionize how we work, learn, and interact with digital systems.',
          image: 'https://via.placeholder.com/400x250',
          category: 'technology',
          source: 'Tech Today',
          publishedAt: '2 hours ago',
          trending: true,
          views: '2.5M',
          shares: '45K',
          url: '#'
        },
        {
          id: 2002,
          title: 'Climate Summit: Historic Agreement Reached',
          description: 'World leaders unite on unprecedented climate action plan with binding commitments for carbon neutrality.',
          image: 'https://via.placeholder.com/400x250',
          category: 'world',
          source: 'Global News',
          publishedAt: '4 hours ago',
          trending: true,
          views: '1.8M',
          shares: '32K',
          url: '#'
        },
        {
          id: 2003,
          title: 'Space Tourism: First Commercial Flight Success',
          description: 'Private space company successfully completes first commercial passenger flight to orbit.',
          image: 'https://via.placeholder.com/400x250',
          category: 'science',
          source: 'Space News',
          publishedAt: '6 hours ago',
          trending: true,
          views: '1.2M',
          shares: '28K',
          url: '#'
        }
      ];

      setTrendingNews(dummyTrending);
    } catch (error) {
      console.error('Error loading trending news:', error);
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
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading trending news...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="section animate-fade-in">
      <div className="mb-8 bg-gradient-to-r from-red-50 to-pink-50 p-6 rounded-lg transform hover:scale-105 transition-transform duration-300">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-serif font-bold text-gray-900 flex items-center">
              <span className="text-red-500 mr-2">🔥</span>
              Trending News
            </h1>
            <p className="text-gray-600 mt-2">Most popular stories right now</p>
          </div>
          <div className="flex items-center space-x-4">
            <label className="text-sm font-medium text-gray-700">Timeframe:</label>
            <select
              value={timeframe}
              onChange={(e) => setTimeframe(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 bg-white transition-all duration-200 hover:border-red-300"
            >
              {timeframes.map(tf => (
                <option key={tf.value} value={tf.value}>{tf.label}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {trendingNews.map((article, index) => (
          <div 
            key={article.id} 
            className="transform hover:scale-105 transition-all duration-300 animate-slide-up"
            style={{ animationDelay: `${index * 0.1}s` }}
          >
            <div className="relative">
              <NewsCard
                article={article}
                viewMode="grid"
                onBookmark={handleBookmark}
                isBookmarked={isArticleBookmarked(article.id)}
                onReadMore={handleReadMore}
              />
              <div className="absolute top-2 left-2 bg-red-500 text-white px-2 py-1 rounded-full text-xs font-bold flex items-center animate-pulse">
                <span className="mr-1">🔥</span>
                TRENDING
              </div>
              <div className="absolute bottom-2 right-2 bg-black bg-opacity-75 text-white px-2 py-1 rounded text-xs">
                {article.views} views
              </div>
            </div>
          </div>
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

export default Trending;
