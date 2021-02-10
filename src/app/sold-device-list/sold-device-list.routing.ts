import { Routes } from '@angular/router';

import { SoldDeviceListComponent } from './sold-device-list.component';

export const SoldDeviceListRoutes: Routes = [{
  path: '',
  component: SoldDeviceListComponent,
  data: {
    breadcrumb: 'Sold Device List',
    icon: 'icofont-home bg-c-blue',
    status: false
  }
}];
