// src/components/FlashcardCollectionList.tsx
import React, { useState, useEffect } from 'react';
import {
    Box,
    Typography,
    Button,
    Card,
    CardContent,
    CardActions,
    IconButton,
    Tooltip,
    CircularProgress,
    Alert,
    useTheme
} from '@mui/material';
import {
    Edit as EditIcon,
    Delete as DeleteIcon,
    Add as AddIcon,
    Collections as CollectionsIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import {
    getAllFlashcardCollections,
    deleteFlashcardCollection,
    type FlashcardCollection // Import the type from the service
} from '../services/flashcardService';

const FlashcardCollectionList = () => {
    const [collections, setCollections] = useState<FlashcardCollection[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const theme = useTheme();

    useEffect(() => {
        fetchCollections();
    }, []);

    const fetchCollections = async () => {
        try {
            const data = await getAllFlashcardCollections();
            setCollections(Array.isArray(data) ? data : []);
        } catch (err) {
            console.error('Error fetching collections:', err);
            setError('Failed to load collections');
            setCollections([]);
        } finally {
            setLoading(false);
        }
    };

    const handleCreateNew = () => {
        navigate('/create-flashcard');
    };

    const handleDelete = async (collectionId: number) => {
        try {
            await deleteFlashcardCollection(collectionId);
            setCollections(collections.filter(c => c.id !== collectionId));
        } catch (err) {
            setError('Failed to delete collection');
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
        <Box>
            <Box sx={{
                mb: 4,
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
            }}>
                <Typography variant="h4" fontWeight="500">
                    My Flashcard Collections
                </Typography>
                <Button
                    variant="contained"
                    startIcon={<AddIcon />}
                    onClick={handleCreateNew}
                    sx={{
                        bgcolor: theme.palette.secondary.main,
                        '&:hover': {
                            bgcolor: theme.palette.secondary.dark,
                        }
                    }}
                >
                    Create New Collection
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
                gap: 3
            }}>
                {collections.map((collection) => (
                    <Card
                        key={collection.id}
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
                        <CardContent sx={{ flexGrow: 1 }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                                <CollectionsIcon sx={{ mr: 1, color: 'primary.main' }} />
                                <Typography variant="h6">
                                    {collection.name}
                                </Typography>
                            </Box>
                            <Typography variant="body2" color="text.secondary">
                                {collection.flashcards?.length || 0} flashcards
                            </Typography>
                        </CardContent>
                        <CardActions sx={{ justifyContent: 'flex-end', p: 2 }}>
                            <Tooltip title="Study Collection">
                                <IconButton
                                    onClick={() => navigate(`/collection/${collection.id}`)}
                                    color="primary"
                                >
                                    <EditIcon />
                                </IconButton>
                            </Tooltip>
                            <Tooltip title="Delete Collection">
                                <IconButton
                                    onClick={() => handleDelete(collection.id)}
                                    color="error"
                                >
                                    <DeleteIcon />
                                </IconButton>
                            </Tooltip>
                        </CardActions>
                    </Card>
                ))}
            </Box>

            {collections.length === 0 && !loading && (
                <Box sx={{
                    textAlign: 'center',
                    py: 8,
                    color: 'text.secondary'
                }}>
                    <Typography variant="h6" gutterBottom>
                        No collections found
                    </Typography>
                    <Typography variant="body1">
                        Create your first flashcard collection to get started!
                    </Typography>
                </Box>
            )}
        </Box>
    );
};

export default FlashcardCollectionList;