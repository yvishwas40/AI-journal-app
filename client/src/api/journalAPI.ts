import api from './axiosConfig';

export interface JournalEntry {
  _id: string;
  userId: string;
  text: string;
  summary: string;
  mood: string;
  createdAt: string;
  updatedAt: string;
}

export const journalAPI = {
  createEntry: (text: string) =>
    api.post('/entries', { text }),
    
  getEntries: (page = 1, limit = 10) =>
    api.get(`/entries?page=${page}&limit=${limit}`),
    
  deleteEntry: (id: string) =>
    api.delete(`/entries/${id}`),
};