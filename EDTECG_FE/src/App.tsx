// src/App.tsx
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Box, Container } from '@mui/material';

import Navigation from './components/layout/Navigation';
import env from './config/env';
import authService from './services/authService';

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
import LoginPage from './pages/LoginPage';
import AuthTest from './components/AuthTest';

// Protected Route Component
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const isAuthenticated = authService.isAuthenticated();
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  return <>{children}</>;
};

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
                        <Route path="/login" element={<LoginPage />} />
                        <Route path="/auth-test" element={<AuthTest />} />
                        <Route path="/" element={
                            <ProtectedRoute>
                                <HomePage />
                            </ProtectedRoute>
                        } />
                        <Route path="/create-flashcard" element={
                            <ProtectedRoute>
                                <CreateFlashcardCollection />
                            </ProtectedRoute>
                        } />
                        <Route path="/collection/:id" element={
                            <ProtectedRoute>
                                <FlashcardCollection />
                            </ProtectedRoute>
                        } />
                        <Route path="/files" element={
                            <ProtectedRoute>
                                <FilesPage />
                            </ProtectedRoute>
                        } />
                        <Route path="/flashcards" element={
                            <ProtectedRoute>
                                <FlashcardCollectionList />
                            </ProtectedRoute>
                        } />
                        <Route path="/create-quiz" element={
                            <ProtectedRoute>
                                <QuizForm onQuizCreated={setMockId} />
                            </ProtectedRoute>
                        } />
                        <Route path="/quiz/:mockId" element={
                            <ProtectedRoute>
                                <QuizDisplay mockId={mockId || 0} />
                            </ProtectedRoute>
                        } />
                        <Route path="/quizzes" element={
                            <ProtectedRoute>
                                <QuizList />
                            </ProtectedRoute>
                        } />
                        <Route path="/mocks" element={
                            <ProtectedRoute>
                                <QuizList />
                            </ProtectedRoute>
                        } />
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
