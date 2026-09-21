import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { PayerRuleSet } from '../models/payer-rule.model.js';

@Injectable({
  providedIn: 'root'
})
export class PayerRulesService {
  private apiUrl = 'http://localhost:5000/api/payer-rules';

  constructor(private http: HttpClient) {}

  getRuleSets(): Observable {
    return this.http.get(`${this.apiUrl}`);
  }

  getRuleSetById(id: string): Observable {
    return this.http.get(`${this.apiUrl}/${id}`);
  }

  createRuleSet(ruleSet: PayerRuleSet): Observable {
    return this.http.post(`${this.apiUrl}`, ruleSet);
  }

  updateRuleSet(ruleSet: PayerRuleSet): Observable {
    return this.http.put(`${this.apiUrl}/${ruleSet.id}`, ruleSet);
  }

  deleteRuleSet(id: string): Observable {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}