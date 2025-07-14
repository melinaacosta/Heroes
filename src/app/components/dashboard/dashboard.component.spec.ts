import {
  ComponentFixture,
  TestBed,
  fakeAsync,
  tick,
} from '@angular/core/testing';
import { DashboardComponent } from './dashboard.component';
import { BaseApiService } from '../../services/base-api.service';
import { of, throwError } from 'rxjs';
import { Heroe } from '../../interfaces/hero.interface';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';

describe('DashboardComponent', () => {
  let component: DashboardComponent;
  let fixture: ComponentFixture<DashboardComponent>;
  let mockHeroService: jasmine.SpyObj<BaseApiService>;
  let mockDialog: jasmine.SpyObj<MatDialog>;
  let mockRouter: jasmine.SpyObj<Router>;

  const mockHeroes: Heroe[] = [
    {
      id: 1,
      nombre: 'Batman',
      imagen: 'batman.png',
      descripcion: 'Dark Knight',
    },
    {
      id: 2,
      nombre: 'Superman',
      imagen: 'superman.png',
      descripcion: 'Man of Steel',
    },
    { id: 3, nombre: 'Wonder Woman', imagen: 'ww.png', descripcion: 'Amazon' },
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
        { provide: Router, useValue: mockRouter },
        {
          provide: ActivatedRoute,
          useValue: {
            queryParamMap: of({
              get: (key: string) => {
                const params: Record<string, string | null> = {
                  search: '',
                  page: '0',
                  size: '10',
                };
                return params[key];
              },
            }),
          },
        },
      ],
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

    expect(component.heroes().length).toBe(3);
    expect(component.filteredHeroes().length).toBe(3);
    expect(component.isLoading()).toBeFalse();
  }));

  it('should handle error on load heroes', fakeAsync(() => {
    mockHeroService.getAll.and.returnValue(throwError(() => new Error('fail')));

    spyOn(console, 'error');

    component.ngOnInit();
    tick();

    expect(component.isLoading()).toBeFalse();
    expect(console.error).toHaveBeenCalledWith(
      'Error al obtener heroe',
      jasmine.any(Error)
    );
  }));

  it('should filter heroes on searchText change', () => {
    component.heroes.set(mockHeroes);
    component.searchText.set('bat');

    const filtered = component.filteredHeroes();
    expect(filtered.length).toBe(1);
    expect(filtered[0].nombre).toBe('Batman');
    expect(component.currentPage()).toBe(0);
  });

  it('should update pagination on page change', () => {
    component.heroes.set(mockHeroes);
    component.pageSize.set(10);
    component.currentPage.set(0);

    component.onPageChange({ pageIndex: 1, pageSize: 1, length: 3 });

    expect(component.pageSize()).toBe(1);
    expect(component.currentPage()).toBe(1);
  });

  it('should update searchText and reset page on search change', () => {
    const spy = spyOn<any>(component as any, 'updateQueryParams');

    component.onSearchChange('woman');

    expect(component.searchText()).toBe('woman');
    expect(component.currentPage()).toBe(0);
    expect(spy).toHaveBeenCalled();
  });

  it('should call router.navigate with correct queryParams on updateQueryParams', () => {
    component.searchText.set('bat');
    component.currentPage.set(2);
    component.pageSize.set(10);

    (component as any).updateQueryParams();

    expect(mockRouter.navigate).toHaveBeenCalledWith([], {
      relativeTo: jasmine.anything(),
      queryParams: {
        search: 'bat',
        page: 2,
        size: 10,
      },
    });
  });

  it('should return correct pagedHeroes', () => {
    component.heroes.set(mockHeroes);
    component.pageSize.set(2);
    component.currentPage.set(1);

    const paged = component.pagedHeroes();
    expect(paged.length).toBe(1);
    expect(paged[0].nombre).toBe('Wonder Woman');
  });
});
