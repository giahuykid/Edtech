// src/pages/HomePage.tsx
import React from 'react';
import {
    Box,
    Typography,
    Button,
    Card,
    CardContent,
    useTheme,
    Paper,
    Container
} from '@mui/material';
import {
    Quiz as QuizIcon,
    Collections as FlashcardIcon,
    Description as FileIcon,
    School as SchoolIcon,
    TrendingUp as ProgressIcon,
    AutoStories as LearnIcon
} from '@mui/icons-material';
import { Link } from 'react-router-dom';

const HomePage = () => {
    const theme = useTheme();

    const features = [
        {
            icon: <QuizIcon sx={{ fontSize: 40 }} />,
            title: 'Interactive Quizzes',
            description: 'Create and take quizzes to test your knowledge across different programming languages.',
            path: '/mocks'
        },
        {
            icon: <FlashcardIcon sx={{ fontSize: 40 }} />,
            title: 'Flashcards',
            description: 'Study efficiently with customizable flashcards for quick learning and revision.',
            path: '/flashcards'
        },
        {
            icon: <FileIcon sx={{ fontSize: 40 }} />,
            title: 'Learning Resources',
            description: 'Access and manage your study materials in one centralized location.',
            path: '/files'
        }
    ];

    return (
        <Box>
            {/* Hero Section */}
            <Paper
                sx={{
                    bgcolor: 'primary.main',
                    color: 'primary.contrastText',
                    borderRadius: 0,
                    py: { xs: 8, md: 12 },
                    mb: 6,
                    position: 'relative',
                    overflow: 'hidden'
                }}
            >
                <Container maxWidth="lg">
                    <Box sx={{
                        display: 'flex',
                        flexDirection: { xs: 'column', md: 'row' },
                        alignItems: 'center',
                        gap: 4
                    }}>
                        <Box sx={{ flex: 1, zIndex: 1 }}>
                            <SchoolIcon sx={{ fontSize: 48, mb: 2 }} />
                            <Typography variant="h2" sx={{ mb: 2, fontWeight: 600 }}>
                                Learn Programming
                                <br />
                                The Smart Way
                            </Typography>
                            <Typography variant="h6" sx={{ mb: 4, opacity: 0.9 }}>
                                Master coding concepts through interactive learning tools and structured practice
                            </Typography>
                            <Button
                                component={Link}
                                to="/mocks"
                                variant="contained"
                                size="large"
                                sx={{
                                    bgcolor: 'white',
                                    color: 'primary.main',
                                    '&:hover': {
                                        bgcolor: 'grey.100'
                                    }
                                }}
                            >
                                Get Started
                            </Button>
                        </Box>
                        <Box sx={{
                            flex: 1,
                            display: { xs: 'none', md: 'flex' },
                            justifyContent: 'center'
                        }}>
                            <LearnIcon sx={{ fontSize: 300, opacity: 0.2, position: 'absolute' }} />
                        </Box>
                    </Box>
                </Container>
            </Paper>

            {/* Features Section */}
            <Container maxWidth="lg">
                <Box sx={{ mb: 8 }}>
                    <Typography
                        variant="h4"
                        align="center"
                        gutterBottom
                        sx={{ mb: 6, fontWeight: 500 }}
                    >
                        Everything you need to succeed
                    </Typography>

                    <Box sx={{
                        display: 'flex',
                        flexWrap: 'wrap',
                        gap: 3,
                        justifyContent: 'center'
                    }}>
                        {features.map((feature, index) => (
                            <Card
                                key={index}
                                component={Link}
                                to={feature.path}
                                sx={{
                                    width: { xs: '100%', sm: 'calc(50% - 12px)', md: 'calc(33.333% - 16px)' },
                                    textDecoration: 'none',
                                    transition: 'all 0.3s ease',
                                    '&:hover': {
                                        transform: 'translateY(-8px)',
                                        boxShadow: theme.shadows[4]
                                    }
                                }}
                            >
                                <CardContent sx={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                    textAlign: 'center',
                                    p: 4
                                }}>
                                    <Box sx={{
                                        mb: 2,
                                        color: 'primary.main',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center'
                                    }}>
                                        {feature.icon}
                                    </Box>
                                    <Typography
                                        variant="h6"
                                        component="h3"
                                        gutterBottom
                                        sx={{ color: 'text.primary' }}
                                    >
                                        {feature.title}
                                    </Typography>
                                    <Typography
                                        variant="body1"
                                        color="text.secondary"
                                    >
                                        {feature.description}
                                    </Typography>
                                </CardContent>
                            </Card>
                        ))}
                    </Box>
                </Box>

                {/* Stats Section */}
                <Box sx={{
                    bgcolor: 'background.paper',
                    borderRadius: 2,
                    p: 4,
                    mb: 8,
                    display: 'flex',
                    flexWrap: 'wrap',
                    gap: 4,
                    justifyContent: 'center',
                    alignItems: 'center'
                }}>
                    <Box sx={{ textAlign: 'center', flex: 1 }}>
                        <ProgressIcon sx={{ fontSize: 40, color: 'primary.main', mb: 1 }} />
                        <Typography variant="h4" sx={{ fontWeight: 600 }}>1000+</Typography>
                        <Typography color="text.secondary">Practice Questions</Typography>
                    </Box>
                    <Box sx={{ textAlign: 'center', flex: 1 }}>
                        <LearnIcon sx={{ fontSize: 40, color: 'primary.main', mb: 1 }} />
                        <Typography variant="h4" sx={{ fontWeight: 600 }}>10+</Typography>
                        <Typography color="text.secondary">Programming Languages</Typography>
                    </Box>
                </Box>
            </Container>
        </Box>
    );
};

export default HomePage;