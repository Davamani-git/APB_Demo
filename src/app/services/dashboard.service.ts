import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { DashboardStats, DrillDownData } from '../models/dashboard.model.js';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  private apiUrl = 'http://localhost:5000/api/dashboard';

  constructor(private http: HttpClient) {}

  getDashboardStats(): Observable<DashboardStats> {
    return this.http.get<DashboardStats>(`${this.apiUrl}/stats`);
  }

  getDrillDownData(status: string, groupBy: string): Observable<DrillDownData[]> {
    return this.http.get<DrillDownData[]>(`${this.apiUrl}/drilldown?status=${status}&groupBy=${groupBy}`);
  }
}