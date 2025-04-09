import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { Login, LoginResponse, Register } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = environment.apiUrl;
 
  private currentUsernameSubject = new BehaviorSubject<string | null>(this.getStoredUsername());
  public currentUsername$ = this.currentUsernameSubject.asObservable();
  
  constructor(private http: HttpClient) {}
  
  private getStoredUsername(): string | null {
    return localStorage.getItem('username');
  }
  
  register(userData: Register): Observable<any> {
    return this.http.post(`${this.apiUrl}/auth/register`, userData);
  }

  login(userData: Login): Observable<any> {
    return this.http.post<LoginResponse>(`${this.apiUrl}/auth/login`, userData).pipe(
      tap((res) => {
        localStorage.setItem('token', res.access_token);
        localStorage.setItem('username', userData.username);
        this.currentUsernameSubject.next(userData.username);
      })
    );
  }

  logout() {
    localStorage.removeItem('userId');
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    this.currentUsernameSubject.next(null);
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  getUsername(): string | null {
    return this.currentUsernameSubject.value;
  }

  socialLogin(token: string, username: string): void {
    localStorage.setItem('token', token);
    localStorage.setItem('username', username);
    this.currentUsernameSubject.next(username);
  }
  
}
