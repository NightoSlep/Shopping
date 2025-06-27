import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, catchError, Observable, of, tap } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { UpdatedUser, User } from '../../../models/user.model';


@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUser = `${environment.apiUrl}/users`;
  private apiAuth = `${environment.apiUrl}/auth`; 

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
    return this.http.get<User>(`${this.apiUser}/${id}`);
  }

  getMyProfile(): Observable<User> {
    return this.http.get<User>(`${this.apiUser}/profile`, { withCredentials: true }).pipe(
      tap((user) => this.currentUserSubject.next(user)),
      catchError((err) => {
        this.currentUserSubject.next(null);
        return of(null as unknown as User);
      })
    );;
  }

  loadUserProfileIfNeeded(): void {
    if (!this.currentUserSubject.value) {
      this.getMyProfile().subscribe();
    }
  }

  updateMyProfile(user: UpdatedUser): Observable<User> {
    return this.http.patch<User>(`${this.apiUser}/me`, user);
  }

  changePassword(oldPassword: string, newPassword: string) {
    console.log('Sending', { oldPassword, newPassword });
    return this.http.patch(`${this.apiUser}/change-password`, {
      oldPassword,
      newPassword
    },{
      withCredentials: true
    });
  }  

  logout() {
    this.currentUserSubject.next(null);
    return this.http.post(`${this.apiAuth}/logout`, {}, {
      withCredentials: true,
      responseType: 'json'
    });
  }

  isAdmin(): boolean {
    return this.currentUserSubject.value?.role === 'admin';
  }
}
