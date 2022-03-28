import { Routes } from '@angular/router';

import { DeviceSalesBillListComponent } from './device-sales-bill-list.component';

export const DeviceSalesBillListRoutes: Routes = [{
  path: '',
  component: DeviceSalesBillListComponent,
  data: {
    breadcrumb: 'Device Sales Bill List',
    icon: 'icofont-home bg-c-blue',
    status: false
  }
}];
