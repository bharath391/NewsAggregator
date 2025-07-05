import React from 'react';

const ArticleModal = ({ article, isOpen, onClose }) => {
  if (!isOpen || !article) return null;

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center px-4 animate-fade-in"
      onClick={handleBackdropClick}
    >
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto transform animate-scale-up">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex justify-between items-start">
          <div className="flex-1 pr-4">
            <div className="flex items-center space-x-3 mb-3">
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                article.category === 'breaking' ? 'bg-red-100 text-red-800' :
                article.category === 'technology' ? 'bg-blue-100 text-blue-800' :
                article.category === 'politics' ? 'bg-red-100 text-red-800' :
                article.category === 'sports' ? 'bg-green-100 text-green-800' :
                article.category === 'business' ? 'bg-yellow-100 text-yellow-800' :
                'bg-gray-100 text-gray-800'
              }`}>
                {article.category}
              </span>
              <span className="text-gray-500 text-sm">{article.source}</span>
              <span className="text-gray-500 text-sm">{article.publishedAt}</span>
            </div>
            <h1 className="text-2xl font-serif font-bold text-gray-900">{article.title}</h1>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors p-2 rounded-full hover:bg-gray-100"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Featured Image */}
          <img 
            src={article.image || 'https://via.placeholder.com/800x400'} 
            alt={article.title}
            className="w-full h-64 object-cover rounded-lg mb-6"
          />

          {/* Article Text */}
          <div className="prose max-w-none">
            <p className="text-lg text-gray-700 mb-6 leading-relaxed">
              {article.description}
            </p>
            
            {/* Extended content - in a real app, this would come from the API */}
            <div className="space-y-4 text-gray-600 leading-relaxed">
              <p>
                This is where the full article content would appear. In a production environment, 
                this content would be fetched from your news API based on the article ID. The modal 
                provides a clean, focused reading experience without leaving the main application.
              </p>
              
              <p>
                The article modal includes proper typography, spacing, and responsive design to ensure 
                optimal readability across different devices. Users can easily close the modal by 
                clicking the X button or clicking outside the modal area.
              </p>
              
              <p>
                Key features of this reading experience include:
              </p>
              
              <ul className="list-disc pl-6 space-y-2">
                <li>Clean, distraction-free layout</li>
                <li>Responsive design for all screen sizes</li>
                <li>Smooth animations and transitions</li>
                <li>Easy navigation and close options</li>
                <li>Proper typography for comfortable reading</li>
              </ul>
              
              <p>
                This modal can be easily extended to include additional features such as:
              </p>
              
              <ul className="list-disc pl-6 space-y-2">
                <li>Social sharing buttons</li>
                <li>Related articles suggestions</li>
                <li>Reading progress indicator</li>
                <li>Text-to-speech functionality</li>
                <li>Font size adjustment controls</li>
                <li>Dark mode toggle</li>
              </ul>
              
              <p>
                The integration with your backend API would involve fetching the full article content 
                when the "Read More" button is clicked, providing users with the complete story in 
                this elegant modal interface.
              </p>
            </div>
          </div>

          {/* Actions */}
          <div className="mt-8 pt-6 border-t border-gray-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <button className="flex items-center space-x-2 text-gray-500 hover:text-blue-600 transition-colors">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path>
                  </svg>
                  <span className="text-sm">Like</span>
                </button>
                <button className="flex items-center space-x-2 text-gray-500 hover:text-green-600 transition-colors">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z"></path>
                  </svg>
                  <span className="text-sm">Share</span>
                </button>
                <button className="flex items-center space-x-2 text-gray-500 hover:text-purple-600 transition-colors">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M17 3H7c-1.1 0-2 .9-2 2v16l7-3 7 3V5c0-1.1-.9-2-2-2z"/>
                  </svg>
                  <span className="text-sm">Bookmark</span>
                </button>
              </div>
              <button
                onClick={onClose}
                className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-2 rounded-md hover:from-blue-700 hover:to-purple-700 transition-all duration-300"
              >
                Close Article
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ArticleModal;
