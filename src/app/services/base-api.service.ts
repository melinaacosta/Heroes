import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { HEROES_MOCK } from '../mock/mock-heroes';
import { Heroe } from '../interfaces/hero.interface';

@Injectable({
  providedIn: 'root'
})
export class BaseApiService {
  private heroes = HEROES_MOCK

  constructor() { }

  public getAll(): Observable<Heroe[]>{
    return of(this.heroes)
  }
}
