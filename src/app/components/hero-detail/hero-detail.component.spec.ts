import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { HeroDetailComponent } from './hero-detail.component';
import { BaseApiService } from '../../services/base-api.service';
import { ActivatedRoute, Router } from '@angular/router';
import { of } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';

describe('HeroDetailComponent', () => {
  let component: HeroDetailComponent;
  let fixture: ComponentFixture<HeroDetailComponent>;
  let mockHeroService: any;
  let mockRouter: any;
  let mockActivatedRoute: any;
  let mockDialog: any;

  const heroMock = {
    id: 1,
    nombre: 'Spiderman',
    imagen: 'url',
    descripcion: 'El amigo arácnido',
  };

  beforeEach(async () => {
    mockHeroService = {
      getById: jasmine.createSpy('getById').and.returnValue(of(heroMock)),
      update: jasmine.createSpy('update').and.returnValue(of(heroMock)),
      delete: jasmine.createSpy('delete').and.returnValue(of(heroMock)),
    };

    mockRouter = {
      navigate: jasmine.createSpy('navigate'),
    };

    mockActivatedRoute = {
      snapshot: {
        paramMap: {
          get: jasmine.createSpy('get').and.returnValue('1'),
        },
      },
    };

    mockDialog = {
      open: jasmine.createSpy('open').and.returnValue({
        afterClosed: () => of(heroMock),
      }),
    };

    await TestBed.configureTestingModule({
      imports: [HeroDetailComponent],
      providers: [
        { provide: BaseApiService, useValue: mockHeroService },
        { provide: Router, useValue: mockRouter },
        { provide: ActivatedRoute, useValue: mockActivatedRoute },
        { provide: MatDialog, useValue: mockDialog },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(HeroDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should fetch hero on init', () => {
    expect(mockHeroService.getById).toHaveBeenCalledWith(1);
    expect(component.heroe).toEqual(heroMock);
  });

  it('return() should navigate to root', () => {
    component.return();
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/']);
  });

  it('edit() should open dialog and navigate on success', () => {
    component.edit();
    expect(mockDialog.open).toHaveBeenCalled();
    expect(mockHeroService.update).toHaveBeenCalledWith(heroMock);
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/']);
  });

  it('delete() should open dialog, call delete service and navigate', () => {
    mockDialog.open.and.returnValue({
      afterClosed: () => of(true),
    });
    component.heroe = heroMock;
    component.delete(heroMock);

    expect(mockDialog.open).toHaveBeenCalled();
    expect(mockHeroService.delete).toHaveBeenCalledWith(heroMock.id);
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/']);
  });
});
