import { Routes } from '@angular/router';

import { CustomerDueListComponent } from './customer-due-list.component';

export const CustomerDueListRoutes: Routes = [{
  path: '',
  component: CustomerDueListComponent,
  data: {
    breadcrumb: 'Customer',
    icon: 'icofont-home bg-c-blue',
    status: false
  }
}];
