import { Routes } from '@angular/router';

import { SellDeviceByCustomerComponent } from './sell-device-by-customer.component';

export const SellDeviceByCustomerRoutes: Routes = [{
  path: '',
  component: SellDeviceByCustomerComponent,
  data: {
    breadcrumb: 'Sell Device',
    icon: 'icofont-home bg-c-blue',
    status: false
  }
}];
