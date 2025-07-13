import { Component } from '@angular/core';
import { Heroe } from '../../interfaces/hero.interface';
import { BaseApiService } from '../../services/base-api.service';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatCardModule } from '@angular/material/card';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule } from '@angular/forms';
import { HeroAddComponent } from '../hero-add/hero-add.component';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    MatProgressSpinnerModule,
    MatCardModule,
    MatPaginatorModule,
    MatInputModule,
    MatFormFieldModule,
    FormsModule,
    RouterModule,
    MatDialogModule,
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.sass',
})
export class DashboardComponent {
  public heroes: Heroe[] = [];
  public isLoading: boolean = true;
  public pagedHeroes: Heroe[] = [];
  public filteredHeroes: Heroe[] = [];

  public pageSize: number = 10;
  public currentPage: number = 0;
  public totalHeroes: number = 0;

  public searchText: string = '';

  constructor(
    private heroesService: BaseApiService,
    private dialog: MatDialog,
    private router: Router
  ) {}

  ngOnInit() {
    this.getAllHeroes();
  }

  public viewDetail(id: number): void {
    this.router.navigate([`/heroes`, id]);
  }

  public addHero(): void {
    const dialogRef = this.dialog.open(HeroAddComponent, {
      width: '400px',
    });

    dialogRef.afterClosed().subscribe((result: Heroe | undefined) => {
      if (result) {
        const nuevoId =
          this.heroes.length > 0
            ? Math.max(...this.heroes.map((h) => h.id)) + 1
            : 1;

        const nuevoHeroe = { ...result, id: nuevoId };

        this.heroes.push(nuevoHeroe);
        this.filteredHeroes = [...this.heroes];
        this.totalHeroes = this.filteredHeroes.length;
        this.updatedPage();
      }
    });
  }

  public searchHeroes(): void {
    const search = this.searchText.toLocaleLowerCase().trim();
    this.filteredHeroes = this.heroes.filter((heroe) =>
      heroe.nombre.toLocaleLowerCase().includes(search)
    );
    this.totalHeroes = this.filteredHeroes.length;
    this.currentPage = 0;
    this.updatedPage();
  }

  public onPageChange(event: PageEvent) {
    this.pageSize = event.pageSize;
    this.currentPage = event.pageIndex;
    this.updatedPage();
  }

  private updatedPage(): void {
    const startIndex = this.currentPage * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    this.pagedHeroes = this.filteredHeroes.slice(startIndex, endIndex);
  }

  private getAllHeroes() {
    this.heroesService.getAll().subscribe({
      next: (response: Heroe[]) => {
        this.heroes = response;
        this.filteredHeroes = [...response];
        this.isLoading = false;
        this.totalHeroes = response.length;
        this.updatedPage();
      },
      error: (error) => {
        console.error('Error al obtener heroe', error);
        this.isLoading = false;
      },
    });
  }
}
