const API_BASE_URL = 'https://api.gymkhana.com/api/v1';

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
    options: RequestInit & { includeAuth?: boolean } = {}
  ): Promise<ApiResponse<T>> {
    try {
      const includeAuth = options.includeAuth !== false;
      const { includeAuth: _, ...fetchOptions } = options;
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        ...fetchOptions,
        headers: { ...this.getHeaders(includeAuth), ...fetchOptions.headers }
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Request failed');
      }

      return data;
    } catch (error) {
      // Mock API simulation for development
      return this.simulateApiCall<T>(endpoint, options);
    }
  }

  private async simulateApiCall<T>(endpoint: string, options: RequestInit): Promise<ApiResponse<T>> {
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
      if (body.otp === '123456') {
        const mockUser = {
          id: body.phone.includes('owner') ? 1 : 2,
          phone: body.phone,
          email: body.phone.includes('owner') ? 'owner@gym.com' : 'member@gym.com',
          name: body.phone.includes('owner') ? 'Gym Owner' : 'John Member',
          role: body.phone.includes('owner') ? 'OWNER' : 'MEMBER',
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
        throw new Error('Invalid OTP');
      }
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

    // Default fallback
    return {
      success: true,
      data: {} as T
    };
  }

  // Authentication methods
  async sendOTP(phone: string, type: 'LOGIN' | 'SIGNUP' | 'RESET' = 'LOGIN') {
    return this.makeRequest<{phone: string, expiresIn: number, type: string}>('/auth/send-otp', {
      method: 'POST',
      body: JSON.stringify({ phone, type })
    });
  }

  async verifyOTP(phone: string, otp: string, type: 'LOGIN' = 'LOGIN') {
    return this.makeRequest<{token: string, user: any}>('/auth/verify-otp', {
      method: 'POST',
      body: JSON.stringify({ phone, otp, type })
    });
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
}

export const apiService = new ApiService();
export default apiService;