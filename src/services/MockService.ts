// src/services/MockService.ts
import axios from 'axios';
import api from '../config/api';

// === Interfaces ===

export interface QuizAnswerDTO {
    id?: number;
    answer: string;
    correct: boolean;
    point: number;
}

export interface QuizQuestionDTO {
    id?: number;
    question: string;
    answers: QuizAnswerDTO[];
}

export interface ScoreDTO {
    id: number;
    score: number;
    submittedAt: string;
    userId: number;
    mockId: number;
}

export interface MockDTO {
    id: number;
    nameMock: string;
    languageName: string;
    numberOfQuestions: number;
    questions: QuizQuestionDTO[];
    scores: ScoreDTO[];
}

export interface LanguageDTO {
    id: number;
    languageName: string;
}

// === API Functions ===

export const getAllLanguages = async (): Promise<LanguageDTO[]> => {
    const response = await api.get<LanguageDTO[]>('/mock/languages');
    return response.data;
};

export const getAllMocks = async (): Promise<MockDTO[]> => {
    try {
        const response = await api.get<MockDTO[]>('/mock/all');
        console.log('Mock API Response:', response.data);
        return Array.isArray(response.data) ? response.data : [];
    } catch (error) {
        console.error('Error fetching mocks:', error);
        return [];
    }
};

export const getMockById = async (mockId: number): Promise<MockDTO> => {
    const response = await api.get<MockDTO>(`/mock/getMock/${mockId}`);
    return response.data;
};

export const getCurrentScore = async (mockId: number): Promise<number> => {
    const response = await api.get<number>(`/mock/${mockId}/score`);
    return response.data;
};

export const submitAnswer = async (
    mockId: number,
    questionId: number,
    answerId: number
): Promise<boolean> => {
    const mock = await getMockById(mockId);
    const question = mock.questions.find(q => q.id === questionId);
    const answer = question?.answers.find(a => a.id === answerId);

    console.log('Answer details:', {
        answer,
        isCorrect: answer?.correct
    });

    const response = await api.post<boolean>(`/mock/${mockId}/submit`, null, {
        params: {
            questionId,
            answerId
        }
    });

    return response.data;
};

export const verifyAnswer = async (
    mockId: number,
    questionId: number,
    answerId: number
): Promise<void> => {
    const mock = await getMockById(mockId);
    const question = mock.questions.find(q => q.id === questionId);
    const answer = question?.answers.find(a => a.id === answerId);

    console.log('Verification details:', {
        mockId,
        questionId,
        answerId,
        question,
        answer,
        isCorrect: answer?.correct
    });
};

export const createMock = async (
    nameMock: string,
    userId: number,
    languageId: number,
    numberOfQuestions: number,
    questions: QuizQuestionDTO[]
): Promise<MockDTO> => {
    const formattedQuestions = questions.map(q => ({
        ...q,
        answers: q.answers.map(a => ({
            ...a,
            correct: a.correct
        }))
    }));

    const response = await api.post<MockDTO>('/mock/create', formattedQuestions, {
        params: { nameMock, userId, languageId, numberOfQuestions },
    });

    return response.data;
};

export const deleteMock = async (mockId: number): Promise<void> => {
    await api.delete(`/mock/delete/${mockId}`);
};

export const updateMock = async (
    mockId: number,
    updateData: {
        languageId?: number;
        numberOfQuestions?: number;
        questions?: QuizQuestionDTO[];
    }
): Promise<MockDTO> => {
    const response = await api.patch<MockDTO>(`/mock/update/${mockId}`, {
        languageId: updateData.languageId,
        numberOfQuestions: updateData.numberOfQuestions,
        questions: updateData.questions
    });
    return response.data;
};

