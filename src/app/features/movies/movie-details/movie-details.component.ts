import { Component } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { NgIf, NgFor, DatePipe, CurrencyPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { MoviesService } from '../../../core/movies.service';
import { CartService } from '../../../core/cart.service';
import { AuthService } from '../../../core/auth.service';

import { Movie } from '../../../models/movie.model';

@Component({
  selector: 'app-movie-details',
  standalone: true,
  imports: [NgIf, NgFor, DatePipe, CurrencyPipe, FormsModule, RouterLink],
  templateUrl: './movie-details.component.html',
  styleUrl: './movie-details.component.scss'
})
export class MovieDetailsComponent {
  movie?: Movie;

  // forma za novu recenziju (demo)
  userName = '';
  rating = 5;
  comment = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private movies: MoviesService,
    private cart: CartService,
    private auth: AuthService
  ) {
    const id = this.route.snapshot.paramMap.get('id')!;
    this.movie = this.movies.getById(id);
  }

  reserve(index: number) {
    if (!this.movie) return;
    if (!this.auth.isLoggedIn()) {
      this.router.navigate(['/login'], { queryParams: { returnUrl: this.router.url } });
      return;
    }
    const p = this.movie.projections[index];
    if (!p) return;
    this.cart.add({ movie: this.movie, projection: p });
    alert(`Rezervisano: ${this.movie.title} — ${new Date(p.dateTime).toLocaleString()}`);
  }

  addReview() {
    if (!this.movie) return;
    if (!this.userName.trim() || !this.comment.trim()) {
      alert('Popuni ime i komentar.');
      return;
    }
    this.movies.addReview(this.movie.id, {
      userName: this.userName.trim(),
      rating: this.rating,
      comment: this.comment.trim()
    });
    // osveži prikaz iz servisa
    this.movie = this.movies.getById(this.movie.id);
    // reset
    this.userName = '';
    this.rating = 5;
    this.comment = '';
  }

  averageRating(): number {
    if (!this.movie || !this.movie.reviews.length) return 0;
    const sum = this.movie.reviews.reduce((s, r) => s + r.rating, 0);
    return +(sum / this.movie.reviews.length).toFixed(1);
  }
}
