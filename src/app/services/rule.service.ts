import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';
import { tap } from 'rxjs/operators';
import { ApiService } from './api.service';
import { PayerRuleSet, SystemSettings } from '../models/rule.model';

@Injectable({
  providedIn: 'root'
})
export class RuleService {
  private ruleSetsSubject = new BehaviorSubject<PayerRuleSet[]>([]);
  public ruleSets$ = this.ruleSetsSubject.asObservable();

  constructor(private apiService: ApiService) {}

  loadRuleSets(): Observable<PayerRuleSet[]> {
    return this.apiService.get<PayerRuleSet[]>('/rules').pipe(
      tap(ruleSets => this.ruleSetsSubject.next(ruleSets))
    );
  }

  getRuleSetById(id: string): Observable<PayerRuleSet> {
    return this.apiService.get<PayerRuleSet>(`/rules/${id}`);
  }

  getRuleSetVersions(payerId: string): Observable<PayerRuleSet[]> {
    return this.apiService.get<PayerRuleSet[]>(`/rules/payer/${payerId}/versions`);
  }

  createRuleSet(ruleSet: Partial<PayerRuleSet>): Observable<PayerRuleSet> {
    return this.apiService.post<PayerRuleSet>('/rules', ruleSet).pipe(
      tap(() => this.loadRuleSets().subscribe())
    );
  }

  updateRuleSet(id: string, ruleSet: Partial<PayerRuleSet>): Observable<PayerRuleSet> {
    return this.apiService.put<PayerRuleSet>(`/rules/${id}`, ruleSet).pipe(
      tap(() => this.loadRuleSets().subscribe())
    );
  }

  deactivateRuleSet(id: string): Observable<void> {
    return this.apiService.put<void>(`/rules/${id}/deactivate`, {}).pipe(
      tap(() => this.loadRuleSets().subscribe())
    );
  }

  getSystemSettings(): Observable<SystemSettings> {
    return this.apiService.get<SystemSettings>('/settings');
  }

  updateSystemSettings(settings: Partial<SystemSettings>): Observable<SystemSettings> {
    return this.apiService.put<SystemSettings>('/settings', settings);
  }
}