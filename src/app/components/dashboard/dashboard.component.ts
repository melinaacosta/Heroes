import { Component } from '@angular/core';
import { Heroe } from '../../interfaces/hero.interface';
import { BaseApiService } from '../../services/base-api.service';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatCardModule } from '@angular/material/card';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule } from '@angular/forms';

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

  constructor(private heroesService: BaseApiService) {}

  ngOnInit() {
    this.getAllHeroes();
  }

  public searchHeroes(): void {
    const search = this.searchText.toLocaleLowerCase().trim();
    console.log(search)
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
