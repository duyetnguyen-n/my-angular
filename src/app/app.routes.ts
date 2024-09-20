import { Routes } from '@angular/router';
import { MainComponent } from './Pages/main/main.component';
import { DashboardComponent } from './Pages/dashboard/dashboard.component';

export const routes: Routes = [
  {
    path: 'tieu-chi',
    loadChildren: () => import('./Pages/a/a.routes').then(m => m.ROUTES),
  },
  {
    path: '',
    loadChildren: () => import('./Pages/dashboard/dashboard.routes').then(m => m.ROUTES),
  },
];
