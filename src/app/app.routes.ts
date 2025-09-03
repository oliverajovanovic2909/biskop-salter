import { Routes } from '@angular/router';
import { MoviesListComponent } from './features/movies/movies-list/movies-list.component';
import { MovieDetailsComponent } from './features/movies/movie-details/movie-details.component';
import { CartComponent } from './features/cart/cart/cart.component';
import { LoginComponent } from './features/auth/login/login.component';
import { RegisterComponent } from './features/auth/register/register.component';
import { ProfileComponent } from './features/profile/profile/profile.component';
import { authGuard } from './core/auth.guard';

export const routes: Routes = [
  { path: '', component: MoviesListComponent },
  { path: 'movie/:id', component: MovieDetailsComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'profile', component: ProfileComponent, canActivate: [authGuard] },
  { path: 'cart', component: CartComponent, canActivate: [authGuard] },
  { path: '**', redirectTo: '' }
];
