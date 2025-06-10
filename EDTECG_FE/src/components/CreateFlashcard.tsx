import React, { useState } from 'react';
import { addFlashcard } from '../services/flashcardService';
import { Button, TextField, Box, Typography, Paper } from '@mui/material';

interface CreateFlashcardProps {
  collectionId: number;
  onFlashcardCreated: () => void;
}

const CreateFlashcard: React.FC<CreateFlashcardProps> = ({ collectionId, onFlashcardCreated }) => {
  const [word, setWord] = useState('');
  const [meaning, setMeaning] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      await addFlashcard(collectionId, word, meaning);
      setWord('');
      setMeaning('');
      onFlashcardCreated();
    } catch (err) {
      setError('Failed to create flashcard. Please try again.');
      console.error('Error creating flashcard:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Paper sx={{ p: 3, mb: 3 }}>
      <Typography variant="h6" gutterBottom>
        Add New Flashcard
      </Typography>
      <Box component="form" onSubmit={handleSubmit}>
        <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
          <TextField
            label="Word"
            value={word}
            onChange={(e) => setWord(e.target.value)}
            required
            fullWidth
            error={!!error}
            disabled={isSubmitting}
          />
          <TextField
            label="Meaning"
            value={meaning}
            onChange={(e) => setMeaning(e.target.value)}
            required
            fullWidth
            error={!!error}
            disabled={isSubmitting}
          />
        </Box>
        {error && (
          <Typography color="error" sx={{ mb: 2 }}>
            {error}
          </Typography>
        )}
        <Button
          type="submit"
          variant="contained"
          color="primary"
          disabled={isSubmitting}
        >
          Add Flashcard
        </Button>
      </Box>
    </Paper>
  );
};

export default CreateFlashcard; 