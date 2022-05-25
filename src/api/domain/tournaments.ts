export interface ITournament {
  id: string;
  name: string;
  organizer: string;
  game: string;
  partecipants: {
    current: number;
    max: number;
  };
  startDate: string;
}
