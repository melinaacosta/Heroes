import { Routes } from '@angular/router';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { HeroDetailComponent } from './components/hero-detail/hero-detail.component';

export const routes: Routes = [
  { path: "", component: DashboardComponent},
  { path: "heroes/:id", component: HeroDetailComponent}
];
