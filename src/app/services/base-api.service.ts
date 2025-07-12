import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { HEROES_MOCK } from '../mock/mock-heroes';
import { Heroe } from '../interfaces/hero.interface';

@Injectable({
  providedIn: 'root'
})
export class BaseApiService {
  private heroes = HEROES_MOCK

  public getAll(): Observable<Heroe[]>{
    return of(this.heroes)
  }

  public getById(id: number): Observable< Heroe | undefined>{
    const hero = HEROES_MOCK.find(heroe => heroe.id === id);
    return of(hero);
  }
}
