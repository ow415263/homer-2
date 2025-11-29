import React from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { Box } from '@mui/material';
import BottomNav from './components/BottomNav';
import Home from './pages/Home';
import Exchange from './pages/Exchange';
import Profile from './pages/Profile';
import Cards from './pages/Cards';
import Login from './pages/Login';
import Header from './components/Header';
import ChatButton from './components/ChatButton';
import ProtectedRoute from './components/ProtectedRoute';
import { LayoutProvider, useLayout } from './context/LayoutContext';
import { useAuth } from './context/AuthContext';

const AppContent = () => {
  const { isFullscreen } = useLayout();
  const { user } = useAuth();
  const location = useLocation();
  const isProfilePage = location.pathname === '/profile';

  return (
    <Box sx={{
      width: '100%',
      px: isFullscreen ? 0 : 2.5, // Remove padding in fullscreen
      pt: isFullscreen ? 0 : 10, // Remove top padding in fullscreen
      pb: isFullscreen ? 0 : 12, // Remove bottom padding in fullscreen
      minHeight: '100vh',
      boxSizing: 'border-box',
      overflowX: 'hidden'
    }}>
      {!isFullscreen && user && <Header />}
      {!isFullscreen && !isProfilePage && user && <BottomNav />}
      {!isFullscreen && !isProfilePage && user && <ChatButton />}
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/" element={
          <ProtectedRoute>
            <Home />
          </ProtectedRoute>
        } />
        <Route path="/cards" element={
          <ProtectedRoute>
            <Cards />
          </ProtectedRoute>
        } />
        <Route path="/exchange" element={
          <ProtectedRoute>
            <Exchange />
          </ProtectedRoute>
        } />
        <Route path="/profile" element={
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        } />
      </Routes>
    </Box>
  );
};

function App() {
  return (
    <LayoutProvider>
      <AppContent />
    </LayoutProvider>
  );
}

export default App;
