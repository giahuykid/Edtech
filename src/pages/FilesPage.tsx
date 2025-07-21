import React, { useState } from 'react';
import { Container, Typography, Box, Button } from '@mui/material';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import FileList from '../components/FileList';
import FileUploadDialog from '../components/FileUploadDialog';
import { FileResponse } from '../services/fileService';

const FilesPage: React.FC = () => {
  const [isUploadDialogOpen, setIsUploadDialogOpen] = useState(false);

  const handleUploadSuccess = (files: FileResponse[]) => {
    setIsUploadDialogOpen(false);
    // The FileList component will automatically refresh its contents
  };

  return (
    <Container>
      <Box sx={{ mt: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h4" component="h1">
            Files
          </Typography>
          <Button
            variant="contained"
            startIcon={<UploadFileIcon />}
            onClick={() => setIsUploadDialogOpen(true)}
          >
            Upload Files
          </Button>
        </Box>

        <FileList />

        <FileUploadDialog
          open={isUploadDialogOpen}
          onClose={() => setIsUploadDialogOpen(false)}
          onUploadSuccess={handleUploadSuccess}
        />
      </Box>
    </Container>
  );
};

export default FilesPage; 