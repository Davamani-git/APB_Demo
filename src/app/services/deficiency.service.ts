import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DeficiencyService {
  private apiUrl = 'http://localhost:5000/api';

  constructor(private http: HttpClient) {}

  getDeficiencies(applicationId: string): Observable {
    return this.http.get(`${this.apiUrl}/deficiencies/${applicationId}`);
  }
}