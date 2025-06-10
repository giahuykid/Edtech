import axios from 'axios';
import api from '../config/api';

export interface FileResponse {
  id: number;
  fileName: string;
  fileType: string;
  size: number;
  language: string;
  uploadedBy: string;
  uploadDate: string;
  uploadStatus: string;
  message: string;
}

export const getFiles = async (): Promise<FileResponse[]> => {
  try {
    const response = await api.get('/files/all');
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response?.status === 404) {
      return []; // Return empty array if no files found
    }
    throw error;
  }
};

export const getAllFiles = async (language?: string): Promise<FileResponse[]> => {
  const params = new URLSearchParams();
  if (language) {
    params.append('language', language);
  }
    const response = await api.get(`/files/all?${params.toString()}`);
    return response.data;
};

export const uploadFiles = async (
  files: File[],
  uploadedBy: string,
  language: string
): Promise<FileResponse[]> => {
  const formData = new FormData();
  files.forEach(file => formData.append('files', file));
  formData.append('uploadedBy', uploadedBy);
  formData.append('language', language);

  const response = await api.post('/files/upload', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });

  return response.data;
};

export const getFileInfo = async (fileId: number): Promise<FileResponse> => {
  const response = await api.get(`/files/${fileId}/info`);
  return response.data;
};

export const viewFile = async (fileId: number): Promise<Blob> => {
  const response = await api.get(`/files/${fileId}/content`, {
    responseType: 'blob'
  });
  return response.data;
};

export const updateFile = async (
  fileId: number,
  file: File,
  uploadedBy: string = 'system',
  language: string
): Promise<FileResponse> => {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('uploadedBy', uploadedBy);
  formData.append('language', language);

  const response = await api.put(`/files/${fileId}`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

export const deleteFile = async (fileId: number): Promise<void> => {
  await api.delete(`/files/${fileId}`);
}; 