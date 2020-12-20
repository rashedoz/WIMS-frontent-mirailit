import { Routes } from '@angular/router';

import { AllDeviceListComponent } from './all-device-list.component';

export const AllDeviceListRoutes: Routes = [{
  path: '',
  component: AllDeviceListComponent,
  data: {
    breadcrumb: 'All Device List',
    icon: 'icofont-home bg-c-blue',
    status: false
  }
}];
