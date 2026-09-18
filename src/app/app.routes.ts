import { Routes } from '@angular/router';
import { ApplicationListComponent } from './applications/application-list.component';
import { ApplicationDetailComponent } from './applications/application-detail.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { AdminComponent } from './admin/admin.component';
import { RuleManagementComponent } from './admin/rule-management.component';

export const routes: Routes = [
  { path: '', redirectTo: '/applications', pathMatch: 'full' },
  { path: 'applications', component: ApplicationListComponent },
  { path: 'applications/:id', component: ApplicationDetailComponent },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'admin', component: AdminComponent },
  { path: 'admin/rules', component: RuleManagementComponent },
  { path: '**', redirectTo: '/applications' }
];