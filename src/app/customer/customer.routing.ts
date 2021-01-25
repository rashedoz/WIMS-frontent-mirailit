import { Routes } from '@angular/router';

import { CustomerComponent } from './customer.component';

export const CustomerRoutes: Routes = [{
  path: '',
  component: CustomerComponent,
  data: {
    breadcrumb: 'Customer List',
    icon: 'icofont-home bg-c-blue',
    status: false
  }
}];
