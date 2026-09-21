import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ReadinessService {
  private apiUrl = 'http://localhost:5000/api';

  constructor(private http: HttpClient) {}

  evaluateReadiness(applicationId: string): Observable {
    return this.http.post(`${this.apiUrl}/readiness/evaluate/${applicationId}`, {});
  }
}