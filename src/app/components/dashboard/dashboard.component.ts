import { Component, signal, computed } from '@angular/core';
import { Heroe } from '../../interfaces/hero.interface';
import { BaseApiService } from '../../services/base-api.service';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatCardModule } from '@angular/material/card';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { HeroAddComponent } from '../hero-add/hero-add.component';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    MatProgressSpinnerModule,
    MatCardModule,
    MatPaginatorModule,
    MatInputModule,
    MatFormFieldModule,
    RouterModule,
    MatDialogModule,
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.sass',
})
export class DashboardComponent {
  public heroes = signal<Heroe[]>([]);
  public isLoading = signal(true);
  public searchText = signal('');
  public pageSize = signal(10);
  public currentPage = signal(0);

  public filteredHeroes = computed(() => {
    const search = this.searchText().toLowerCase().trim();
    return this.heroes().filter((heroe) =>
      heroe.nombre.toLowerCase().includes(search)
    );
  });

  public totalHeroes = computed(() => this.filteredHeroes().length);

  public pagedHeroes = computed(() => {
    const startIndex = this.currentPage() * this.pageSize();
    const endIndex = startIndex + this.pageSize();
    return this.filteredHeroes().slice(startIndex, endIndex);
  });

  constructor(
    private heroesService: BaseApiService,
    private dialog: MatDialog,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.getAllHeroes();

    this.route.queryParamMap.subscribe((params) => {
      const search = params.get('search') || '';
      const page = Number(params.get('page')) || 0;
      const size = Number(params.get('size')) || 10;

      this.searchText.set(search);
      this.currentPage.set(page);
      this.pageSize.set(size);
    });
  }

  private updateQueryParams() {
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: {
        search: this.searchText(),
        page: this.currentPage(),
        size: this.pageSize(),
      },
    });
  }

  public onSearchChange(value: string): void {
    this.searchText.set(value);
    this.currentPage.set(0);
    this.updateQueryParams();
  }

  public viewDetail(id: number): void {
  this.router.navigate(['/heroes', id], {
    queryParams: {
      search: this.searchText(),
      page: this.currentPage(),
      size: this.pageSize()
    }
  });
}

  public addHero(): void {
    const dialogRef = this.dialog.open(HeroAddComponent, {
      width: '400px',
    });

    dialogRef.afterClosed().subscribe((result: Heroe | undefined) => {
      if (result) {
        const nuevoId =
          this.heroes().length > 0
            ? Math.max(...this.heroes().map((h) => h.id)) + 1
            : 1;

        const nuevoHeroe = { ...result, id: nuevoId };
        this.heroes.set([...this.heroes(), nuevoHeroe]);
      }
    });
  }

  public onPageChange(event: PageEvent) {
    this.pageSize.set(event.pageSize);
    this.currentPage.set(event.pageIndex);
    this.updateQueryParams();
  }

  private getAllHeroes() {
    this.heroesService.getAll().subscribe({
      next: (response: Heroe[]) => {
        this.heroes.set(response);
        this.isLoading.set(false);
      },
      error: (error) => {
        console.error('Error al obtener heroe', error);
        this.isLoading.set(false);
      },
    });
  }
}
