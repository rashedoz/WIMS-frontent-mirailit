import { Routes } from '@angular/router';

import { CustomerDetailsComponent } from './customer-details.component';

export const CustomerDetailsRoutes: Routes = [{
  path: '',
  component: CustomerDetailsComponent,
  data: {
    breadcrumb: 'Customer Details',
    icon: 'icofont-home bg-c-blue',
    status: false
  }
}];
