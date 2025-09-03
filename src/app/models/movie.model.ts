import { Genre } from './genre.enum';
import { Review } from './review.model';
import { Projection } from './projection.model';

export interface Movie {
  id: string;
  title: string;
  description: string;
  genre: Genre[];
  durationMin: number;
  director: string;
  actors: string[];
  releaseDate: string;     // ISO datum izlaska filma
  projections: Projection[]; // termini projekcija
  reviews: Review[]; 
  imageUrl?: string; 
}
