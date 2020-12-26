import { Routes } from '@angular/router';

import { DeviceStockHistoryComponent } from './device-stock-history.component';

export const DeviceStockHistoryRoutes: Routes = [{
  path: '',
  component: DeviceStockHistoryComponent,
  data: {
    breadcrumb: 'Device Stock History',
    icon: 'icofont-home bg-c-blue',
    status: false
  }
}];
