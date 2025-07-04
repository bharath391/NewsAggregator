import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './contexts/AuthContext';
import Navbar from './components/Navbar';
import AuthModal from './components/AuthModal';
import Home from './pages/Home';
import Categories from './pages/Categories';
import Bookmarks from './pages/Bookmarks';
import Search from './pages/Search';
import Profile from './pages/Profile';
import Settings from './pages/Settings';
import Trending from './pages/Trending';
import Headlines from './pages/Headlines';
import MyFeed from './pages/MyFeed';
import Analytics from './pages/Analytics';

function App() {
  const { user, loading } = useAuth();
  const [showAuthModal, setShowAuthModal] = useState(false);

  useEffect(() => {
    if (!loading && !user) {
      setShowAuthModal(true);
    }
  }, [user, loading]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600 font-body">Loading your personalized news...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 font-body">
      <Navbar />
      
      {showAuthModal && !user && (
        <AuthModal onClose={() => setShowAuthModal(false)} />
      )}

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Routes>
          <Route path="/" element={user ? <Home /> : <Navigate to="/login" />} />
          <Route path="/trending" element={user ? <Trending /> : <Navigate to="/login" />} />
          <Route path="/headlines" element={user ? <Headlines /> : <Navigate to="/login" />} />
          <Route path="/my-feed" element={user ? <MyFeed /> : <Navigate to="/login" />} />
          <Route path="/categories" element={user ? <Categories /> : <Navigate to="/login" />} />
          <Route path="/bookmarks" element={user ? <Bookmarks /> : <Navigate to="/login" />} />
          <Route path="/search" element={user ? <Search /> : <Navigate to="/login" />} />
          <Route path="/analytics" element={user ? <Analytics /> : <Navigate to="/login" />} />
          <Route path="/profile" element={user ? <Profile /> : <Navigate to="/login" />} />
          <Route path="/settings" element={user ? <Settings /> : <Navigate to="/login" />} />
          <Route path="/login" element={!user ? <div></div> : <Navigate to="/" />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
