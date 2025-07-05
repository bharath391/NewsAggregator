import React, { useState, useEffect } from 'react';

const Analytics = () => {
  const [analytics, setAnalytics] = useState({
    readingStats: {
      articlesRead: 0,
      timeSpent: 0,
      averageReadTime: 0,
      streakDays: 0
    },
    preferences: {
      topCategories: [],
      topSources: [],
      readingTimes: []
    },
    engagement: {
      bookmarks: 0,
      searches: 0,
      shares: 0
    }
  });
  const [timeRange, setTimeRange] = useState('week');
  const [loading, setLoading] = useState(true);

  const timeRanges = [
    { value: 'week', label: 'This Week' },
    { value: 'month', label: 'This Month' },
    { value: 'year', label: 'This Year' }
  ];

  useEffect(() => {
    loadAnalytics();
  }, [timeRange]);

  const loadAnalytics = async () => {
    try {
      setLoading(true);
      
      // Dummy analytics data
      const dummyAnalytics = {
        readingStats: {
          articlesRead: 47,
          timeSpent: 285, // minutes
          averageReadTime: 6.1, // minutes
          streakDays: 12
        },
        preferences: {
          topCategories: [
            { name: 'Technology', percentage: 35, articles: 16 },
            { name: 'Politics', percentage: 28, articles: 13 },
            { name: 'Business', percentage: 20, articles: 9 },
            { name: 'Science', percentage: 17, articles: 8 }
          ],
          topSources: [
            { name: 'Tech Weekly', percentage: 25, articles: 12 },
            { name: 'Reuters', percentage: 20, articles: 9 },
            { name: 'BBC News', percentage: 18, articles: 8 },
            { name: 'CNN', percentage: 15, articles: 7 }
          ],
          readingTimes: [
            { hour: '08:00', articles: 12 },
            { hour: '12:00', articles: 8 },
            { hour: '18:00', articles: 15 },
            { hour: '21:00', articles: 12 }
          ]
        },
        engagement: {
          bookmarks: 23,
          searches: 34,
          shares: 12
        }
      };

      setAnalytics(dummyAnalytics);
    } catch (error) {
      console.error('Error loading analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="section flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading your analytics...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="section animate-fade-in">
      <div className="mb-8 bg-gradient-to-r from-green-50 to-teal-50 p-6 rounded-lg transform hover:scale-105 transition-transform duration-300">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-serif font-bold text-gray-900 flex items-center">
              <span className="text-green-500 mr-2">📊</span>
              Analytics Dashboard
            </h1>
            <p className="text-gray-600 mt-2">Insights into your reading habits and preferences</p>
          </div>
          <div className="flex items-center space-x-4">
            <label className="text-sm font-medium text-gray-700">Time Range:</label>
            <select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 bg-white transition-all duration-200 hover:border-green-300"
            >
              {timeRanges.map(tr => (
                <option key={tr.value} value={tr.value}>{tr.label}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Key Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-6 rounded-lg transform hover:scale-105 transition-all duration-300 animate-slide-up">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-600 text-sm font-medium">Articles Read</p>
              <p className="text-3xl font-bold text-blue-700">{analytics.readingStats.articlesRead}</p>
            </div>
            <div className="text-blue-500 text-2xl">📖</div>
          </div>
        </div>

        <div className="bg-gradient-to-r from-green-50 to-green-100 p-6 rounded-lg transform hover:scale-105 transition-all duration-300 animate-slide-up" style={{ animationDelay: '0.1s' }}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-600 text-sm font-medium">Time Spent</p>
              <p className="text-3xl font-bold text-green-700">{Math.floor(analytics.readingStats.timeSpent / 60)}h {analytics.readingStats.timeSpent % 60}m</p>
            </div>
            <div className="text-green-500 text-2xl">⏱️</div>
          </div>
        </div>

        <div className="bg-gradient-to-r from-orange-50 to-orange-100 p-6 rounded-lg transform hover:scale-105 transition-all duration-300 animate-slide-up" style={{ animationDelay: '0.2s' }}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-orange-600 text-sm font-medium">Avg Read Time</p>
              <p className="text-3xl font-bold text-orange-700">{analytics.readingStats.averageReadTime}m</p>
            </div>
            <div className="text-orange-500 text-2xl">📈</div>
          </div>
        </div>

        <div className="bg-gradient-to-r from-purple-50 to-purple-100 p-6 rounded-lg transform hover:scale-105 transition-all duration-300 animate-slide-up" style={{ animationDelay: '0.3s' }}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-600 text-sm font-medium">Reading Streak</p>
              <p className="text-3xl font-bold text-purple-700">{analytics.readingStats.streakDays} days</p>
            </div>
            <div className="text-purple-500 text-2xl">🔥</div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Top Categories */}
        <div className="bg-white rounded-lg shadow-lg p-6 transform hover:scale-105 transition-transform duration-300">
          <h3 className="text-xl font-serif font-semibold text-gray-900 mb-4">Top Categories</h3>
          <div className="space-y-4">
            {analytics.preferences.topCategories.map((category, index) => (
              <div key={category.name} className="animate-slide-up" style={{ animationDelay: `${index * 0.1}s` }}>
                <span className="text-sm font-medium text-gray-700">{typeof category === 'object' && category !== null && !Array.isArray(category) ? category.name : String(category)}</span>
                <span className="text-sm text-gray-500">{typeof category === 'object' && category !== null && !Array.isArray(category) && category.articles ? category.articles : ''} articles</span>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className={`h-2 rounded-full transition-all duration-1000 ${
                      index === 0 ? 'bg-blue-500' :
                      index === 1 ? 'bg-green-500' :
                      index === 2 ? 'bg-yellow-500' : 'bg-purple-500'
                    }`}
                    style={{ width: `${category.percentage}%` }}
                  />
                </div>
                <div className="text-xs text-gray-500 mt-1">{category.percentage}%</div>
              </div>
            ))}
          </div>
        </div>

        {/* Top Sources */}
        <div className="bg-white rounded-lg shadow-lg p-6 transform hover:scale-105 transition-transform duration-300">
          <h3 className="text-xl font-serif font-semibold text-gray-900 mb-4">Top Sources</h3>
          <div className="space-y-4">
            {analytics.preferences.topSources.map((source, index) => (
              <div key={source.name} className="animate-slide-up" style={{ animationDelay: `${index * 0.1}s` }}>
                <span className="text-sm font-medium text-gray-700">{typeof source === 'object' && source !== null && !Array.isArray(source) ? source.name : String(source)}</span>
                <span className="text-sm text-gray-500">{typeof source === 'object' && source !== null && !Array.isArray(source) && source.articles ? source.articles : ''} articles</span>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className={`h-2 rounded-full transition-all duration-1000 ${
                      index === 0 ? 'bg-red-500' :
                      index === 1 ? 'bg-indigo-500' :
                      index === 2 ? 'bg-pink-500' : 'bg-teal-500'
                    }`}
                    style={{ width: `${source.percentage}%` }}
                  />
                </div>
                <div className="text-xs text-gray-500 mt-1">{source.percentage}%</div>
              </div>
            ))}
          </div>
        </div>

        {/* Reading Times */}
        <div className="bg-white rounded-lg shadow-lg p-6 transform hover:scale-105 transition-transform duration-300">
          <h3 className="text-xl font-serif font-semibold text-gray-900 mb-4">Reading Patterns</h3>
          <div className="space-y-4">
            {analytics.preferences.readingTimes.map((time, index) => (
              <div key={time.hour} className="animate-slide-up" style={{ animationDelay: `${index * 0.1}s` }}>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700">{time.hour}</span>
                  <span className="text-sm text-gray-500">{time.articles} articles</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="h-2 rounded-full bg-gradient-to-r from-cyan-500 to-blue-500 transition-all duration-1000"
                    style={{ width: `${(time.articles / 15) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Engagement Stats */}
        <div className="bg-white rounded-lg shadow-lg p-6 transform hover:scale-105 transition-transform duration-300">
          <h3 className="text-xl font-serif font-semibold text-gray-900 mb-4">Engagement</h3>
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center p-4 bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg">
              <div className="text-2xl text-blue-500 mb-2">🔖</div>
              <div className="text-xl font-bold text-blue-600">{analytics.engagement.bookmarks}</div>
              <div className="text-xs text-gray-600">Bookmarks</div>
            </div>
            <div className="text-center p-4 bg-gradient-to-r from-green-50 to-green-100 rounded-lg">
              <div className="text-2xl text-green-500 mb-2">🔍</div>
              <div className="text-xl font-bold text-green-600">{analytics.engagement.searches}</div>
              <div className="text-xs text-gray-600">Searches</div>
            </div>
            <div className="text-center p-4 bg-gradient-to-r from-purple-50 to-purple-100 rounded-lg">
              <div className="text-2xl text-purple-500 mb-2">📤</div>
              <div className="text-xl font-bold text-purple-600">{analytics.engagement.shares}</div>
              <div className="text-xs text-gray-600">Shares</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
