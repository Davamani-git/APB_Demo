import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

interface DashboardStats {
  totalApplications: number;
  readyApplications: number;
  pendingApplications: number;
  incompleteApplications: number;
  byCoordinator: { [key: string]: number };
  byPayer: { [key: string]: number };
}

@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  private apiUrl = 'http://localhost:5000/api';

  constructor(private http: HttpClient) {}

  getDashboardStats(): Observable {
    return this.http.get(`${this.apiUrl}/dashboard/stats`);
  }
}