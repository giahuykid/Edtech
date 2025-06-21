// src/services/authService.ts
import api from '../config/api'; // Giữ nguyên api đã cấu hình

export interface TokenPair {
  accessToken: string;
  refreshToken: string;
}

export interface LoginRequest {
  username: string;
  password: string;
}

export interface RegisterRequest {
  fullName: string;
  username: string;
  password: string;
  confirmPassword: string;
}

export interface RefreshTokenRequest {
  refreshToken: string;
}

class AuthService {
  private static instance: AuthService;
  private isRefreshing = false;
  private failedQueue: Array<{
    resolve: (value?: any) => void;
    reject: (reason?: any) => void;
  }> = [];

  private constructor() {
    this.setupInterceptors();
  }

  public static getInstance(): AuthService {
    if (!AuthService.instance) {
      AuthService.instance = new AuthService();
    }
    return AuthService.instance;
  }

  private setupInterceptors(): void {
    api.interceptors.request.use(
        (config) => {
          const token = this.getAccessToken();
          // 👉 KHÔNG gán Authorization nếu token rỗng hoặc undefined
          if (token && token !== 'undefined') {
            config.headers.Authorization = `Bearer ${token}`;
          }
          return config;
        },
        (error) => Promise.reject(error)
    );

    api.interceptors.response.use(
        (response) => response,
        async (error) => {
          const originalRequest = error.config;

          if (
              error.response?.status === 401 &&
              !originalRequest._retry &&
              !originalRequest.url.includes('/auth/login') &&
              !originalRequest.url.includes('/auth/register')
          ) {
            if (this.isRefreshing) {
              return new Promise((resolve, reject) => {
                this.failedQueue.push({ resolve, reject });
              }).then(() => api(originalRequest));
            }

            originalRequest._retry = true;
            this.isRefreshing = true;

            const refreshToken = this.getRefreshToken();
            if (!refreshToken) {
              this.clearTokens();
              window.location.href = '/auth';
              return Promise.reject(error);
            }

            try {
              const response = await this.refreshToken({ refreshToken });
              this.setTokens(response.data);
              this.failedQueue.forEach(({ resolve }) => resolve());
              this.failedQueue = [];
              return api(originalRequest);
            } catch (refreshError) {
              this.failedQueue.forEach(({ reject }) => reject(refreshError));
              this.failedQueue = [];
              this.clearTokens();
              window.location.href = '/auth';
              return Promise.reject(refreshError);
            } finally {
              this.isRefreshing = false;
            }
          }

          return Promise.reject(error);
        }
    );
  }

  public async login(credentials: LoginRequest) {
    const response = await api.post('auth/login', credentials);
    this.setTokens(response.data);
    return response;
  }

  public async register(data: RegisterRequest) {
    return await api.post('auth/register', data); // không gắn token nếu chưa có
  }

  public async refreshToken(data: RefreshTokenRequest) {
    return await api.post('auth/refresh-token', data);
  }

  public logout() {
    this.clearTokens();
    window.location.href = '/auth';
  }

  private setTokens(tokens: TokenPair) {
    localStorage.setItem('accessToken', tokens.accessToken);
    localStorage.setItem('refreshToken', tokens.refreshToken);
  }

  private clearTokens() {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
  }

  public isAuthenticated(): boolean {
    return !!localStorage.getItem('accessToken');
  }

  public getAccessToken(): string | null {
    return localStorage.getItem('accessToken');
  }

  public getRefreshToken(): string | null {
    return localStorage.getItem('refreshToken');
  }
}

export default AuthService.getInstance();
