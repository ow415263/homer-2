import React from 'react';
import { Box, Container, Typography } from '@mui/material';
import ConstructionIcon from '@mui/icons-material/Construction';
import { keyframes } from '@emotion/react';

const bobbing = keyframes`
    0% { transform: translateY(0) rotate(-6deg); }
    50% { transform: translateY(-10px) rotate(6deg); }
    100% { transform: translateY(0) rotate(-6deg); }
`;

const Home = () => {
    return (
        <Container
            maxWidth="md"
            sx={{
                minHeight: '100vh',
                display: 'flex',
                alignItems: 'flex-start',
                justifyContent: 'flex-start',
                textAlign: 'center',
                pt: 4.5
            }}
        >
            <Box
                sx={{
                    p: 4,
                    width: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center'
                }}
            >
                <Typography
                    variant="h4"
                    color="text.secondary"
                    fontWeight="bold"
                    sx={{ width: '100%', textAlign: 'center', mb: 2 }}
                >
                    Under construction
                </Typography>
                <ConstructionIcon
                    sx={{
                        fontSize: 160,
                        color: 'primary.main',
                        animation: `${bobbing} 2.5s ease-in-out infinite`
                    }}
                />
            </Box>
        </Container>
    );
};

export default Home;
