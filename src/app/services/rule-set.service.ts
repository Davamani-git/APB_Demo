import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { RuleSet } from '../models/rule-set.model';

@Injectable({
  providedIn: 'root'
})
export class RuleSetService {
  private apiUrl = 'http://localhost:5000/api/rulesets';

  constructor(private http: HttpClient) {}

  getRuleSets(): Observable<RuleSet[]> {
    return this.http.get<RuleSet[]>(this.apiUrl);
  }

  getRuleSetById(id: string): Observable<RuleSet> {
    return this.http.get<RuleSet>(`${this.apiUrl}/${id}`);
  }

  getRuleSetByPayerAndDate(payerId: string, submissionDate: Date): Observable<RuleSet> {
    return this.http.get<RuleSet>(`${this.apiUrl}/effective`, {
      params: {
        payerId: payerId,
        submissionDate: submissionDate.toISOString()
      }
    });
  }

  createRuleSet(ruleSet: RuleSet): Observable<RuleSet> {
    return this.http.post<RuleSet>(this.apiUrl, ruleSet);
  }

  updateRuleSet(id: string, ruleSet: RuleSet): Observable<RuleSet> {
    return this.http.put<RuleSet>(`${this.apiUrl}/${id}`, ruleSet);
  }

  deleteRuleSet(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}