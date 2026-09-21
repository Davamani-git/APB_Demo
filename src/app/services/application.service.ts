import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Application } from '../models/application.model.js';

@Injectable({
  providedIn: 'root'
})
export class ApplicationService {
  private apiUrl = 'http://localhost:5000/api/applications';

  constructor(private http: HttpClient) {}

  getApplications(): Observable<Application[]> {
    return this.http.get<Application[]>(this.apiUrl);
  }

  getApplicationById(id: string): Observable<Application> {
    return this.http.get<Application>(`${this.apiUrl}/${id}`);
  }

  createApplication(application: Application): Observable<Application> {
    return this.http.post<Application>(this.apiUrl, application);
  }

  updateApplication(application: Application): Observable<Application> {
    return this.http.put<Application>(`${this.apiUrl}/${application.id}`, application);
  }

  evaluateApplication(id: string): Observable<Application> {
    return this.http.post<Application>(`${this.apiUrl}/${id}/evaluate`, {});
  }
}