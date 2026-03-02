import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import LoginPage from '../page';
import { AuthProvider } from '../../../../contexts/AuthContext';

vi.mock('../../../../services/api', () => ({
  authService: {
    login: vi.fn(),
  },
}));

import { authService } from '../../../../services/api';

vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: vi.fn(),
  }),
}));

describe('Login Page', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('debe mostrar el formulario de login', () => {
    render(
      <AuthProvider>
        <LoginPage />
      </AuthProvider>,
    );

    expect(
      screen.getByRole('heading', { name: /Fullstack Challenge/i }),
    ).toBeDefined();
    expect(screen.getByLabelText('Email')).toBeDefined();
    expect(screen.getByLabelText('Password')).toBeDefined();
    expect(screen.getByPlaceholderText('eve.holt@reqres.in')).toBeDefined();
    expect(screen.getByPlaceholderText('cityslicka')).toBeDefined();

    const submitButton = screen.getByRole('button', { name: 'Log in' });
    expect(submitButton).toBeDefined();
  });

  it('debe permitir submit del formulario', async () => {
    vi.mocked(authService.login).mockResolvedValue({ token: 'fake-token' });

    render(
      <AuthProvider>
        <LoginPage />
      </AuthProvider>,
    );

    const emailInput = screen.getByLabelText('Email');
    const passwordInput = screen.getByLabelText('Password');
    const submitButton = screen.getByRole('button', { name: 'Log in' });

    fireEvent.change(emailInput, { target: { value: 'eve.holt@reqres.in' } });
    fireEvent.change(passwordInput, { target: { value: 'cityslicka' } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(authService.login).toHaveBeenCalledWith({
        email: 'eve.holt@reqres.in',
        password: 'cityslicka',
      });
    });
  });

  it('debe mostrar error cuando el login falla', async () => {
    const error = new Error('Error logging in');
    vi.mocked(authService.login).mockRejectedValue(error);

    render(
      <AuthProvider>
        <LoginPage />
      </AuthProvider>,
    );

    const emailInput = screen.getByLabelText('Email');
    const passwordInput = screen.getByLabelText('Password');
    const submitButton = screen.getByRole('button', { name: 'Log in' });

    fireEvent.change(emailInput, { target: { value: 'wrong@email.com' } });
    fireEvent.change(passwordInput, { target: { value: 'wrong' } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/Error logging in/i)).toBeDefined();
    });
  });
});
