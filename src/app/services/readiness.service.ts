import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ReadinessEvaluation } from '../models/readiness.model';

@Injectable({
  providedIn: 'root'
})
export class ReadinessService {
  private apiUrl = 'http://localhost:5000/api/readiness';

  constructor(private http: HttpClient) {}

  evaluateApplication(applicationId: string): Observable<ReadinessEvaluation> {
    return this.http.post<ReadinessEvaluation>(`${this.apiUrl}/evaluate`, { applicationId });
  }

  getEvaluationHistory(applicationId: string): Observable<ReadinessEvaluation[]> {
    return this.http.get<ReadinessEvaluation[]>(`${this.apiUrl}/history/${applicationId}`);
  }
}