import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { CurrencyPipe, DatePipe, NgFor, NgIf } from '@angular/common'; 

import { MoviesService } from '../../../core/movies.service';
import { CartService } from '../../../core/cart.service';
import { AuthService } from '../../../core/auth.service';

import { Movie } from '../../../models/movie.model';
import { Genre } from '../../../models/genre.enum';

type SortKey = 'priceAsc' | 'priceDesc' | 'soonest';

@Component({
  selector: 'app-movies-list',
  standalone: true,
  imports: [FormsModule, NgFor, DatePipe, CurrencyPipe, RouterLink, NgIf],
  templateUrl: './movies-list.component.html',
  styleUrl: './movies-list.component.scss'
})
export class MoviesListComponent {
  Genre = Genre;
  genres = Object.values(Genre);

  // filter polja
  q = '';
  director = '';
  actor = '';
  genre?: Genre;
  maxPrice?: number;
  sortBy: SortKey = 'soonest';

  movies: Movie[] = [];

  constructor(
    private moviesSrv: MoviesService,
    private cart: CartService,
    private auth: AuthService,
    private router: Router
  ) {
    this.movies = this.applySort(this.moviesSrv.getAll());
  }

  activeFilters() {
    const af: { key: string; label: string }[] = [];
    if (this.q) af.push({ key: 'q', label: `Tekst: “${this.q}”` });
    if (this.director) af.push({ key: 'director', label: `Režiser: ${this.director}` });
    if (this.actor) af.push({ key: 'actor', label: `Glumac: ${this.actor}` });
    if (this.genre) af.push({ key: 'genre', label: `Žanr: ${this.genre}` });
    if (this.maxPrice != null) af.push({ key: 'maxPrice', label: `Max cena: ${this.maxPrice} RSD` });
    return af;
  }

  clearFilter(key: string) {
    (this as any)[key] = key === 'genre' ? undefined : '';
    if (key === 'maxPrice') this.maxPrice = undefined;
    this.search();
  }

  private applySort(list: Movie[]) {
    if (this.sortBy === 'priceAsc') {
      return [...list].sort((a, b) => (minPrice(a) - minPrice(b)));
    }
    if (this.sortBy === 'priceDesc') {
      return [...list].sort((a, b) => (minPrice(b) - minPrice(a)));
    }
    return [...list].sort((a, b) => (firstTime(a) - firstTime(b)));

    function minPrice(m: Movie) { return Math.min(...m.projections.map(p => p.price)); }
    function firstTime(m: Movie) { return Math.min(...m.projections.map(p => new Date(p.dateTime).getTime())); }
  }

  search() {
    const base = this.moviesSrv.search({
      title: this.q,
      director: this.director,
      actor: this.actor,
      genre: this.genre,
      maxPriceAtAnyProjection: this.maxPrice
    });
    this.movies = this.applySort(base);
  }

  reset() {
    this.q = this.director = this.actor = '';
    this.genre = undefined;
    this.maxPrice = undefined;
    this.sortBy = 'soonest';
    this.movies = this.applySort(this.moviesSrv.getAll());
  }

  reserve(m: Movie, projectionIndex = 0) {
    if (!this.auth.isLoggedIn()) {
      this.router.navigate(['/login'], { queryParams: { returnUrl: this.router.url } });
      return;
    }
    const projection = m.projections[projectionIndex];
    if (!projection) return;
    this.cart.add({ movie: m, projection });
    alert(`Rezervisano: ${m.title} — ${new Date(projection.dateTime).toLocaleString()}`);
  }
}
