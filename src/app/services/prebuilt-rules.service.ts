import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { PrebuiltRuleSet } from '../models/payer-rule.model.js';

@Injectable({
  providedIn: 'root'
})
export class PrebuiltRulesService {
  private apiUrl = 'http://localhost:5000/api/prebuilt-rules';

  constructor(private http: HttpClient) {}

  getPrebuiltRuleSets(): Observable {
    return this.http.get(`${this.apiUrl}`);
  }

  activateRuleSet(id: string, activate: boolean): Observable {
    return this.http.post(`${this.apiUrl}/${id}/activate`, { activate });
  }
}