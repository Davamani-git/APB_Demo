import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  constructor(private apiService: ApiService) {}

  sendExpirationAlert(applicationId: string, documentId: string): Observable<void> {
    return this.apiService.post<void>('/notifications/expiration-alert', {
      applicationId,
      documentId
    });
  }

  sendWeeklyDigest(): Observable<void> {
    return this.apiService.post<void>('/notifications/weekly-digest', {});
  }

  getNotificationSettings(): Observable<any> {
    return this.apiService.get<any>('/notifications/settings');
  }

  updateNotificationSettings(settings: any): Observable<any> {
    return this.apiService.put<any>('/notifications/settings', settings);
  }
}