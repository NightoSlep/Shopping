import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = `${environment.apiUrl}/users`;
  constructor(private http: HttpClient) {}

  getUserName(userId: string): Observable<{ username: string }> {
    return this.http.get<{ username: string }>(`${this.apiUrl}/${userId}/name`);
  }
}
