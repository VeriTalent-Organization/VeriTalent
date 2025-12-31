import { apiClient } from './apiClient';

// DTOs
export interface PurchaseTokensDto {
  bundle: number;
}

// Tokens service functions
export const tokensService = {
  // Get token balance
  getBalance: async () => {
    const response = await apiClient.get('/tokens/balance');
    return response.data;
  },

  // Get token history
  getHistory: async () => {
    const response = await apiClient.get('/tokens/history');
    return response.data;
  },

  // Purchase tokens
  purchase: async (data: PurchaseTokensDto) => {
    const response = await apiClient.post('/tokens/purchase', data);
    return response.data;
  },
};