// src/components/MockList.tsx
import React, { useEffect, useState } from 'react';
import {
    Typography,
    Paper,
    Box,
    Card,
    CardContent,
    CardActions,
    Button,
    Chip,
    CircularProgress,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    Snackbar,
    Alert,
    RadioGroup,
    FormControlLabel,
    Radio,
    IconButton,
    Divider
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { getAllMocks, deleteMock, updateMock, MockDTO, QuizQuestionDTO } from '../services/MockService';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';

const MockList: React.FC = () => {
    const [mocks, setMocks] = useState<MockDTO[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string>('');
    const [editMock, setEditMock] = useState<MockDTO | null>(null);
    const [editQuestions, setEditQuestions] = useState<QuizQuestionDTO[]>([]);
    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' as 'success' | 'error' });
    const navigate = useNavigate();

    useEffect(() => {
        fetchMocks();
    }, []);

    const fetchMocks = async () => {
        try {
            const data = await getAllMocks();
            setMocks(data);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleStartQuiz = (mockId: number) => {
        navigate(`/quiz/${mockId}`);
    };

    const handleCreateQuiz = () => {
        navigate('/quiz/create');
    };

    const handleDelete = async (mockId: number) => {
        if (window.confirm('Are you sure you want to delete this quiz?')) {
            try {
                await deleteMock(mockId);
                setMocks(mocks.filter(mock => mock.id !== mockId));
                setSnackbar({
                    open: true,
                    message: 'Quiz deleted successfully',
                    severity: 'success'
                });
            } catch (err: any) {
                setSnackbar({
                    open: true,
                    message: err.message,
                    severity: 'error'
                });
            }
        }
    };

    const handleEditOpen = (mock: MockDTO) => {
        setEditMock(mock);
        setEditQuestions([...mock.questions]);
    };

    const handleEditClose = () => {
        setEditMock(null);
        setEditQuestions([]);
    };

    const handleQuestionChange = (index: number, value: string) => {
        const newQuestions = [...editQuestions];
        newQuestions[index] = {
            ...newQuestions[index],
            question: value
        };
        setEditQuestions(newQuestions);
    };

    const handleAnswerChange = (questionIndex: number, answerIndex: number, value: string) => {
        const newQuestions = [...editQuestions];
        newQuestions[questionIndex].answers[answerIndex] = {
            ...newQuestions[questionIndex].answers[answerIndex],
            answer: value
        };
        setEditQuestions(newQuestions);
    };

    const handleCorrectAnswerChange = (questionIndex: number, answerIndex: number) => {
        const newQuestions = [...editQuestions];
        newQuestions[questionIndex].answers = newQuestions[questionIndex].answers.map((a, idx) => ({
            ...a,
            correct: idx === answerIndex,
            point: idx === answerIndex ? 1 : 0
        }));
        setEditQuestions(newQuestions);
    };

    const handleUpdate = async () => {
        if (editMock) {
            try {
                const updated = await updateMock(editMock.id, {
                    numberOfQuestions: editQuestions.length,
                    questions: editQuestions
                });

                setMocks(mocks.map(mock =>
                    mock.id === updated.id ? updated : mock
                ));
                handleEditClose();
                setSnackbar({
                    open: true,
                    message: 'Quiz updated successfully',
                    severity: 'success'
                });
            } catch (err: any) {
                setSnackbar({
                    open: true,
                    message: err.message,
                    severity: 'error'
                });
            }
        }
    };

    if (loading) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
                <CircularProgress />
            </Box>
        );
    }

    if (error) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
                <Typography color="error">{error}</Typography>
            </Box>
        );
    }

    return (
        <>
            <Paper elevation={3} sx={{ p: 4, maxWidth: 1200, mx: 'auto' }}>
                <Box sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    mb: 3
                }}>
                    <Typography variant="h4">
                        Available Quizzes
                    </Typography>
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={handleCreateQuiz}
                    >
                        Create Quiz
                    </Button>
                </Box>

                <Box sx={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    gap: 2,
                    justifyContent: 'flex-start'
                }}>
                    {mocks.map((mock) => (
                        <Card
                            key={mock.id}
                            variant="outlined"
                            sx={{
                                width: 300,
                                display: 'flex',
                                flexDirection: 'column'
                            }}
                        >
                            <CardContent>
                                <Typography variant="h6" gutterBottom>
                                    {mock.nameMock}
                                </Typography>
                                <Typography color="textSecondary" gutterBottom>
                                    Language: {mock.languageName}
                                </Typography>
                                <Box display="flex" gap={1} mb={2}>
                                    <Chip
                                        label={`${mock.numberOfQuestions} questions`}
                                        size="small"
                                        color="primary"
                                    />
                                    {mock.scores.length > 0 && (
                                        <Chip
                                            label={`Best Score: ${Math.max(...mock.scores.map(s => s.score))}`}
                                            size="small"
                                            color="secondary"
                                        />
                                    )}
                                </Box>
                                {mock.scores.length > 0 && (
                                    <Typography variant="body2" color="textSecondary">
                                        Last attempt: {new Date(mock.scores[mock.scores.length - 1].submittedAt).toLocaleDateString()}
                                    </Typography>
                                )}
                            </CardContent>
                            <CardActions sx={{ display: 'flex', gap: 1, p: 2 }}>
                                <Button
                                    size="small"
                                    color="primary"
                                    variant="contained"
                                    onClick={() => handleStartQuiz(mock.id)}
                                >
                                    Start Quiz
                                </Button>
                                <Button
                                    size="small"
                                    color="secondary"
                                    variant="contained"
                                    onClick={() => handleEditOpen(mock)}
                                >
                                    Edit
                                </Button>
                                <Button
                                    size="small"
                                    color="error"
                                    variant="contained"
                                    onClick={() => handleDelete(mock.id)}
                                >
                                    Delete
                                </Button>
                            </CardActions>
                        </Card>
                    ))}
                </Box>

                {mocks.length === 0 && (
                    <Typography textAlign="center" sx={{ mt: 4 }}>
                        No quizzes available.
                    </Typography>
                )}
            </Paper>

            <Dialog
                open={!!editMock}
                onClose={handleEditClose}
                maxWidth="md"
                fullWidth
            >
                <DialogTitle>Edit Quiz</DialogTitle>
                <DialogContent>
                    {editQuestions.map((question, qIndex) => (
                        <Box key={qIndex} sx={{ mt: 3, mb: 4 }}>
                            <Typography variant="subtitle1" gutterBottom>
                                Question {qIndex + 1}
                            </Typography>
                            <TextField
                                fullWidth
                                label="Question"
                                value={question.question}
                                onChange={(e) => handleQuestionChange(qIndex, e.target.value)}
                                sx={{ mb: 2 }}
                            />
                            <Typography variant="subtitle2" gutterBottom>
                                Answers
                            </Typography>
                            <RadioGroup
                                value={question.answers.findIndex(a => a.correct)}
                                onChange={(e) => handleCorrectAnswerChange(qIndex, parseInt(e.target.value))}
                            >
                                {question.answers.map((answer, aIndex) => (
                                    <Box key={aIndex} sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                                        <FormControlLabel
                                            value={aIndex}
                                            control={<Radio />}
                                            label=""
                                        />
                                        <TextField
                                            size="small"
                                            value={answer.answer}
                                            onChange={(e) => handleAnswerChange(qIndex, aIndex, e.target.value)}
                                            sx={{ flex: 1 }}
                                        />
                                    </Box>
                                ))}
                            </RadioGroup>
                            <Divider sx={{ mt: 2 }} />
                        </Box>
                    ))}
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleEditClose}>Cancel</Button>
                    <Button onClick={handleUpdate} variant="contained" color="primary">
                        Update
                    </Button>
                </DialogActions>
            </Dialog>

            <Snackbar
                open={snackbar.open}
                autoHideDuration={6000}
                onClose={() => setSnackbar({ ...snackbar, open: false })}
            >
                <Alert
                    onClose={() => setSnackbar({ ...snackbar, open: false })}
                    severity={snackbar.severity}
                    sx={{ width: '100%' }}
                >
                    {snackbar.message}
                </Alert>
            </Snackbar>
        </>
    );
};

export default MockList;