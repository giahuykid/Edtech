import React, { useState, useRef } from 'react';
import {
  Box,
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Typography,
  Alert,
  CircularProgress,
  Paper
} from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { uploadFiles, FileResponse } from '../services/fileService';

interface FileUploadProps {
  onUploadSuccess: (files: FileResponse[]) => void;
}

const FileUpload: React.FC<FileUploadProps> = ({ onUploadSuccess }) => {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [language, setLanguage] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      setSelectedFiles(Array.from(event.target.files));
      setError(null);
    }
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    if (event.dataTransfer.files) {
      setSelectedFiles(Array.from(event.dataTransfer.files));
      setError(null);
    }
  };

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
  };

  const handleUpload = async () => {
    if (!language) {
      setError('Please select a language');
      return;
    }

    if (selectedFiles.length === 0) {
      setError('Please select at least one file');
      return;
    }

    setIsUploading(true);
    setError(null);

    try {
      const response = await uploadFiles(selectedFiles, 'user', language);
      onUploadSuccess(response);
      setSelectedFiles([]);
      setLanguage('');
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    } catch (err: any) {
      setError(err.message || 'Failed to upload files');
      console.error('Error uploading files:', err);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <Box sx={{ width: '100%', maxWidth: 600, mx: 'auto', mt: 4 }}>
      <Paper
        sx={{
          p: 3,
          border: '2px dashed #ccc',
          borderRadius: 2,
          textAlign: 'center',
          cursor: 'pointer',
          '&:hover': {
            borderColor: 'primary.main',
          },
        }}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onClick={() => fileInputRef.current?.click()}
      >
        <input
          type="file"
          multiple
          onChange={handleFileSelect}
          style={{ display: 'none' }}
          ref={fileInputRef}
        />
        <CloudUploadIcon sx={{ fontSize: 48, color: 'primary.main', mb: 2 }} />
        <Typography variant="h6" gutterBottom>
          Drag and drop files here
        </Typography>
        <Typography variant="body2" color="textSecondary">
          or click to select files
        </Typography>
      </Paper>

      {selectedFiles.length > 0 && (
        <Box sx={{ mt: 2 }}>
          <Typography variant="subtitle1" gutterBottom>
            Selected Files:
          </Typography>
          {selectedFiles.map((file, index) => (
            <Typography key={index} variant="body2">
              {file.name} ({(file.size / 1024).toFixed(2)} KB)
            </Typography>
          ))}
        </Box>
      )}

      <FormControl fullWidth sx={{ mt: 2 }}>
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
        <Alert severity="error" sx={{ mt: 2 }}>
          {error}
        </Alert>
      )}

      <Button
        variant="contained"
        color="primary"
        fullWidth
        sx={{ mt: 2 }}
        onClick={handleUpload}
        disabled={isUploading || selectedFiles.length === 0 || !language}
      >
        {isUploading ? <CircularProgress size={24} /> : 'Upload Files'}
      </Button>
    </Box>
  );
};

export default FileUpload; 