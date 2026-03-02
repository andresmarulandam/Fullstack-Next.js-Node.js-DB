import { describe, it, expect, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import UsersPage from '../page';

vi.mock('@/services/api', () => ({
  usersService: {
    getUsersFromReqRes: vi.fn().mockResolvedValue({
      data: [
        {
          id: 1,
          email: 'george.bluth@reqres.in',
          first_name: 'George',
          last_name: 'Bluth',
          avatar: 'https://reqres.in/img/faces/1-image.jpg',
        },
        {
          id: 2,
          email: 'janet.weaver@reqres.in',
          first_name: 'Janet',
          last_name: 'Weaver',
          avatar: 'https://reqres.in/img/faces/2-image.jpg',
        },
      ],
      total_pages: 1,
    }),
    getSavedUsers: vi.fn().mockResolvedValue([]),
  },
}));

describe('Users Page', () => {
  it('It should display the loaded users', async () => {
    render(<UsersPage />);

    expect(screen.getByText(/loading users/i)).toBeDefined();

    await waitFor(() => {
      expect(screen.getByText('George Bluth')).toBeDefined();
      expect(screen.getByText('Janet Weaver')).toBeDefined();
    });
  });

  it('It should display users emails', async () => {
    render(<UsersPage />);

    await waitFor(() => {
      expect(screen.getByText('george.bluth@reqres.in')).toBeDefined();
      expect(screen.getByText('janet.weaver@reqres.in')).toBeDefined();
    });
  });
});
