import { Genre } from './genre.enum';

export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  favoriteGenres: Genre[];
  password: string; // samo za mock (nemoj ovako u pravom app-u)
}
