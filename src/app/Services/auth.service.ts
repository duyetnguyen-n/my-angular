import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, BehaviorSubject } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private isAuthenticatedSubject = new BehaviorSubject<boolean>(this.hasToken());
  isAuthenticated$ = this.isAuthenticatedSubject.asObservable();
  private apiUrl = 'http://localhost:5238/api/Auth';

  constructor(private http: HttpClient, private router: Router) {}

  // Hàm lưu token vào cookie
  private setCookie(name: string, value: string, days: number) {
    const date = new Date();
    date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
    const expires = `expires=${date.toUTCString()}`;
    document.cookie = `${name}=${value}; ${expires}; path=/`;
  }

  // Hàm lấy token từ cookie
  private getCookie(name: string): string | null {
    const nameEQ = `${name}=`;
    const ca = document.cookie.split(';');
    for (let i = 0; i < ca.length; i++) {
      let c = ca[i];
      while (c.charAt(0) === ' ') c = c.substring(1, c.length);
      if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
    }
    return null;
  }

  // Hàm xóa cookie
  private deleteCookie(name: string) {
    document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
  }

  login(credentials: { numberPhone: string, password: string }): Observable<any> {
    return this.http.post(`${this.apiUrl}/login`, credentials).pipe(
      map((response: any) => {
        if (this.isBrowser()) {
          // Lưu token vào cookie với thời hạn 1 ngày
          this.setCookie('token', response.token, 1);
        }
        this.isAuthenticatedSubject.next(true);
        return response;
      })
    );
  }

  logout(): void {
    if (this.isBrowser()) {
      // Xóa token khỏi cookie
      this.deleteCookie('token');
    }
    this.isAuthenticatedSubject.next(false);
    this.router.navigate(['/login']);
  }

  getToken(): string | null {
    if (this.isBrowser()) {
      // Lấy token từ cookie
      return this.getCookie('token');
    }
    return null;
  }

  isTokenExpired(token: string): boolean {
    const expiry = (JSON.parse(atob(token.split('.')[1]))).exp;
    if (this.isBrowser()) {
      return (Math.floor((new Date).getTime() / 1000)) >= expiry;
    }
    return false;
  }

  getUserPosition(): string | null {
    const token = this.getToken();
    if (token) {
      const tokenPayload = JSON.parse(atob(token.split('.')[1]));
      return tokenPayload.role || null;
    }
    return null;
  }

  getCurrentUserId(): string | null {
    const token = this.getToken();
    if (token) {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.sub || null;
    }
    return null;
  }

  hasToken(): boolean {
    if (this.isBrowser()) {
      const token = this.getToken();
      return !!token && !this.isTokenExpired(token);
    }
    return false;
  }

  private isBrowser(): boolean {
    return typeof window !== 'undefined' && typeof document !== 'undefined';
  }
}
