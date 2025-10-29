import axios from 'axios'
import { useAuthStore } from '../store/authStore'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000'

// Create axios instance
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = useAuthStore.getState().token
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Response interceptor to handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Unauthorized - logout user
      useAuthStore.getState().logout()
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

export default api

// ============================================
// API Service Functions
// ============================================

// Auth
export const authApi = {
  register: (data: any) => api.post('/api/auth/register', data),
  login: (data: any) => api.post('/api/auth/login', data),
  me: () => api.get('/api/auth/me'),
  logout: () => api.post('/api/auth/logout'),
}

// AI
export const aiApi = {
  generateCaption: (data: any) => api.post('/api/ai/generate-caption', data),
  generateHashtags: (data: any) => api.post('/api/ai/generate-hashtags', data),
  generateImage: (data: any) => api.post('/api/ai/generate-image', data),
  translate: (data: any) => api.post('/api/ai/translate', data),
}

// Posts
export const postApi = {
  create: (data: any) => api.post('/api/posts', data),
  list: (params?: any) => api.get('/api/posts', { params }),
  get: (id: string) => api.get(`/api/posts/${id}`),
  update: (id: string, data: any) => api.patch(`/api/posts/${id}`, data),
  delete: (id: string) => api.delete(`/api/posts/${id}`),
  schedule: (id: string, data: any) => api.post(`/api/posts/${id}/schedule`, data),
  publish: (id: string) => api.post(`/api/posts/${id}/publish`),
}

// WhatsApp
export const whatsappApi = {
  sendMessage: (data: any) => api.post('/api/whatsapp/send-message', data),
  sendBroadcast: (data: any) => api.post('/api/whatsapp/send-broadcast', data),
  sendChannel: (data: any) => api.post('/api/whatsapp/send-channel', data),
}

// Facebook
export const facebookApi = {
  uploadMedia: (data: any) => api.post('/api/facebook/upload-media', data),
  createPost: (data: any) => api.post('/api/facebook/create-post', data),
  getPageInsights: () => api.get('/api/facebook/page-insights'),
}

// Instagram
export const instagramApi = {
  createContainer: (data: any) => api.post('/api/instagram/create-container', data),
  publish: (data: any) => api.post('/api/instagram/publish', data),
  getAccountInsights: () => api.get('/api/instagram/account-insights'),
}

// LinkedIn
export const linkedinApi = {
  uploadMedia: (data: any) => api.post('/api/linkedin/upload-media', data),
  publish: (data: any) => api.post('/api/linkedin/publish', data),
  getOrganization: () => api.get('/api/linkedin/organization'),
}

// Analytics
export const analyticsApi = {
  overview: () => api.get('/api/analytics/overview'),
  engagement: () => api.get('/api/analytics/engagement'),
  platforms: () => api.get('/api/analytics/platforms'),
}

