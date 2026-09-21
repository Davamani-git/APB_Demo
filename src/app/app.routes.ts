import { Routes } from '@angular/router';
import { WorkQueueComponent } from './work-queue/work-queue.component.js';
import { PayerRulesComponent } from './payer-rules/payer-rules.component.js';
import { PrebuiltRulesComponent } from './prebuilt-rules/prebuilt-rules.component.js';
import { ApplicationDetailComponent } from './application-detail/application-detail.component.js';

export const routes: Routes = [
  { path: '', redirectTo: '/work-queue', pathMatch: 'full' },
  { path: 'work-queue', component: WorkQueueComponent },
  { path: 'payer-rules', component: PayerRulesComponent },
  { path: 'prebuilt-rules', component: PrebuiltRulesComponent },
  { path: 'application/:id', component: ApplicationDetailComponent }
];