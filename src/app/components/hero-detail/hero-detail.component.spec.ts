import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HeroDetailComponent } from './hero-detail.component';
import { BaseApiService } from '../../services/base-api.service';
import { ActivatedRoute, Router } from '@angular/router';
import { of } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { Heroe } from '../../interfaces/hero.interface';

describe('HeroDetailComponent', () => {
  let component: HeroDetailComponent;
  let fixture: ComponentFixture<HeroDetailComponent>;
  let mockHeroService: jasmine.SpyObj<BaseApiService>;
  let mockRouter: jasmine.SpyObj<Router>;
  let mockActivatedRoute: any;
  let mockDialog: any;

  const heroMock: Heroe = {
    id: 1,
    nombre: 'Spiderman',
    imagen: 'url',
    descripcion: 'El amigo arácnido',
  };

  beforeEach(async () => {
    mockHeroService = jasmine.createSpyObj('BaseApiService', [
      'getById',
      'update',
      'delete',
    ]);
    mockHeroService.getById.and.returnValue(of(heroMock));
    mockHeroService.update.and.returnValue(of(heroMock));
    mockHeroService.delete.and.returnValue(of(heroMock));

    mockRouter = jasmine.createSpyObj('Router', ['navigate']);

    mockActivatedRoute = {
      snapshot: {
        paramMap: {
          get: jasmine.createSpy().and.returnValue('1'),
        },
        queryParams: {
          search: 'bat',
          page: '2',
          size: '10',
        },
      },
    };

    mockDialog = {
      open: jasmine.createSpy().and.returnValue({
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

  it('should load hero on init', () => {
    expect(mockHeroService.getById).toHaveBeenCalledWith(1);
    expect(component.heroe()).toEqual(heroMock);
  });

  it('return() should navigate to root with queryParams', () => {
    component.return();
    expect(mockRouter.navigate).toHaveBeenCalledWith(
      ['/'],
      { queryParams: mockActivatedRoute.snapshot.queryParams }
    );
  });

  it('edit() should open dialog and update hero with queryParams', () => {
    component.heroe.set(heroMock);

    component.edit();

    expect(mockDialog.open).toHaveBeenCalled();
    expect(mockHeroService.update).toHaveBeenCalledWith(heroMock);
    expect(mockRouter.navigate).toHaveBeenCalledWith(
      ['/'],
      { queryParams: mockActivatedRoute.snapshot.queryParams }
    );
  });

  it('delete() should open dialog and delete hero with queryParams', () => {
    mockDialog.open.and.returnValue({
      afterClosed: () => of(true),
    });

    component.heroe.set(heroMock);

    component.delete();

    expect(mockDialog.open).toHaveBeenCalled();
    expect(mockHeroService.delete).toHaveBeenCalledWith(heroMock.id);
    expect(mockRouter.navigate).toHaveBeenCalledWith(
      ['/'],
      { queryParams: mockActivatedRoute.snapshot.queryParams }
    );
  });

  it('delete() should not delete if dialog is cancelled', () => {
    mockDialog.open.and.returnValue({
      afterClosed: () => of(false),
    });

    component.heroe.set(heroMock);

    component.delete();

    expect(mockHeroService.delete).not.toHaveBeenCalled();
    expect(mockRouter.navigate).not.toHaveBeenCalled();
  });

  it('edit() should do nothing if dialog is cancelled', () => {
    mockDialog.open.and.returnValue({
      afterClosed: () => of(undefined),
    });

    component.heroe.set(heroMock);

    component.edit();

    expect(mockHeroService.update).not.toHaveBeenCalled();
    expect(mockRouter.navigate).not.toHaveBeenCalled();
  });

  it('delete() should do nothing if heroe is undefined', () => {
    component.heroe.set(undefined);

    component.delete();

    expect(mockDialog.open).not.toHaveBeenCalled();
    expect(mockHeroService.delete).not.toHaveBeenCalled();
  });
});
