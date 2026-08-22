// Complete implementation for QE-4528 - Role-Based Access Control System
import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable, map } from 'rxjs';
import { AuthService, UserRole } from '../auth.service';

@Injectable({ providedIn: 'root' })
export class RoleGuard implements CanActivate {

  constructor(private authService: AuthService, private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
    const allowedRoles = route.data['roles'] as UserRole[] | undefined;

    return this.authService.getCurrentUserRole().pipe(
      map((role) => {
        if (!allowedRoles || allowedRoles.includes(role)) {
          return true;
        }

        // redirect to a generic unauthorized page or dashboard based on role
        if (role === 'seller') {
          this.router.navigate(['/seller/dashboard']);
        } else if (role === 'consumer') {
          this.router.navigate(['/home']);
        } else {
          this.router.navigate(['/admin']);
        }
        return false;
      })
    );
  }
}
