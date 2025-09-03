import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { v4 as uuid } from 'uuid';
import { User } from '../models/user.model';

const LS_USERS = 'users';
const LS_CURRENT = 'current_user';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private _current$ = new BehaviorSubject<User | null>(this.loadCurrent());
  readonly current$ = this._current$.asObservable();

  get current() { return this._current$.value; }
  isLoggedIn() { return !!this.current; }

  private loadUsers(): User[] {
    try { return JSON.parse(localStorage.getItem(LS_USERS) || '[]'); } catch { return []; }
  }
  private saveUsers(users: User[]) { localStorage.setItem(LS_USERS, JSON.stringify(users)); }
  private loadCurrent(): User | null {
    try { return JSON.parse(localStorage.getItem(LS_CURRENT) || 'null'); } catch { return null; }
  }
  private saveCurrent(u: User | null) {
    if (u) localStorage.setItem(LS_CURRENT, JSON.stringify(u));
    else localStorage.removeItem(LS_CURRENT);
  }

  register(data: Omit<User, 'id'>): string | null {
    const users = this.loadUsers();
    if (users.some(u => u.email.toLowerCase() === data.email.toLowerCase())) return 'Email je već registrovan.';
    const u: User = { id: uuid(), ...data };
    users.push(u);
    this.saveUsers(users);
    this._current$.next(u);
    this.saveCurrent(u);
    return null;
  }

  login(email: string, password: string): string | null {
    const u = this.loadUsers().find(x => x.email.toLowerCase() === email.toLowerCase() && x.password === password);
    if (!u) return 'Pogrešan email ili lozinka.';
    this._current$.next(u);
    this.saveCurrent(u);
    return null;
  }

  logout() {
    this._current$.next(null);
    this.saveCurrent(null);
  }

  updateProfile(patch: Partial<Omit<User, 'id' | 'email' | 'password'>>) {
    const u = this.current;
    if (!u) return;
    const updated: User = { ...u, ...patch };
    const users = this.loadUsers().map(x => x.id === u.id ? updated : x);
    this.saveUsers(users);
    this._current$.next(updated);
    this.saveCurrent(updated);
  }
}
