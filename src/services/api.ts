import type { Trainer, TrainerFormData } from '@/types';

// For local development, use a relative path or your local API URL
const API_BASE_URL = '/api/v1';

// For production, you might want to use an environment variable
// const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api/v1';

interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data?: T;
  errorCode?: string;
  timestamp?: string;
  details?: any;
}

class ApiService {
  private getHeaders(includeAuth = true): HeadersInit {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    };

    if (includeAuth) {
      const token = localStorage.getItem('authToken');
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }
    }

    return headers;
  }

  private async makeRequest<T>(
    endpoint: string, 
    options: RequestInit & { 
      includeAuth?: boolean;
      params?: Record<string, any>;
    } = {}
  ): Promise<ApiResponse<T>> {
    // Use mock API in development
    if (process.env.NODE_ENV === 'development') {
      return this.simulateApiCall<T>(endpoint, options, options.params);
    }

    try {
      const includeAuth = options.includeAuth !== false;
      const { includeAuth: _, params, ...fetchOptions } = options;
      
      // Build URL with query parameters
      const url = new URL(`${API_BASE_URL}${endpoint}`, window.location.origin);
      if (params) {
        Object.entries(params).forEach(([key, value]) => {
          if (value !== undefined && value !== null) {
            url.searchParams.append(key, String(value));
          }
        });
      }
      
      // Don't set Content-Type for FormData, let the browser set it with the correct boundary
      const headers = { ...this.getHeaders(includeAuth) };
      if (!(fetchOptions.body instanceof FormData)) {
        headers['Content-Type'] = 'application/json';
      }

      const response = await fetch(url.toString(), {
        ...fetchOptions,
        headers: {
          ...headers,
          ...(fetchOptions.headers || {}),
        },
        // Only stringify the body if it's not FormData
        body: fetchOptions.body && !(fetchOptions.body instanceof FormData)
          ? JSON.stringify(fetchOptions.body)
          : fetchOptions.body,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        const error = new Error(errorData.message || `HTTP error! status: ${response.status}`);
        // @ts-ignore - cause is a valid property in newer TypeScript versions
        error.cause = errorData;
        throw error;
      }

      // Only try to parse as JSON if there's content
      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        return await response.json();
      }
      
      // For non-JSON responses, return a success response
      return { success: true } as ApiResponse<T>;
    } catch (error) {
      console.error('API request failed:', error);
      let errorMessage = 'An unknown error occurred';
      
      if (error instanceof TypeError) {
        if (error.message === 'Failed to fetch') {
          errorMessage = 'Unable to connect to the server. Please check your internet connection or try again later.';
        } else {
          errorMessage = error.message;
        }
      } else if (error instanceof Error) {
        errorMessage = error.message;
      }
      
      return {
        success: false,
        message: errorMessage,
        errorCode: 'NETWORK_ERROR',
      } as ApiResponse<T>;
    }
  }

  private async simulateApiCall<T>(
    endpoint: string, 
    options: RequestInit,
    params?: Record<string, any>
  ): Promise<ApiResponse<T>> {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 500 + Math.random() * 1000));

    // Parse endpoint and method to determine response
    const method = options.method || 'GET';
    const body = options.body ? JSON.parse(options.body as string) : null;

    // Authentication endpoints
    if (endpoint === '/auth/send-otp' && method === 'POST') {
      return {
        success: true,
        message: 'OTP sent successfully',
        data: {
          phone: body.phone,
          expiresIn: 300,
          type: body.type
        } as T
      };
    }

    if (endpoint === '/auth/verify-otp' && method === 'POST') {
      // For demo purposes, accept any OTP that's 6 digits
      if (/^\d{6}$/.test(body.otp)) {
        const isOwner = body.phone.includes('owner') || body.phone === '1234567890';
        const mockUser = {
          id: isOwner ? 1 : 2,
          phone: body.phone.replace('+owner', ''), // Clean up the phone number
          email: isOwner ? 'owner@gym.com' : 'member@gym.com',
          name: isOwner ? 'Gym Owner' : 'John Member',
          role: isOwner ? 'OWNER' : 'MEMBER',
          isVerified: true,
          createdAt: new Date().toISOString()
        };

        const token = `mock_jwt_token_${mockUser.id}_${Date.now()}`;
        localStorage.setItem('authToken', token);

        return {
          success: true,
          message: 'Login successful',
          data: {
            token,
            user: mockUser
          } as T
        };
      } else {
        return {
          success: false,
          message: 'Invalid OTP. Please try again.',
          errorCode: 'INVALID_OTP'
        } as ApiResponse<T>;
      }
    }

    if (endpoint === '/signup/send-otp' && method === 'POST') {
      // Simulate checking if phone is already registered
      if (body.phone === '1234567890') {
        throw new Error('Phone already registered');
      }
      
      return {
        success: true,
        message: 'OTP sent successfully',
        data: {
          phone: body.phone,
          name: body.name,
          expiresIn: 300
        } as T
      };
    }

    if (endpoint === '/signup/verify-otp' && method === 'POST') {
      if (body.otp === '123456' || body.otp === '1234') {
        const mockUser = {
          id: Math.floor(Math.random() * 1000),
          phone: body.phone,
          email: `${body.phone}@gym.com`,
          name: 'New Member',
          role: 'MEMBER',
          isVerified: true,
          createdAt: new Date().toISOString()
        };

        const token = `mock_jwt_token_${mockUser.id}_${Date.now()}`;
        localStorage.setItem('authToken', token);

        return {
          success: true,
          message: 'Signup successful',
          data: {
            token,
            user: mockUser
          } as T
        };
      } else {
        throw new Error('Invalid OTP');
      }
    }

    if (endpoint === '/auth/signup-member' && method === 'POST') {
      return {
        success: true,
        message: 'Member registered successfully',
        data: {
          id: Math.floor(Math.random() * 1000),
          phone: body.phone,
          email: body.email,
          name: body.name,
          role: 'MEMBER',
          isVerified: false,
          createdAt: new Date().toISOString()
        } as T
      };
    }

    if (endpoint === '/auth/signup-owner' && method === 'POST') {
      return {
        success: true,
        message: 'Owner registered successfully',
        data: {
          id: Math.floor(Math.random() * 1000),
          phone: body.phone,
          email: body.email,
          name: body.name,
          role: 'OWNER',
          isVerified: false,
          createdAt: new Date().toISOString()
        } as T
      };
    }

    if (endpoint === '/auth/profile' && method === 'GET') {
      const token = localStorage.getItem('authToken');
      if (!token) throw new Error('Unauthorized');

      const isOwner = token.includes('_1_');
      return {
        success: true,
        data: {
          id: isOwner ? 1 : 2,
          phone: isOwner ? '+1234567890' : '+9876543210',
          email: isOwner ? 'owner@gym.com' : 'member@gym.com',
          name: isOwner ? 'Gym Owner' : 'John Member',
          role: isOwner ? 'OWNER' : 'MEMBER',
          isVerified: true,
          createdAt: '2024-01-15T10:00:00Z'
        } as T
      };
    }

    // Gym endpoints
    if (endpoint === '/gyms' && method === 'GET') {
      return {
        success: true,
        data: {
          content: [
            {
              id: 1,
              name: 'PowerHouse Fitness',
              address: '123 Fitness Street, Gym City',
              phone: '+1234567890',
              email: 'powerhouse@gym.com',
              description: 'Premium fitness center with state-of-the-art equipment',
              ownerId: 1,
              status: 'ACTIVE',
              createdAt: '2024-01-15T10:00:00Z',
              fees: {
                monthlyFee: 999.99,
                quarterlyFee: 2499.99,
                yearlyFee: 8999.99
              }
            }
          ],
          totalElements: 1,
          totalPages: 1,
          size: 10,
          number: 0
        } as T
      };
    }

    if (endpoint === '/gyms/available' && method === 'GET') {
      return {
        success: true,
        data: [
          {
            id: 1,
            name: 'PowerHouse Fitness',
            address: '123 Fitness Street, Gym City',
            phone: '+1234567890',
            email: 'powerhouse@gym.com',
            description: 'Premium fitness center',
            fees: {
              monthlyFee: 999.99,
              quarterlyFee: 2499.99,
              yearlyFee: 8999.99
            }
          },
          {
            id: 2,
            name: 'Elite Gym',
            address: '456 Strength Ave, Fitness Town',
            phone: '+9876543210',
            email: 'elite@gym.com',
            description: 'Elite training facility',
            fees: {
              monthlyFee: 1499.99,
              quarterlyFee: 3599.99,
              yearlyFee: 12999.99
            }
          }
        ] as T
      };
    }

    // Membership endpoints
    if (endpoint === '/memberships/my' && method === 'GET') {
      return {
        success: true,
        data: [
          {
            id: 1,
            totalAmount: 4499.97,
            durationMonths: 12,
            startDate: '2024-02-01',
            status: 'ACTIVE',
            createdAt: '2024-01-15T10:00:00Z',
            approvalStatus: {
              totalGyms: 2,
              approvedGyms: 2,
              pendingGyms: 0,
              rejectedGyms: 0
            },
            gyms: [
              {
                gymId: 1,
                gymName: 'PowerHouse Fitness',
                individualFee: 999.99,
                status: 'APPROVED'
              },
              {
                gymId: 2,
                gymName: 'Elite Gym',
                individualFee: 1499.99,
                status: 'APPROVED'
              }
            ]
          }
        ] as T
      };
    }

    if (endpoint === '/memberships/pending-approvals' && method === 'GET') {
      return {
        success: true,
        data: [
          {
            membershipId: 2,
            memberId: 3,
            memberName: 'Jane Smith',
            memberPhone: '+1111111111',
            gymId: 1,
            gymName: 'PowerHouse Fitness',
            individualFee: 999.99,
            requestedAt: '2024-01-15T09:00:00Z',
            status: 'PENDING'
          },
          {
            membershipId: 3,
            memberId: 4,
            memberName: 'Bob Johnson',
            memberPhone: '+2222222222',
            gymId: 1,
            gymName: 'PowerHouse Fitness',
            individualFee: 999.99,
            requestedAt: '2024-01-15T08:30:00Z',
            status: 'PENDING'
          }
        ] as T
      };
    }

    // Attendance endpoints
    if (endpoint === '/attendance/my' && method === 'GET') {
      return {
        success: true,
        data: {
          content: [
            {
              id: 1,
              gymId: 1,
              gymName: 'PowerHouse Fitness',
              checkInTime: '2024-01-14T18:30:00Z',
              checkOutTime: '2024-01-14T20:15:00Z',
              duration: 'PT1H45M',
              status: 'CHECKED_OUT'
            },
            {
              id: 2,
              gymId: 1,
              gymName: 'PowerHouse Fitness',
              checkInTime: '2024-01-12T07:00:00Z',
              checkOutTime: '2024-01-12T08:30:00Z',
              duration: 'PT1H30M',
              status: 'CHECKED_OUT'
            },
            {
              id: 3,
              gymId: 2,
              gymName: 'Elite Gym',
              checkInTime: '2024-01-10T19:15:00Z',
              checkOutTime: '2024-01-10T21:15:00Z',
              duration: 'PT2H',
              status: 'CHECKED_OUT'
            }
          ],
          totalElements: 3,
          totalPages: 1,
          size: 10,
          number: 0
        } as T
      };
    }

    // Expense endpoints
    if (endpoint === '/expenses' && method === 'GET') {
      const mockExpenses = [
        {
          id: '1',
          date: new Date().toISOString(),
          category: 'EQUIPMENT',
          amount: 15000,
          description: 'New treadmill',
          paymentMethod: 'CARD',
          paidById: '1',
          paidByName: 'John Doe',
          receiptUrl: '',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        {
          id: '2',
          date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
          category: 'RENT',
          amount: 50000,
          description: 'Monthly rent',
          paymentMethod: 'BANK_TRANSFER',
          paidById: '1',
          paidByName: 'John Doe',
          receiptUrl: '',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
      ];

      // Apply filters
      let filteredExpenses = [...mockExpenses];
      const { startDate, endDate, category, search } = params || {};

      if (startDate) {
        filteredExpenses = filteredExpenses.filter(
          exp => new Date(exp.date) >= new Date(startDate)
        );
      }

      if (endDate) {
        filteredExpenses = filteredExpenses.filter(
          exp => new Date(exp.date) <= new Date(endDate)
        );
      }

      if (category) {
        filteredExpenses = filteredExpenses.filter(
          exp => exp.category === category
        );
      }

      if (search) {
        const searchLower = search.toLowerCase();
        filteredExpenses = filteredExpenses.filter(
          exp => exp.description.toLowerCase().includes(searchLower)
        );
      }

      return {
        success: true,
        data: filteredExpenses as T
      };
    }

    if (endpoint.startsWith('/expenses/') && method === 'GET') {
      const id = endpoint.split('/').pop();
      const mockExpense = {
        id,
        date: new Date().toISOString(),
        category: 'EQUIPMENT',
        amount: 15000,
        description: 'New treadmill',
        paymentMethod: 'CARD',
        paidById: '1',
        paidByName: 'John Doe',
        receiptUrl: '',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      return {
        success: true,
        data: mockExpense as T
      };
    }

    if (endpoint === '/expenses' && method === 'POST') {
      const newExpense = {
        id: Date.now().toString(),
        ...body,
        paidByName: 'John Doe', // In a real app, this would come from the current user
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      return {
        success: true,
        message: 'Expense created successfully',
        data: newExpense as T
      };
    }

    if (endpoint.startsWith('/expenses/') && method === 'PUT') {
      const id = endpoint.split('/').pop();
      const updatedExpense = {
        id,
        ...body,
        updatedAt: new Date().toISOString(),
      };

      return {
        success: true,
        message: 'Expense updated successfully',
        data: updatedExpense as T
      };
    }

    if (endpoint.startsWith('/expenses/') && method === 'DELETE') {
      return {
        success: true,
        message: 'Expense deleted successfully'
      } as ApiResponse<T>;
    }

    // Default fallback
    return {
      success: true,
      data: {} as T
    };
  }

  // Authentication methods
  async sendOTP(phone: string, type: 'LOGIN' | 'SIGNUP' | 'RESET' = 'LOGIN') {
    // Use mock API for demo purposes
    try {
      const response = await this.simulateApiCall<{phone: string, expiresIn: number, type: string}>('/auth/send-otp', {
        method: 'POST',
        body: JSON.stringify({ phone, type })
      });
      
      // For demo purposes, we'll always return success for any valid phone number
      if (phone && phone.length > 0) {
        return {
          success: true,
          message: 'OTP sent successfully',
          data: {
            phone,
            expiresIn: 300, // 5 minutes
            type
          }
        };
      }
      
      return response;
    } catch (error) {
      console.error('Failed to send OTP:', error);
      return {
        success: false,
        message: 'Failed to send OTP. Please try again.',
        errorCode: 'SEND_OTP_FAILED'
      };
    }
  }

  async verifyOTP(phone: string, otp: string, type: 'LOGIN' = 'LOGIN') {
    // Use mock API for demo purposes
    try {
      const response = await this.simulateApiCall<{token: string, user: any}>('/auth/verify-otp', {
        method: 'POST',
        body: JSON.stringify({ phone, otp, type })
      });
      
      // If verification is successful, store the token
      if (response.success && response.data?.token) {
        localStorage.setItem('authToken', response.data.token);
      }
      
      return response;
    } catch (error) {
      console.error('OTP verification failed:', error);
      return {
        success: false,
        message: 'Failed to verify OTP',
        errorCode: 'VERIFICATION_FAILED'
      };
    }
  }

  async login(phone: string, otp: string) {
    return this.makeRequest<{token: string, user: any}>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ phone, otp })
    });
  }

  async getProfile() {
    return this.makeRequest<any>('/auth/profile');
  }

  async logout() {
    const result = await this.makeRequest<{}>('/auth/logout', { method: 'POST' });
    localStorage.removeItem('authToken');
    return result;
  }

  async signupMember(memberData: {phone: string, email: string, name: string}) {
    return this.makeRequest<any>('/auth/signup-member', {
      method: 'POST',
      body: JSON.stringify(memberData),
      includeAuth: false
    });
  }

  async signupOwner(ownerData: {phone: string, email: string, name: string}) {
    return this.makeRequest<any>('/auth/signup-owner', {
      method: 'POST',
      body: JSON.stringify(ownerData),
      includeAuth: false
    });
  }

  // Two-step signup methods
  async sendSignupOTP(userData: {name: string, phone: string}) {
    return this.makeRequest<any>('/signup/send-otp', {
      method: 'POST',
      body: JSON.stringify(userData),
      includeAuth: false
    });
  }

  async verifySignupOTP(otpData: {phone: string, otp: string}) {
    return this.makeRequest<any>('/signup/verify-otp', {
      method: 'POST',
      body: JSON.stringify(otpData),
      includeAuth: false
    });
  }

  // Gym methods
  async getAllGyms(page = 0, size = 10, sort = 'name,asc') {
    return this.makeRequest<any>(`/gyms?page=${page}&size=${size}&sort=${sort}`);
  }

  async getAvailableGyms() {
    return this.makeRequest<any[]>('/gyms/available');
  }

  async getGymById(id: number) {
    return this.makeRequest<any>(`/gyms/${id}`);
  }

  async createGym(gymData: any) {
    return this.makeRequest<any>('/gyms', {
      method: 'POST',
      body: JSON.stringify(gymData)
    });
  }

  async updateGym(id: number, gymData: any) {
    return this.makeRequest<any>(`/gyms/${id}`, {
      method: 'PUT',
      body: JSON.stringify(gymData)
    });
  }

  // Membership methods
  async createMembership(membershipData: {selectedGymIds: number[], durationMonths: number, startDate: string}) {
    return this.makeRequest<any>('/memberships/create', {
      method: 'POST',
      body: JSON.stringify(membershipData)
    });
  }

  async getMyMemberships() {
    return this.makeRequest<any[]>('/memberships/my');
  }

  async getPendingApprovals() {
    return this.makeRequest<any[]>('/memberships/pending-approvals');
  }

  async approveGymMembership(membershipId: number, gymId: number) {
    return this.makeRequest<any>(`/memberships/approve-gym/${membershipId}/${gymId}`, {
      method: 'POST'
    });
  }

  async rejectGymMembership(membershipId: number, gymId: number, reason: string, details: string) {
    return this.makeRequest<any>(`/memberships/reject-gym/${membershipId}/${gymId}`, {
      method: 'POST',
      body: JSON.stringify({ reason, details })
    });
  }

  // Attendance methods
  async checkIn(gymId: number) {
    return this.makeRequest<any>('/attendance/checkin', {
      method: 'POST',
      body: JSON.stringify({ gymId })
    });
  }

  async checkOut(gymId: number) {
    return this.makeRequest<any>('/attendance/checkout', {
      method: 'POST',
      body: JSON.stringify({ gymId })
    });
  }

  async getMyAttendance(page = 0, size = 10, sort = 'checkInTime,desc') {
    return this.makeRequest<any>(`/attendance/my?page=${page}&size=${size}&sort=${sort}`);
  }

  // Gym dashboard methods
  async getGymDashboard(gymId: number) {
    return this.makeRequest<any>(`/gyms/${gymId}/dashboard`);
  }

  async getGymMembers(gymId: number, page = 0, size = 10, sort = 'name,asc', status = 'ACTIVE') {
    return this.makeRequest<any>(`/gyms/${gymId}/members?page=${page}&size=${size}&sort=${sort}&status=${status}`);
  }

  async getAttendanceStats(gymId: number, startDate: string, endDate: string) {
    return this.makeRequest<any>(`/gyms/${gymId}/attendance-stats?startDate=${startDate}&endDate=${endDate}`);
  }

  // Expense Methods
  async getExpenses(params: { 
    startDate?: string; 
    endDate?: string; 
    category?: string; 
    search?: string 
  } = {}): Promise<ApiResponse<any[]>> {
    return this.makeRequest<any[]>('/expenses', {
      method: 'GET',
      params,
    });
  }

  async getExpense(id: string): Promise<ApiResponse<any>> {
    return this.makeRequest<any>(`/expenses/${id}`, {
      method: 'GET',
    });
  }

  async createExpense(data: FormData): Promise<ApiResponse<any>> {
    return this.makeRequest<any>('/expenses', {
      method: 'POST',
      body: data,
      headers: {
        // Let the browser set the Content-Type with boundary for FormData
        ...(data instanceof FormData ? {} : { 'Content-Type': 'application/json' }),
      },
    });
  }

  async updateExpense(id: string, data: FormData): Promise<ApiResponse<any>> {
    return this.makeRequest<any>(`/expenses/${id}`, {
      method: 'PUT',
      body: data,
      headers: {
        // Let the browser set the Content-Type with boundary for FormData
        ...(data instanceof FormData ? {} : { 'Content-Type': 'application/json' }),
      },
    });
  }

  async deleteExpense(id: string): Promise<ApiResponse<void>> {
    return this.makeRequest<void>(`/expenses/${id}`, {
      method: 'DELETE',
    });
  }

  // Trainer methods
  async getTrainers(params: { status?: string; search?: string } = {}): Promise<ApiResponse<Trainer[]>> {
    return this.makeRequest<Trainer[]>('/trainers', {
      method: 'GET',
      params,
    });
  }

  async getTrainer(id: string): Promise<ApiResponse<Trainer>> {
    return this.makeRequest<Trainer>(`/trainers/${id}`, {
      method: 'GET'
    });
  }

  async createTrainer(trainerData: TrainerFormData): Promise<ApiResponse<Trainer>> {
    return this.makeRequest<Trainer>('/trainers', {
      method: 'POST',
      body: JSON.stringify(trainerData)
    });
  }

  async updateTrainer(id: string, updates: Partial<TrainerFormData>): Promise<ApiResponse<Trainer>> {
    return this.makeRequest<Trainer>(`/trainers/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(updates)
    });
  }

  async deleteTrainer(id: string): Promise<ApiResponse<void>> {
    return this.makeRequest<void>(`/trainers/${id}`, {
      method: 'DELETE'
    });
  }

  async toggleTrainerStatus(id: string, status: string): Promise<ApiResponse<Trainer>> {
    return this.makeRequest<Trainer>(`/trainers/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status })
    });
  }
}

export const apiService = new ApiService();
export default apiService;