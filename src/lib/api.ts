import Cookies from 'js-cookie';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

class ApiClient {
  private baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const token = Cookies.get('token');
    const url = `${this.baseUrl}${endpoint}`;

    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...(options.headers as Record<string, string> || {}),
    };

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(url, {
      ...options,
      headers,
      credentials: 'include',
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: 'An error occurred' }));
      throw new Error(error.message || `HTTP error! status: ${response.status}`);
    }

    return response.json();
  }

  // Auth
  async signup(data: { email: string; password: string; displayName: string; language: string }) {
    return this.request<{ user: any; token: string }>('/auth/signup', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async login(data: { email: string; password: string }) {
    return this.request<{ user: any; token: string }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async getMe() {
    return this.request<any>('/auth/me');
  }

  // Stories
  async getStories(params?: { tags?: string[]; page?: number; sort?: string; category?: string; authorId?: string }) {
    const query = new URLSearchParams();
    if (params?.tags) query.append('tags', params.tags.join(','));
    if (params?.page) query.append('page', params.page.toString());
    if (params?.sort) query.append('sort', params.sort);
    if (params?.category) query.append('category', params.category);
    if (params?.authorId) query.append('authorId', params.authorId);
    return this.request<any>(`/stories?${query.toString()}`);
  }

  async getStory(id: string) {
    return this.request<any>(`/stories/${id}`);
  }

  async createStory(data: { title: string; category: string; tags: string[]; language: string; content: string }) {
    return this.request<any>('/stories', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async likeStory(id: string) {
    return this.request<any>(`/stories/${id}/like`, { method: 'POST' });
  }

  async bookmarkStory(id: string) {
    return this.request<any>(`/stories/${id}/bookmark`, { method: 'POST' });
  }

  // Confessions
  async getConfessions(params?: { sort?: string; page?: number }) {
    const query = new URLSearchParams();
    if (params?.sort) query.append('sort', params.sort);
    if (params?.page) query.append('page', params.page.toString());
    return this.request<any>(`/confessions?${query.toString()}`);
  }

  async createConfession(data: { content: string; tags: string[] }) {
    return this.request<any>('/confessions', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async reactToConfession(id: string, reaction: string) {
    return this.request<any>(`/confessions/${id}/react`, {
      method: 'POST',
      body: JSON.stringify({ reaction }),
    });
  }

  // Communities
  async getCommunities() {
    return this.request<any>('/communities');
  }

  async getCommunity(slug: string) {
    return this.request<any>(`/communities/${slug}`);
  }

  async joinCommunity(slug: string) {
    return this.request<any>(`/communities/${slug}/join`, { method: 'POST' });
  }

  // Chat
  async getChats() {
    return this.request<any>('/chats');
  }

  async getChatThread(threadId: string) {
    return this.request<any>(`/chats/${threadId}`);
  }

  async getMessages(threadId: string, page?: number) {
    const query = page ? `?page=${page}` : '';
    return this.request<any>(`/chats/${threadId}/messages${query}`);
  }

  async sendMessageRequest(toUserId: string, preview: string) {
    return this.request<any>('/chats/request', {
      method: 'POST',
      body: JSON.stringify({ toUserId, preview }),
    });
  }

  async acceptMessageRequest(requestId: string) {
    return this.request<any>(`/chats/request/${requestId}/accept`, { method: 'POST' });
  }

  async rejectMessageRequest(requestId: string) {
    return this.request<any>(`/chats/request/${requestId}/reject`, { method: 'POST' });
  }

  // Comments
  async getComments(storyId: string, page?: number) {
    const query = page ? `?page=${page}` : '';
    return this.request<any>(`/stories/${storyId}/comments${query}`);
  }

  async createComment(storyId: string, content: string) {
    return this.request<any>(`/stories/${storyId}/comments`, {
      method: 'POST',
      body: JSON.stringify({ content }),
    });
  }

  // Tags
  async getTags(query?: string) {
    const params = query ? `?query=${query}` : '';
    return this.request<any>(`/tags${params}`);
  }

  // User
  async getUser(username: string) {
    return this.request<any>(`/users/${username}`);
  }

  async updateProfile(data: Partial<any>) {
    return this.request<any>('/users/me', {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  }

  async getBookmarks() {
    return this.request<any>('/users/me/bookmarks');
  }

  // Reading Progress
  async saveProgress(storyId: string, position: number, percentage: number) {
    return this.request<any>(`/users/me/progress`, {
      method: 'POST',
      body: JSON.stringify({ storyId, position, percentage }),
    });
  }

  async getProgress(storyId: string) {
    return this.request<any>(`/users/me/progress/${storyId}`);
  }

  // Feed
  async getForYouFeed(page?: number) {
    const query = page ? `?page=${page}` : '';
    return this.request<any>(`/feed/for-you${query}`);
  }

  // Reports
  async reportContent(type: string, targetId: string, reason: string) {
    return this.request<any>('/reports', {
      method: 'POST',
      body: JSON.stringify({ type, targetId, reason }),
    });
  }

  // Admin
  async getPendingStories() {
    return this.request<any>('/admin/stories/pending');
  }

  async approveStory(id: string) {
    return this.request<any>(`/admin/stories/${id}/approve`, { method: 'POST' });
  }

  async rejectStory(id: string, reason: string) {
    return this.request<any>(`/admin/stories/${id}/reject`, {
      method: 'POST',
      body: JSON.stringify({ reason }),
    });
  }

  async getReports() {
    return this.request<any>('/admin/reports');
  }
}

export const api = new ApiClient(API_URL);

