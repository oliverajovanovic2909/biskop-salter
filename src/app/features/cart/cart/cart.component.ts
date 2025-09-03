import { Component } from '@angular/core';
import { CurrencyPipe, DatePipe, NgFor, NgIf } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { CartService } from '../../../core/cart.service';
import { MoviesService } from '../../../core/movies.service';
import { AuthService } from '../../../core/auth.service';

import { Reservation } from '../../../models/reservation.model';
import { ReservationStatus } from '../../../models/reservation-status.enum';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [NgIf, NgFor, DatePipe, CurrencyPipe, FormsModule],
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.scss'
})
export class CartComponent {
  items: Reservation[] = [];
  ReservationStatus = ReservationStatus;

  // ✅ constructor je SAMO ovde, unutar klase
  constructor(
    public cart: CartService,
    private movies: MoviesService,
    private auth: AuthService
  ) {
    this.cart.items$.subscribe(v => (this.items = v));
  }

  remove(id: string) { this.cart.remove(id); }
  total() { return this.cart.total(); }

  // opciono: kad korisnik oceni "gledano", upiši i u recenzije filma
  onRate(id: string, movieId: string, rating: number) {
    this.cart.setRating(id, rating);
    const name = this.auth.current?.firstName || 'Korisnik';
    this.movies.addReview(movieId, { userName: name, rating, comment: 'Ocena nakon gledanja' });
  }
}
