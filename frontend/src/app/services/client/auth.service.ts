import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = environment.apiUrl;
  private userSubject = new BehaviorSubject<string | null>(this.getStoredUser());
  constructor(private http: HttpClient) {}
  
  // Đăng ký tài khoản
  register(userData: { username: string; password: string }): Observable<any> {
    return this.http.post(`${this.apiUrl}/auth/register`, userData);
  }

  // Đăng nhập
  login(userData: { username: string; password: string }): Observable<any> {
    return this.http.post(`${this.apiUrl}/auth/login`, userData);
  }

  // Đăng xuất
  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    this.userSubject.next(null);
  }
  
  // Lấy user từ localStorage (dùng khi khởi tạo service)
  private getStoredUser(): string | null {
    return localStorage.getItem('username');
  }

  setUser(username: string) {
    localStorage.setItem('username', username);
    this.userSubject.next(username); 
  }

  getUser(): Observable<string | null> {
    return this.userSubject.asObservable();  
  }
}
