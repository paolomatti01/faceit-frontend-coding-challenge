import { ITournament } from '../api/domain/tournaments';
import { FetchStatus } from '../api/ui/fetch-status';
import { RootState } from '../reducers';
import { createSelector } from 'reselect';

export function selectTournamentsStatus(state: RootState): FetchStatus {
  return state.tournaments.status;
}

function selectTournamentsById(state: RootState): Record<string, ITournament> {
  return state.tournaments.tournamentsById;
}

// The selector is memoized since the Object.values operation can be quite expensive and we
// do not want to trigger it on each re-render.
export const selectTournaments = createSelector(
  selectTournamentsById,
  (tournamentsById: Record<string, ITournament>): ITournament[] =>
    Object.values(tournamentsById)
);
