import { apiClient } from './apiClient';

// DTOs
export interface EvaluationNote {
  id: string;
  applicantId: string;
  jobId: string;
  note: string;
  noteType: 'evaluation' | 'interview' | 'general';
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateNoteDto {
  applicantId: string;
  jobId: string;
  note: string;
  noteType: 'evaluation' | 'interview' | 'general';
}

export interface UpdateNoteDto {
  note: string;
  noteType?: 'evaluation' | 'interview' | 'general';
}

// Evaluation notes service functions
export const evaluationNotesService = {
  // Get all notes for an applicant
  getNotes: async (applicantId: string, jobId: string): Promise<EvaluationNote[]> => {
    const response = await apiClient.get(`/applicants/${applicantId}/notes`, {
      params: { jobId }
    });
    return response.data;
  },

  // Create a new note
  createNote: async (data: CreateNoteDto): Promise<EvaluationNote> => {
    const response = await apiClient.post(`/applicants/${data.applicantId}/notes`, data);
    return response.data;
  },

  // Update an existing note
  updateNote: async (applicantId: string, noteId: string, data: UpdateNoteDto): Promise<EvaluationNote> => {
    const response = await apiClient.put(`/applicants/${applicantId}/notes/${noteId}`, data);
    return response.data;
  },

  // Delete a note
  deleteNote: async (applicantId: string, noteId: string): Promise<void> => {
    await apiClient.delete(`/applicants/${applicantId}/notes/${noteId}`);
  }
};