// Support service for QE-4528 - provides current user role for RBAC
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';

export type UserRole = 'consumer' | 'seller' | 'administrator';

interface MeResponse {
  role: UserRole;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly baseUrl = '/api/auth';

  constructor(private http: HttpClient) {}

  getCurrentUserRole(): Observable<UserRole> {
    return this.http.get<MeResponse>(`${this.baseUrl}/me`).pipe(map(resp => resp.role));
  }
}
