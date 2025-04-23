import { render, RenderOptions } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from '@/contexts/AuthContext';
import { ReactElement, ReactNode } from 'react';
import { vi } from 'vitest';
import * as authContext from '@/contexts/AuthContext';
import { User } from '@/types/auth';

interface AllProvidersProps {
  children: ReactNode;
}

// Wrapper that includes all providers
export const AllProviders = ({ children }: AllProvidersProps) => {
  return (
    <BrowserRouter>
      <AuthProvider>{children}</AuthProvider>
    </BrowserRouter>
  );
};

// Custom render with providers
export const renderWithProviders = (
  ui: ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>
) => render(ui, { wrapper: AllProviders, ...options });

// Mock navigation
export const mockNavigate = () => {
  const navigateMock = vi.fn();
  vi.mock('react-router-dom', async () => {
    const actual = await vi.importActual('react-router-dom');
    return {
      ...actual,
      useNavigate: () => navigateMock,
    };
  });
  return navigateMock;
};

// Helper to test protected routes
export const mockAuthContext = (isAuthenticated = true) => {
  const mockUser: User = {
    id: '1',
    name: 'Test User',
    email: 'test@example.com',
    role: 'user'
  };
  
  return vi.spyOn(authContext, 'useAuth').mockReturnValue({
    user: isAuthenticated ? mockUser : null,
    loading: false,
    login: vi.fn(),
    logout: vi.fn(),
    register: vi.fn(),
  });
}; 