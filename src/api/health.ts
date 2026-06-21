import { apiRequest } from './client';

export function checkApiHealth() {
  return apiRequest<{ status: string }>('/api/health');
}
