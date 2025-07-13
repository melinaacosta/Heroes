import { Injectable } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';
import { HEROES_MOCK } from '../mock/mock-heroes';
import { Heroe } from '../interfaces/hero.interface';

@Injectable({
  providedIn: 'root',
})
export class BaseApiService {
  private heroes = HEROES_MOCK;

  public getAll(): Observable<Heroe[]> {
    return of(this.heroes);
  }

  public getById(id: number): Observable<Heroe | undefined> {
    const hero = HEROES_MOCK.find((heroe) => heroe.id === id);
    return of(hero);
  }

  public update(updatedHero: Heroe): Observable<Heroe> {
    const hero = HEROES_MOCK.findIndex((heroe) => heroe.id === updatedHero.id);
    if (hero > -1) {
      HEROES_MOCK[hero] = updatedHero;
      return of(updatedHero);
    } else {
      return throwError(() => new Error('Héroe no encontrado'));
    }
  }

  public delete(id: number): Observable<Heroe> {
    const hero = HEROES_MOCK.findIndex((heroe) => heroe.id === id);
    if (hero > -1) {
      const deleted = HEROES_MOCK.splice(hero, 1)[0];
      return of(deleted);
    } else {
      return throwError(() => new Error('Héroe no encontrado'));
    }
  }
}
