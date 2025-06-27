import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { ManageUser, Register, User } from '../../../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = `${environment.apiUrl}/users`;
  constructor(private http: HttpClient) {}

  getUserName(userId: string): Observable<{ username: string }> {
    return this.http.get<{ username: string }>(`${this.apiUrl}/${userId}/name`);
  }

  getAllUsers(): Observable<User[]> {
    return this.http.get<User[]>(this.apiUrl, { withCredentials: true });
  }

  createUser(user: Register): Observable<User> {
    console.log(user);
    return this.http.post<User>(this.apiUrl, user , { withCredentials: true });
  }

  updateUser(userId: string, user: Partial<ManageUser>): Observable<User> {
    console.log(user);
    return this.http.patch<User>(`${this.apiUrl}/${userId}`, user , { withCredentials: true });
  }

  updateStatusUser(userId: string, status: { isActive: boolean }): Observable<User> {
    return this.http.patch<User>(
      `${this.apiUrl}/${userId}/status`,
      status,
      { withCredentials: true }
    );
  }

  deleteUser(userId: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${userId}`, { withCredentials: true });
  }
}
