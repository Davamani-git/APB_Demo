import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';
import { AuditLogEntry } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class AuditService {
  constructor(private apiService: ApiService) {}

  getAuditLogs(filters?: any): Observable<AuditLogEntry[]> {
    const queryParams = filters ? `?${new URLSearchParams(filters).toString()}` : '';
    return this.apiService.get<AuditLogEntry[]>(`/audit${queryParams}`);
  }

  getAuditLogsByEntity(entityType: string, entityId: string): Observable<AuditLogEntry[]> {
    return this.apiService.get<AuditLogEntry[]>(`/audit/${entityType}/${entityId}`);
  }

  logAction(action: string, entityType: string, entityId: string, details: any): Observable<void> {
    return this.apiService.post<void>('/audit', {
      action,
      entityType,
      entityId,
      details
    });
  }
}