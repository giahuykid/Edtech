import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Alert,
  CircularProgress
} from '@mui/material';
import { Flashcard, updateFlashcard } from '../services/flashcardService';

interface EditFlashcardProps {
  open: boolean;
  onClose: () => void;
  flashcard: Flashcard;
  collectionId: number;
  onUpdate: (updatedFlashcard: Flashcard) => void;
}

const EditFlashcard: React.FC<EditFlashcardProps> = ({
  open,
  onClose,
  flashcard,
  onUpdate
}) => {
  const [word, setWord] = useState(flashcard.word);
  const [meaning, setMeaning] = useState(flashcard.meaning);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      const updatedFlashcard = await updateFlashcard(
        flashcard.id,
        word,
        meaning
      );
      onUpdate(updatedFlashcard);
      onClose();
    } catch (err: any) {
      setError(err.message || 'Failed to update flashcard');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <form onSubmit={handleSubmit}>
        <DialogTitle>Edit Flashcard</DialogTitle>
        <DialogContent>
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}
          <TextField
            label="Word"
            value={word}
            onChange={(e) => setWord(e.target.value)}
            fullWidth
            required
            margin="normal"
            disabled={isSubmitting}
          />
          <TextField
            label="Meaning"
            value={meaning}
            onChange={(e) => setMeaning(e.target.value)}
            fullWidth
            required
            margin="normal"
            multiline
            rows={3}
            disabled={isSubmitting}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            disabled={isSubmitting || !word.trim() || !meaning.trim()}
          >
            {isSubmitting ? <CircularProgress size={24} /> : 'Save Changes'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default EditFlashcard; 