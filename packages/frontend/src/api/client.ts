import axios, { AxiosInstance, AxiosError } from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';

class ApiClient {
  private client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      baseURL: API_BASE_URL,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Request interceptor to add auth token
    this.client.interceptors.request.use(
      (config) => {
        const token = localStorage.getItem('accessToken');
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    // Response interceptor for error handling
    this.client.interceptors.response.use(
      (response) => response,
      async (error: AxiosError) => {
        if (error.response?.status === 401) {
          // Token expired, logout user
          localStorage.removeItem('accessToken');
          localStorage.removeItem('refreshToken');
          window.location.href = '/';
        }
        return Promise.reject(error);
      }
    );
  }

  // Auth endpoints
  async register(data: { email: string; password: string; fullName: string; handle: string }) {
    const response = await this.client.post('/api/auth/register', data);
    return response.data;
  }

  async login(data: { email: string; password: string }) {
    const response = await this.client.post('/api/auth/login', data);
    return response.data;
  }

  async logout() {
    await this.client.post('/api/auth/logout');
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
  }

  // Profile endpoints
  async getProfile(id: string) {
    const response = await this.client.get(`/api/profiles/${id}`);
    return response.data;
  }

  async updateProfile(id: string, data: any) {
    const response = await this.client.put(`/api/profiles/${id}`, data);
    return response.data;
  }

  async searchProfiles(query: string, page = 0, size = 20) {
    const response = await this.client.get('/api/profiles/search', {
      params: { query, page, size },
    });
    return response.data;
  }

  // Content endpoints
  async getFeed(page = 0, size = 20) {
    const response = await this.client.get('/api/content/feed', {
      params: { page, size },
    });
    return response.data;
  }

  async createContent(data: { type: string; body: string; title?: string; abstract?: string; keywords?: string[] }) {
    const response = await this.client.post('/api/content', data);
    return response.data;
  }

  async getContent(id: string) {
    const response = await this.client.get(`/api/content/${id}`);
    return response.data;
  }

  // AI endpoints
  async refineText(text: string) {
    const response = await axios.post(`${import.meta.env.VITE_AI_SERVICE_URL || 'http://localhost:3001'}/api/ai/refine-text`, { text });
    return response.data.refinedText;
  }

  async generateAbstract(title: string, notes: string) {
    const response = await axios.post(`${import.meta.env.VITE_AI_SERVICE_URL || 'http://localhost:3001'}/api/ai/generate-abstract`, { title, notes });
    return response.data.abstract;
  }

  async enhanceBio(text: string, context: string) {
    const response = await axios.post(`${import.meta.env.VITE_AI_SERVICE_URL || 'http://localhost:3001'}/api/ai/enhance-bio`, { text, context });
    return response.data.enhancedText;
  }
}

export const apiClient = new ApiClient();
