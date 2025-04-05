import { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { useToast } from './ToastContext';

// Define the User type
interface User {
  id: string;
  email: string;
  name?: string;
}

// Define the AuthContext type
interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  signup: (email: string, password: string, name?: string) => Promise<boolean>;
  logout: () => void;
  resetPassword: (email: string) => Promise<boolean>;
  isLoading: boolean;
}

// Create the context with a default value
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Hook to use the auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// Provider component
export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { showToast } = useToast();

  // Check if the user is logged in on initial load
  useEffect(() => {
    const storedUser = localStorage.getItem('ar-menu-user');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        console.error('Failed to parse stored user:', error);
        localStorage.removeItem('ar-menu-user');
      }
    }
    setIsLoading(false);
  }, []);

  // Login function
  const login = async (email: string, password: string): Promise<boolean> => {
    // In a real app, this would make an API call to authenticate
    // For now, we'll simulate a successful login with any non-empty values
    try {
      setIsLoading(true);
      
      // Simple validation
      if (!email || !password) {
        throw new Error('Email and password are required');
      }
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Create a new user
      const newUser: User = {
        id: `user-${Date.now()}`,
        email,
        name: email.split('@')[0],
      };
      
      // Store user in localStorage
      localStorage.setItem('ar-menu-user', JSON.stringify(newUser));
      setUser(newUser);
      showToast('Login successful!', 'success');
      return true;
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to login';
      showToast(message, 'error');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // Signup function
  const signup = async (email: string, password: string, name?: string): Promise<boolean> => {
    try {
      setIsLoading(true);
      
      // Simple validation
      if (!email || !password) {
        throw new Error('Email and password are required');
      }
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Create a new user
      const newUser: User = {
        id: `user-${Date.now()}`,
        email,
        name: name || email.split('@')[0],
      };
      
      // Store user in localStorage
      localStorage.setItem('ar-menu-user', JSON.stringify(newUser));
      setUser(newUser);
      showToast('Account created successfully!', 'success');
      return true;
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to create account';
      showToast(message, 'error');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // Logout function
  const logout = () => {
    localStorage.removeItem('ar-menu-user');
    setUser(null);
    showToast('You have been logged out', 'info');
  };

  // Reset password function
  const resetPassword = async (email: string): Promise<boolean> => {
    try {
      setIsLoading(true);
      
      // Simple validation
      if (!email) {
        throw new Error('Email is required');
      }
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 800));
      
      showToast('Password reset instructions sent to your email', 'success');
      return true;
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to reset password';
      showToast(message, 'error');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // Context value
  const value = {
    user,
    login,
    signup,
    logout,
    resetPassword,
    isLoading
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
