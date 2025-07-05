import React from 'react';

const NewsCard = ({ article, viewMode = 'grid', onBookmark, isBookmarked, onReadMore }) => {
  const handleBookmark = () => {
    onBookmark(article);
  };

  const handleReadMore = () => {
    if (onReadMore) {
      onReadMore(article);
    } else {
      // Open in new tab if URL is provided
      if (article.url && article.url !== '#') {
        window.open(article.url, '_blank');
      } else {
        // Show modal with full article content
        alert(`Full Article: ${article.title}\n\n${article.description}\n\nThis would normally open the full article or show a modal with the complete content.`);
      }
    }
  };

  if (viewMode === 'list') {
    return (
      <div className="bg-white rounded-lg shadow-lg overflow-hidden flex">
        <img 
          src={article.image || 'https://via.placeholder.com/200x150'} 
          alt={article.title}
          className="w-48 h-32 object-cover"
        />
        <div className="p-4 flex-1">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center space-x-2">
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                article.category === 'breaking' ? 'bg-red-100 text-red-800' :
                article.category === 'technology' ? 'bg-blue-100 text-blue-800' :
                article.category === 'politics' ? 'bg-red-100 text-red-800' :
                article.category === 'sports' ? 'bg-green-100 text-green-800' :
                'bg-gray-100 text-gray-800'
              }`}>
                {article.category}
              </span>
              <span className="text-gray-500 text-sm">{article.source}</span>
            </div>
            <button
              onClick={handleBookmark}
              className={`p-2 rounded-full transition-colors ${
                isBookmarked ? 'text-blue-600 bg-blue-50' : 'text-gray-400 hover:text-blue-600'
              }`}
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17 3H7c-1.1 0-2 .9-2 2v16l7-3 7 3V5c0-1.1-.9-2-2-2z"/>
              </svg>
            </button>
          </div>
          <h3 className="font-serif font-semibold text-gray-900 mb-2">{article.title}</h3>
          <p className="text-gray-600 text-sm mb-3">{article.description}</p>
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-500">{article.publishedAt}</span>
            <button 
              onClick={handleReadMore}
              className="text-blue-600 hover:text-blue-800 text-sm font-medium"
            >
              Read More
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (viewMode === 'magazine') {
    return (
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="p-6">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center space-x-2">
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                article.category === 'breaking' ? 'bg-red-100 text-red-800' :
                article.category === 'technology' ? 'bg-blue-100 text-blue-800' :
                article.category === 'politics' ? 'bg-red-100 text-red-800' :
                article.category === 'sports' ? 'bg-green-100 text-green-800' :
                'bg-gray-100 text-gray-800'
              }`}>
                {article.category}
              </span>
              <span className="text-gray-500 text-sm">{article.source}</span>
            </div>
            <button
              onClick={handleBookmark}
              className={`p-2 rounded-full transition-colors ${
                isBookmarked ? 'text-blue-600 bg-blue-50' : 'text-gray-400 hover:text-blue-600'
              }`}
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17 3H7c-1.1 0-2 .9-2 2v16l7-3 7 3V5c0-1.1-.9-2-2-2z"/>
              </svg>
            </button>
          </div>
          <h3 className="text-xl font-serif font-semibold text-gray-900 mb-3">{article.title}</h3>
          <p className="text-gray-600 mb-4">{article.description}</p>
          <img 
            src={article.image || 'https://via.placeholder.com/400x200'} 
            alt={article.title}
            className="w-full h-48 object-cover rounded-md mb-4"
          />
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-500">{article.publishedAt}</span>
            <button 
              onClick={handleReadMore}
              className="text-blue-600 hover:text-blue-800 text-sm font-medium"
            >
              Read More
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Default grid view
  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
      <img 
        src={article.image || 'https://via.placeholder.com/400x250'} 
        alt={article.title}
        className="w-full h-48 object-cover"
      />
      <div className="p-6">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-2">
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
              article.category === 'breaking' ? 'bg-red-100 text-red-800' :
              article.category === 'technology' ? 'bg-blue-100 text-blue-800' :
              article.category === 'politics' ? 'bg-red-100 text-red-800' :
              article.category === 'sports' ? 'bg-green-100 text-green-800' :
              'bg-gray-100 text-gray-800'
            }`}>
              {article.category}
            </span>
            <span className="text-gray-500 text-sm">{article.source}</span>
          </div>
          <button
            onClick={handleBookmark}
            className={`p-2 rounded-full transition-colors ${
              isBookmarked ? 'text-blue-600 bg-blue-50' : 'text-gray-400 hover:text-blue-600'
            }`}
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M17 3H7c-1.1 0-2 .9-2 2v16l7-3 7 3V5c0-1.1-.9-2-2-2z"/>
            </svg>
          </button>
        </div>
        <h3 className="text-lg font-serif font-semibold text-gray-900 mb-3">{article.title}</h3>
        <p className="text-gray-600 mb-4">{article.description}</p>
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-500">{article.publishedAt}</span>
          <button 
            onClick={handleReadMore}
            className="text-blue-600 hover:text-blue-800 text-sm font-medium"
          >
            Read More
          </button>
        </div>
      </div>
    </div>
  );
};

export default NewsCard;
