import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  private apiUrl = environment.apiUrl || 'http://localhost:5000/api';

  constructor(private http: HttpClient) {}

  getDashboardStats(): Observable<any> {
    return this.http.get(`${this.apiUrl}/dashboard/stats`);
  }

  getCoordinatorBreakdown(): Observable<any> {
    return this.http.get(`${this.apiUrl}/dashboard/coordinator-breakdown`);
  }

  getPayerBreakdown(): Observable<any> {
    return this.http.get(`${this.apiUrl}/dashboard/payer-breakdown`);
  }
}