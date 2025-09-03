import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgFor, NgIf } from '@angular/common';
import { Router, RouterLink } from '@angular/router';

import { AuthService } from '../../../core/auth.service';
import { Genre } from '../../../models/genre.enum';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [FormsModule, NgFor, NgIf, RouterLink],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss'
})
export class RegisterComponent {
  genres = Object.values(Genre);

  user = {
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    password: '',
    favoriteGenres: [] as Genre[],
  };

  error = '';

  constructor(private auth: AuthService, private router: Router) {}

  toggleGenre(g: Genre) {
    const i = this.user.favoriteGenres.indexOf(g);
    if (i >= 0) this.user.favoriteGenres.splice(i, 1);
    else this.user.favoriteGenres.push(g);
  }

  submit() {
    // prosta validacija
    if (!this.user.firstName || !this.user.lastName || !this.user.email || !this.user.password) {
      this.error = 'Popuni obavezna polja (ime, prezime, email, lozinka).';
      return;
    }
    this.error = '';
    this.auth.register(this.user); // neka u servisu napravi current i upiše u localStorage
    this.router.navigateByUrl('/');
  }
}
