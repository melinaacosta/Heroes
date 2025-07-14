import { TestBed } from '@angular/core/testing';

import { BaseApiService } from './base-api.service';
import { HEROES_MOCK } from '../mock/mock-heroes';
import { Heroe } from '../interfaces/hero.interface';
import { take } from 'rxjs/operators';

describe('BaseApiService', () => {
  let service: BaseApiService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BaseApiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should return all heroes', (done) => {
    service.getAll().pipe(take(1)).subscribe((heroes) => {
      expect(heroes.length).toBe(HEROES_MOCK.length);
      expect(heroes).toEqual(HEROES_MOCK);
      done();
    });
  });

  it('should return hero by id', (done) => {
    const targetId = HEROES_MOCK[0].id;
    service.getById(targetId).pipe(take(1)).subscribe((hero) => {
      expect(hero).toEqual(HEROES_MOCK[0]);
      done();
    });
  });

  it('should update an existing hero', (done) => {
    const original = HEROES_MOCK[0];
    const updatedHero: Heroe = {
      ...original,
      nombre: 'Héroe Actualizado',
    };

    service.update(updatedHero).pipe(take(1)).subscribe((result) => {
      expect(result.nombre).toBe('Héroe Actualizado');
      expect(HEROES_MOCK[0].nombre).toBe('Héroe Actualizado');
      done();
    });
  });

  it('should return error if trying to update non-existing hero', (done) => {
    const fakeHero: Heroe = { id: 9999, nombre: 'Falso', descripcion: '', imagen: '' };

    service.update(fakeHero).subscribe({
      next: () => fail('should have failed'),
      error: (err) => {
        expect(err.message).toBe('Héroe no encontrado');
        done();
      },
    });
  });

  it('should delete an existing hero', (done) => {
    const heroToDelete = HEROES_MOCK[0];
    const idToDelete = heroToDelete.id;

    service.delete(idToDelete).pipe(take(1)).subscribe((deletedHero) => {
      expect(deletedHero.id).toBe(idToDelete);
      expect(HEROES_MOCK.find((h) => h.id === idToDelete)).toBeUndefined();
      done();
    });
  });

  it('should return error if trying to delete non-existing hero', (done) => {
    service.delete(9999).subscribe({
      next: () => fail('should have failed'),
      error: (err) => {
        expect(err.message).toBe('Héroe no encontrado');
        done();
      },
    });
  });
});
