import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createFlashcardCollection } from '../services/flashcardService';
import {
  Container,
  Typography,
  TextField,
  Button,
  Box,
  Paper,
  Alert
} from '@mui/material';

const CreateFlashcardCollection: React.FC = () => {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('Collection name is required');
      return;
    }

    setError(null);
    setIsSubmitting(true);

    try {
      const newCollection = await createFlashcardCollection(name.trim());
      console.log('Created collection:', newCollection);
      navigate(`/collection/${newCollection.id}`);
    } catch (err: any) {
      console.error('Error creating collection:', err);
      setError(err.message || 'Failed to create collection. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Container maxWidth="sm">
      <Box sx={{ mt: 4 }}>
        <Paper sx={{ p: 3 }}>
          <Typography variant="h4" component="h1" gutterBottom>
            Create New Collection
          </Typography>
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}
          <Box component="form" onSubmit={handleSubmit}>
            <TextField
              label="Collection Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              fullWidth
              required
              error={!!error}
              disabled={isSubmitting}
              sx={{ mb: 3 }}
            />
            <Button
              type="submit"
              variant="contained"
              color="primary"
              fullWidth
              disabled={!name.trim() || isSubmitting}
            >
              Create Collection
            </Button>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
};

export default CreateFlashcardCollection; 