import { Routes } from '@angular/router';

import { PermanentlyCancelledSIMListComponent } from './permanently-cancelled-sim-list.component';

export const PermanentlyCancelledSIMListRoutes: Routes = [{
  path: '',
  component: PermanentlyCancelledSIMListComponent,
  data: {
    breadcrumb: 'Permanently Cancelled SIM List',
    icon: 'icofont-home bg-c-blue',
    status: false
  }
}];
