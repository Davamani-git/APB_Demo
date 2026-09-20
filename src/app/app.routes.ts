import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', redirectTo: '/applications', pathMatch: 'full' },
  { 
    path: 'applications', 
    loadComponent: () => import('./applications/application-list.component').then(m => m.ApplicationListComponent)
  },
  { 
    path: 'applications/:id', 
    loadComponent: () => import('./applications/application-detail.component').then(m => m.ApplicationDetailComponent)
  },
  { 
    path: 'rule-sets', 
    loadComponent: () => import('./rule-sets/rule-set-list.component').then(m => m.RuleSetListComponent)
  },
  { 
    path: 'rule-sets/:id', 
    loadComponent: () => import('./rule-sets/rule-set-detail.component').then(m => m.RuleSetDetailComponent)
  },
  { 
    path: 'dashboard', 
    loadComponent: () => import('./dashboard/dashboard.component').then(m => m.DashboardComponent)
  }
];