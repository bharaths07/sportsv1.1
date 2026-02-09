import { render, screen } from '@testing-library/react';
import { Header } from './Header';
import { describe, it, expect, vi } from 'vitest';

// Mock useSession from next-auth/react
vi.mock("next-auth/react", () => ({
  useSession: () => ({ data: null, status: "unauthenticated" }),
  signIn: vi.fn(),
  signOut: vi.fn(),
  SessionProvider: ({ children }: { children: React.ReactNode }) => <div>{children}</div>
}));

describe('Header', () => {
  it('renders logo text', () => {
    render(<Header />);
    expect(screen.getByText('ScoreHeroes')).toBeInTheDocument();
  });

  it('renders navigation links', () => {
    render(<Header />);
    expect(screen.getByText('Matches')).toBeInTheDocument();
    expect(screen.getByText('Teams')).toBeInTheDocument();
  });
  
  it('renders sign in button when unauthenticated', () => {
      render(<Header />);
      expect(screen.getByText('Sign in')).toBeInTheDocument();
  });
});
