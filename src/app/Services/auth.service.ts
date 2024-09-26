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

  private isBrowser(): boolean {
    return typeof window !== 'undefined' && typeof localStorage !== 'undefined';
  }

  login(credentials: { numberPhone: string, password: string }): Observable<any> {
    return this.http.post(`${this.apiUrl}/login`, credentials).pipe(
      map((response: any) => {
        if (this.isBrowser()) {
          localStorage.setItem('token', response.token);
        }
        this.isAuthenticatedSubject.next(true);
        return response;
      })
    );
  }

  logout(): void {
    if (this.isBrowser()) {
      localStorage.removeItem('token');
    }
    this.isAuthenticatedSubject.next(false);
    this.router.navigate(['/login']);
  }

  getToken(): string | null {
    if (this.isBrowser()) {
      return localStorage.getItem('token');
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
      const token = localStorage.getItem('token');
      return !!token && !this.isTokenExpired(token);
    }
    return false;
  }
}
