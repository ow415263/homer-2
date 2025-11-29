import React, { useState } from 'react';
import { Box, Typography, Tabs, Tab, Card, CardMedia, CardContent, CardActionArea, Chip } from '@mui/material';
import { phygitalCards, eCardThemes } from '../data/mockData';

const Cards = () => {
    const [tabValue, setTabValue] = useState(0);
    const [selectedCategory, setSelectedCategory] = useState('all');

    const handleTabChange = (event, newValue) => {
        setTabValue(newValue);
        setSelectedCategory('all'); // Reset category when switching tabs
    };

    const handleCategoryChange = (category) => {
        setSelectedCategory(category);
    };

    // Categories for Phygital Cards
    const phygitalCategories = [
        { id: 'all', label: 'All' },
        { id: 'collectable', label: 'Collectable' },
        { id: 'christmas', label: 'Christmas' },
        { id: 'travel', label: 'Travel' },
        { id: 'birthday', label: 'Birthday' },
        { id: 'limited', label: 'Limited Edition' },
    ];

    // Categories for E-Cards
    const eCardCategories = [
        { id: 'all', label: 'All' },
        { id: 'celebration', label: 'Celebration' },
        { id: 'holiday', label: 'Holiday' },
        { id: 'nature', label: 'Nature' },
        { id: 'abstract', label: 'Abstract' },
        { id: 'love', label: 'Love & Romance' },
        { id: 'seasonal', label: 'Seasonal' },
    ];

    // Mock data for different card collections
    const collectableCards = [
        { id: 1, title: 'Vintage Paris', image: 'https://picsum.photos/seed/collect1/300/200', price: '$12.99', category: 'collectable' },
        { id: 2, title: 'Tokyo Nights', image: 'https://picsum.photos/seed/collect2/300/200', price: '$12.99', category: 'collectable' },
        { id: 3, title: 'NYC Skyline', image: 'https://picsum.photos/seed/collect3/300/200', price: '$14.99', category: 'collectable' },
        { id: 4, title: 'London Bridge', image: 'https://picsum.photos/seed/collect4/300/200', price: '$12.99', category: 'collectable' },
    ];

    const christmasCards = [
        { id: 1, title: 'Winter Wonderland', image: 'https://picsum.photos/seed/xmas1/300/200', price: '$9.99', category: 'christmas' },
        { id: 2, title: 'Santa\'s Workshop', image: 'https://picsum.photos/seed/xmas2/300/200', price: '$9.99', category: 'christmas' },
        { id: 3, title: 'Snowy Village', image: 'https://picsum.photos/seed/xmas3/300/200', price: '$10.99', category: 'christmas' },
        { id: 4, title: 'Holiday Lights', image: 'https://picsum.photos/seed/xmas4/300/200', price: '$9.99', category: 'christmas' },
    ];

    const travelCards = [
        { id: 1, title: 'Beach Sunset', image: 'https://picsum.photos/seed/travel1/300/200', price: '$11.99', category: 'travel' },
        { id: 2, title: 'Mountain Peak', image: 'https://picsum.photos/seed/travel2/300/200', price: '$11.99', category: 'travel' },
        { id: 3, title: 'Desert Oasis', image: 'https://picsum.photos/seed/travel3/300/200', price: '$12.99', category: 'travel' },
        { id: 4, title: 'City Lights', image: 'https://picsum.photos/seed/travel4/300/200', price: '$11.99', category: 'travel' },
    ];

    const birthdayCards = [
        { id: 1, title: 'Celebration', image: 'https://picsum.photos/seed/bday1/300/200', price: '$8.99', category: 'birthday' },
        { id: 2, title: 'Party Time', image: 'https://picsum.photos/seed/bday2/300/200', price: '$8.99', category: 'birthday' },
        { id: 3, title: 'Balloons', image: 'https://picsum.photos/seed/bday3/300/200', price: '$9.99', category: 'birthday' },
        { id: 4, title: 'Cake & Candles', image: 'https://picsum.photos/seed/bday4/300/200', price: '$8.99', category: 'birthday' },
    ];

    const limitedEditionCards = [
        { id: 1, title: 'Gold Edition', image: 'https://picsum.photos/seed/limited1/300/200', price: '$24.99', category: 'limited' },
        { id: 2, title: 'Artist Series #1', image: 'https://picsum.photos/seed/limited2/300/200', price: '$29.99', category: 'limited' },
        { id: 3, title: 'Platinum', image: 'https://picsum.photos/seed/limited3/300/200', price: '$34.99', category: 'limited' },
        { id: 4, title: 'Signature', image: 'https://picsum.photos/seed/limited4/300/200', price: '$27.99', category: 'limited' },
    ];

    // E-Card themes with categories
    const eCardThemesData = [
        // Celebration
        { id: 1, title: 'Birthday Bash', image: 'https://picsum.photos/seed/ecard1/300/200', category: 'celebration' },
        { id: 2, title: 'Graduation', image: 'https://picsum.photos/seed/ecard2/300/200', category: 'celebration' },
        { id: 3, title: 'Congratulations', image: 'https://picsum.photos/seed/ecard3/300/200', category: 'celebration' },
        { id: 4, title: 'New Baby', image: 'https://picsum.photos/seed/ecard4/300/200', category: 'celebration' },
        { id: 5, title: 'Anniversary', image: 'https://picsum.photos/seed/ecard5/300/200', category: 'celebration' },

        // Holiday
        { id: 6, title: 'Christmas Joy', image: 'https://picsum.photos/seed/ecard6/300/200', category: 'holiday' },
        { id: 7, title: 'Happy New Year', image: 'https://picsum.photos/seed/ecard7/300/200', category: 'holiday' },
        { id: 8, title: 'Easter Wishes', image: 'https://picsum.photos/seed/ecard8/300/200', category: 'holiday' },
        { id: 9, title: 'Halloween Fun', image: 'https://picsum.photos/seed/ecard9/300/200', category: 'holiday' },
        { id: 10, title: 'Thanksgiving', image: 'https://picsum.photos/seed/ecard10/300/200', category: 'holiday' },

        // Nature
        { id: 11, title: 'Ocean Breeze', image: 'https://picsum.photos/seed/ecard11/300/200', category: 'nature' },
        { id: 12, title: 'Mountain Vista', image: 'https://picsum.photos/seed/ecard12/300/200', category: 'nature' },
        { id: 13, title: 'Forest Path', image: 'https://picsum.photos/seed/ecard13/300/200', category: 'nature' },
        { id: 14, title: 'Sunset Sky', image: 'https://picsum.photos/seed/ecard14/300/200', category: 'nature' },
        { id: 15, title: 'Flower Garden', image: 'https://picsum.photos/seed/ecard15/300/200', category: 'nature' },

        // Abstract
        { id: 16, title: 'Geometric Dreams', image: 'https://picsum.photos/seed/ecard16/300/200', category: 'abstract' },
        { id: 17, title: 'Color Splash', image: 'https://picsum.photos/seed/ecard17/300/200', category: 'abstract' },
        { id: 18, title: 'Minimalist', image: 'https://picsum.photos/seed/ecard18/300/200', category: 'abstract' },
        { id: 19, title: 'Watercolor', image: 'https://picsum.photos/seed/ecard19/300/200', category: 'abstract' },
        { id: 20, title: 'Modern Art', image: 'https://picsum.photos/seed/ecard20/300/200', category: 'abstract' },

        // Love & Romance
        { id: 21, title: 'Valentine\'s Day', image: 'https://picsum.photos/seed/ecard21/300/200', category: 'love' },
        { id: 22, title: 'Love Letter', image: 'https://picsum.photos/seed/ecard22/300/200', category: 'love' },
        { id: 23, title: 'Romance', image: 'https://picsum.photos/seed/ecard23/300/200', category: 'love' },
        { id: 24, title: 'Just Because', image: 'https://picsum.photos/seed/ecard24/300/200', category: 'love' },
        { id: 25, title: 'Thinking of You', image: 'https://picsum.photos/seed/ecard25/300/200', category: 'love' },

        // Seasonal
        { id: 26, title: 'Spring Blooms', image: 'https://picsum.photos/seed/ecard26/300/200', category: 'seasonal' },
        { id: 27, title: 'Summer Vibes', image: 'https://picsum.photos/seed/ecard27/300/200', category: 'seasonal' },
        { id: 28, title: 'Autumn Leaves', image: 'https://picsum.photos/seed/ecard28/300/200', category: 'seasonal' },
        { id: 29, title: 'Winter Snow', image: 'https://picsum.photos/seed/ecard29/300/200', category: 'seasonal' },
        { id: 30, title: 'First Day of Spring', image: 'https://picsum.photos/seed/ecard30/300/200', category: 'seasonal' },
    ];

    // Combine all cards
    const allPhygitalCards = [...collectableCards, ...christmasCards, ...travelCards, ...birthdayCards, ...limitedEditionCards];

    // Filter cards based on selected category
    const getFilteredCards = () => {
        if (selectedCategory === 'all') {
            return allPhygitalCards;
        }
        return allPhygitalCards.filter(card => card.category === selectedCategory);
    };

    // Filter e-cards based on selected category
    const getFilteredECards = () => {
        if (selectedCategory === 'all') {
            return eCardThemesData;
        }
        return eCardThemesData.filter(card => card.category === selectedCategory);
    };

    const CardSection = ({ title, cards }) => (
        <Box sx={{ mb: 4 }}>
            <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold' }}>{title}</Typography>
            <Box sx={{
                display: 'flex',
                gap: 2,
                overflowX: 'auto',
                pb: 2,
                mr: -2.5, // Extend to right edge (counteract page padding)
                pr: 2.5, // Add padding back for last card
                '&::-webkit-scrollbar': {
                    display: 'none', // Hide scrollbar
                },
                scrollbarWidth: 'none', // Hide scrollbar for Firefox
                msOverflowStyle: 'none', // Hide scrollbar for IE/Edge
            }}>
                {cards.map((card) => (
                    <Card key={card.id} sx={{ minWidth: 180, maxWidth: 180, borderRadius: 2, boxShadow: 1, flexShrink: 0 }}>
                        <CardActionArea>
                            <CardMedia
                                component="img"
                                height="120"
                                image={card.image}
                                alt={card.title}
                            />
                            <CardContent sx={{ p: 1.5 }}>
                                <Typography variant="subtitle2" fontWeight="bold" noWrap>{card.title}</Typography>
                                {card.price && <Typography variant="body2" color="text.secondary">{card.price}</Typography>}
                            </CardContent>
                        </CardActionArea>
                    </Card>
                ))}
            </Box>
        </Box>
    );

    return (
        <Box sx={{ pb: 8 }}>
            {/* Tabs */}
            <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 2 }}>
                <Tabs value={tabValue} onChange={handleTabChange} aria-label="cards tabs">
                    <Tab label="Phygital Cards" />
                    <Tab label="E-Cards" />
                </Tabs>
            </Box>

            {/* Category Filter Pills - Extended to right edge */}
            <Box sx={{
                mb: 3,
                display: 'flex',
                gap: 1,
                overflowX: 'auto',
                pb: 1,
                mr: -2.5, // Extend to right edge (counteract page padding)
                pr: 2.5, // Add padding back for content
                '&::-webkit-scrollbar': {
                    display: 'none', // Hide scrollbar
                },
                scrollbarWidth: 'none', // Hide scrollbar for Firefox
                msOverflowStyle: 'none', // Hide scrollbar for IE/Edge
            }}>
                {(tabValue === 0 ? phygitalCategories : eCardCategories).map((category) => (
                    <Chip
                        key={category.id}
                        label={category.label}
                        onClick={() => handleCategoryChange(category.id)}
                        color={selectedCategory === category.id ? 'primary' : 'default'}
                        variant={selectedCategory === category.id ? 'filled' : 'outlined'}
                        sx={{
                            fontWeight: selectedCategory === category.id ? 'bold' : 'normal',
                            cursor: 'pointer',
                            flexShrink: 0,
                        }}
                    />
                ))}
            </Box>

            {/* Phygital Cards Section */}
            <Box role="tabpanel" hidden={tabValue !== 0}>
                {tabValue === 0 && (
                    <Box>
                        {selectedCategory === 'all' ? (
                            <>
                                <CardSection title="Collectable Cards" cards={collectableCards} />
                                <CardSection title="Christmas Cards" cards={christmasCards} />
                                <CardSection title="Travel Cards" cards={travelCards} />
                                <CardSection title="Birthday Cards" cards={birthdayCards} />
                                <CardSection title="Limited Edition Cards" cards={limitedEditionCards} />
                            </>
                        ) : (
                            <CardSection title={phygitalCategories.find(c => c.id === selectedCategory)?.label || 'Cards'} cards={getFilteredCards()} />
                        )}
                    </Box>
                )}
            </Box>

            {/* E-Cards Section */}
            <Box role="tabpanel" hidden={tabValue !== 1}>
                {tabValue === 1 && (
                    <Box>
                        {selectedCategory === 'all' ? (
                            <>
                                <CardSection title="Celebration" cards={eCardThemesData.filter(c => c.category === 'celebration')} />
                                <CardSection title="Holiday" cards={eCardThemesData.filter(c => c.category === 'holiday')} />
                                <CardSection title="Nature" cards={eCardThemesData.filter(c => c.category === 'nature')} />
                                <CardSection title="Abstract" cards={eCardThemesData.filter(c => c.category === 'abstract')} />
                                <CardSection title="Love & Romance" cards={eCardThemesData.filter(c => c.category === 'love')} />
                                <CardSection title="Seasonal" cards={eCardThemesData.filter(c => c.category === 'seasonal')} />
                            </>
                        ) : (
                            <CardSection title={eCardCategories.find(c => c.id === selectedCategory)?.label || 'E-Cards'} cards={getFilteredECards()} />
                        )}
                    </Box>
                )}
            </Box>
        </Box>
    );
};

export default Cards;
