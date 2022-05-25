import React, { useCallback } from 'react';
import styled from 'styled-components';
import { ITournament } from '../../../api/domain/tournaments';
import theme from '../../../theme';
import Button from '../../../components/Button';
import { useDispatch } from 'react-redux';
import {
  editTournamentName,
  removeTournament
} from '../../../actions/tournaments';

interface ITournamentProps {
  tournament: ITournament;
}

const DescriptionRow = styled.p`
  margin: 0;
`;

const StyledCard = styled.div`
  background-color: ${theme.palette.background.base};
  border-radius: ${theme.borderRadius};
  padding: ${theme.spacing(4)};
`;

const ButtonsContainer = styled.div`
  display: flex;
  margin-top: ${theme.spacing(2)};
  gap: ${theme.spacing(2)};
`;

const TournamentCard: React.FC<ITournamentProps> = ({ tournament }) => {
  const dispatch = useDispatch();
  const formattedDate: string = new Date(tournament.startDate).toLocaleString(
    'en-GB'
  );

  const handleEditTournament = useCallback(() => {
    const name = window.prompt('New Tournament Name:');

    if (name) {
      dispatch(editTournamentName({ tournamentId: tournament.id, name: name }));

      // NOTE: now we would call the service to edit the tournament, if this was implemented in the mock api.
      // Alternatively, we could even create a thunk action which handles both the service call and the
      // optimistic update.
    }
  }, [dispatch, tournament.id]);

  const handleRemoveTournament = useCallback(() => {
    const confirmed = window.confirm(
      'Do you really want to delete this tournament?'
    );

    if (confirmed) {
      dispatch(removeTournament(tournament.id));

      // NOTE: now we would call the service to edit the tournament, if this was implemented in the mock api.
      // Alternatively, we could even create a thunk action which handles both the service call and the
      // optimistic update.
    }
  }, [dispatch, tournament.id]);

  return (
    <StyledCard>
      <h6>{tournament.name}</h6>
      <DescriptionRow>Organizer: {tournament.organizer}</DescriptionRow>
      <DescriptionRow>Game: {tournament.game}</DescriptionRow>
      <DescriptionRow>Partecipants: {tournament.partecipants}</DescriptionRow>
      <DescriptionRow>Start: {formattedDate}</DescriptionRow>
      <ButtonsContainer>
        <Button onClick={handleEditTournament}>Edit</Button>
        <Button onClick={handleRemoveTournament}>Remove</Button>
      </ButtonsContainer>
    </StyledCard>
  );
};

export default TournamentCard;
