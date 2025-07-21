import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Container,
  Typography,
  Box,
  Card,
  CardContent,
  CardActions,
  Button,
  IconButton,
  TextField,
  Stack,
  Divider,
  Alert,
  CircularProgress,
  Paper
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import { 
  FlashcardCollection as IFlashcardCollection, 
  Flashcard,
  getFlashcardCollection,
  addFlashcard,
  deleteFlashcard as deleteFlashcardService,
  updateFlashcard
} from '../services/flashcardService';
import EditFlashcard from './EditFlashcard';

const FlashcardCollection: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [collection, setCollection] = useState<IFlashcardCollection | null>(null);
  const [newWord, setNewWord] = useState('');
  const [newMeaning, setNewMeaning] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [editingFlashcard, setEditingFlashcard] = useState<Flashcard | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const fetchCollection = async () => {
    if (!id) return;
    
    try {
      const data = await getFlashcardCollection(parseInt(id));
      setCollection(data);
      setError(null);
    } catch (err: any) {
      setError(err.message || 'Failed to load flashcard collection');
      console.error('Error loading collection:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      fetchCollection();
    }
  }, [id]);

  const handleAddFlashcard = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id) return;

    setIsSubmitting(true);
    try {
      await addFlashcard(parseInt(id), newWord, newMeaning);
      setNewWord('');
      setNewMeaning('');
      setError(null);
      fetchCollection();
    } catch (err: any) {
      setError(err.message || 'Failed to add flashcard');
      console.error('Error adding flashcard:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteFlashcard = async (flashcardId: number) => {
    if (!id) return;

    if (window.confirm('Are you sure you want to delete this flashcard?')) {
      try {
        await deleteFlashcardService(parseInt(id), flashcardId);
        setError(null);
        fetchCollection();
      } catch (err: any) {
        setError(err.message || 'Failed to delete flashcard');
        console.error('Error deleting flashcard:', err);
      }
    }
  };

  const handleEditFlashcard = (flashcard: Flashcard) => {
    setEditingFlashcard(flashcard);
  };

  const handleUpdateFlashcard = async (updatedFlashcard: Flashcard) => {
    try {
      await updateFlashcard(updatedFlashcard.id, updatedFlashcard.word, updatedFlashcard.meaning);
      setError(null);
      fetchCollection();
    } catch (err: any) {
      setError(err.message || 'Failed to update flashcard');
      console.error('Error updating flashcard:', err);
    }
  };

  if (isLoading) {
    return (
      <Container>
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  if (error) {
    return (
      <Container>
        <Alert severity="error" sx={{ mt: 4 }}>
          {error}
        </Alert>
        <Button
          variant="outlined"
          onClick={() => navigate('/flashcards')}
          sx={{ mt: 2 }}
        >
          Back to Collections
        </Button>
      </Container>
    );
  }

  if (!collection) {
    return (
      <Container>
        <Alert severity="warning" sx={{ mt: 4 }}>
          Collection not found
        </Alert>
        <Button
          variant="outlined"
          onClick={() => navigate('/flashcards')}
          sx={{ mt: 2 }}
        >
          Back to Collections
        </Button>
      </Container>
    );
  }

  return (
    <Container>
      <Box sx={{ mt: 4, mb: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h4" component="h1">
            {collection.name}
          </Typography>
          <Button
            variant="outlined"
            onClick={() => navigate('/flashcards')}
          >
            Back to Collections
          </Button>
        </Box>

        <Box component="form" onSubmit={handleAddFlashcard} sx={{ mb: 4 }}>
          <Typography variant="h6" sx={{ mb: 2 }}>Add New Flashcard</Typography>
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
            <TextField
              label="Word"
              value={newWord}
              onChange={(e) => setNewWord(e.target.value)}
              fullWidth
              required
              disabled={isSubmitting}
              error={!!error}
            />
            <TextField
              label="Meaning"
              value={newMeaning}
              onChange={(e) => setNewMeaning(e.target.value)}
              fullWidth
              required
              disabled={isSubmitting}
              error={!!error}
            />
            <Button
              type="submit"
              variant="contained"
              color="primary"
              disabled={isSubmitting || !newWord.trim() || !newMeaning.trim()}
              sx={{ minWidth: { xs: '100%', sm: '200px' } }}
            >
              {isSubmitting ? <CircularProgress size={24} /> : 'Add'}
            </Button>
          </Stack>
          {error && (
            <Alert severity="error" sx={{ mt: 2 }}>
              {error}
            </Alert>
          )}
        </Box>

        <Divider sx={{ mb: 4 }} />

        <Typography variant="h6" sx={{ mb: 2 }}>Flashcards</Typography>
        
        {collection.flashcards.length === 0 ? (
          <Alert severity="info">
            No flashcards yet. Add your first flashcard above!
          </Alert>
        ) : (
          <Box sx={{ 
            display: 'grid',
            gap: 2,
            gridTemplateColumns: {
              xs: '1fr',
              sm: 'repeat(2, 1fr)',
              md: 'repeat(3, 1fr)'
            }
          }}>
            {collection.flashcards.map((flashcard) => (
              <Card key={flashcard.id}>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    {flashcard.word}
                  </Typography>
                  <Typography variant="body1" color="text.secondary">
                    {flashcard.meaning}
                  </Typography>
                </CardContent>
                <CardActions sx={{ justifyContent: 'flex-end' }}>
                  <IconButton
                    size="small"
                    onClick={() => handleEditFlashcard(flashcard)}
                    aria-label="edit flashcard"
                  >
                    <EditIcon />
                  </IconButton>
                  <IconButton
                    size="small"
                    color="error"
                    onClick={() => handleDeleteFlashcard(flashcard.id)}
                    aria-label="delete flashcard"
                  >
                    <DeleteIcon />
                  </IconButton>
                </CardActions>
              </Card>
            ))}
          </Box>
        )}
      </Box>

      {editingFlashcard && (
        <EditFlashcard
          open={true}
          onClose={() => setEditingFlashcard(null)}
          flashcard={editingFlashcard}
          collectionId={parseInt(id!)}
          onUpdate={handleUpdateFlashcard}
        />
      )}
    </Container>
  );
};

export default FlashcardCollection; 