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
        path: 'lich-su',
        loadChildren: () => import('../log/log.routes').then(m => m.ROUTES),
        canActivate: [AuthGuard]
      },
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full'
      },
      {
        path: 'nguoi-dung/chi-tiet-nguoi-dung/:id',
        loadChildren: () => import('../detail-user/detail-user.routes').then(m => m.ROUTES),
        canActivate: [AuthGuard]
      },
      {
        path: 'nguoi-dung/danh-gia/:id',
        loadChildren: () => import('../criteria-of-evaluate/criteria-of-evaluate.routes').then(m => m.ROUTES),
        canActivate: [AuthGuard]
      }
    ]
  }
];
