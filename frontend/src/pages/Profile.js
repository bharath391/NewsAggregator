import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';

const Profile = () => {
  const { user, updateUser } = useAuth();
  const [profileData, setProfileData] = useState({
    name: '',
    email: '',
    bio: '',
    preferences: {
      categories: [],
      sources: [],
      viewMode: 'grid'
    }
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const categories = [
    { id: 'technology', name: 'Technology' },
    { id: 'politics', name: 'Politics' },
    { id: 'sports', name: 'Sports' },
    { id: 'business', name: 'Business' },
    { id: 'entertainment', name: 'Entertainment' },
    { id: 'health', name: 'Health' },
    { id: 'science', name: 'Science' },
    { id: 'world', name: 'World' }
  ];

  const sources = [
    { id: 'bbc', name: 'BBC News' },
    { id: 'cnn', name: 'CNN' },
    { id: 'reuters', name: 'Reuters' },
    { id: 'ap', name: 'Associated Press' },
    { id: 'guardian', name: 'The Guardian' },
    { id: 'nytimes', name: 'New York Times' },
    { id: 'washpost', name: 'Washington Post' },
    { id: 'wsj', name: 'Wall Street Journal' }
  ];

  useEffect(() => {
    if (user) {
      setProfileData({
        name: user.name || '',
        email: user.email || '',
        bio: user.bio || '',
        preferences: {
          categories: user.preferences?.categories || [],
          sources: user.preferences?.sources || [],
          viewMode: user.preferences?.viewMode || 'grid'
        }
      });
    }
  }, [user]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfileData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleCategoryChange = (categoryId) => {
    setProfileData(prev => ({
      ...prev,
      preferences: {
        ...prev.preferences,
        categories: prev.preferences.categories.includes(categoryId)
          ? prev.preferences.categories.filter(c => c !== categoryId)
          : [...prev.preferences.categories, categoryId]
      }
    }));
  };

  const handleSourceChange = (sourceId) => {
    setProfileData(prev => ({
      ...prev,
      preferences: {
        ...prev.preferences,
        sources: prev.preferences.sources.includes(sourceId)
          ? prev.preferences.sources.filter(s => s !== sourceId)
          : [...prev.preferences.sources, sourceId]
      }
    }));
  };

  const handlePreferenceChange = (key, value) => {
    setProfileData(prev => ({
      ...prev,
      preferences: {
        ...prev.preferences,
        [key]: value
      }
    }));
  };

  const saveProfile = async () => {
    try {
      setLoading(true);
      setMessage('');

      // Commented out API call - replace with actual backend later
      /*
      const response = await axios.put('/api/user/profile', profileData, {
        headers: { Authorization: `Bearer ${user.token}` }
      });
      */

      // Update user context with new data
      updateUser(profileData);
      
      setMessage('Profile updated successfully!');
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      console.error('Profile update error:', error);
      setMessage('Failed to update profile. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="section">
      <div className="mb-8 bg-gradient-to-r from-indigo-50 to-purple-50 p-6 rounded-lg">
        <h1 className="text-3xl font-serif font-bold text-gray-900">Profile</h1>
        <p className="text-gray-600 mt-2">Manage your account information and preferences</p>
      </div>

      {message && (
        <div className={`mb-6 p-4 rounded-md ${
          message.includes('successfully') ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
        }`}>
          {message}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Profile Information */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-serif font-semibold text-gray-900 mb-4">Personal Information</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                <input
                  type="text"
                  name="name"
                  value={profileData.name}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter your full name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                <input
                  type="email"
                  name="email"
                  value={profileData.email}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter your email address"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Bio</label>
                <textarea
                  name="bio"
                  value={profileData.bio}
                  onChange={handleInputChange}
                  rows="4"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Tell us about yourself..."
                />
              </div>
            </div>
          </div>

          {/* Preferences */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-serif font-semibold text-gray-900 mb-4">Content Preferences</h2>
            
            <div className="space-y-6">
              {/* Preferred Categories */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">Preferred Categories</label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {categories.map((category) => (
                    <label key={category.id} className="flex items-center space-x-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={profileData.preferences.categories.includes(category.id)}
                        onChange={() => handleCategoryChange(category.id)}
                        className="rounded text-blue-600 focus:ring-blue-500"
                      />
                      <span className="text-sm text-gray-700">{typeof category === 'object' && category !== null && !Array.isArray(category) ? category.name : String(category)}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Preferred Sources */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">Preferred News Sources</label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {sources.map((source) => (
                    <label key={source.id} className="flex items-center space-x-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={profileData.preferences.sources.includes(source.id)}
                        onChange={() => handleSourceChange(source.id)}
                        className="rounded text-blue-600 focus:ring-blue-500"
                      />
                      <span className="text-sm text-gray-700">{typeof source === 'object' && source !== null && !Array.isArray(source) ? source.name : String(source)}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Default View Mode */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">Default View Mode</label>
                <select
                  value={profileData.preferences.viewMode}
                  onChange={(e) => handlePreferenceChange('viewMode', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="grid">Grid View</option>
                  <option value="list">List View</option>
                  <option value="magazine">Magazine View</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Profile Summary */}
        <div className="space-y-6">
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-serif font-semibold text-gray-900 mb-4">Profile Summary</h2>
            <div className="space-y-4">
              <div className="text-center">
                <div className="w-20 h-20 bg-gradient-to-r from-blue-100 to-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="text-2xl font-serif font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                    {profileData.name ? profileData.name.charAt(0).toUpperCase() : 'U'}
                  </span>
                </div>
                <h3 className="font-serif font-semibold text-gray-900">{profileData.name || 'User'}</h3>
                <p className="text-sm text-gray-600">{profileData.email}</p>
              </div>
              
              <div className="border-t pt-4">
                <h4 className="font-medium text-gray-900 mb-2">Interests</h4>
                <div className="flex flex-wrap gap-2">
                  {profileData.preferences.categories.map((categoryId) => {
                    const category = categories.find(c => c.id === categoryId);
                    return category ? (
                      <span key={categoryId} className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                        {typeof category === 'object' && category !== null && !Array.isArray(category) ? category.name : String(category)}
                      </span>
                    ) : null;
                  })}
                </div>
              </div>
              
              <div className="border-t pt-4">
                <h4 className="font-medium text-gray-900 mb-2">Preferred Sources</h4>
                <div className="space-y-1">
                  {profileData.preferences.sources.slice(0, 3).map((sourceId) => {
                    const source = sources.find(s => s.id === sourceId);
                    return source ? (
                      <p key={sourceId} className="text-sm text-gray-600">• {typeof source === 'object' && source !== null && !Array.isArray(source) ? source.name : String(source)}</p>
                    ) : null;
                  })}
                  {profileData.preferences.sources.length > 3 && (
                    <p className="text-sm text-gray-500">+{profileData.preferences.sources.length - 3} more</p>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Save Button */}
          <button
            onClick={saveProfile}
            disabled={loading}
            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 px-6 rounded-md hover:from-blue-700 hover:to-purple-700 transition-all duration-300 disabled:opacity-50"
          >
            {loading ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Profile;
