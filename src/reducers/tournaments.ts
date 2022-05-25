import { AnyAction } from 'redux';
import { TournamentsActionType } from '../actions/tournaments';
import { ITournament } from '../api/domain/tournaments';
import { FetchStatus } from '../api/ui/fetch-status';

interface ITournamentsState {
  status: FetchStatus;
  tournamentsById: Record<string, ITournament>;
}

const initialState: ITournamentsState = {
  status: 'idle',
  tournamentsById: {}
};

export default function tournaments(
  state: ITournamentsState = initialState,
  action: AnyAction
): ITournamentsState {
  switch (action.type) {
    case TournamentsActionType.FETCH_TOURNAMENTS_REQUEST:
      return {
        ...state,
        status: 'loading'
      };
    case TournamentsActionType.FETCH_TOURNAMENTS_SUCCESS:
      return {
        ...state,
        // Here we create a record of the tournaments by their IDs.
        // This is done so that we can access any tournament in O(1) time.
        tournamentsById: action.payload.reduce(
          (acc: Record<string, ITournament>, val: ITournament) => ({
            ...acc,
            [val.id]: val
          }),
          {}
        ),
        status: 'success'
      };
    case TournamentsActionType.FETCH_TOURNAMENTS_FAILURE:
      return {
        ...state,
        tournamentsById: {},
        status: 'error'
      };
    case TournamentsActionType.EDIT_TOURNAMENT_NAME:
      return {
        ...state,
        tournamentsById: {
          ...state.tournamentsById,
          [action.payload.tournamentId]: {
            ...state.tournamentsById[action.payload.tournamentId],
            name: action.payload.name
          }
        }
      };
    case TournamentsActionType.REMOVE_TOURNAMENT:
      const updatedTournamentsById = { ...state.tournamentsById };
      delete updatedTournamentsById[action.payload];

      return {
        ...state,
        tournamentsById: updatedTournamentsById
      };
    case TournamentsActionType.ADD_TOURNAMENT:
      return {
        ...state,
        tournamentsById: {
          ...state.tournamentsById,
          [action.payload.id]: action.payload
        }
      };
    default:
      return state;
  }
}
