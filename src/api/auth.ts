import { apiRequest } from './client';
import type { User } from '../types';

interface LoginResponse {
  token: string;
  user: User;
}

interface MeResponse {
  user: User;
}

export function login(email: string, password: string) {
  return apiRequest<LoginResponse>('/api/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });
}

export function getMe() {
  return apiRequest<MeResponse>('/api/auth/me');
}
