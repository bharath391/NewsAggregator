import React, { useState, useEffect } from 'react';
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
      setSelectedCategory(categoryId);
      
      // Commented out API call - replace with actual backend later
      /*
      const response = await axios.get(`/api/news/category/${categoryId}`, {
        headers: { Authorization: `Bearer ${user.token}` }
      });
      setCategoryNews(response.data.articles);
      */

      // Dummy data for frontend testing
      const dummyArticles = {
        technology: [
          {
            id: 101,
            title: 'Quantum Computing Breakthrough Achieved',
            description: 'Researchers have achieved a major breakthrough in quantum computing that could revolutionize computational power.',
            image: 'https://via.placeholder.com/400x250',
            category: 'technology',
            source: 'Tech Review',
            publishedAt: '2 hours ago',
            url: '#'
          },
          {
            id: 102,
            title: 'New AI Model Surpasses Human Performance',
            description: 'The latest AI model has demonstrated capabilities that exceed human performance in complex reasoning tasks.',
            image: 'https://via.placeholder.com/400x250',
            category: 'technology',
            source: 'AI Today',
            publishedAt: '4 hours ago',
            url: '#'
          },
          {
            id: 103,
            title: 'Revolutionary Battery Technology Unveiled',
            description: 'A new battery technology promises to charge electric vehicles in minutes rather than hours.',
            image: 'https://via.placeholder.com/400x250',
            category: 'technology',
            source: 'Energy Tech',
            publishedAt: '6 hours ago',
            url: '#'
          }
        ],
        politics: [
          {
            id: 201,
            title: 'International Trade Agreement Signed',
            description: 'Major economies have signed a comprehensive trade agreement aimed at boosting global commerce.',
            image: 'https://via.placeholder.com/400x250',
            category: 'politics',
            source: 'Political Weekly',
            publishedAt: '1 hour ago',
            url: '#'
          },
          {
            id: 202,
            title: 'Climate Policy Reforms Announced',
            description: 'Government announces sweeping climate policy reforms to address environmental challenges.',
            image: 'https://via.placeholder.com/400x250',
            category: 'politics',
            source: 'Policy Today',
            publishedAt: '3 hours ago',
            url: '#'
          }
        ],
        sports: [
          {
            id: 301,
            title: 'World Cup Preparations Underway',
            description: 'Teams are making final preparations for the upcoming World Cup with intense training sessions.',
            image: 'https://via.placeholder.com/400x250',
            category: 'sports',
            source: 'Sports News',
            publishedAt: '30 minutes ago',
            url: '#'
          },
          {
            id: 302,
            title: 'Olympic Records Continue to Fall',
            description: 'Athletes are pushing the boundaries of human performance with new Olympic records.',
            image: 'https://via.placeholder.com/400x250',
            category: 'sports',
            source: 'Olympic Report',
            publishedAt: '2 hours ago',
            url: '#'
          }
        ],
        business: [
          {
            id: 401,
            title: 'Tech Giant Announces Major Acquisition',
            description: 'A leading technology company has announced the acquisition of a promising startup.',
            image: 'https://via.placeholder.com/400x250',
            category: 'business',
            source: 'Business Daily',
            publishedAt: '1 hour ago',
            url: '#'
          },
          {
            id: 402,
            title: 'Market Volatility Continues',
            description: 'Financial markets experience continued volatility amid global economic uncertainty.',
            image: 'https://via.placeholder.com/400x250',
            category: 'business',
            source: 'Market Watch',
            publishedAt: '3 hours ago',
            url: '#'
          }
        ],
        entertainment: [
          {
            id: 501,
            title: 'Blockbuster Movie Breaks Box Office Records',
            description: 'The latest blockbuster film has shattered opening weekend box office records worldwide.',
            image: 'https://via.placeholder.com/400x250',
            category: 'entertainment',
            source: 'Hollywood Reporter',
            publishedAt: '4 hours ago',
            url: '#'
          }
        ],
        health: [
          {
            id: 601,
            title: 'New Treatment Shows Promise',
            description: 'Clinical trials for a new treatment show promising results for previously incurable conditions.',
            image: 'https://via.placeholder.com/400x250',
            category: 'health',
            source: 'Medical News',
            publishedAt: '2 hours ago',
            url: '#'
          }
        ],
        science: [
          {
            id: 701,
            title: 'Mars Mission Discovers Water',
            description: 'The latest Mars mission has discovered evidence of liquid water beneath the planet\'s surface.',
            image: 'https://via.placeholder.com/400x250',
            category: 'science',
            source: 'Space Science',
            publishedAt: '5 hours ago',
            url: '#'
          }
        ],
        world: [
          {
            id: 801,
            title: 'Global Summit Addresses Climate Change',
            description: 'World leaders gather to address pressing climate change issues and sustainable development.',
            image: 'https://via.placeholder.com/400x250',
            category: 'world',
            source: 'Global News',
            publishedAt: '1 hour ago',
            url: '#'
          }
        ]
      };

      setCategoryNews(dummyArticles[categoryId] || []);
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
                  article={article}
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
