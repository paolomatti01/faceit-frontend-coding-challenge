import { ITournament } from '../api/domain/tournaments';
import { API_TOURNAMENTS_URL } from '../constants/api';

/**
 * Function used to fetch tournaments from the API.
 * @param query Optional query string to filter tournaments by name.
 */
export async function getTournaments(query?: string): Promise<ITournament[]> {
  const response = await fetch(
    `${API_TOURNAMENTS_URL}${query ? `?q=${query}` : ''}`
  );

  return await response.json();
}

/**
 * Function used to create a new tournament.
 * @param name The name of the new tournament entity.
 */
export async function createNewTournament(name: string): Promise<ITournament> {
  const response = await fetch(`${API_TOURNAMENTS_URL}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ name })
  });

  return await response.json();
}

/**
 * NOTE: This function is unused since there's no corresponding mock API implementation, but it's here just for an idea.
 *
 * Function used to delete a tournament.
 * @param tournamentId Id of the tournament to delete.
 */
export async function deleteTournament(tournamentId: string): Promise<void> {
  const response = await fetch(`${API_TOURNAMENTS_URL}/${tournamentId}`, {
    method: 'DELETE'
  });

  return await response.json();
}

/**
 * NOTE: This function is unused since there's no corresponding mock API implementation, but it's here just for an idea.
 *
 * Function used to edit a tournament.
 * @param tournament The new tournament entity.
 */
export async function editTournament(
  tournament: ITournament
): Promise<ITournament> {
  const response = await fetch(`${API_TOURNAMENTS_URL}/${tournament.id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(tournament)
  });

  return await response.json();
}
