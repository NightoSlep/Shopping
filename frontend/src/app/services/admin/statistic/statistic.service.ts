import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class StatisticService {
  private apiUrl = `${environment.apiUrl}/statistics`; 

  constructor(private http: HttpClient) {}

  getOverview(): Observable<any> {
    return this.http.get(`${this.apiUrl}/overview`);
  }

  getRevenue(range: 'week' | 'month' | 'year'): Observable<any> {
    return this.http.get(`${this.apiUrl}/revenue?range=${range}`);
  }

  getTopProducts(): Observable<any> {
    return this.http.get(`${this.apiUrl}/top-products`);
  }
}
