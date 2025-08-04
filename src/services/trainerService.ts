import { apiService } from './api';
import type { Trainer, TrainerFormData, TrainerStatus } from '@/types';

// Get all trainers
export const getTrainers = async (params: { status?: TrainerStatus; search?: string } = {}): Promise<Trainer[]> => {
  const response = await apiService.getTrainers({
    status: params.status,
    search: params.search
  });
  
  // The API response should have a data property containing the array of trainers
  if (response && response.success && Array.isArray(response.data)) {
    return response.data;
  }
  
  console.warn('Unexpected response format from getTrainers:', response);
  return [];
};

// Get single trainer by ID
export const getTrainer = async (id: string): Promise<Trainer | null> => {
  const response = await apiService.getTrainer(id);
  return response.data || null;
};

// Create new trainer
export const createTrainer = async (trainerData: TrainerFormData): Promise<Trainer> => {
  const response = await apiService.createTrainer(trainerData);
  if (!response.success) {
    throw new Error(response.message || 'Failed to create trainer');
  }
  return response.data!;
};

// Update trainer
export const updateTrainer = async (id: string, updates: Partial<TrainerFormData>): Promise<Trainer> => {
  const response = await apiService.updateTrainer(id, updates);
  if (!response.success) {
    throw new Error(response.message || 'Failed to update trainer');
  }
  return response.data!;
};

// Delete trainer
export const deleteTrainer = async (id: string): Promise<void> => {
  const response = await apiService.deleteTrainer(id);
  if (!response.success) {
    throw new Error(response.message || 'Failed to delete trainer');
  }
};

// Toggle trainer status
export const toggleTrainerStatus = async (id: string, status: TrainerStatus): Promise<Trainer> => {
  const response = await apiService.toggleTrainerStatus(id, status);
  if (!response.success) {
    throw new Error(response.message || 'Failed to update trainer status');
  }
  return response.data!;
};
