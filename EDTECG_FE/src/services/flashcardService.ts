import axios from "axios";
import api from '../config/api';

export interface Flashcard {
  id: number;
  word: string;
  meaning: string;
  collectionId: number;
}

export interface FlashcardCollection {
  id: number;
  name: string;
  numberOfFlashcards: number;
  userId: number;
  flashcards: Flashcard[];
}

export const getAllFlashcardCollections = async (): Promise<FlashcardCollection[]> => {
  try {
    const response = await api.get('/flashcard/collections');
    console.log('API Response:', response.data);
    // Ensure we always return an array
    return Array.isArray(response.data) ? response.data : [];
  } catch (error) {
    console.error('Error fetching collections:', error);
    return []; // Return empty array on error
  }
};

export const getFlashcardCollection = async (id: number): Promise<FlashcardCollection> => {
  const response = await api.get(`/flashcard/getflashcardcollection/${id}`);
  return response.data;
};

export const createFlashcardCollection = async (name: string): Promise<FlashcardCollection> => {
  const params = new URLSearchParams();
  params.append('name', name);
  params.append('userId', '1');

  const response = await api.post(`/flashcard/createflashcardcollection?${params.toString()}`);
  return response.data;
};

export const deleteFlashcardCollection = async (id: number): Promise<void> => {
  await api.delete(`/flashcard/deletecollection/${id}`);
};

export const addFlashcard = async (collectionId: number, word: string, meaning: string): Promise<Flashcard> => {
  const params = new URLSearchParams();
  params.append('word', word);
  params.append('meaning', meaning);
  params.append('collectionId', collectionId.toString());

  const response = await api.post(`/flashcard/createflashcard?${params.toString()}`);
  return response.data;
};

export const updateFlashcard = async (flashcardId: number, word: string, meaning: string): Promise<Flashcard> => {
  const params = new URLSearchParams();
  params.append('word', word);
  params.append('meaning', meaning);

  const response = await api.patch(`/flashcard/updateflashcard/${flashcardId}?${params.toString()}`);
  return response.data;
};

export const deleteFlashcard = async (collectionId: number, flashcardId: number): Promise<void> => {
  await api.delete(`/flashcard/deleteflashcard/${flashcardId}`);
};