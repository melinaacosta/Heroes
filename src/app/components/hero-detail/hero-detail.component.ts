import { Component, signal } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { Heroe } from '../../interfaces/hero.interface';
import { ActivatedRoute, Router } from '@angular/router';
import { BaseApiService } from '../../services/base-api.service';
import { CommonModule } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { HeroAddComponent } from '../hero-add/hero-add.component';
import { HeroDeleteComponent } from '../hero-delete/hero-delete.component';

@Component({
  selector: 'app-hero-detail',
  standalone: true,
  imports: [CommonModule, MatCardModule],
  templateUrl: './hero-detail.component.html',
  styleUrl: './hero-detail.component.sass',
})
export class HeroDetailComponent {
  public heroe = signal<Heroe | undefined>(undefined);

  constructor(
    private route: ActivatedRoute,
    private heroService: BaseApiService,
    private router: Router,
    private dialog: MatDialog
  ) {}

  ngOnInit() {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.heroService.getById(id).subscribe((heroe) => this.heroe.set(heroe));
  }

  public return(): void {
    this.router.navigate(['/'], {
      queryParams: this.route.snapshot.queryParams,
    });
  }

  public edit(): void {
    const dialogRef = this.dialog.open(HeroAddComponent, {
      width: '400px',
      data: { ...this.heroe() },
    });

    dialogRef.afterClosed().subscribe((resultadoEditado: Heroe) => {
      if (resultadoEditado) {
        this.heroService.update(resultadoEditado).subscribe({
          next: () =>
            this.router.navigate(['/'], {
              queryParams: this.route.snapshot.queryParams,
            }),
          error: (err) => console.error(err),
        });
      }
    });
  }

  public delete(): void {
    const heroeActual = this.heroe();
    if (!heroeActual) return;

    const dialogRef = this.dialog.open(HeroDeleteComponent, {
      width: '350px',
      data: {
        message: `¿Estás seguro de que querés borrar a ${heroeActual.nombre}?`,
      },
    });

    dialogRef.afterClosed().subscribe((confirmado: boolean) => {
      if (confirmado) {
        this.heroService.delete(heroeActual.id).subscribe({
          next: () =>
            this.router.navigate(['/'], {
              queryParams: this.route.snapshot.queryParams,
            }),
          error: (err) => console.error('Error al borrar héroe:', err),
        });
      }
    });
  }
}
