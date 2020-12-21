import { Routes } from '@angular/router';

import { UpdatableDeviceListComponent } from './updatable-device-list.component';

export const UpdatableDeviceListRoutes: Routes = [{
  path: '',
  component: UpdatableDeviceListComponent,
  data: {
    breadcrumb: 'Updatable Device List',
    icon: 'icofont-home bg-c-blue',
    status: false
  }
}];
