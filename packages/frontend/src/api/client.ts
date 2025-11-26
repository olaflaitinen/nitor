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

  async updateContent(id: string, data: any) {
    const response = await this.client.put(`/api/content/${id}`, data);
    return response.data;
  }

  async deleteContent(id: string) {
    await this.client.delete(`/api/content/${id}`);
  }

  async getUserContent(userId: string, page = 0, size = 20) {
    const response = await this.client.get(`/api/content/user/${userId}`, {
      params: { page, size },
    });
    return response.data;
  }

  async searchContent(query: string, page = 0, size = 20) {
    const response = await this.client.get('/api/content/search', {
      params: { query, page, size },
    });
    return response.data;
  }

  // Comment endpoints
  async getComments(contentId: string, page = 0, size = 20) {
    const response = await this.client.get(`/api/content/${contentId}/comments`, {
      params: { page, size },
    });
    return response.data;
  }

  async createComment(contentId: string, body: string, parentCommentId?: string) {
    const response = await this.client.post(`/api/content/${contentId}/comments`, {
      body,
      parentCommentId,
    });
    return response.data;
  }

  async updateComment(contentId: string, commentId: string, body: string) {
    const response = await this.client.put(`/api/content/${contentId}/comments/${commentId}`, { body });
    return response.data;
  }

  async deleteComment(contentId: string, commentId: string) {
    await this.client.delete(`/api/content/${contentId}/comments/${commentId}`);
  }

  // CV endpoints
  async getUserCV(userId: string) {
    const response = await this.client.get(`/api/cv/${userId}`);
    return response.data;
  }

  async addEducation(data: any) {
    const response = await this.client.post('/api/cv/education', data);
    return response.data;
  }

  async updateEducation(id: string, data: any) {
    const response = await this.client.put(`/api/cv/education/${id}`, data);
    return response.data;
  }

  async deleteEducation(id: string) {
    await this.client.delete(`/api/cv/education/${id}`);
  }

  async addExperience(data: any) {
    const response = await this.client.post('/api/cv/experience', data);
    return response.data;
  }

  async deleteExperience(id: string) {
    await this.client.delete(`/api/cv/experience/${id}`);
  }

  async addProject(data: any) {
    const response = await this.client.post('/api/cv/projects', data);
    return response.data;
  }

  async deleteProject(id: string) {
    await this.client.delete(`/api/cv/projects/${id}`);
  }

  // Notification endpoints
  async getNotifications(page = 0, size = 20) {
    const response = await this.client.get('/api/notifications', {
      params: { page, size },
    });
    return response.data;
  }

  async getUnreadCount() {
    const response = await this.client.get('/api/notifications/unread-count');
    return response.data;
  }

  async markNotificationAsRead(id: string) {
    await this.client.put(`/api/notifications/${id}/read`);
  }

  async markAllNotificationsAsRead() {
    await this.client.put('/api/notifications/read-all');
  }

  // File upload endpoints
  async uploadAvatar(file: File) {
    const formData = new FormData();
    formData.append('file', file);
    const response = await this.client.post('/api/upload/avatar', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data.url;
  }

  async uploadContentMedia(file: File) {
    const formData = new FormData();
    formData.append('file', file);
    const response = await this.client.post('/api/upload/content', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data.url;
  }

  // Interaction endpoints
  async endorseContent(contentId: string) {
    const response = await this.client.post(`/api/content/${contentId}/endorse`);
    return response.data;
  }

  async unendorseContent(contentId: string) {
    await this.client.delete(`/api/content/${contentId}/endorse`);
  }

  async repostContent(contentId: string, commentary?: string) {
    const response = await this.client.post(`/api/content/${contentId}/repost`,
      commentary ? { commentary } : null
    );
    return response.data;
  }

  async unrepostContent(contentId: string) {
    await this.client.delete(`/api/content/${contentId}/repost`);
  }

  async getContentStats(contentId: string) {
    const response = await this.client.get(`/api/content/${contentId}/stats`);
    return response.data;
  }

  async bookmarkContent(contentId: string) {
    await this.client.post(`/api/content/${contentId}/bookmark`);
  }

  async unbookmarkContent(contentId: string) {
    await this.client.delete(`/api/content/${contentId}/bookmark`);
  }

  // Follow endpoints
  async followUser(userId: string) {
    const response = await this.client.post(`/api/follow/${userId}`);
    return response.data;
  }

  async unfollowUser(userId: string) {
    await this.client.delete(`/api/follow/${userId}`);
  }

  async getFollowers(userId: string, page = 0, size = 20) {
    const response = await this.client.get(`/api/follow/${userId}/followers`, {
      params: { page, size },
    });
    return response.data;
  }

  async getFollowing(userId: string, page = 0, size = 20) {
    const response = await this.client.get(`/api/follow/${userId}/following`, {
      params: { page, size },
    });
    return response.data;
  }

  async getFollowStats(userId: string) {
    const response = await this.client.get(`/api/follow/${userId}/stats`);
    return response.data;
  }

  async isFollowing(userId: string) {
    const response = await this.client.get(`/api/follow/is-following/${userId}`);
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
