import { Routes } from '@angular/router';
import { MainComponent } from './main.component';
import { AuthGuard } from '../../guards/auth.guard';

export const ROUTES: Routes = [
  {
    path: '',
    component: MainComponent,
    children: [
      {
        path: 'dashboard',
        loadChildren: () => import('../dashboard/dashboard.routes').then(m => m.ROUTES),
        canActivate: [AuthGuard] 
      },
      {
        path: 'tieu-chi',
        loadChildren: () => import('../criteria/criteria.routes').then(m => m.ROUTES),
        canActivate: [AuthGuard]
      },
      {
        path: 'nguoi-dung',
        loadChildren: () => import('../user/user.routes').then(m => m.ROUTES),
        canActivate: [AuthGuard]
      },
      {
        path: '',
        redirectTo: 'dashboard', // Redirect từ root về dashboard
        pathMatch: 'full'
      }
    ]
  }
];
