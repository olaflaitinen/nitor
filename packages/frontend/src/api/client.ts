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

  async changePassword(currentPassword: string, newPassword: string) {
    const response = await this.client.post('/api/auth/change-password', {
      currentPassword,
      newPassword
    });
    return response.data;
  }

  async deleteAccount() {
    const response = await this.client.delete('/api/auth/delete-account');
    return response.data;
  }

  async refreshToken(refreshToken: string) {
    const response = await this.client.post('/api/auth/refresh', { refreshToken });
    return response.data;
  }

  async forgotPassword(email: string) {
    const response = await this.client.post('/api/auth/forgot-password', { email });
    return response.data;
  }

  async resetPassword(token: string, newPassword: string) {
    const response = await this.client.post('/api/auth/reset-password', { token, newPassword });
    return response.data;
  }

  // OAuth endpoints
  async handleOAuthCallback(provider: string, code: string, state?: string) {
    const response = await this.client.get(`/api/auth/oauth2/callback/${provider}`, {
      params: { code, state }
    });
    return response.data;
  }

  async getOAuthStatus() {
    const response = await this.client.get('/api/auth/oauth2/status');
    return response.data;
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

  async deactivateProfile(id: string) {
    const response = await this.client.post(`/api/profiles/${id}/deactivate`);
    return response.data;
  }

  async searchProfiles(query: string, page = 0, size = 20) {
    const response = await this.client.get('/api/profiles/search', {
      params: { query, page, size },
    });
    return response.data;
  }

  async getProfileByHandle(handle: string) {
    const response = await this.client.get(`/api/profiles/handle/${handle}`);
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

  async updateExperience(id: string, data: any) {
    const response = await this.client.put(`/api/cv/experience/${id}`, data);
    return response.data;
  }

  async updateProject(id: string, data: any) {
    const response = await this.client.put(`/api/cv/projects/${id}`, data);
    return response.data;
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

  async reportContent(contentId: string, reason: string) {
    const response = await this.client.post(`/api/content/${contentId}/report`, null, {
      params: { reason }
    });
    return response.data;
  }

  async getContentEndorsements(contentId: string, page = 0, size = 20) {
    const response = await this.client.get(`/api/content/${contentId}/endorsements`, {
      params: { page, size }
    });
    return response.data;
  }

  async getUserBookmarks(page = 0, size = 20) {
    const response = await this.client.get('/api/content/any/bookmarks/user', {
      params: { page, size }
    });
    return response.data;
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

  // Search endpoints
  async searchGlobal(query: string, page = 0, size = 20) {
    const response = await this.client.get('/api/search/all', {
      params: { q: query, page, size }
    });
    return response.data;
  }

  // Admin endpoints
  async getPlatformStats() {
    const response = await this.client.get('/api/admin/stats');
    return response.data;
  }

  async getAllUsers(page = 0, size = 20, sort = 'createdAt,desc') {
    const response = await this.client.get('/api/admin/users', {
      params: { page, size, sort }
    });
    return response.data;
  }

  async searchUsers(query: string) {
    const response = await this.client.get('/api/admin/users/search', {
      params: { query }
    });
    return response.data;
  }

  async activateUser(userId: string) {
    const response = await this.client.put(`/api/admin/users/${userId}/activate`);
    return response.data;
  }

  async deactivateUser(userId: string) {
    const response = await this.client.put(`/api/admin/users/${userId}/deactivate`);
    return response.data;
  }

  async verifyProfile(profileId: string) {
    const response = await this.client.put(`/api/admin/profiles/${profileId}/verify`);
    return response.data;
  }

  async removeContentAdmin(contentId: string, reason: string = 'Violates community guidelines') {
    await this.client.delete(`/api/admin/content/${contentId}`, {
      params: { reason }
    });
  }

  async getReports(status?: string, page = 0, size = 20) {
    const response = await this.client.get('/api/admin/reports', {
      params: { status, page, size }
    });
    return response.data;
  }

  async updateReport(reportId: string, status: string, resolution: string = '') {
    const response = await this.client.put(`/api/admin/reports/${reportId}`, null, {
      params: { status, resolution }
    });
    return response.data;
  }

  async getAuditLogs(page = 0, size = 50) {
    const response = await this.client.get('/api/admin/audit-logs', {
      params: { page, size }
    });
    return response.data;
  }

  async getUserAuditLogs(userId: string, page = 0, size = 50) {
    const response = await this.client.get(`/api/admin/audit-logs/user/${userId}`, {
      params: { page, size }
    });
    return response.data;
  }

  // AI endpoints - Helper method
  private getAiServiceUrl() {
    return import.meta.env.VITE_AI_SERVICE_URL || 'http://localhost:3001';
  }

  // AI endpoints
  async refineText(text: string) {
    const response = await axios.post(`${this.getAiServiceUrl()}/api/ai/refine-text`, { text });
    return response.data.refinedText;
  }

  async generateAbstract(title: string, notes: string) {
    const response = await axios.post(`${this.getAiServiceUrl()}/api/ai/generate-abstract`, { title, notes });
    return response.data.abstract;
  }

  async enhanceBio(text: string, context: string) {
    const response = await axios.post(`${this.getAiServiceUrl()}/api/ai/enhance-bio`, { text, context });
    return response.data.enhancedText;
  }

  async plainLanguageSummary(text: string) {
    const response = await axios.post(`${this.getAiServiceUrl()}/api/ai/plain-language-summary`, { text });
    return response.data.summary;
  }

  async multiLevelSummary(text: string, level: string) {
    const response = await axios.post(`${this.getAiServiceUrl()}/api/ai/multi-level-summary`, { text, level });
    return response.data.summary;
  }

  async extractSkeleton(text: string) {
    const response = await axios.post(`${this.getAiServiceUrl()}/api/ai/extract-skeleton`, { text });
    return response.data.skeleton;
  }

  async checkConsistency(text: string) {
    const response = await axios.post(`${this.getAiServiceUrl()}/api/ai/check-consistency`, { text });
    return response.data.analysis;
  }

  async detectRepetition(text: string) {
    const response = await axios.post(`${this.getAiServiceUrl()}/api/ai/detect-repetition`, { text });
    return response.data.analysis;
  }

  async detectCitationNeeded(text: string) {
    const response = await axios.post(`${this.getAiServiceUrl()}/api/ai/detect-citation-needed`, { text });
    return response.data.analysis;
  }

  async improveMethods(text: string) {
    const response = await axios.post(`${this.getAiServiceUrl()}/api/ai/improve-methods`, { text });
    return response.data.improved;
  }

  async suggestLimitations(text: string) {
    const response = await axios.post(`${this.getAiServiceUrl()}/api/ai/suggest-limitations`, { text });
    return response.data.limitations;
  }

  async generateCaption(description: string, type: string) {
    const response = await axios.post(`${this.getAiServiceUrl()}/api/ai/generate-caption`, { description, type });
    return response.data.caption;
  }

  async generateTitleVariants(originalTitle: string, context?: string) {
    const response = await axios.post(`${this.getAiServiceUrl()}/api/ai/generate-title-variants`, { originalTitle, context });
    return response.data.variants;
  }

  async clarifyResearchQuestion(question: string) {
    const response = await axios.post(`${this.getAiServiceUrl()}/api/ai/clarify-research-question`, { question });
    return response.data.clarified;
  }

  async generateReviewerResponse(reviewComment: string, yourResponse: string) {
    const response = await axios.post(`${this.getAiServiceUrl()}/api/ai/generate-reviewer-response`, { reviewComment, yourResponse });
    return response.data.response;
  }

  async compressForPoster(text: string, targetWords: number) {
    const response = await axios.post(`${this.getAiServiceUrl()}/api/ai/compress-for-poster`, { text, targetWords });
    return response.data.compressed;
  }

  async generateSlideOutline(topic: string, duration: number) {
    const response = await axios.post(`${this.getAiServiceUrl()}/api/ai/generate-slide-outline`, { topic, duration });
    return response.data.outline;
  }

  async softenTone(text: string) {
    const response = await axios.post(`${this.getAiServiceUrl()}/api/ai/soften-tone`, { text });
    return response.data.softened;
  }

  async extractContributions(text: string) {
    const response = await axios.post(`${this.getAiServiceUrl()}/api/ai/extract-contributions`, { text });
    return response.data.contributions;
  }

  async generateResearchStatement(background: string, interests: string, goals: string) {
    const response = await axios.post(`${this.getAiServiceUrl()}/api/ai/generate-research-statement`, { background, interests, goals });
    return response.data.statement;
  }

  async generateTeachingStatement(experience: string, philosophy: string, approach: string) {
    const response = await axios.post(`${this.getAiServiceUrl()}/api/ai/generate-teaching-statement`, { experience, philosophy, approach });
    return response.data.statement;
  }

  async generateDiversityStatement(experiences: string, commitment: string, plans: string) {
    const response = await axios.post(`${this.getAiServiceUrl()}/api/ai/generate-diversity-statement`, { experiences, commitment, plans });
    return response.data.statement;
  }

  async tailorCV(cvContent: string, jobDescription: string) {
    const response = await axios.post(`${this.getAiServiceUrl()}/api/ai/tailor-cv`, { cvContent, jobDescription });
    return response.data.recommendations;
  }

  async extractSkills(text: string) {
    const response = await axios.post(`${this.getAiServiceUrl()}/api/ai/extract-skills`, { text });
    return response.data.skills;
  }

  async summarizeRole(roleDescription: string) {
    const response = await axios.post(`${this.getAiServiceUrl()}/api/ai/summarize-role`, { roleDescription });
    return response.data.summary;
  }

  async explainCareerGap(gapDetails: string) {
    const response = await axios.post(`${this.getAiServiceUrl()}/api/ai/explain-career-gap`, { gapDetails });
    return response.data.explanation;
  }

  async draftRecommendationLetter(candidateInfo: string, relationship: string, position: string) {
    const response = await axios.post(`${this.getAiServiceUrl()}/api/ai/draft-recommendation-letter`, { candidateInfo, relationship, position });
    return response.data.letter;
  }

  async generateBio(info: string, length: string, context: string) {
    const response = await axios.post(`${this.getAiServiceUrl()}/api/ai/generate-bio`, { info, length, context });
    return response.data.bio;
  }

  async findInterdisciplinaryConnections(research1: string, research2: string) {
    const response = await axios.post(`${this.getAiServiceUrl()}/api/ai/find-interdisciplinary-connections`, { research1, research2 });
    return response.data.connections;
  }

  async generateWeeklySummary(activities: string) {
    const response = await axios.post(`${this.getAiServiceUrl()}/api/ai/generate-weekly-summary`, { activities });
    return response.data.summary;
  }

  async curateReadingList(topic: string, level: string) {
    const response = await axios.post(`${this.getAiServiceUrl()}/api/ai/curate-reading-list`, { topic, level });
    return response.data.readingList;
  }

  async suggestReferences(context: string) {
    const response = await axios.post(`${this.getAiServiceUrl()}/api/ai/suggest-references`, { context });
    return response.data.suggestions;
  }

  async explainResearchTrend(trend: string) {
    const response = await axios.post(`${this.getAiServiceUrl()}/api/ai/explain-research-trend`, { trend });
    return response.data.explanation;
  }

  async suggestCommentDraft(postContent: string, context?: string) {
    const response = await axios.post(`${this.getAiServiceUrl()}/api/ai/suggest-comment-draft`, { postContent, context });
    return response.data.comment;
  }

  async classifyQuestion(question: string) {
    const response = await axios.post(`${this.getAiServiceUrl()}/api/ai/classify-question`, { question });
    return response.data.classification;
  }

  async analyzeDiscussionHealth(discussionText: string) {
    const response = await axios.post(`${this.getAiServiceUrl()}/api/ai/analyze-discussion-health`, { discussionText });
    return response.data.analysis;
  }

  async summarizeMeetingAgenda(notes: string) {
    const response = await axios.post(`${this.getAiServiceUrl()}/api/ai/summarize-meeting-agenda`, { notes });
    return response.data.agenda;
  }

  async generateCollaborationProposal(topic: string, partner: string, goal: string) {
    const response = await axios.post(`${this.getAiServiceUrl()}/api/ai/generate-collaboration-proposal`, { topic, partner, goal });
    return response.data.proposal;
  }

  async explainForExpertiseLevel(content: string, level: string) {
    const response = await axios.post(`${this.getAiServiceUrl()}/api/ai/explain-for-expertise-level`, { content, level });
    return response.data.explanation;
  }

  async structureReviewFeedback(feedback: string) {
    const response = await axios.post(`${this.getAiServiceUrl()}/api/ai/structure-review-feedback`, { feedback });
    return response.data.structured;
  }

  async generateSelfReviewChecklist(paperType: string) {
    const response = await axios.post(`${this.getAiServiceUrl()}/api/ai/generate-self-review-checklist`, { paperType });
    return response.data.checklist;
  }

  async generateInterviewQA(topic: string, role: string) {
    const response = await axios.post(`${this.getAiServiceUrl()}/api/ai/generate-interview-qa`, { topic, role });
    return response.data.qa;
  }

  async describeVisual(visualDescription: string) {
    const response = await axios.post(`${this.getAiServiceUrl()}/api/ai/describe-visual`, { visualDescription });
    return response.data.description;
  }

  async interpretResults(data: string, context: string) {
    const response = await axios.post(`${this.getAiServiceUrl()}/api/ai/interpret-results`, { data, context });
    return response.data.interpretation;
  }

  async formatStatisticalResults(results: string, testType: string) {
    const response = await axios.post(`${this.getAiServiceUrl()}/api/ai/format-statistical-results`, { results, testType });
    return response.data.formatted;
  }

  async summarizeCodeOfConduct(fullText: string) {
    const response = await axios.post(`${this.getAiServiceUrl()}/api/ai/summarize-code-of-conduct`, { fullText });
    return response.data.summary;
  }

  async generateOnboardingGuide(role: string, institution: string) {
    const response = await axios.post(`${this.getAiServiceUrl()}/api/ai/generate-onboarding-guide`, { role, institution });
    return response.data.guide;
  }

  async draftLabManifesto(values: string, goals: string, culture: string) {
    const response = await axios.post(`${this.getAiServiceUrl()}/api/ai/draft-lab-manifesto`, { values, goals, culture });
    return response.data.manifesto;
  }

  async generateEventDescription(eventDetails: string) {
    const response = await axios.post(`${this.getAiServiceUrl()}/api/ai/generate-event-description`, { eventDetails });
    return response.data.description;
  }

  async translateToSecondLanguage(text: string, targetLanguage: string) {
    const response = await axios.post(`${this.getAiServiceUrl()}/api/ai/translate-to-second-language`, { text, targetLanguage });
    return response.data.translation;
  }

  async alignTerminology(text: string, targetField: string) {
    const response = await axios.post(`${this.getAiServiceUrl()}/api/ai/align-terminology`, { text, targetField });
    return response.data.aligned;
  }

  async adjustTone(text: string, targetTone: string) {
    const response = await axios.post(`${this.getAiServiceUrl()}/api/ai/adjust-tone`, { text, targetTone });
    return response.data.adjusted;
  }

  async prioritizeNotifications(notifications: any[]) {
    const response = await axios.post(`${this.getAiServiceUrl()}/api/ai/prioritize-notifications`, { notifications });
    return response.data.prioritized;
  }

  async reviewGrantProposal(proposal: string, grantType: string) {
    const response = await axios.post(`${this.getAiServiceUrl()}/api/ai/review-grant-proposal`, { proposal, grantType });
    return response.data.review;
  }
}

export const apiClient = new ApiClient();
