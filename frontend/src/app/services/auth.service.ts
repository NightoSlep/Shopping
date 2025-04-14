import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Login, LoginResponse, Register } from '../models/user.model';
import { StorageService } from './storage.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = environment.apiUrl;
  
  constructor(private http: HttpClient, private storage: StorageService) {}
  
  register(userData: Register): Observable<any> {
    return this.http.post(`${this.apiUrl}/auth/register`, userData);
  }
  
  login(userData: Login): Observable<any> {
    return this.http.post<LoginResponse>(`${this.apiUrl}/auth/login`, userData);
  }

  socialLogin(token: string, userId: string): void {
    this.storage.setToken(token);
    this.storage.setUserId(userId);
  }

  logout() {
    this.storage.clear();
  }

  isLoggedIn(): boolean {
    const token = this.storage.getToken();
    return !!token;
  }

  isAdmin(): boolean {
    const roleId = this.storage.getRole();
    return roleId === 'AD';
  }
}
