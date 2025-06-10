// src/components/QuizForm.tsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { TextField, Button, Box, Typography, FormControlLabel, Checkbox, Paper } from '@mui/material';
import { createMock, QuizAnswerDTO, QuizQuestionDTO } from '../services/MockService';

interface FormData {
    nameMock: string;
    questions: {
        question: string;
        answers: {
            answer: string;
            correct: boolean;
            point: number;
        }[];
    }[];
}

interface QuizFormProps {
    onQuizCreated: (mockId: number) => void;
}

const QuizForm: React.FC<QuizFormProps> = ({ onQuizCreated }) => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState<FormData>({
        nameMock: '',
        questions: [{
            question: '',
            answers: [{ answer: '', correct: true, point: 1 }]
        }]
    });
    const [error, setError] = useState<string>('');
    const [success, setSuccess] = useState<string>('');

    // Hardcoded userId and languageId
    const userId = 1;
    const languageId = 1;

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement>,
        questionIndex?: number,
        answerIndex?: number
    ) => {
        const { name, value, type, checked } = e.target;
        setFormData((prev) => {
            if (questionIndex !== undefined && name === 'question') {
                const newQuestions = [...prev.questions];
                newQuestions[questionIndex] = { ...newQuestions[questionIndex], question: value };
                return { ...prev, questions: newQuestions };
            } else if (
                questionIndex !== undefined &&
                answerIndex !== undefined &&
                (name === 'answer' || name === 'correct')
            ) {
                const newQuestions = [...prev.questions];
                newQuestions[questionIndex].answers = newQuestions[questionIndex].answers.map((answer, idx) =>
                    idx === answerIndex
                        ? { ...answer, [name]: type === 'checkbox' ? checked : value }
                        : answer
                );
                return { ...prev, questions: newQuestions };
            } else if (name === 'nameMock') {
                return { ...prev, nameMock: value };
            }
            return prev;
        });
    };

    const addQuestion = () => {
        setFormData({
            ...formData,
            questions: [
                ...formData.questions,
                { question: '', answers: [{ answer: '', correct: false, point: 1 }] }
            ],
        });
    };

    const addAnswer = (questionIndex: number) => {
        setFormData({
            ...formData,
            questions: formData.questions.map((q, idx) =>
                idx === questionIndex
                    ? { ...q, answers: [...q.answers, { answer: '', correct: false, point: 1 }] }
                    : q
            ),
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setSuccess('');
        try {
            // Map the form data to match the API expectations
            const apiQuestions: QuizQuestionDTO[] = formData.questions.map(q => ({
                question: q.question,
                answers: q.answers.map(a => ({
                    answer: a.answer,
                    correct: a.correct,
                    point: a.point
                }))
            }));

            const response = await createMock(
                formData.nameMock,
                userId,
                languageId,
                apiQuestions.length,
                apiQuestions
            );
            setSuccess('Quiz created successfully!');
            onQuizCreated(response.id);
            navigate(`/quiz/${response.id}`);
            // Reset form
            setFormData({
                nameMock: '',
                questions: [{ question: '', answers: [{ answer: '', correct: true, point: 1 }] }]
            });
        } catch (err: any) {
            setError(err.message);
        }
    };

    return (
        <Paper elevation={3} sx={{ p: 4, maxWidth: 800, mx: 'auto' }}>
            <Typography variant="h5" gutterBottom>
                Create a Quiz
            </Typography>
            <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <TextField
                    label="Quiz Name"
                    name="nameMock"
                    value={formData.nameMock}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleChange(e)}
                    required
                    fullWidth
                />
                {formData.questions.map((question, index) => (
                    <Box key={index} sx={{ border: '1px solid #ccc', p: 2, borderRadius: 2 }}>
                        <Typography variant="subtitle1">Question {index + 1}</Typography>
                        <TextField
                            label="Question"
                            name="question"
                            value={question.question}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleChange(e, index)}
                            required
                            fullWidth
                            sx={{ mt: 1 }}
                        />
                        {question.answers.map((answer, aIndex) => (
                            <Box key={aIndex} sx={{ ml: 2, mt: 2 }}>
                                <TextField
                                    label={`Answer ${aIndex + 1}`}
                                    name="answer"
                                    value={answer.answer}
                                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleChange(e, index, aIndex)}
                                    required
                                    fullWidth
                                />
                                <FormControlLabel
                                    control={
                                        <Checkbox
                                            name="correct"
                                            checked={answer.correct}
                                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleChange(e, index, aIndex)}
                                        />
                                    }
                                    label="Correct Answer"
                                    sx={{ mt: 1 }}
                                />
                            </Box>
                        ))}
                        <Button
                            variant="outlined"
                            onClick={() => addAnswer(index)}
                            sx={{ mt: 2 }}
                        >
                            Add Answer
                        </Button>
                    </Box>
                ))}
                <Button variant="contained" color="success" onClick={addQuestion}>
                    Add Question
                </Button>
                <Button variant="contained" color="primary" type="submit">
                    Create Quiz
                </Button>
                {error && <Typography color="error">{error}</Typography>}
                {success && <Typography color="success.main">{success}</Typography>}
            </Box>
        </Paper>
    );
};

export default QuizForm;