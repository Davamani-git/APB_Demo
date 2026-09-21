import { Routes } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ApplicationListComponent } from './applications/application-list.component';
import { ApplicationDetailComponent } from './applications/application-detail.component';
import { PayerRulesComponent } from './payer-rules/payer-rules.component';

export const routes: Routes = [
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'applications', component: ApplicationListComponent },
  { path: 'applications/:id', component: ApplicationDetailComponent },
  { path: 'payer-rules', component: PayerRulesComponent },
  { path: '**', redirectTo: '/dashboard' }
];