import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../Services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean | Observable<boolean> | Promise<boolean> {
    if (this.authService.hasToken()) {
      const userRole = this.authService.getUserPosition();
      const userId = this.authService.getCurrentUserId();

      if (userRole === 'Admin') {
        return true;
      }

      if (userRole === 'User') {
        if (state.url === `/nguoi-dung/chi-tiet-nguoi-dung/${userId}` || state.url !== '/nguoi-dung') {
          return true;
        } else {
          this.router.navigate([`/nguoi-dung/chi-tiet-nguoi-dung/${userId}`]);
          return false;
        }
      }

      this.router.navigate(['/dashboard']);
      return false;
    } else {
      this.authService.logout();
      this.router.navigate(['/login'], { queryParams: { returnUrl: state.url } });
      return false;
    }
  }
}
