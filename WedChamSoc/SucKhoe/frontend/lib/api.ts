/**
 * API client for Elderly Health Support System
 */

import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import Cookies from 'js-cookie';
import {
  User,
  UserCreate,
  UserUpdate,
  HealthProfile,
  HealthProfileCreate,
  HealthRecord,
  HealthRecordCreate,
  Medication,
  MedicationCreate,
  Schedule,
  ScheduleCreate,
  Reminder,
  ChatSession,
  ChatMessage,
  ChatResponse,
  ApiResponse,
} from '@/types';

// API configuration
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8001/api';

// Create axios instance
const createApiClient = (): AxiosInstance => {
  const client = axios.create({
    baseURL: API_BASE_URL,
    timeout: 10000,
    headers: {
      'Content-Type': 'application/json',
    },
  });

  // Request interceptor to add auth token
  client.interceptors.request.use(
    async (config) => {
      try {
        // Get token from cookies (simple auth)
        if (typeof window !== 'undefined') {
          const token = Cookies.get('auth_token');
          console.log('🔑 Token from cookies:', token ? `${token.substring(0, 20)}...` : 'NO TOKEN');

          if (token) {
            // Decode token to check if it's valid
            try {
              const payload = JSON.parse(atob(token.split('.')[1]));
              console.log('🔍 Token payload:', payload);
              console.log('⏰ Token expires:', new Date(payload.exp * 1000));
              console.log('🕐 Current time:', new Date());

              if (payload.exp * 1000 < Date.now()) {
                console.error('❌ Token has expired!');
              } else {
                console.log('✅ Token is still valid');
              }
            } catch (e) {
              console.error('❌ Failed to decode token:', e);
            }

            config.headers.Authorization = `Bearer ${token}`;
            console.log('✅ Authorization header set');
          } else {
            console.warn('❌ No auth token found in cookies');
          }
        }
      } catch (error) {
        console.warn('Failed to get auth token:', error);
      }
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  // Response interceptor for error handling
  client.interceptors.response.use(
    (response: AxiosResponse) => response,
    (error) => {
      // Log error for debugging
      console.error('API Error:', {
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data,
        url: error.config?.url,
        method: error.config?.method,
        headers: error.config?.headers
      });

      if (error.response?.status === 401) {
        // Redirect to login on unauthorized
        console.warn('401 Unauthorized - redirecting to login');
        // TEMPORARILY DISABLED FOR DEBUGGING
        // if (typeof window !== 'undefined') {
        //   Cookies.remove('auth_token');
        //   window.location.href = '/auth/login';
        // }
      }
      return Promise.reject(error);
    }
  );

  return client;
};

// API client instance
const apiClient = createApiClient();

// Generic API request function
const apiRequest = async <T>(
  method: 'GET' | 'POST' | 'PUT' | 'DELETE',
  url: string,
  data?: any,
  config?: AxiosRequestConfig
): Promise<T> => {
  try {
    const response = await apiClient.request<T>({
      method,
      url,
      data,
      ...config,
    });
    return response.data;
  } catch (error: any) {
    console.error(`API ${method} ${url} error:`, error);
    throw new Error(
      error.response?.data?.message ||
      error.message ||
      'An unexpected error occurred'
    );
  }
};

// Auth API
export const authApi = {
  // Login
  login: async (email: string, password: string): Promise<{ access_token: string; user: User }> => {
    const response = await apiRequest<{ access_token: string; user: User }>('POST', '/auth/login', {
      email,
      password,
    });

    // Store token in cookies
    if (typeof window !== 'undefined' && response.access_token) {
      Cookies.set('auth_token', response.access_token, { expires: 1 });
    }

    return response;
  },

  // Register
  register: async (userData: UserCreate & { password: string }): Promise<{ access_token: string; user: User }> => {
    const response = await apiRequest<{ access_token: string; user: User }>('POST', '/auth/register', userData);

    // Store token in cookies
    if (typeof window !== 'undefined' && response.access_token) {
      Cookies.set('auth_token', response.access_token, { expires: 1 });
    }

    return response;
  },

  // Logout
  logout: (): void => {
    if (typeof window !== 'undefined') {
      Cookies.remove('auth_token');
      window.location.href = '/auth/login';
    }
  },

  // Check if user is authenticated
  isAuthenticated: (): boolean => {
    if (typeof window !== 'undefined') {
      return !!Cookies.get('auth_token');
    }
    return false;
  },

  // Get current user info
  getCurrentUser: (): Promise<User> =>
    apiRequest<User>('GET', '/auth/me'),
};

// User API
export const userApi = {
  // Get current user profile
  getCurrentUser: (): Promise<User> =>
    apiRequest<User>('GET', '/users/me'),

  // Create user profile
  createUser: (userData: UserCreate): Promise<User> =>
    apiRequest<User>('POST', '/users', userData),

  // Update user profile
  updateUser: (userData: UserUpdate): Promise<User> =>
    apiRequest<User>('PUT', '/users/me', userData),

  // Get health profile
  getHealthProfile: (): Promise<HealthProfile> =>
    apiRequest<HealthProfile>('GET', '/users/me/health-profile'),

  // Create health profile
  createHealthProfile: (profileData: HealthProfileCreate): Promise<HealthProfile> =>
    apiRequest<HealthProfile>('POST', '/users/me/health-profile', profileData),

  // Update health profile
  updateHealthProfile: (profileData: HealthProfileCreate): Promise<HealthProfile> =>
    apiRequest<HealthProfile>('PUT', '/users/me/health-profile', profileData),

  // Get user settings
  getSettings: (): Promise<any[]> =>
    apiRequest<any[]>('GET', '/users/me/settings'),

  // Create/update user setting
  updateSetting: (key: string, value: string): Promise<any> =>
    apiRequest<any>('POST', '/users/me/settings', { setting_key: key, setting_value: value }),
};

// Health Records API
export const healthApi = {
  // Get health records
  getRecords: (params?: {
    record_type?: string;
    limit?: number;
    offset?: number;
    start_date?: string;
    end_date?: string;
  }): Promise<HealthRecord[]> =>
    apiRequest<HealthRecord[]>('GET', '/health/records', undefined, { params }),

  // Create health record
  createRecord: (recordData: HealthRecordCreate): Promise<HealthRecord> =>
    apiRequest<HealthRecord>('POST', '/health/records', recordData),

  // Get specific health record
  getRecord: (recordId: number): Promise<HealthRecord> =>
    apiRequest<HealthRecord>('GET', `/health/records/${recordId}`),

  // Delete health record
  deleteRecord: (recordId: number): Promise<void> =>
    apiRequest<void>('DELETE', `/health/records/${recordId}`),

  // Get health statistics
  getStats: (recordType: string): Promise<any> =>
    apiRequest<any>('GET', `/health/stats/${recordType}`),
};

// Medications API
export const medicationsApi = {
  // Get medications
  getMedications: (activeOnly: boolean = true): Promise<Medication[]> =>
    apiRequest<Medication[]>('GET', '/medications', undefined, {
      params: { active_only: activeOnly }
    }),

  // Create medication
  createMedication: (medicationData: MedicationCreate): Promise<Medication> =>
    apiRequest<Medication>('POST', '/medications', medicationData),

  // Get specific medication
  getMedication: (medicationId: number): Promise<Medication> =>
    apiRequest<Medication>('GET', `/medications/${medicationId}`),

  // Update medication
  updateMedication: (medicationId: number, medicationData: Partial<MedicationCreate>): Promise<Medication> =>
    apiRequest<Medication>('PUT', `/medications/${medicationId}`, medicationData),

  // Delete medication
  deleteMedication: (medicationId: number): Promise<void> =>
    apiRequest<void>('DELETE', `/medications/${medicationId}`),
};

// Schedules API
export const schedulesApi = {
  // Get schedules
  getSchedules: (params?: {
    schedule_type?: string;
    upcoming_only?: boolean;
    start_date?: string;
    end_date?: string;
    limit?: number;
    offset?: number;
  }): Promise<Schedule[]> =>
    apiRequest<Schedule[]>('GET', '/schedules', undefined, { params }),

  // Create schedule
  createSchedule: (scheduleData: ScheduleCreate): Promise<Schedule> =>
    apiRequest<Schedule>('POST', '/schedules', scheduleData),

  // Get today's schedules
  getTodaySchedules: (): Promise<Schedule[]> =>
    apiRequest<Schedule[]>('GET', '/schedules/today'),

  // Get specific schedule
  getSchedule: (scheduleId: number): Promise<Schedule> =>
    apiRequest<Schedule>('GET', `/schedules/${scheduleId}`),

  // Update schedule
  updateSchedule: (scheduleId: number, scheduleData: Partial<ScheduleCreate>): Promise<Schedule> =>
    apiRequest<Schedule>('PUT', `/schedules/${scheduleId}`, scheduleData),

  // Delete schedule
  deleteSchedule: (scheduleId: number): Promise<void> =>
    apiRequest<void>('DELETE', `/schedules/${scheduleId}`),

  // Get reminders
  getReminders: (params?: {
    upcoming_only?: boolean;
    limit?: number;
  }): Promise<Reminder[]> =>
    apiRequest<Reminder[]>('GET', '/schedules/reminders', undefined, { params }),

  // Mark reminder as read
  markReminderRead: (reminderId: number): Promise<void> =>
    apiRequest<void>('PUT', `/schedules/reminders/${reminderId}/read`),
};

// Chat API
export const chatApi = {
  // Create chat session
  createSession: (): Promise<ChatSession> =>
    apiRequest<ChatSession>('POST', '/chat/sessions'),

  // Get active session
  getActiveSession: (): Promise<ChatSession | null> =>
    apiRequest<ChatSession | null>('GET', '/chat/sessions/active'),

  // Send message
  sendMessage: (sessionId: number, content: string): Promise<ChatResponse> =>
    apiRequest<ChatResponse>('POST', `/chat/sessions/${sessionId}/messages`, { content }),

  // Get chat history
  getChatHistory: (sessionId: number): Promise<ChatMessage[]> =>
    apiRequest<ChatMessage[]>('GET', `/chat/sessions/${sessionId}/messages`),

  // End session
  endSession: (sessionId: number): Promise<void> =>
    apiRequest<void>('PUT', `/chat/sessions/${sessionId}/end`),
};

// Dashboard API
export const dashboardApi = {
  // Get dashboard stats
  getStats: (): Promise<any> =>
    apiRequest<any>('GET', '/dashboard/stats'),

  // Get recent activity
  getRecentActivity: (limit: number = 10): Promise<any[]> =>
    apiRequest<any[]>('GET', '/dashboard/activity', undefined, {
      params: { limit }
    }),

  // Get health summary
  getHealthSummary: (): Promise<any> =>
    apiRequest<any>('GET', '/dashboard/health-summary'),
};

// Utility functions
export const apiUtils = {
  // Check API health
  checkHealth: (): Promise<any> =>
    apiRequest<any>('GET', '/health'),

  // Get API info
  getInfo: (): Promise<any> =>
    apiRequest<any>('GET', '/info'),

  // Upload file (if needed)
  uploadFile: async (file: File, endpoint: string): Promise<any> => {
    const formData = new FormData();
    formData.append('file', file);

    return apiRequest<any>('POST', endpoint, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },
};

// Export default API client
export default apiClient;
