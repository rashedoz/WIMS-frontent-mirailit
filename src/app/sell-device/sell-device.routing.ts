import { Routes } from '@angular/router';

import { SellDeviceComponent } from './sell-device.component';

export const SellDeviceRoutes: Routes = [{
  path: '',
  component: SellDeviceComponent,
  data: {
    breadcrumb: 'Sell Device',
    icon: 'icofont-home bg-c-blue',
    status: false
  }
}];
