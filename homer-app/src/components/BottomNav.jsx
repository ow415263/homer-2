import React from 'react';
import { Paper, BottomNavigation, BottomNavigationAction, Box, useMediaQuery, useTheme } from '@mui/material';
import HomeIcon from '@mui/icons-material/Home';
import CardGiftcardIcon from '@mui/icons-material/CardGiftcard';
import SwapHorizIcon from '@mui/icons-material/SwapHoriz';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';

const BottomNav = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const theme = useTheme();
    const isLgUp = useMediaQuery(theme.breakpoints.up('lg'));
    const isXlUp = useMediaQuery(theme.breakpoints.up('xl'));

    const navShift = isXlUp ? 160 : isLgUp ? 80 : 40;
    const navWidth = isXlUp ? 520 : isLgUp ? 420 : 360;

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

    const surfaceColor = '#FFFFFF';
    return (
        <Paper
            sx={{
                position: 'fixed',
                bottom: { xs: 12, md: 20 },
                left: { xs: 16, md: '50%' },
                right: { xs: 88, md: 'auto' },
                transform: {
                    xs: 'none',
                    md: `translateX(calc(-50% - ${navShift}px))`,
                },
                zIndex: 1000,
                borderRadius: 999,
                overflow: 'hidden',
                minWidth: { md: navWidth },
                maxWidth: { xs: 'none', md: navWidth },
                backgroundColor: surfaceColor,
                backdropFilter: 'blur(22px) saturate(160%)',
                WebkitBackdropFilter: 'blur(22px) saturate(160%)',
                border: '1px solid rgba(15, 23, 42, 0.15)',
                boxShadow: 'none'
            }}
            elevation={0}
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
                        px: 0.5,
                        boxSizing: 'border-box',
                    }}
                >
                    <Box sx={{
                        width: '100%',
                        height: '100%',
                        borderRadius: 4,
                        backgroundColor: '#FFFFFF',
                        boxShadow: '0 6px 16px rgba(15, 23, 42, 0.12)',
                        border: '1px solid rgba(255,255,255,0.65)'
                    }} />
                </Box>

                <BottomNavigation
                    showLabels
                    value={value}
                    onChange={handleChange}
                    sx={{
                        bgcolor: 'transparent',
                        height: { xs: 56, md: 64 },
                        position: 'relative',
                        zIndex: 1,
                        '& .MuiBottomNavigationAction-label': {
                            fontWeight: 600,
                            fontSize: 12,
                            display: { xs: 'none', sm: 'block' }
                        }
                    }}
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
                                mx: { xs: 0.25, md: 0.5 },
                                transition: 'color 0.3s ease',
                                color: 'rgba(15, 23, 42, 0.6)',
                                minWidth: { xs: 56, md: 80 },
                                py: { xs: 0, md: 0.5 },
                                '& .MuiSvgIcon-root': {
                                    fontSize: { xs: '1.5rem', md: '1.75rem' }
                                },
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
