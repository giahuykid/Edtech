import React, { useState } from 'react';
import { useCallback } from 'react';

import {
  Box,
  Card,
  CardContent,
  CardActions,
  Typography,
  IconButton,
  Chip,
  CircularProgress,
  Alert,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Dialog,
  DialogContent,
  DialogTitle,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import VisibilityIcon from '@mui/icons-material/Visibility';
import AudiotrackIcon from '@mui/icons-material/Audiotrack';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import DescriptionIcon from '@mui/icons-material/Description';
import CloseIcon from '@mui/icons-material/Close';

import { Worker, Viewer } from '@react-pdf-viewer/core';
import { zoomPlugin } from '@react-pdf-viewer/zoom';
import { pageNavigationPlugin } from '@react-pdf-viewer/page-navigation';

import '@react-pdf-viewer/core/lib/styles/index.css';
import '@react-pdf-viewer/zoom/lib/styles/index.css';
import '@react-pdf-viewer/page-navigation/lib/styles/index.css';

import {
  getFiles,
  deleteFile,
  FileResponse,
  viewFile,
} from '../services/fileService';

import { useQuery, useQueryClient } from '@tanstack/react-query';

const FileList: React.FC = React.memo(() => {
  const [language, setLanguage] = useState<string>('all');
  const [selectedFile, setSelectedFile] = useState<FileResponse | null>(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const queryClient = useQueryClient();

  const zoomPluginInstance = zoomPlugin();
  const pageNavigationPluginInstance = pageNavigationPlugin();

  const {
    data: files = [],
    isLoading,
    isError,
    error,
  } = useQuery<FileResponse[], Error>({
    queryKey: ['files'],
    queryFn: getFiles,
    staleTime: 5 * 60 * 1000,
  });

  const handleDelete = async (fileId: number) => {
    if (window.confirm('Are you sure you want to delete this file?')) {
      try {
        await deleteFile(fileId);

        // Cập nhật ngay UI bằng cache local
        queryClient.setQueryData<FileResponse[]>(['files'], (oldFiles) =>
            oldFiles ? oldFiles.filter((f) => f.id !== fileId) : []
        );

        // Sau đó gọi lại API thật để đảm bảo đồng bộ backend
        queryClient.invalidateQueries({ queryKey: ['files'] });
      } catch (err: any) {
        console.error('Error deleting file:', err);
      }
    }
  };

  const handleView = useCallback(async (file: FileResponse) => {
    setSelectedFile(file);
    setIsPreviewOpen(true);

    if (file.fileType.includes('pdf')) {
      try {
        const blob = await viewFile(file.id);
        const url = URL.createObjectURL(blob);
        setPdfUrl(url);
      } catch (err: any) {
        console.error('Error loading PDF:', err);
      }
    }
  },[]);

  const handleClosePreview = () => {
    setSelectedFile(null);
    setIsPreviewOpen(false);
    if (pdfUrl) {
      URL.revokeObjectURL(pdfUrl);
      setPdfUrl(null);
    }
  };

  const renderFilePreview = () => {
    if (!selectedFile) return null;

    if (selectedFile.fileType.includes('audio')) {
      return (
          <audio controls style={{ width: '100%' }}>
            <source
                src={`/api/files/${selectedFile.id}/content`}
                type={selectedFile.fileType}
            />
            Your browser does not support the audio element.
          </audio>
      );
    }

    if (selectedFile.fileType.includes('pdf')) {
      if (!pdfUrl) return <CircularProgress />;
      return (
          <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.11.174/build/pdf.worker.min.js">
            <div style={{ height: '80vh' }}>
              <Viewer
                  fileUrl={pdfUrl}
                  plugins={[zoomPluginInstance, pageNavigationPluginInstance]}
              />
            </div>
          </Worker>
      );
    }

    if (
        selectedFile.fileType.includes('text') ||
        selectedFile.fileType.includes('csv') ||
        selectedFile.fileName.endsWith('.txt') ||
        selectedFile.fileName.endsWith('.csv')
    ) {
      return (
          <iframe
              src={`/api/files/${selectedFile.id}/content`}
              style={{ width: '100%', height: '500px' }}
              title={selectedFile.fileName}
          />
      );
    }

    return <Typography>This file type cannot be previewed.</Typography>;
  };

  const getFileIcon = (fileType: string) => {
    if (fileType.includes('audio')) return <AudiotrackIcon />;
    if (fileType.includes('pdf')) return <PictureAsPdfIcon />;
    return <DescriptionIcon />;
  };

  const filteredFiles =
      language === 'all'
          ? files
          : files.filter(
              (file) =>
                  file.language.toLowerCase() === language.toLowerCase()
          );

  if (isLoading) {
    return (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
          <CircularProgress />
        </Box>
    );
  }

  if (isError) {
    return (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error.message}
        </Alert>
    );
  }

  return (
      <Box sx={{ mt: 4 }}>
        <Box sx={{ mb: 3 }}>
          <FormControl sx={{ minWidth: 200 }}>
            <InputLabel>Filter by Language</InputLabel>
            <Select
                value={language}
                label="Filter by Language"
                onChange={(e) => setLanguage(e.target.value)}
            >
              <MenuItem value="all">All Languages</MenuItem>
              <MenuItem value="english">English</MenuItem>
              <MenuItem value="Vietnamese">Vietnamese</MenuItem>
              <MenuItem value="japanese">Japanese</MenuItem>
            </Select>
          </FormControl>
        </Box>

        {filteredFiles.length === 0 ? (
            <Alert severity="info">No files found</Alert>
        ) : (
            <Box
                sx={{
                  display: 'grid',
                  gridTemplateColumns: {
                    xs: '1fr',
                    sm: 'repeat(2, 1fr)',
                    md: 'repeat(3, 1fr)',
                  },
                  gap: 3,
                }}
            >
              {filteredFiles.map((file) => (
                  <Card key={file.id}>
                    <CardContent>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                        {getFileIcon(file.fileType)}
                        <Typography variant="h6" sx={{ ml: 1 }}>
                          {file.fileName}
                        </Typography>
                      </Box>
                      <Typography color="text.secondary" variant="body2">
                        Type: {file.fileType}
                      </Typography>
                      <Typography color="text.secondary" variant="body2">
                        Size: {(file.size / 1024).toFixed(2)} KB
                      </Typography>
                      <Box sx={{ mt: 1 }}>
                        <Chip
                            label={file.language}
                            size="small"
                            color="primary"
                            variant="outlined"
                        />
                      </Box>
                    </CardContent>
                    <CardActions>
                      <IconButton onClick={() => handleView(file)} title="View/Play">
                        <VisibilityIcon />
                      </IconButton>
                      <IconButton
                          onClick={() => handleDelete(file.id)}
                          color="error"
                          title="Delete"
                      >
                        <DeleteIcon />
                      </IconButton>
                    </CardActions>
                  </Card>
              ))}
            </Box>
        )}

        <Dialog
            open={isPreviewOpen}
            onClose={handleClosePreview}
            maxWidth="lg"
            fullWidth
            PaperProps={{
              sx: {
                height: selectedFile?.fileType.includes('pdf') ? '90vh' : 'auto',
                maxHeight: '90vh',
              },
            }}
        >
          <DialogTitle
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                borderBottom: '1px solid rgba(0, 0, 0, 0.12)',
                padding: 2,
              }}
          >
            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
              {selectedFile?.fileName}
            </Typography>
            <IconButton onClick={handleClosePreview} size="small">
              <CloseIcon />
            </IconButton>
          </DialogTitle>
          <DialogContent
              sx={{
                padding: selectedFile?.fileType.includes('pdf') ? 1 : 2,
                overflow: 'hidden',
              }}
          >
            {renderFilePreview()}
          </DialogContent>
        </Dialog>
      </Box>
  );
});

export default FileList;
