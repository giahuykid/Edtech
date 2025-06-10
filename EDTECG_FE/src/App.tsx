// src/App.tsx
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Box, Container } from '@mui/material';

import Navigation from './components/layout/Navigation';
import env from './config/env';

import CreateFlashcardCollection from './components/CreateFlashcardCollection';
import FlashcardCollection from './components/FlashcardCollection';
import FlashcardCollectionList from './components/FlashcardCollectionList';
import FileUploadDialog from './components/FileUploadDialog';
import FilesPage from './pages/FilesPage';
import QuizForm from './components/QuizForm';
import QuizDisplay from './components/QuizDisplay';
import QuizList from './components/QuizList';
import { FileResponse } from './services/fileService';
import HomePage from './pages/HomePage';

function App() {
    const [isUploadDialogOpen, setIsUploadDialogOpen] = useState(false);
    const [mockId, setMockId] = useState<number | null>(null);

    // Example of using environment variables through our utility
    useEffect(() => {
        // Using our type-safe env utility
        console.log('API URL:', env.apiUrl);
        console.log('API Version:', env.apiVersion);
        console.log('App Name:', env.appName);
        
        // Example of using feature flags
        if (env.debugMode) {
            console.log('Debug mode is enabled');
        }

        // Example of environment-specific code
        if (env.isDevelopment) {
            console.log('Running in development mode');
        }
    }, []);

    const handleUploadSuccess = (files: FileResponse[]) => {
        console.log('Files uploaded successfully:', files);
        setIsUploadDialogOpen(false);
    };

    return (
        <Router>
            <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
                {/* Custom Navigation Component */}
                <Navigation />

                {/* Main Content */}
                <Container
                    maxWidth={false}
                    sx={{
                        flexGrow: 1,
                        pt: 10, // Add padding to account for fixed AppBar
                        px: { xs: 2, sm: 4 },
                        bgcolor: 'background.default',
                    }}
                >
                    <Routes>
                        <Route path="/" element={<HomePage />} />
                        <Route path="/create-flashcard" element={<CreateFlashcardCollection />} />
                        <Route path="/collection/:id" element={<FlashcardCollection />} />
                        <Route path="/files" element={<FilesPage />} />
                        <Route path="/flashcards" element={<FlashcardCollectionList />} />
                        <Route path="/create-quiz" element={<QuizForm onQuizCreated={setMockId} />} />
                        <Route path="/quiz/:mockId" element={<QuizDisplay mockId={mockId || 0} />} />
                        <Route path="/quizzes" element={<QuizList />} />
                        <Route path="/mocks" element={<QuizList />} />
                        <Route path="*" element={<Navigate to="/flashcards" replace />} />
                    </Routes>
                </Container>

                {/* Upload Dialog */}
                <FileUploadDialog
                    open={isUploadDialogOpen}
                    onClose={() => setIsUploadDialogOpen(false)}
                    onUploadSuccess={handleUploadSuccess}
                />
            </Box>
        </Router>
    );
}

export default App;
