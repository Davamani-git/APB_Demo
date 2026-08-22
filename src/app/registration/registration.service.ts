// Complete implementation for QE-4527 - user registration service
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map, timeout } from 'rxjs';

export interface RegistrationRequest {
  email: string;
  password: string;
}

@Injectable({ providedIn: 'root' })
export class RegistrationService {
  private readonly baseUrl = '/api/auth';

  constructor(private http: HttpClient) {}

  register(payload: RegistrationRequest): Observable<void> {
    return this.http.post<{ confirmationEmailSent: boolean }>(`${this.baseUrl}/register`, payload)
      .pipe(
        timeout(60000), // enforce email confirmation dispatch within 1 minute
        map(response => {
          if (!response.confirmationEmailSent) {
            throw new Error('Confirmation email not dispatched');
          }
        })
      );
  }
}
