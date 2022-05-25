import { Action, Dispatch } from 'redux';
import { ITournament } from '../api/domain/tournaments';
import { ActionWithPayload } from '../api/ui/action-with-payload';
import {
  getTournaments,
  createNewTournament as createNewTournamentService
} from '../services/tournaments';

export enum TournamentsActionType {
  FETCH_TOURNAMENTS_REQUEST = 'tournaments.fetch-request',
  FETCH_TOURNAMENTS_FAILURE = 'tournaments.fetch-failure',
  FETCH_TOURNAMENTS_SUCCESS = 'tournaments.fetch-success',
  EDIT_TOURNAMENT_NAME = 'tournaments.edit-name',
  REMOVE_TOURNAMENT = 'tournaments.remove',
  ADD_TOURNAMENT = 'tournaments.add'
}

export function fetchTournamentsRequest(): Action<
  TournamentsActionType.FETCH_TOURNAMENTS_REQUEST
> {
  return {
    type: TournamentsActionType.FETCH_TOURNAMENTS_REQUEST
  };
}

export function fetchTournamentsFailure(): Action<
  TournamentsActionType.FETCH_TOURNAMENTS_FAILURE
> {
  return {
    type: TournamentsActionType.FETCH_TOURNAMENTS_FAILURE
  };
}

export function fetchTournamentsSuccess(
  tournaments: ITournament[]
): ActionWithPayload<
  TournamentsActionType.FETCH_TOURNAMENTS_SUCCESS,
  ITournament[]
> {
  return {
    type: TournamentsActionType.FETCH_TOURNAMENTS_SUCCESS,
    payload: tournaments
  };
}

interface IEditTournamentNamePayload {
  tournamentId: string;
  name: string;
}

export function editTournamentName(
  payload: IEditTournamentNamePayload
): ActionWithPayload<
  TournamentsActionType.EDIT_TOURNAMENT_NAME,
  IEditTournamentNamePayload
> {
  return {
    type: TournamentsActionType.EDIT_TOURNAMENT_NAME,
    payload
  };
}

export function removeTournament(
  id: string
): ActionWithPayload<TournamentsActionType.REMOVE_TOURNAMENT, string> {
  return {
    type: TournamentsActionType.REMOVE_TOURNAMENT,
    payload: id
  };
}

export function addTournament(
  tournament: ITournament
): ActionWithPayload<TournamentsActionType.ADD_TOURNAMENT, ITournament> {
  return {
    type: TournamentsActionType.ADD_TOURNAMENT,
    payload: tournament
  };
}

export function fetchTournaments(query?: string) {
  return async (dispatch: Dispatch) => {
    dispatch(fetchTournamentsRequest());

    try {
      const tournaments: ITournament[] = await getTournaments(query);
      dispatch(fetchTournamentsSuccess(tournaments));
    } catch (err) {
      // Since it's not a requirement to differentiate depending on the error, we
      // keep the state to a bare minimum and we do not save the error in the Redux-state.
      dispatch(fetchTournamentsFailure());
    }
  };
}

export function createNewTournament(name: string) {
  return async (dispatch: Dispatch) => {
    try {
      // NOTE: we cannot really do an optimistic update here, since the
      // new tournament is generated from the service.
      // If we want to make an optimistic update, we'd have to create a tournament
      // with only the name but without the other properties, which, from my understanding
      // are mandatory.
      // A Swagger contract or something similar would help with this.
      const newTournament: ITournament = await createNewTournamentService(name);
      dispatch(addTournament(newTournament));
    } catch (err) {
      // Nothing to do here, the requirements don't say how to handle the case.
      // Ideally, we'd show the info to the user.
    }
  };
}
