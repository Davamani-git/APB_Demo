import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { EnrollmentApplication } from '../models/enrollment-application.model.js';

@Injectable({
  providedIn: 'root'
})
export class EnrollmentService {
  private apiUrl = 'http://localhost:5000/api/enrollment';

  constructor(private http: HttpClient) {}

  getApplications(): Observable {
    return this.http.get(`${this.apiUrl}/applications`);
  }

  getApplicationById(id: string): Observable {
    return this.http.get(`${this.apiUrl}/applications/${id}`);
  }

  evaluateApplication(id: string): Observable {
    return this.http.post(`${this.apiUrl}/applications/${id}/evaluate`, {});
  }

  createApplication(application: EnrollmentApplication): Observable {
    return this.http.post(`${this.apiUrl}/applications`, application);
  }

  updateApplication(id: string, application: EnrollmentApplication): Observable {
    return this.http.put(`${this.apiUrl}/applications/${id}`, application);
  }
}