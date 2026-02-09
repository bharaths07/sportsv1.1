// @vitest-environment jsdom
import { render, screen, fireEvent, cleanup, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { TournamentListScreen } from '../modules/tournament/TournamentListScreen';
import * as AppProviders from '../app/AppProviders';

// Mock dependencies
vi.mock('react-router-dom', () => ({
  Link: ({ children, to }: any) => <a href={to}>{children}</a>,
  useNavigate: () => vi.fn(),
}));

// Mock Data
const mockUser = { id: 'u1', name: 'Test User' };
const mockPlayer = { id: 'p1', userId: 'u1' };
const mockTeam = { id: 't1', members: [{ playerId: 'p1' }] };

const mockTournaments = [
  { 
    id: '1', 
    name: 'Upcoming League', 
    dates: 'Jan 2025', 
    status: 'upcoming',
    structure: { format: 'LEAGUE' },
    organizerId: 'u1', // User is organizer
    bannerUrl: 'test.jpg' 
  },
  { 
    id: '2', 
    name: 'Ongoing Knockout', 
    dates: 'Feb 2025', 
    status: 'ongoing',
    structure: { format: 'KNOCKOUT' },
    scorers: ['u1'], // User is scorer
    bannerUrl: 'test.jpg' 
  },
  { 
    id: '3', 
    name: 'Completed Group', 
    dates: 'Mar 2025', 
    status: 'completed',
    structure: { format: 'GROUP_KNOCKOUT' },
    teams: ['t1'], // User is participant (via team t1)
    bannerUrl: 'test.jpg' 
  }
];

describe('TournamentListFilter', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    
    // Default mock setup
    vi.spyOn(AppProviders, 'useGlobalState').mockReturnValue({
      tournaments: mockTournaments,
      currentUser: mockUser,
      teams: [mockTeam],
      players: [mockPlayer]
    } as any);
  });

  afterEach(() => {
    cleanup();
  });

  it('renders new filter UI correctly', () => {
    render(<TournamentListScreen />);

    expect(screen.getByText('Filter Tournaments')).toBeTruthy();
    expect(screen.getByPlaceholderText('Tournament name...')).toBeTruthy();
    expect(screen.getByText('Status')).toBeTruthy();
    expect(screen.getByText('Format')).toBeTruthy();
    expect(screen.getByText('My Role')).toBeTruthy();
    
    // Check Status options
    const statusSelect = screen.getAllByRole('combobox')[0] as HTMLSelectElement; // Status is 1st select (0 is likely search if it was a select, but search is input)
    // Actually input is not combobox. Selects are: Status, Format, Role.
    
    // Verify selects exist
    const selects = screen.getAllByRole('combobox');
    expect(selects.length).toBe(3);
  });

  it('filters by status', async () => {
    render(<TournamentListScreen />);
    const statusSelect = screen.getAllByRole('combobox')[0] as HTMLSelectElement; // Status
    
    // Initially all 3 shown
    expect(screen.getAllByText('Upcoming League').length).toBeGreaterThan(0);
    expect(screen.getAllByText('Ongoing Knockout').length).toBeGreaterThan(0);
    expect(screen.getByText('Completed Group')).toBeTruthy();

    // Select Ongoing
    fireEvent.change(statusSelect, { target: { value: 'ongoing' } });
    expect(statusSelect.value).toBe('ongoing');
    
    await waitFor(() => {
      expect(screen.queryByText('Upcoming League')).toBeNull();
    });
    expect(screen.getAllByText('Ongoing Knockout').length).toBeGreaterThan(0);
    expect(screen.queryByText('Completed Group')).toBeNull();
  });

  it('filters by format', async () => {
    render(<TournamentListScreen />);
    const formatSelect = screen.getAllByRole('combobox')[1]; // Format
    
    fireEvent.change(formatSelect, { target: { value: 'KNOCKOUT' } });
    
    await waitFor(() => {
      expect(screen.queryByText('Upcoming League')).toBeNull();
    });
    expect(screen.getAllByText('Ongoing Knockout').length).toBeGreaterThan(0);
    expect(screen.queryByText('Completed Group')).toBeNull();
  });

  it('filters by search', async () => {
    render(<TournamentListScreen />);
    const searchInput = screen.getByRole('textbox');
    
    fireEvent.change(searchInput, { target: { value: 'Upcoming' } });
    
    await waitFor(() => {
      expect(screen.getAllByText('Upcoming League').length).toBeGreaterThan(0);
    });
    expect(screen.queryByText('Ongoing Knockout')).toBeNull();
    expect(screen.queryByText('Completed Group')).toBeNull();
  });

  it('filters by role: Organizer', async () => {
    render(<TournamentListScreen />);
    const roleSelect = screen.getAllByRole('combobox')[2]; // Role
    
    fireEvent.change(roleSelect, { target: { value: 'organizer' } });
    
    await waitFor(() => {
      expect(screen.getAllByText('Upcoming League').length).toBeGreaterThan(0); // u1 is organizer
    });
    expect(screen.queryByText('Ongoing Knockout')).toBeNull();
    expect(screen.queryByText('Completed Group')).toBeNull();
  });

  it('filters by role: Scorer', async () => {
    render(<TournamentListScreen />);
    const roleSelect = screen.getAllByRole('combobox')[2]; // Role
    
    fireEvent.change(roleSelect, { target: { value: 'scorer' } });
    
    await waitFor(() => {
      expect(screen.queryByText('Upcoming League')).toBeNull();
    });
    expect(screen.getAllByText('Ongoing Knockout').length).toBeGreaterThan(0); // Scorer u1
    expect(screen.queryByText('Completed Group')).toBeNull();
  });

  it('filters by role: Participant', async () => {
    render(<TournamentListScreen />);
    const roleSelect = screen.getAllByRole('combobox')[2]; // Role
    
    fireEvent.change(roleSelect, { target: { value: 'participant' } });
    expect(roleSelect.value).toBe('participant');
    
    await waitFor(() => {
      expect(screen.queryByText('Upcoming League')).toBeNull();
    });
    
    expect(screen.queryByText('Ongoing Knockout')).toBeNull();
    expect(screen.getByText('Completed Group')).toBeTruthy(); // Team t1 is participant, u1 is in t1
  });

  it('hides role filter when user is not logged in', () => {
    vi.spyOn(AppProviders, 'useGlobalState').mockReturnValue({
      tournaments: mockTournaments,
      currentUser: null,
      teams: [],
      players: []
    } as any);

    render(<TournamentListScreen />);
    
    expect(screen.queryByText('My Role')).toBeNull();
    const selects = screen.getAllByRole('combobox');
    expect(selects.length).toBe(2); // Only Status and Format
  });
});
