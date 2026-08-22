// Route configuration using RoleGuard for QE-4528
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SellerDashboardComponent } from './seller-dashboard.component';
import { InventoryManagementComponent } from './inventory-management.component';
import { RoleGuard } from '../auth/rbac/role.guard';

const routes: Routes = [
  {
    path: 'seller/dashboard',
    component: SellerDashboardComponent,
    canActivate: [RoleGuard],
    data: { roles: ['seller'] }
  },
  {
    path: 'seller/inventory',
    component: InventoryManagementComponent,
    canActivate: [RoleGuard],
    data: { roles: ['seller'] }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SellerRoutingModule {}
