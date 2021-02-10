import { Routes } from '@angular/router';

import { SoldSIMListComponent } from './sold-sim-list.component';

export const SoldSIMListRoutes: Routes = [{
  path: '',
  component: SoldSIMListComponent,
  data: {
    breadcrumb: 'Sold SIM List',
    icon: 'icofont-home bg-c-blue',
    status: false
  }
}];
