import { Routes } from '@angular/router';

import { ReissuedSIMListComponent } from './reissued-sim-list.component';

export const ReissuedSIMListRoutes: Routes = [{
  path: '',
  component: ReissuedSIMListComponent,
  data: {
    breadcrumb: 'Reissued SIM List',
    icon: 'icofont-home bg-c-blue',
    status: false
  }
}];
