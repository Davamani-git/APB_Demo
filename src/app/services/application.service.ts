import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';
import { tap } from 'rxjs/operators';
import { ApiService } from './api.service';
import { Application, Document, EvaluationResult } from '../models/application.model';

@Injectable({
  providedIn: 'root'
})
export class ApplicationService {
  private applicationsSubject = new BehaviorSubject<Application[]>([]);
  public applications$ = this.applicationsSubject.asObservable();

  constructor(private apiService: ApiService) {}

  loadApplications(): Observable<Application[]> {
    return this.apiService.get<Application[]>('/applications').pipe(
      tap(applications => this.applicationsSubject.next(applications))
    );
  }

  getApplicationById(id: string): Observable<Application> {
    return this.apiService.get<Application>(`/applications/${id}`);
  }

  createApplication(application: Partial<Application>): Observable<Application> {
    return this.apiService.post<Application>('/applications', application).pipe(
      tap(() => this.loadApplications().subscribe())
    );
  }

  updateApplication(id: string, application: Partial<Application>): Observable<Application> {
    return this.apiService.put<Application>(`/applications/${id}`, application).pipe(
      tap(() => this.loadApplications().subscribe())
    );
  }

  uploadDocument(applicationId: string, file: File, metadata: any): Observable<Document> {
    return this.apiService.post<Document>(
      `/applications/${applicationId}/documents`,
      { file, metadata }
    ).pipe(
      tap(() => this.loadApplications().subscribe())
    );
  }

  deleteDocument(applicationId: string, documentId: string): Observable<void> {
    return this.apiService.delete<void>(
      `/applications/${applicationId}/documents/${documentId}`
    ).pipe(
      tap(() => this.loadApplications().subscribe())
    );
  }

  evaluateApplication(applicationId: string): Observable<EvaluationResult> {
    return this.apiService.post<EvaluationResult>(
      `/applications/${applicationId}/evaluate`,
      {}
    ).pipe(
      tap(() => this.loadApplications().subscribe())
    );
  }

  getExpiringDocuments(thresholdDays: number): Observable<any[]> {
    return this.apiService.get<any[]>(`/applications/expiring-documents?threshold=${thresholdDays}`);
  }

  exportApplications(format: 'csv' | 'pdf'): Observable<Blob> {
    return this.apiService.get<Blob>(`/applications/export?format=${format}`);
  }
}