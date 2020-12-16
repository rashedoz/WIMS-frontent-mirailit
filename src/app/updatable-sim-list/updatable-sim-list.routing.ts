import { Routes } from '@angular/router';

import { UpdatableSIMListComponent } from './updatable-sim-list.component';

export const UpdatableSIMListRoutes: Routes = [{
  path: '',
  component: UpdatableSIMListComponent,
  data: {
    breadcrumb: 'Updatable SIM List',
    icon: 'icofont-home bg-c-blue',
    status: false
  }
}];
