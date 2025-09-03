import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Reservation } from '../models/reservation.model';
import { ReservationStatus } from '../models/reservation-status.enum';
import { v4 as uuid } from 'uuid';

const LS_KEY = 'cart_items';

@Injectable({ providedIn: 'root' })
export class CartService {
  private _items$ = new BehaviorSubject<Reservation[]>(this.load());
  readonly items$ = this._items$.asObservable();

  private load(): Reservation[] {
    try { return JSON.parse(localStorage.getItem(LS_KEY) || '[]'); } catch { return []; }
  }
  private save() {
    localStorage.setItem(LS_KEY, JSON.stringify(this._items$.value));
  }

  add(res: Omit<Reservation, 'id' | 'status'>) {
    const item: Reservation = { id: uuid(), status: ReservationStatus.Rezervisano, ...res };
    this._items$.next([...this._items$.value, item]);
    this.save();
  }

  remove(id: string) {
    this._items$.next(this._items$.value.filter(i => i.id !== id));
    this.save();
  }

  setStatus(id: string, status: ReservationStatus) {
    this._items$.next(
      this._items$.value.map(i =>
        i.id === id
          ? { ...i, status, rating: status === ReservationStatus.Gledano ? i.rating : undefined }
          : i
      )
    );
    this.save();
  }

  setRating(id: string, rating: number) {
    this._items$.next(
      this._items$.value.map(i =>
        i.id === id && i.status === ReservationStatus.Gledano ? { ...i, rating } : i
      )
    );
    this.save();
  }

  // promena termina dozvoljena samo kad je rezervisano
  setProjection(id: string, newProjection: { dateTime: string; price: number }) {
    this._items$.next(
      this._items$.value.map(i =>
        i.id === id && i.status === ReservationStatus.Rezervisano ? { ...i, projection: newProjection } : i
      )
    );
    this.save();
  }

  total() { return this._items$.value.reduce((s, i) => s + i.projection.price, 0); }
  getAll() { return this._items$.value; }
  clear() { this._items$.next([]); this.save(); }
}
