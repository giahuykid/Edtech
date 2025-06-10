import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Box,
  Typography,
  CircularProgress,
  Alert
} from '@mui/material';
import { uploadFiles, FileResponse } from '../services/fileService';

interface FileUploadDialogProps {
  open: boolean;
  onClose: () => void;
  onUploadSuccess?: (files: FileResponse[]) => void;
}

const FileUploadDialog: React.FC<FileUploadDialogProps> = ({
  open,
  onClose,
  onUploadSuccess
}) => {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [language, setLanguage] = useState<string>('');
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      setSelectedFiles(Array.from(event.target.files));
      setError(null);
    }
  };

  const handleUpload = async () => {
    if (!language) {
      setError('Please select a language');
      return;
    }

    if (selectedFiles.length === 0) {
      setError('Please select a file');
      return;
    }

    setIsUploading(true);
    setError(null);

    try {
      const response = await uploadFiles(selectedFiles, 'user', language);
      if (onUploadSuccess) {
        onUploadSuccess(response);
      }
      onClose();
    } catch (err: any) {
      setError(err.message || 'Failed to upload file');
      console.error('Error uploading file:', err);
    } finally {
      setIsUploading(false);
    }
  };

  const handleClose = () => {
    setSelectedFiles([]);
    setLanguage('');
    setError(null);
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>Upload Files</DialogTitle>
      <DialogContent>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, my: 2 }}>
          <input
            type="file"
            onChange={handleFileSelect}
            multiple
            accept=".txt,.csv,.xlsx,.pdf,.mp3,audio/mp3"
            style={{ display: 'none' }}
            id="file-input"
          />
          <label htmlFor="file-input">
            <Button variant="outlined" component="span" fullWidth>
              Choose Files
            </Button>
          </label>

          {selectedFiles.length > 0 && (
            <Typography variant="body2" color="text.secondary">
              Selected: {selectedFiles.map(file => file.name).join(', ')}
            </Typography>
          )}

          <FormControl fullWidth>
            <InputLabel>Language</InputLabel>
            <Select
              value={language}
              label="Language"
              onChange={(e) => setLanguage(e.target.value)}
              disabled={isUploading}
            >
              <MenuItem value="english">English</MenuItem>
              <MenuItem value="vietnamese">Vietnamese</MenuItem>
              <MenuItem value="japanese">Japanese</MenuItem>
            </Select>
          </FormControl>

          {error && (
            <Alert severity="error" onClose={() => setError(null)}>
              {error}
            </Alert>
          )}
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} disabled={isUploading}>
          Cancel
        </Button>
        <Button
          onClick={handleUpload}
          variant="contained"
          disabled={isUploading || selectedFiles.length === 0 || !language}
          startIcon={isUploading ? <CircularProgress size={20} /> : null}
        >
          {isUploading ? 'Uploading...' : 'Upload'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default FileUploadDialog; 