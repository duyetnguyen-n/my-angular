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

      // Nếu là Admin, cho phép truy cập tất cả các trang
      if (userRole === 'Admin') {
        return true;
      }

      // Nếu là User, chỉ cho phép vào trang chi tiết người dùng
      if (userRole === 'User') {
        // Chỉ cho phép vào trang chi tiết người dùng hoặc trang khác
        if (state.url === `/nguoi-dung/chi-tiet-nguoi-dung/${userId}` || state.url !== '/nguoi-dung') {
          return true;
        } else {
          this.router.navigate([`/nguoi-dung/chi-tiet-nguoi-dung/${userId}`]);
          return false;
        }
      }

      // Nếu không có vai trò phù hợp, chuyển hướng đến trang đăng nhập
      this.router.navigate(['/login']);
      return false;
    } else {
      this.authService.logout();
      this.router.navigate(['/login'], { queryParams: { returnUrl: state.url } });
      return false;
    }
  }
}
