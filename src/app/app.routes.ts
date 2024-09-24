import { Routes } from '@angular/router';
import { LoginComponent } from './Pages/login/login.component';
import { AuthGuard } from './guards/auth.guard';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  {
    path: '',
    redirectTo: '/dashboard', // Redirect trang chủ đến dashboard
    pathMatch: 'full'
  },
  {
    path: '',
    loadChildren: () => import('./Pages/main/main.routes').then(m => m.ROUTES),
    canActivate: [AuthGuard] // Bảo vệ toàn bộ route bằng AuthGuard
  },
  { path: '**', redirectTo: '/dashboard' } // Redirect các route không tìm thấy về dashboard
];
