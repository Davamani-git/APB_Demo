import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PayerRuleService {
  private apiUrl = environment.apiUrl || 'http://localhost:5000/api';

  constructor(private http: HttpClient) {}

  getAllPayerRules(): Observable<any> {
    return this.http.get(`${this.apiUrl}/payer-rules`);
  }

  getPayerRuleById(id: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/payer-rules/${id}`);
  }

  getPayerRuleByPayerId(payerId: string, effectiveDate?: string): Observable<any> {
    const params = effectiveDate ? { effectiveDate } : {};
    return this.http.get(`${this.apiUrl}/payer-rules/payer/${payerId}`, { params });
  }

  createPayerRule(rule: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/payer-rules`, rule);
  }

  updatePayerRule(id: string, rule: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/payer-rules/${id}`, rule);
  }

  deletePayerRule(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/payer-rules/${id}`);
  }
}