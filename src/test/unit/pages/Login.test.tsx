import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from '@/contexts/AuthContext';
import Login from '@/pages/Login';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import * as authContext from '@/contexts/AuthContext';

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => vi.fn(),
  };
});

describe('Login', () => {
  const renderLogin = () => {
    return render(
      <BrowserRouter>
        <AuthProvider>
          <Login />
        </AuthProvider>
      </BrowserRouter>
    );
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders the login form correctly', () => {
    renderLogin();
    
    expect(screen.getByText('Login', { selector: '[data-slot="card-title"]' })).toBeInTheDocument();
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /login/i })).toBeInTheDocument();
    expect(screen.getByText(/don't have an account\?/i)).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /register/i })).toBeInTheDocument();
  });

  it('validates required fields', async () => {
    renderLogin();
    const user = userEvent.setup();
    
    await user.click(screen.getByRole('button', { name: /login/i }));
    
    await waitFor(() => {

      const emailError = screen.queryByText(/email is required/i) || 
                         screen.queryByText(/please enter a valid email address/i);
      const passwordError = screen.queryByText(/password is required/i) || 
                            screen.queryByText(/password must be at least/i);
                            
      expect(emailError).toBeTruthy();
      expect(passwordError).toBeTruthy();
    });
  });

  it('validates email format', async () => {
    renderLogin();
    const user = userEvent.setup();
    
    await user.type(screen.getByLabelText(/email/i), 'invalid-email');
    await user.type(screen.getByLabelText(/password/i), 'password123');
    await user.click(screen.getByRole('button', { name: /login/i }));
    
    await waitFor(() => {
      const emailError = screen.queryByText(/invalid email format/i) || 
                         screen.queryByText(/please enter a valid email address/i);
      expect(emailError).toBeTruthy();
    });
  });

  it('calls login function with correct credentials', async () => {

    const loginMock = vi.fn().mockResolvedValue({ success: true });
    vi.spyOn(authContext, 'useAuth').mockReturnValue({
      login: loginMock,
      user: null,
      loading: false,
      logout: vi.fn(),
      register: vi.fn(),
    });
    
    renderLogin();
    const user = userEvent.setup();
    
    await user.type(screen.getByLabelText(/email/i), 'test@example.com');
    await user.type(screen.getByLabelText(/password/i), 'password123');
    await user.click(screen.getByRole('button', { name: /login/i }));

    await waitFor(() => {
      expect(loginMock).toHaveBeenCalledWith('test@example.com', 'password123');
    });
  });
}); 