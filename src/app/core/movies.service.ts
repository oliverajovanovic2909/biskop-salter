import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Movie } from '../models/movie.model';
import { Genre } from '../models/genre.enum';

@Injectable({ providedIn: 'root' })
export class MoviesService {
  private _movies$ = new BehaviorSubject<Movie[]>(this.seed());
  readonly movies$ = this._movies$.asObservable();

  getAll(): Movie[] {
    return this._movies$.value;
  }

  search(params: {
    title?: string;
    genre?: Genre;
    director?: string;
    actor?: string;
    maxPriceAtAnyProjection?: number;
  }): Movie[] {
    const q = (params?.title ?? '').toLowerCase().trim();
    const dir = (params?.director ?? '').toLowerCase().trim();
    const act = (params?.actor ?? '').toLowerCase().trim();
    const g = params?.genre;
    const maxP = params?.maxPriceAtAnyProjection;

    return this.getAll().filter(m => {
      const byTitle = !q || m.title.toLowerCase().includes(q) || m.description.toLowerCase().includes(q);
      const byGenre = !g || m.genre.includes(g);
      const byDirector = !dir || m.director.toLowerCase().includes(dir);
      const byActor = !act || m.actors.some(a => a.toLowerCase().includes(act));
      const byPrice = maxP == null || m.projections.some(p => p.price <= maxP);
      return byTitle && byGenre && byDirector && byActor && byPrice;
    });
  }

  getById(id: string) {
  return this.getAll().find(m => m.id === id);
}

addReview(movieId: string, review: { userName: string; rating: number; comment: string }) {
  const all = this.getAll().map(m => {
    if (m.id === movieId) {
      const r = { ...review, createdAt: new Date().toISOString() };
      return { ...m, reviews: [...m.reviews, r] };
    }
    return m;
  });
  (this as any)._movies$.next(all);
}


  private seed(): Movie[] {
  return [
    {
      id: 'm1',
      title: 'Bure baruta',
      description: 'Drama o ljudima na ivici živaca u postsocijalističkoj Srbiji.',
      genre: [Genre.Drama],
      durationMin: 115,
      director: 'Goran Paskaljević',
      actors: ['Miki Manojlović', 'Lazar Ristovski'],
      releaseDate: '1998-09-15',
      projections: [
        { dateTime: '2025-09-05T18:00:00', price: 420 },
        { dateTime: '2025-09-06T20:30:00', price: 450 }
      ],
      reviews: [],
      imageUrl: 'assets/Bure_baruta.jpg'
    },
    {
      id: 'm2',
      title: 'Lepa sela lepo gore',
      description: 'Priča o prijateljstvu i ratu u Bosni tokom devedesetih.',
      genre: [Genre.Drama],
      durationMin: 115,
      director: 'Srđan Dragojević',
      actors: ['Dragan Bjelogrlić', 'Nikola Kojo'],
      releaseDate: '1996-03-17',
      projections: [
        { dateTime: '2025-09-07T17:00:00', price: 420 },
        { dateTime: '2025-09-08T19:30:00', price: 450 }
      ],
      reviews: [],
      imageUrl: 'assets/Lepaselalepogore.jpg'
    },
    {
      id: 'm3',
      title: 'Rane',
      description: 'Odrastanje u kriminalnom Beogradu devedesetih.',
      genre: [Genre.Drama],
      durationMin: 100,
      director: 'Srđan Dragojević',
      actors: ['Milan Marić', 'Dušan Pekić'],
      releaseDate: '1998-02-15',
      projections: [
        { dateTime: '2025-09-05T21:00:00', price: 420 },
        { dateTime: '2025-09-06T19:00:00', price: 440 }
      ],
      reviews: [],
      imageUrl: 'assets/Rane.jpg'
    },
    {
      id: 'm4',
      title: 'Mi nismo anđeli',
      description: 'Kultna komedija o đavolu i anđelu koji se bore za dušu studenta.',
      genre: [Genre.Komedija],
      durationMin: 95,
      director: 'Srđan Dragojević',
      actors: ['Nikola Kojo', 'Maja Sabljić'],
      releaseDate: '1992-03-15',
      projections: [
        { dateTime: '2025-09-09T18:00:00', price: 400 },
        { dateTime: '2025-09-10T20:00:00', price: 430 }
      ],
      reviews: [],
      imageUrl: 'assets/Mi_nismo_andjeli.jpg'
    },
    {
      id: 'm5',
      title: 'Mi nismo anđeli 2',
      description: 'Nastavak kultne komedije sa novim zapletom.',
      genre: [Genre.Komedija],
      durationMin: 97,
      director: 'Srđan Dragojević',
      actors: ['Nikola Kojo', 'Branka Katić'],
      releaseDate: '2005-04-10',
      projections: [
        { dateTime: '2025-09-11T19:00:00', price: 400 },
        { dateTime: '2025-09-12T21:00:00', price: 420 }
      ],
      reviews: [],
      imageUrl: 'assets/Minismoandjeli2.jpg'
    },
    {
      id: 'm6',
      title: 'Zona Zamfirova',
      description: 'Ljubavna priča iz Niša prema romanu Stevana Sremca.',
      genre: [Genre.Drama],
      durationMin: 110,
      director: 'Zdravko Šotra',
      actors: ['Vojin Ćetković', 'Katarina Radivojević'],
      releaseDate: '2002-01-20',
      projections: [
        { dateTime: '2025-09-06T18:30:00', price: 460 },
        { dateTime: '2025-09-07T20:30:00', price: 500 }
      ],
      reviews: [],
      imageUrl: 'assets/Zone_zamfirsko.jpg'
    },
    {
      id: 'm7',
      title: 'Ivkova slava',
      description: 'Komedija zasnovana na delu Stevana Sremca.',
      genre: [Genre.Komedija],
      durationMin: 105,
      director: 'Zdravko Šotra',
      actors: ['Zoran Cvijanović', 'Dragan Bjelogrlić'],
      releaseDate: '2005-04-15',
      projections: [
        { dateTime: '2025-09-08T18:00:00', price: 430 },
        { dateTime: '2025-09-09T20:00:00', price: 460 }
      ],
      reviews: [],
      imageUrl: 'assets/Ivkova-slava.jpg'
    },
    {
      id: 'm8',
      title: 'Turneja',
      description: 'Grupa glumaca na turneji kroz ratom zahvaćenu Bosnu.',
      genre: [Genre.Drama],
      durationMin: 100,
      director: 'Goran Marković',
      actors: ['Tihomir Stanić', 'Mirjana Karanović'],
      releaseDate: '2008-09-10',
      projections: [
        { dateTime: '2025-09-10T19:00:00', price: 420 },
        { dateTime: '2025-09-11T21:00:00', price: 440 }
      ],
      reviews: [],
      imageUrl: 'assets/Turneja.jpg'
    },
    {
      id: 'm9',
      title: 'Profesionalac',
      description: 'Neočekivani susret bivšeg policajca i pisca, po drami Dušana Kovačevića.',
      genre: [Genre.Drama, Genre.Komedija],
      durationMin: 120,
      director: 'Dušan Kovačević',
      actors: ['Bora Todorović', 'Branislav Lečić'],
      releaseDate: '2003-02-12',
      projections: [
        { dateTime: '2025-09-12T18:30:00', price: 440 },
        { dateTime: '2025-09-13T20:30:00', price: 470 }
      ],
      reviews: [],
      imageUrl: 'assets/Profesionalac.jpg'
    },
    {
      id: 'm10',
      title: 'Tri karte za Holivud',
      description: 'Satirična priča o iluzijama i stvarnosti u tranziciji.',
      genre: [Genre.Komedija, Genre.Drama],
      durationMin: 110,
      director: 'Božidar Nikolić',
      actors: ['Nikola Đuričko', 'Zoran Cvijanović'],
      releaseDate: '1993-09-20',
      projections: [
        { dateTime: '2025-09-13T18:00:00', price: 400 },
        { dateTime: '2025-09-14T20:30:00', price: 420 }
      ],
      reviews: [],
      imageUrl: 'assets/Tri_karte.jpg'
    }
  ];
}
}