import React, { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components';
import {
  fetchTournaments,
  createNewTournament
} from '../../actions/tournaments';
import { ITournament } from '../../api/domain/tournaments';
import { FetchStatus } from '../../api/ui/fetch-status';
import Button from '../../components/Button';
import Container from '../../components/Container';
import H4 from '../../components/H4';
import TournamentCard from './components/TournamentCard';
import {
  selectTournaments,
  selectTournamentsStatus
} from '../../selectors/tournaments';
import theme from '../../theme';
import Input from '../../components/Input';
import { useDebounce } from '../../hooks/use-debounce';

interface IUseTournamentsResult {
  status: FetchStatus;
  tournaments: ITournament[];
  triggerFetch: (query?: string) => void;
}

const HeaderContainer = styled.p`
  display: flex;
  justify-content: space-between;
`;

const TournamentsInfoContainer = styled.div`
  text-align: center;
`;

const TournamentsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: ${theme.spacing(6)};
`;

// Considering the median human reaction time is ~275ms
// we debounce the search with that value.
// It doesn't need to be higher, since the query is quite fast
// and the data amount is not big.
const SEARCH_DEBOUNCE_DELAY_MS = 275;

/**
 * Hook which fetches the tournaments and provides the tournaments list, as well as
 * the status of the fetch and a function to retrigger it.
 *
 * @param query The query parameter to use for the fetch.
 */
function useTournaments(query?: string): IUseTournamentsResult {
  const dispatch = useDispatch();
  const status: FetchStatus = useSelector(selectTournamentsStatus);
  const tournaments: ITournament[] = useSelector(selectTournaments);
  const debouncedQuery = useDebounce<string | undefined>(
    query,
    SEARCH_DEBOUNCE_DELAY_MS
  );

  const dispatchFetchTournaments = useCallback(
    (q?: string) => {
      dispatch(fetchTournaments(q));
    },
    [dispatch]
  );

  useEffect(() => {
    dispatchFetchTournaments(debouncedQuery);
  }, [dispatchFetchTournaments, debouncedQuery]);

  return { status, tournaments, triggerFetch: dispatchFetchTournaments };
}

const TournamentsRoute: React.FC = () => {
  const dispatch = useDispatch();
  const [query, setQuery] = useState<string>('');

  const { status, tournaments, triggerFetch } = useTournaments(query);

  const handleCreateTournament = useCallback(() => {
    const newTournamentName = window.prompt('Tournament Name:');

    if (newTournamentName) {
      dispatch(createNewTournament(newTournamentName));
    }
  }, [dispatch]);

  return (
    <Container>
      <H4>FACEIT Tournaments</H4>

      <HeaderContainer>
        <Input
          placeholder="Search tournament ..."
          value={query}
          onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
            setQuery(event.target.value);
          }}
        />
        <Button onClick={handleCreateTournament}>Create tournament</Button>
      </HeaderContainer>

      {status === 'loading' && (
        <TournamentsInfoContainer>
          Loading tournaments ...
        </TournamentsInfoContainer>
      )}

      {status === 'error' && (
        <TournamentsInfoContainer>
          <p>Something went wrong.</p>
          <Button
            onClick={() => {
              triggerFetch();
            }}
          >
            Retry
          </Button>
        </TournamentsInfoContainer>
      )}

      {status === 'success' &&
        (tournaments.length > 0 ? (
          <TournamentsGrid>
            {tournaments.map(tournament => (
              <TournamentCard key={tournament.id} tournament={tournament} />
            ))}
          </TournamentsGrid>
        ) : (
          <TournamentsInfoContainer>
            No tournaments found.
          </TournamentsInfoContainer>
        ))}
    </Container>
  );
};

export default TournamentsRoute;
