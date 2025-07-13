import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { DashboardComponent } from './dashboard.component';
import { BaseApiService } from '../../services/base-api.service';
import { of, throwError } from 'rxjs';
import { Heroe } from '../../interfaces/hero.interface';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';

describe('DashboardComponent', () => {
  let component: DashboardComponent;
  let fixture: ComponentFixture<DashboardComponent>;
  let mockHeroService: jasmine.SpyObj<BaseApiService>;
  let mockDialog: jasmine.SpyObj<MatDialog>;
  let mockRouter: jasmine.SpyObj<Router>;

  const mockHeroes: Heroe[] = [
    { id: 1, nombre: 'Batman', imagen: 'batman.png', descripcion: 'Dark Knight' },
    { id: 2, nombre: 'Superman', imagen: 'superman.png', descripcion: 'Man of Steel' },
    { id: 3, nombre: 'Wonder Woman', imagen: 'ww.png', descripcion: 'Amazon' }
  ];

  beforeEach(async () => {
    mockHeroService = jasmine.createSpyObj('BaseApiService', ['getAll']);
    mockDialog = jasmine.createSpyObj('MatDialog', ['open']);
    mockRouter = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      imports: [DashboardComponent],
      providers: [
        { provide: BaseApiService, useValue: mockHeroService },
        { provide: MatDialog, useValue: mockDialog },
        { provide: Router, useValue: mockRouter }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(DashboardComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load heroes on init', fakeAsync(() => {
    mockHeroService.getAll.and.returnValue(of(mockHeroes));

    component.ngOnInit();
    tick();

    expect(component.heroes.length).toBe(3);
    expect(component.filteredHeroes.length).toBe(3);
    expect(component.isLoading).toBeFalse();
  }));

  it('should handle error on load heroes', fakeAsync(() => {
    mockHeroService.getAll.and.returnValue(throwError(() => new Error('fail')));

    spyOn(console, 'error');

    component.ngOnInit();
    tick();

    expect(component.isLoading).toBeFalse();
    expect(console.error).toHaveBeenCalledWith('Error al obtener heroe', jasmine.any(Error));
  }));

  it('should filter heroes on search', () => {
    component.heroes = mockHeroes;
    component.filteredHeroes = [...mockHeroes];
    component.searchText = 'bat';

    component.searchHeroes();

    expect(component.filteredHeroes.length).toBe(1);
    expect(component.filteredHeroes[0].nombre).toBe('Batman');
    expect(component.currentPage).toBe(0);
  });

  it('should update pagination on page change', () => {
    component.heroes = mockHeroes;
    component.filteredHeroes = [...mockHeroes];
    component.pageSize = 10;
    component.currentPage = 0;

    component.onPageChange({ pageIndex: 1, pageSize: 1, length: 3 });

    expect(component.pageSize).toBe(1);
    expect(component.currentPage).toBe(1);
  });

  it('should navigate to detail on viewDetail', () => {
    component.viewDetail(42);
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/heroes', 42]);
  });
});
