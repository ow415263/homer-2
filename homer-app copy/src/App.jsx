import React from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { Box } from '@mui/material';
import BottomNav from './components/BottomNav';
import Home from './pages/Home';
import Exchange from './pages/Exchange';
import Profile from './pages/Profile';
import Cards from './pages/Cards';
import Header from './components/Header';
import ChatButton from './components/ChatButton';
import { LayoutProvider, useLayout } from './context/LayoutContext';

const AppContent = () => {
  const { isFullscreen } = useLayout();
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
      {!isFullscreen && <Header />}
      {!isFullscreen && !isProfilePage && <BottomNav />}
      {!isFullscreen && !isProfilePage && <ChatButton />}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/cards" element={<Cards />} />
        <Route path="/exchange" element={<Exchange />} />
        <Route path="/profile" element={<Profile />} />
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
