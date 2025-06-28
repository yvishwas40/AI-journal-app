import api from './axiosConfig';

export const authAPI = {
  login: (email: string, password: string) =>
    api.post('/auth/login', { email, password }),
    
  register: (name: string, email: string, password: string) =>
    api.post('/auth/register', { name, email, password }),
    
  verifyToken: () =>
    api.get('/auth/verify'),
};