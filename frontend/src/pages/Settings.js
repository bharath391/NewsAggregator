import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';

const Settings = () => {
  const { user, updateUser } = useAuth();
  const [settings, setSettings] = useState({
    display: {
      darkMode: false,
      compactView: false,
      articlesPerPage: 12,
      fontSize: 'medium'
    },
    notifications: {
      breaking: true,
      daily: true,
      weekly: false,
      email: true,
      push: false
    },
    privacy: {
      profileVisible: true,
      trackingEnabled: false,
      analytics: true
    },
    language: 'en',
    timezone: 'UTC'
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (user?.settings) {
      setSettings(prev => ({
        ...prev,
        ...user.settings
      }));
    }
  }, [user]);

  const handleDisplayChange = (key, value) => {
    setSettings(prev => ({
      ...prev,
      display: {
        ...prev.display,
        [key]: value
      }
    }));
  };

  const handleNotificationChange = (key, value) => {
    setSettings(prev => ({
      ...prev,
      notifications: {
        ...prev.notifications,
        [key]: value
      }
    }));
  };

  const handlePrivacyChange = (key, value) => {
    setSettings(prev => ({
      ...prev,
      privacy: {
        ...prev.privacy,
        [key]: value
      }
    }));
  };

  const handleSettingChange = (key, value) => {
    setSettings(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const saveSettings = async () => {
    try {
      setLoading(true);
      setMessage('');

      // Commented out API call - replace with actual backend later
      /*
      const response = await axios.put('/api/user/settings', settings, {
        headers: { Authorization: `Bearer ${user.token}` }
      });
      */

      // Update user context with new settings
      updateUser({ settings });
      
      setMessage('Settings saved successfully!');
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      console.error('Settings update error:', error);
      setMessage('Failed to save settings. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const resetSettings = () => {
    setSettings({
      display: {
        darkMode: false,
        compactView: false,
        articlesPerPage: 12,
        fontSize: 'medium'
      },
      notifications: {
        breaking: true,
        daily: true,
        weekly: false,
        email: true,
        push: false
      },
      privacy: {
        profileVisible: true,
        trackingEnabled: false,
        analytics: true
      },
      language: 'en',
      timezone: 'UTC'
    });
  };

  const ToggleSwitch = ({ checked, onChange, label }) => (
    <div className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition-colors">
      <span className="text-sm font-medium text-gray-700">{label}</span>
      <label className="relative inline-flex items-center cursor-pointer">
        <input
          type="checkbox"
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
          className="sr-only peer"
        />
        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-gradient-to-r peer-checked:from-blue-600 peer-checked:to-purple-600"></div>
      </label>
    </div>
  );

  return (
    <div className="section bg-gradient-to-br from-blue-50 via-white to-purple-50 min-h-screen">
      <div className="mb-8 bg-white rounded-lg shadow-lg p-6 bg-gradient-to-r from-blue-50 to-purple-50">
        <h1 className="text-3xl font-serif font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Settings</h1>
        <p className="text-gray-600 mt-2">Customize your news experience</p>
      </div>

      {message && (
        <div className={`mb-6 p-4 rounded-lg shadow-md transition-all duration-300 ${
          message.includes('successfully') ? 'bg-gradient-to-r from-green-50 to-emerald-50 text-green-800 border border-green-200' : 'bg-gradient-to-r from-red-50 to-pink-50 text-red-800 border border-red-200'
        }`}>
          {message}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Settings */}
        <div className="lg:col-span-2 space-y-6">
          {/* Display Settings */}
          <div className="bg-white rounded-lg shadow-lg p-6 hover-lift transition-smooth border border-blue-100">
            <h2 className="text-xl font-serif font-semibold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">Display Settings</h2>
            <div className="space-y-4">
              <ToggleSwitch
                checked={settings.display.darkMode}
                onChange={(value) => handleDisplayChange('darkMode', value)}
                label="Dark Mode"
              />
              <ToggleSwitch
                checked={settings.display.compactView}
                onChange={(value) => handleDisplayChange('compactView', value)}
                label="Compact View"
              />
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-gray-700">Articles Per Page</label>
                <select
                  value={settings.display.articlesPerPage}
                  onChange={(e) => handleDisplayChange('articlesPerPage', parseInt(e.target.value))}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white transition-all duration-200 hover:border-blue-300"
                >
                  <option value={12}>12 articles</option>
                  <option value={24}>24 articles</option>
                  <option value={36}>36 articles</option>
                  <option value={48}>48 articles</option>
                </select>
              </div>
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-gray-700">Font Size</label>
                <select
                  value={settings.display.fontSize}
                  onChange={(e) => handleDisplayChange('fontSize', e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white transition-all duration-200 hover:border-blue-300"
                >
                  <option value="small">Small</option>
                  <option value="medium">Medium</option>
                  <option value="large">Large</option>
                </select>
              </div>
            </div>
          </div>

          {/* Notification Settings */}
          <div className="bg-white rounded-lg shadow-lg p-6 hover-lift transition-smooth border border-green-100">
            <h2 className="text-xl font-serif font-semibold bg-gradient-to-r from-green-600 to-teal-600 bg-clip-text text-transparent mb-4">Notification Settings</h2>
            <div className="space-y-4">
              <ToggleSwitch
                checked={settings.notifications.breaking}
                onChange={(value) => handleNotificationChange('breaking', value)}
                label="Breaking News Alerts"
              />
              <ToggleSwitch
                checked={settings.notifications.daily}
                onChange={(value) => handleNotificationChange('daily', value)}
                label="Daily Digest"
              />
              <ToggleSwitch
                checked={settings.notifications.weekly}
                onChange={(value) => handleNotificationChange('weekly', value)}
                label="Weekly Summary"
              />
              <ToggleSwitch
                checked={settings.notifications.email}
                onChange={(value) => handleNotificationChange('email', value)}
                label="Email Notifications"
              />
              <ToggleSwitch
                checked={settings.notifications.push}
                onChange={(value) => handleNotificationChange('push', value)}
                label="Push Notifications"
              />
            </div>
          </div>

          {/* Privacy Settings */}
          <div className="bg-white rounded-lg shadow-lg p-6 hover-lift transition-smooth border border-orange-100">
            <h2 className="text-xl font-serif font-semibold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent mb-4">Privacy Settings</h2>
            <div className="space-y-4">
              <ToggleSwitch
                checked={settings.privacy.profileVisible}
                onChange={(value) => handlePrivacyChange('profileVisible', value)}
                label="Public Profile"
              />
              <ToggleSwitch
                checked={settings.privacy.trackingEnabled}
                onChange={(value) => handlePrivacyChange('trackingEnabled', value)}
                label="Allow Tracking"
              />
              <ToggleSwitch
                checked={settings.privacy.analytics}
                onChange={(value) => handlePrivacyChange('analytics', value)}
                label="Analytics & Insights"
              />
            </div>
          </div>

          {/* Language & Region */}
          <div className="bg-white rounded-lg shadow-lg p-6 hover-lift transition-smooth border border-purple-100">
            <h2 className="text-xl font-serif font-semibold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-4">Language & Region</h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-gray-700">Language</label>
                <select
                  value={settings.language}
                  onChange={(e) => handleSettingChange('language', e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white transition-all duration-200 hover:border-blue-300"
                >
                  <option value="en">English</option>
                  <option value="es">Spanish</option>
                  <option value="fr">French</option>
                  <option value="de">German</option>
                  <option value="it">Italian</option>
                  <option value="pt">Portuguese</option>
                </select>
              </div>
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-gray-700">Timezone</label>
                <select
                  value={settings.timezone}
                  onChange={(e) => handleSettingChange('timezone', e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white transition-all duration-200 hover:border-blue-300"
                >
                  <option value="UTC">UTC</option>
                  <option value="EST">Eastern Time</option>
                  <option value="PST">Pacific Time</option>
                  <option value="GMT">GMT</option>
                  <option value="CET">Central European Time</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Settings Summary */}
        <div className="space-y-6">
          <div className="bg-white rounded-lg shadow-lg p-6 hover-lift transition-smooth border border-indigo-100">
            <h2 className="text-xl font-serif font-semibold bg-gradient-to-r from-indigo-600 to-blue-600 bg-clip-text text-transparent mb-4">Current Settings</h2>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Dark Mode:</span>
                <span className="font-medium">{settings.display.darkMode ? 'On' : 'Off'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Articles Per Page:</span>
                <span className="font-medium">{settings.display.articlesPerPage}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Font Size:</span>
                <span className="font-medium capitalize">{settings.display.fontSize}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Breaking News:</span>
                <span className="font-medium">{settings.notifications.breaking ? 'On' : 'Off'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Daily Digest:</span>
                <span className="font-medium">{settings.notifications.daily ? 'On' : 'Off'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Language:</span>
                <span className="font-medium">{settings.language.toUpperCase()}</span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3">
            <button
              onClick={saveSettings}
              disabled={loading}
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 px-6 rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:transform-none shadow-lg"
            >
              {loading ? 'Saving...' : 'Save Settings'}
            </button>
            <button
              onClick={resetSettings}
              className="w-full bg-gradient-to-r from-gray-200 to-gray-300 text-gray-700 py-3 px-6 rounded-lg hover:from-gray-300 hover:to-gray-400 transition-all duration-300 transform hover:scale-105 shadow-lg"
            >
              Reset to Default
            </button>
          </div>

          {/* Data Management */}
          <div className="bg-white rounded-lg shadow-lg p-6 hover-lift transition-smooth border border-red-100">
            <h2 className="text-xl font-serif font-semibold bg-gradient-to-r from-red-600 to-pink-600 bg-clip-text text-transparent mb-4">Data Management</h2>
            <div className="space-y-3">
              <button className="w-full text-left text-sm text-gray-600 hover:text-blue-600 transition-colors">
                Export My Data
              </button>
              <button className="w-full text-left text-sm text-gray-600 hover:text-blue-600 transition-colors">
                Clear Reading History
              </button>
              <button className="w-full text-left text-sm text-red-600 hover:text-red-700 transition-colors">
                Delete Account
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
