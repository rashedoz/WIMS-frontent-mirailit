import { Routes } from '@angular/router';

import { CancelledSIMListComponent } from './cancelled-sim-list.component';

export const CancelledSIMListRoutes: Routes = [{
  path: '',
  component: CancelledSIMListComponent,
  data: {
    breadcrumb: 'Cancelled SIM List',
    icon: 'icofont-home bg-c-blue',
    status: false
  }
}];
