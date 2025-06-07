import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Login, LoginResponse, Register } from '../../../models/user.model';
import { StorageService } from '../storage/storage.service';

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
    return this.http.post<LoginResponse>(`${this.apiUrl}/auth/login`, userData, {
      withCredentials: true
    });
  }

  refreshToken(): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.apiUrl}/auth/refresh-token`, {}, {
      withCredentials: true
    });
  }

  loginWithGoogle() {
    window.location.href = `${environment.apiUrl}/auth/google`;
  }

  loginWithFacebook() {
    window.location.href = `${environment.apiUrl}/auth/facebook`;
  }

  logout() {
    this.storage.clear();
  }

  isLoggedIn(): boolean {
    const token = this.storage.getToken();
    return !!token;
  }

  isAdmin(): boolean {
    const role = this.storage.getRole();
    return role === 'AD' || role === 'admin';
  } 
}
