import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { Login, LoginResponse, Register, User } from '../../../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = `${environment.apiUrl}/auth`;

  constructor(private http: HttpClient) {}
  
  register(userData: Register): Observable<any> {
    return this.http.post(`${this.apiUrl}/register`, userData, {
      withCredentials: true
    });
  }
  
  login(userData: Login): Observable<any> {
    return this.http.post<LoginResponse>(`${this.apiUrl}/login`, userData, {
      withCredentials: true
    });
  }

  refreshToken(): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(
      `${this.apiUrl}/refresh-token`, 
      {}, 
      { withCredentials: true }
    );
  }

  loginWithGoogle() {
    window.location.href = `${this.apiUrl}/google`;
  }

  loginWithFacebook() {
    window.location.href = `${this.apiUrl}/facebook`;
  }
}
