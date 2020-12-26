import { Routes } from '@angular/router';

import { CancelledDeviceListComponent } from './cancelled-device-list.component';

export const CancelledDeviceListRoutes: Routes = [{
  path: '',
  component: CancelledDeviceListComponent,
  data: {
    breadcrumb: 'Cancelled Device List',
    icon: 'icofont-home bg-c-blue',
    status: false
  }
}];
