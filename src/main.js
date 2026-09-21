import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component.js';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { importProvidersFrom } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

const routes = [
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
  { path: 'dashboard', loadComponent: () => import('./app/enrollment-dashboard/enrollment-dashboard.component.js').then(m => m.EnrollmentDashboardComponent) },
  { path: 'work-queue', loadComponent: () => import('./app/work-queue/work-queue.component.js').then(m => m.WorkQueueComponent) },
  { path: 'application/:id', loadComponent: () => import('./app/application-management/application-management.component.js').then(m => m.ApplicationManagementComponent) },
  { path: 'deficiency/:id', loadComponent: () => import('./app/deficiency-guidance/deficiency-guidance.component.js').then(m => m.DeficiencyGuidanceComponent) },
  { path: 'readiness-evaluation/:id', loadComponent: () => import('./app/readiness-evaluation/readiness-evaluation.component.js').then(m => m.ReadinessEvaluationComponent) },
  { path: 'risk-prioritization', loadComponent: () => import('./app/risk-prioritization/risk-prioritization.component.js').then(m => m.RiskPrioritizationComponent) }
];

bootstrapApplication(AppComponent, {
  providers: [
    provideRouter(routes),
    provideHttpClient(),
    importProvidersFrom(CommonModule, FormsModule, ReactiveFormsModule)
  ]
}).catch(err => console.error(err));