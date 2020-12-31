import { Routes } from '@angular/router';

import { CustomerBalanceListComponent } from './customer-balance-list.component';

export const CustomerBalanceListRoutes: Routes = [{
  path: '',
  component: CustomerBalanceListComponent,
  data: {
    breadcrumb: 'Customer Balance List',
    icon: 'icofont-home bg-c-blue',
    status: false
  }
}];
