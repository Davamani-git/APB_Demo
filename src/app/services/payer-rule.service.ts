import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { PayerRule } from '../models/payer-rule.model.js';

@Injectable({
  providedIn: 'root'
})
export class PayerRuleService {
  private apiUrl = 'http://localhost:5000/api/payer-rules';

  constructor(private http: HttpClient) {}

  getPayerRules(): Observable<PayerRule[]> {
    return this.http.get<PayerRule[]>(this.apiUrl);
  }

  getPayerRuleById(id: string): Observable<PayerRule> {
    return this.http.get<PayerRule>(`${this.apiUrl}/${id}`);
  }

  getActiveRuleForPayer(payerName: string, date: Date): Observable<PayerRule> {
    return this.http.get<PayerRule>(`${this.apiUrl}/active?payerName=${payerName}&date=${date.toISOString()}`);
  }

  createPayerRule(rule: PayerRule): Observable<PayerRule> {
    return this.http.post<PayerRule>(this.apiUrl, rule);
  }

  updatePayerRule(rule: PayerRule): Observable<PayerRule> {
    return this.http.put<PayerRule>(`${this.apiUrl}/${rule.id}`, rule);
  }
}