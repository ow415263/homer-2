import React from 'react';
import { Paper, BottomNavigation, BottomNavigationAction, Box } from '@mui/material';
import HomeIcon from '@mui/icons-material/Home';
import CardGiftcardIcon from '@mui/icons-material/CardGiftcard';
import SwapHorizIcon from '@mui/icons-material/SwapHoriz';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';

const BottomNav = () => {
    const navigate = useNavigate();
    const location = useLocation();

    const getValue = (path) => {
        if (path === '/') return 0;
        if (path === '/cards') return 1;
        if (path === '/exchange') return 2;
        return 0;
    };

    const [value, setValue] = React.useState(getValue(location.pathname));

    React.useEffect(() => {
        setValue(getValue(location.pathname));
    }, [location.pathname]);

    const handleChange = (event, newValue) => {
        setValue(newValue);
        const routes = ['/', '/cards', '/exchange'];
        navigate(routes[newValue]);
    };

    return (
        <Paper
            sx={{
                position: 'fixed',
                bottom: 20,
                left: '50%',
                transform: 'translateX(calc(-50% - 40px))', // Shift left more to create space for chat button
                zIndex: 1000,
                borderRadius: 50,
                overflow: 'hidden',
                width: 'auto',
                minWidth: 360, // Increased width for longer tab labels
                maxWidth: '95%',
                backgroundColor: 'rgba(255, 255, 255, 0.8)',
                backdropFilter: 'blur(12px)',
                boxShadow: '0 4px 30px rgba(0, 0, 0, 0.1)',
                border: '1px solid rgba(255, 255, 255, 0.3)',
            }}
            elevation={4}
        >
            <Box sx={{ position: 'relative' }}>
                {/* Sliding Indicator */}
                <Box
                    component={motion.div}
                    animate={{ x: value * 100 + '%' }}
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    sx={{
                        position: 'absolute',
                        top: 4,
                        left: 0,
                        width: '33.33%', // 1/3 width for 3 tabs
                        height: 'calc(100% - 8px)',
                        zIndex: 0,
                        px: 0.5, // Padding for the inner box
                        boxSizing: 'border-box',
                    }}
                >
                    <Box sx={{
                        width: '100%',
                        height: '100%',
                        borderRadius: 4,
                        backgroundColor: 'rgba(255, 255, 255, 0.5)',
                        backdropFilter: 'blur(8px)',
                        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)',
                        border: '1px solid rgba(255, 255, 255, 0.4)',
                    }} />
                </Box>

                <BottomNavigation
                    showLabels
                    value={value}
                    onChange={handleChange}
                    sx={{ bgcolor: 'transparent', height: 64, position: 'relative', zIndex: 1 }}
                >
                    {[
                        { label: 'Home', icon: <HomeIcon /> },
                        { label: 'Cards', icon: <CardGiftcardIcon /> },
                        { label: 'Exchange', icon: <SwapHorizIcon /> },
                    ].map((action, index) => (
                        <BottomNavigationAction
                            key={index}
                            label={action.label}
                            icon={action.icon}
                            sx={{
                                borderRadius: 4,
                                mx: 0.5,
                                transition: 'color 0.3s ease',
                                color: 'text.secondary',
                                '&.Mui-selected': {
                                    color: 'primary.main',
                                },
                            }}
                        />
                    ))}
                </BottomNavigation>
            </Box>
        </Paper>
    );
};

export default BottomNav;
