// src/components/QuizList.tsx
import React, { useEffect, useState } from 'react';
import {
    Box,
    Typography,
    Card,
    CardContent,
    CardActions,
    Button,
    Chip,
    IconButton,
    Tooltip,
    CircularProgress,
    Alert,
    useTheme
} from '@mui/material';
import {
    PlayArrow as PlayIcon,
    Delete as DeleteIcon,
    Edit as EditIcon,
    TrendingUp as ScoreIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { getAllMocks, deleteMock, MockDTO } from '../services/MockService';

const QuizList: React.FC = () => {
    const [mocks, setMocks] = useState<MockDTO[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const theme = useTheme();

    useEffect(() => {
        fetchMocks();
    }, []);

    const fetchMocks = async () => {
        try {
            const data = await getAllMocks();
            setMocks(Array.isArray(data) ? data : []);
        } catch (err: any) {
            console.error('Error fetching quizzes:', err);
            setError('Failed to load quizzes');
            setMocks([]); // Ensure mocks is always an array
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (mockId: number) => {
        try {
            await deleteMock(mockId);
            setMocks(mocks.filter(mock => mock.id !== mockId));
        } catch (err: any) {
            setError('Failed to delete quiz');
        }
    };

    if (loading) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
                <CircularProgress />
            </Box>
        );
    }

    return (
        <Box sx={{ maxWidth: '1200px', mx: 'auto', px: 3 }}>
            <Box sx={{
                mb: 4,
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
            }}>
                <Typography variant="h4" fontWeight="500">
                    My Quizzes
                </Typography>
                <Button
                    variant="contained"
                    onClick={() => navigate('/create-quiz')}
                    sx={{
                        backgroundColor: theme.palette.secondary.main,
                        '&:hover': {
                            backgroundColor: theme.palette.secondary.dark,
                        }
                    }}
                >
                    Create New Quiz
                </Button>
            </Box>

            {error && (
                <Alert severity="error" sx={{ mb: 3 }}>
                    {error}
                </Alert>
            )}

            <Box sx={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: 3,
                alignItems: 'stretch'
            }}>
                {mocks.map((mock) => (
                    <Card
                        key={mock.id}
                        sx={{
                            width: { xs: '100%', sm: 'calc(50% - 12px)', md: 'calc(33.333% - 16px)' },
                            display: 'flex',
                            flexDirection: 'column',
                            transition: 'all 0.3s ease',
                            '&:hover': {
                                transform: 'translateY(-4px)',
                                boxShadow: theme.shadows[4]
                            }
                        }}
                    >
                        <CardContent sx={{ flexGrow: 1, p: 3 }}>
                            <Typography
                                variant="h6"
                                gutterBottom
                                sx={{
                                    overflow: 'hidden',
                                    textOverflow: 'ellipsis',
                                    whiteSpace: 'nowrap'
                                }}
                            >
                                {mock.nameMock}
                            </Typography>
                            <Box sx={{ mb: 2 }}>
                                <Chip
                                    label={mock.languageName}
                                    color="primary"
                                    size="small"
                                    sx={{ mr: 1 }}
                                />
                                <Chip
                                    label={`${mock.numberOfQuestions} questions`}
                                    size="small"
                                    color="secondary"
                                />
                            </Box>
                            {mock.scores && mock.scores.length > 0 && (
                                <Box sx={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 1,
                                    mt: 2,
                                    p: 1,
                                    borderRadius: 1,
                                    bgcolor: 'rgba(25, 118, 210, 0.08)'
                                }}>
                                    <ScoreIcon color="primary" fontSize="small" />
                                    <Typography variant="body2">
                                        Best Score: {Math.max(...mock.scores.map(s => s.score))}%
                                    </Typography>
                                </Box>
                            )}
                        </CardContent>
                        <CardActions sx={{
                            justifyContent: 'space-between',
                            px: 2,
                            pb: 2,
                            borderTop: '1px solid',
                            borderColor: 'divider'
                        }}>
                            <Box sx={{ display: 'flex', gap: 1 }}>
                                <Tooltip title="Start Quiz">
                                    <IconButton
                                        onClick={() => navigate(`/quiz/${mock.id}`)}
                                        color="primary"
                                        size="small"
                                    >
                                        <PlayIcon />
                                    </IconButton>
                                </Tooltip>
                                <Tooltip title="Edit Quiz">
                                    <IconButton
                                        onClick={() => navigate(`/quiz/edit/${mock.id}`)}
                                        color="info"
                                        size="small"
                                    >
                                        <EditIcon />
                                    </IconButton>
                                </Tooltip>
                            </Box>
                            <Tooltip title="Delete Quiz">
                                <IconButton
                                    onClick={() => handleDelete(mock.id)}
                                    color="error"
                                    size="small"
                                >
                                    <DeleteIcon />
                                </IconButton>
                            </Tooltip>
                        </CardActions>
                    </Card>
                ))}
            </Box>

            {mocks.length === 0 && !loading && (
                <Box sx={{
                    textAlign: 'center',
                    py: 8,
                    color: 'text.secondary',
                    bgcolor: 'background.paper',
                    borderRadius: 2,
                    boxShadow: 1
                }}>
                    <Typography variant="h6" gutterBottom>
                        No quizzes found
                    </Typography>
                    <Typography variant="body1">
                        Create your first quiz to get started!
                    </Typography>
                </Box>
            )}
        </Box>
    );
};

export default QuizList;