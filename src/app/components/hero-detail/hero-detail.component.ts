import { Component } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { Heroe } from '../../interfaces/hero.interface';
import { ActivatedRoute } from '@angular/router';
import { BaseApiService } from '../../services/base-api.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-hero-detail',
  standalone: true,
  imports: [CommonModule, MatCardModule],
  templateUrl: './hero-detail.component.html',
  styleUrl: './hero-detail.component.sass',
})
export class HeroDetailComponent {
  public heroe?: Heroe;

  constructor(
    private route: ActivatedRoute,
    private heroService: BaseApiService
  ) {}

  ngOnInit() {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.heroService.getById(id).subscribe((heroe) => (this.heroe = heroe));
  }
}
