import { describe, it, expect, vi, beforeEach } from 'vitest';
import { cricheroesIntegrationService } from '../services/cricheroesIntegrationService';
import { matchService } from '../services/matchService';
import { tournamentService } from '../services/tournamentService';
import { CricheroesAdapter } from '../services/adapters/cricheroesAdapter';

// Mocks
vi.mock('../services/matchService', () => ({
    matchService: {
        getMatchById: vi.fn(),
        createMatch: vi.fn(),
        getAllMatches: vi.fn()
    }
}));

vi.mock('../services/tournamentService', () => ({
    tournamentService: {
        getAllTournaments: vi.fn(),
        updateTournament: vi.fn()
    }
}));

describe('CricheroesIntegrationService', () => {
    
    beforeEach(() => {
        vi.clearAllMocks();
    });

    describe('startTournament', () => {
        const mockTournamentId = 'tour_123';
        const mockTeams = [
            { id: 'team_1', name: 'Team 1', members: [], type: 'club' as const, createdAt: '', active: true, sportId: 's1' },
            { id: 'team_2', name: 'Team 2', members: [], type: 'club' as const, createdAt: '', active: true, sportId: 's1' }
        ];

        it('should successfully start a tournament and generate schedule', async () => {
            // Setup
            const mockTournament = { 
                id: mockTournamentId, 
                name: 'Test Tour', 
                organizer: 'org_1', 
                status: 'upcoming', 
                teams: ['team_1', 'team_2'], 
                scheduleMode: 'AUTO',
                dates: '2025-01-01 - 2025-01-31' // Added dates
            };

            vi.mocked(tournamentService.getAllTournaments).mockResolvedValue([mockTournament as any]);
            vi.mocked(matchService.createMatch).mockResolvedValue({} as any);
            vi.mocked(tournamentService.updateTournament).mockResolvedValue({} as any);

            // Execute
            const result = await cricheroesIntegrationService.startTournament(mockTournamentId, mockTeams);

            // Assert
            expect(result.success).toBe(true);
            expect(result.matchesGenerated).toBe(1); // 2 teams = 1 match
            expect(tournamentService.updateTournament).toHaveBeenCalledWith(mockTournamentId, expect.objectContaining({ status: 'ongoing' }));
        });

        it('should fail if tournament has fewer than 2 teams', async () => {
             // Setup
             const mockTournament = { 
                id: mockTournamentId, 
                name: 'Test Tour', 
                organizer: 'org_1', 
                status: 'upcoming', 
                teams: ['team_1'], 
                scheduleMode: 'AUTO',
                dates: '2025-01-01 - 2025-01-31' // Added dates
            };

             vi.mocked(tournamentService.getAllTournaments).mockResolvedValue([mockTournament as any]);

            // Execute
            const result = await cricheroesIntegrationService.startTournament(mockTournamentId, [mockTeams[0]]);

            // Assert
            expect(result.success).toBe(false);
            expect(result.message).toContain('At least 2 teams');
        });
    });

    describe('validateMatchStart', () => {
        const mockMatchId = 'match_123';
        const mockHomeTeam = { id: 'team_1', name: 'Team 1', members: [{ playerId: 'p1', role: 'member' }] } as any;
        const mockAwayTeam = { id: 'team_2', name: 'Team 2', members: [{ playerId: 'p2', role: 'member' }] } as any;

        it('should validate a correct match payload', async () => {
            // Setup
            vi.mocked(matchService.getMatchById).mockResolvedValue({ 
                id: mockMatchId, 
                tournamentId: 'tour_1',
                homeParticipant: { id: 'team_1' },
                awayParticipant: { id: 'team_2' },
                date: '2025-01-01',
                location: 'Stadium'
            } as any);

            // Execute
            const result = await cricheroesIntegrationService.validateMatchStart(mockMatchId, mockHomeTeam, mockAwayTeam);

            // Assert
            expect(result.valid).toBe(true);
        });

        it('should fail validation if teams have no players', async () => {
            // Setup
            vi.mocked(matchService.getMatchById).mockResolvedValue({ 
                id: mockMatchId, 
                tournamentId: 'tour_1',
                homeParticipant: { id: 'team_1' },
                awayParticipant: { id: 'team_2' }
            } as any);

            const emptyHomeTeam = { ...mockHomeTeam, members: [] };

            // Execute
            const result = await cricheroesIntegrationService.validateMatchStart(mockMatchId, emptyHomeTeam, mockAwayTeam);

            // Assert
            expect(result.valid).toBe(false);
            expect(result.errors).toContain('Home team has no players');
        });
    });

    describe('CricheroesAdapter', () => {
        it('should correctly map internal Match to Cricheroes payload', () => {
            const match = { id: 'm1', tournamentId: 't1', date: '2025-01-01', location: 'Ground' } as any;
            const home = { id: 'h1', name: 'Home', members: [] } as any;
            const away = { id: 'a1', name: 'Away', members: [] } as any;

            const payload = CricheroesAdapter.toMatchPayload(match, home, away);

            expect(payload.match_id).toBe('m1');
            expect(payload.home_team.team_id).toBe('h1');
            expect(payload.overs_limit).toBe(20); // Default
        });
    });
});
