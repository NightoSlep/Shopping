import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { User } from '../../../models/user.model';


@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = `${environment.apiUrl}/users`;

  private currentUserSubject = new BehaviorSubject<User | null>(null);
  currentUser$ = this.currentUserSubject.asObservable();

  constructor(private http: HttpClient) {}

  setCurrentUser(user: User) {
    this.currentUserSubject.next(user);
  }

  getCurrentUser() {
    return this.currentUserSubject.value;
  }
  
  getUserById(id : number): Observable<User>{
    return this.http.get<User>(`${this.apiUrl}/${id}`);
  }

  getMyProfile(): Observable<User> {
    return this.http.get<User>(`${this.apiUrl}/profile`, { withCredentials: true });
  }

  updateMyProfile(user: User): Observable<User> {
    return this.http.patch<User>(`${this.apiUrl}/me`, user);
  }

  changePassword(oldPassword: string, newPassword: string) {
    return this.http.post(`${this.apiUrl}/change-password`, {
      oldPassword,
      newPassword
    });
  }  
}
