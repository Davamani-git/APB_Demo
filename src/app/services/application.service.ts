import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApplicationService {
  private apiUrl = 'http://localhost:5000/api';

  constructor(private http: HttpClient) {}

  getApplications(): Observable {
    return this.http.get(`${this.apiUrl}/applications`);
  }

  getApplicationById(id: string): Observable {
    return this.http.get(`${this.apiUrl}/applications/${id}`);
  }

  updateApplication(id: string, data: any): Observable {
    return this.http.put(`${this.apiUrl}/applications/${id}`, data);
  }

  addDocument(applicationId: string, document: any): Observable {
    return this.http.post(`${this.apiUrl}/applications/${applicationId}/documents`, document);
  }

  deleteDocument(applicationId: string, documentId: string): Observable {
    return this.http.delete(`${this.apiUrl}/applications/${applicationId}/documents/${documentId}`);
  }
}