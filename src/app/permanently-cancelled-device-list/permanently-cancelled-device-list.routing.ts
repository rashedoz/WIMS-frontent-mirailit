import { Routes } from '@angular/router';

import { PermanentlyCancelledDeviceListComponent } from './permanently-cancelled-device-list.component';

export const PermanentlyCancelledDeviceListRoutes: Routes = [{
  path: '',
  component: PermanentlyCancelledDeviceListComponent,
  data: {
    breadcrumb: 'Permanently Cancelled Device List',
    icon: 'icofont-home bg-c-blue',
    status: false
  }
}];
