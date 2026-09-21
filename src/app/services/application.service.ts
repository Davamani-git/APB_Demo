import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ApplicationService {
  private apiUrl = environment.apiUrl || 'http://localhost:5000/api';

  constructor(private http: HttpClient) {}

  getAllApplications(filters?: any): Observable<any> {
    let params = new HttpParams();
    if (filters) {
      Object.keys(filters).forEach(key => {
        if (filters[key]) {
          params = params.set(key, filters[key]);
        }
      });
    }
    return this.http.get(`${this.apiUrl}/applications`, { params });
  }

  getApplicationById(id: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/applications/${id}`);
  }

  createApplication(application: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/applications`, application);
  }

  updateApplication(id: string, application: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/applications/${id}`, application);
  }

  deleteApplication(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/applications/${id}`);
  }

  evaluateApplication(id: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/applications/${id}/evaluate`, {});
  }
}