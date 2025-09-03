import { ReservationStatus } from './reservation-status.enum';
import { Movie } from './movie.model';
import { Projection } from './projection.model';

export interface Reservation {
  id: string;
  movie: Movie;
  projection: Projection;
  status: ReservationStatus;
  // rating je dozvoljen samo kad je status Gledano
  rating?: number;
}
