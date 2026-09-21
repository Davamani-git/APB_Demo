import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component.js';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { importProvidersFrom } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

const routes = [
  { path: '', redirectTo: '/applications', pathMatch: 'full' },
  { path: 'applications', loadComponent: () => import('./app/applications/application-list.component.js').then(m => m.ApplicationListComponent) },
  { path: 'applications/:id', loadComponent: () => import('./app/applications/application-detail.component.js').then(m => m.ApplicationDetailComponent) },
  { path: 'dashboard', loadComponent: () => import('./app/dashboard/dashboard.component.js').then(m => m.DashboardComponent) },
  { path: 'payer-rules', loadComponent: () => import('./app/payer-rules/payer-rules.component.js').then(m => m.PayerRulesComponent) },
  { path: 'payer-rules/:id', loadComponent: () => import('./app/payer-rules/payer-rule-detail.component.js').then(m => m.PayerRuleDetailComponent) }
];

bootstrapApplication(AppComponent, {
  providers: [
    provideRouter(routes),
    provideHttpClient(),
    importProvidersFrom(CommonModule, FormsModule, ReactiveFormsModule)
  ]
}).catch(err => console.error(err));