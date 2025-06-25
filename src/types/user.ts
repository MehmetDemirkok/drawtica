export type UserRole = 'free' | 'premium';

export interface User {
  id: string;
  email: string;
  name?: string;
  role: UserRole;
  credits: number;
  premiumUntil?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface UserSession {
  user: User | null;
  isLoading: boolean;
  error?: string;
}

export interface AuthResponse {
  success: boolean;
  user?: User;
  error?: string;
}

export interface PricingPlan {
  id: string;
  name: string;
  price: number;
  credits: number;
  features: string[];
  recommended?: boolean;
} 