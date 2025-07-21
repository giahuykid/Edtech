// src/components/QuizDisplay.tsx
import React, { useState, useEffect } from 'react';
import { Typography, Box, Paper, Radio, RadioGroup, FormControlLabel, Button, Alert } from '@mui/material';
import { getMockById, submitAnswer, getCurrentScore, MockDTO, QuizQuestionDTO, QuizAnswerDTO, ScoreDTO } from '../services/MockService';

interface QuizDisplayProps {
    mockId: number;
}

const QuizDisplay: React.FC<QuizDisplayProps> = ({ mockId }) => {
    const [quiz, setQuiz] = useState<MockDTO | null>(null);
    const [score, setScore] = useState<number>(0);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string>('');
    const [feedback, setFeedback] = useState<{ message: string; severity: 'success' | 'error' | 'info' } | null>(null);
    const [selectedAnswers, setSelectedAnswers] = useState<{ [key: number]: number }>({});
    const [submitStatus, setSubmitStatus] = useState<'idle' | 'submitting'>('idle');

    useEffect(() => {
        const fetchQuiz = async () => {
            try {
                const data = await getMockById(mockId);
                console.log('Fetched quiz:', data);
                setQuiz(data);
                const currentScore = await getCurrentScore(mockId);
                console.log('Initial score:', currentScore);
                setScore(currentScore);
                setLoading(false);
            } catch (err: any) {
                setError(err.message);
                setLoading(false);
            }
        };
        if (mockId) fetchQuiz();
    }, [mockId]);

    const handleSelectAnswer = (questionId: number, answerId: number) => {
        console.log(`Selected: questionId=${questionId}, answerId=${answerId}`);
        setSelectedAnswers(prev => ({ ...prev, [questionId]: answerId }));
    };

    const handleSubmitAllAnswers = async () => {
        if (!quiz) return;

        try {
            setSubmitStatus('submitting');
            setFeedback(null);

            // Check if all questions are answered
            const unansweredQuestions = quiz.questions.filter(q =>
                q.id && !selectedAnswers[q.id]
            );

            if (unansweredQuestions.length > 0) {
                setFeedback({
                    message: `Please answer all questions. ${unansweredQuestions.length} questions remaining.`,
                    severity: 'error'
                });
                setSubmitStatus('idle');
                return;
            }

            // Submit all answers
            let correctCount = 0;
            const results = [];

            for (const question of quiz.questions) {
                if (question.id && selectedAnswers[question.id]) {
                    try {
                        const isCorrect = await submitAnswer(mockId, question.id, selectedAnswers[question.id]);
                        results.push({
                            questionId: question.id,
                            isCorrect
                        });
                        if (isCorrect) correctCount++;
                    } catch (err) {
                        console.error(`Error submitting answer for question ${question.id}:`, err);
                    }
                }
            }

            // Get final score
            const finalScore = await getCurrentScore(mockId);
            setScore(finalScore);

            // Show results
            setFeedback({
                message: `Quiz completed! You got ${correctCount} out of ${quiz.questions.length} questions correct. Final score: ${finalScore}`,
                severity: 'success'
            });

            // Reset selected answers
            setSelectedAnswers({});

        } catch (err: any) {
            console.error('Submission error:', err);
            setFeedback({
                message: err.message || 'Failed to submit answers',
                severity: 'error'
            });
        } finally {
            setSubmitStatus('idle');
        }
    };

    if (loading) return <Typography sx={{ textAlign: 'center', p: 4 }}>Loading...</Typography>;
    if (error) return <Typography color="error" sx={{ textAlign: 'center', p: 4 }}>{error}</Typography>;
    if (!quiz) return <Typography sx={{ textAlign: 'center', p: 4 }}>No quiz found</Typography>;

    const totalQuestions = quiz.questions.length;
    const answeredQuestions = Object.keys(selectedAnswers).length;

    return (
        <Paper elevation={3} sx={{ p: 4, maxWidth: 800, mx: 'auto' }}>
            <Typography variant="h5" gutterBottom>
                {quiz.nameMock}
            </Typography>
            <Typography variant="body1" gutterBottom>
                Language: {quiz.languageName}
            </Typography>
            <Typography variant="body1" gutterBottom>
                Current Score: {score}
            </Typography>
            <Typography variant="body1" gutterBottom>
                Progress: {answeredQuestions}/{totalQuestions} questions answered
            </Typography>

            {feedback && (
                <Alert severity={feedback.severity} sx={{ mb: 2 }}>
                    {feedback.message}
                </Alert>
            )}

            {quiz.questions.map((question: QuizQuestionDTO) => (
                <Box key={question.id || `question-${question.question}`}
                     sx={{ border: '1px solid #ccc', p: 2, borderRadius: 2, mb: 2 }}>
                    <Typography variant="subtitle1">
                        Question {quiz.questions.indexOf(question) + 1}: {question.question}
                    </Typography>
                    <RadioGroup
                        name={`question-${question.id || question.question}`}
                        value={question.id && selectedAnswers[question.id] ? selectedAnswers[question.id] : ''}
                        onChange={(e) => question.id && handleSelectAnswer(question.id, parseInt(e.target.value))}
                    >
                        {question.answers.map((answer: QuizAnswerDTO) => (
                            <FormControlLabel
                                key={answer.id || `answer-${answer.answer}`}
                                value={answer.id}
                                control={<Radio />}
                                label={answer.answer}
                                disabled={submitStatus === 'submitting'}
                            />
                        ))}
                    </RadioGroup>
                </Box>
            ))}

            <Button
                variant="contained"
                color="primary"
                onClick={handleSubmitAllAnswers}
                disabled={submitStatus === 'submitting' || answeredQuestions < totalQuestions}
                fullWidth
                sx={{ mt: 3, mb: 2 }}
            >
                {submitStatus === 'submitting' ? 'Submitting...' : 'Submit All Answers'}
            </Button>

            {quiz.scores.length > 0 && (
                <Box sx={{ mt: 4 }}>
                    <Typography variant="subtitle1">Score History</Typography>
                    {quiz.scores.map((score: ScoreDTO) => (
                        <Typography key={score.id}>
                            Score: {score.score} (Submitted: {new Date(score.submittedAt).toLocaleString()})
                        </Typography>
                    ))}
                </Box>
            )}
        </Paper>
    );
};

export default QuizDisplay;