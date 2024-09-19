import { Routes } from '@angular/router';
import { MainComponent } from './Pages/main/main.component';

export const routes: Routes = [
  {
    path: 'tieu-chi',
    loadChildren: () => import('./Pages/a/a.routes').then(m => m.ROUTES),
  },
  { path: '', component: MainComponent },
];
