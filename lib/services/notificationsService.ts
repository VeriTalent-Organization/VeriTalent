import { apiClient } from './apiClient';

// Notification types
export interface Notification {
  id: string;
  type: 'reference_request' | 'reference_status_update' | 'reference_issued' | 'application_update' | 'job_recommendation' | 'team_invitation' | 'certificate_verification' | 'lpi_completion';
  title: string;
  message: string;
  isRead: boolean;
  createdAt: string;
  data?: any; // Additional data specific to notification type
  actionUrl?: string; // URL to navigate to when clicked
}

// Notifications service functions
export const notificationsService = {
  // Get all notifications
  getAll: async (): Promise<Notification[]> => {
    try {
      const response = await apiClient.get('/notifications');
      return response.data || [];
    } catch (err: any) {
      // If endpoint not found, return empty list instead of throwing
      if (err?.response?.status === 404) {
        console.warn('[notificationsService] /notifications returned 404 — returning empty list');
        return [];
      }
      console.error('[notificationsService] getAll failed:', err);
      throw err;
    }
  },

  // Get unread notifications count
  getUnreadCount: async (): Promise<number> => {
    try {
      const response = await apiClient.get('/notifications/unread');
      return response?.data?.count ?? 0;
    } catch (err: any) {
      if (err?.response?.status === 404) {
        console.warn('[notificationsService] /notifications/unread returned 404 — returning 0');
        return 0;
      }
      console.error('[notificationsService] getUnreadCount failed:', err);
      throw err;
    }
  },

  // Mark notification as read
  markAsRead: async (notificationId: string): Promise<void> => {
    const response = await apiClient.put(`/notifications/${notificationId}/read`);
    return response.data;
  },

  // Mark all notifications as read
  markAllAsRead: async (): Promise<void> => {
    const response = await apiClient.put('/notifications/read-all');
    return response.data;
  },

  // Delete notification
  delete: async (notificationId: string): Promise<void> => {
    const response = await apiClient.delete(`/notifications/${notificationId}`);
    return response.data;
  },

  // Get reference-specific notifications
  getReferenceNotifications: async (): Promise<Notification[]> => {
    const response = await apiClient.get('/references/notifications');
    return response.data;
  },
};