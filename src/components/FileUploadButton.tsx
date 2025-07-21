import React, { useRef, useState } from 'react';
import {
  Button,
  CircularProgress,
  Alert,
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem
} from '@mui/material';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import { uploadFiles, FileResponse } from '../services/fileService';
import { useQueryClient } from '@tanstack/react-query'; // ✅ Add

interface FileUploadButtonProps {
  onUploadSuccess?: (files: FileResponse[]) => void;
  buttonText?: string;
  acceptedFileTypes?: string;
  multiple?: boolean;
}

const FileUploadButton: React.FC<FileUploadButtonProps> = ({
                                                             onUploadSuccess,
                                                             buttonText = 'Upload File',
                                                             acceptedFileTypes = '*',
                                                             multiple = false
                                                           }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [language, setLanguage] = useState<string>('');
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const queryClient = useQueryClient(); // ✅

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
      queryClient.invalidateQueries({ queryKey: ['files'] }); // ✅ Invalidate cache
      onUploadSuccess?.(response);
      setSelectedFiles([]);
      setLanguage('');
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    } catch (err: any) {
      setError(err.message || 'Failed to upload file');
      console.error('Error uploading file:', err);
    } finally {
      setIsUploading(false);
    }
  };

  return (
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, maxWidth: 400 }}>
        <input
            type="file"
            ref={fileInputRef}
            style={{ display: 'none' }}
            onChange={handleFileSelect}
            accept={acceptedFileTypes}
            multiple={multiple}
        />

        <Button
            variant="contained"
            onClick={() => fileInputRef.current?.click()}
            startIcon={<UploadFileIcon />}
            disabled={isUploading}
        >
          {buttonText}
        </Button>

        {selectedFiles.length > 0 && (
            <Box sx={{ mt: 1 }}>
              Selected: {selectedFiles.map(file => file.name).join(', ')}
            </Box>
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

        <Button
            variant="contained"
            color="primary"
            onClick={handleUpload}
            disabled={isUploading || selectedFiles.length === 0 || !language}
            startIcon={isUploading ? <CircularProgress size={20} /> : null}
        >
          {isUploading ? 'Uploading...' : 'Start Upload'}
        </Button>
      </Box>
  );
};

export default FileUploadButton;
