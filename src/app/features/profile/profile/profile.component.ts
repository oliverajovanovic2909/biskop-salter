import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgIf, NgFor } from '@angular/common';
import { RouterLink } from '@angular/router';

import { AuthService } from '../../../core/auth.service';
import { Genre } from '../../../models/genre.enum';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [FormsModule, NgIf, NgFor, RouterLink],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss'
})
export class ProfileComponent {
  genres = Object.values(Genre);

  constructor(public auth: AuthService) {}

  toggleGenre(g: Genre) {
    const u = this.auth.current!;
    const i = u.favoriteGenres.indexOf(g);
    if (i >= 0) u.favoriteGenres.splice(i, 1);
    else u.favoriteGenres.push(g);
    this.auth.updateProfile({ favoriteGenres: [...u.favoriteGenres] });
  }
}
