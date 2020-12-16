import { Routes } from '@angular/router';

import { AllSIMListComponent } from './all-sim-list.component';

export const AllSIMListRoutes: Routes = [{
  path: '',
  component: AllSIMListComponent,
  data: {
    breadcrumb: 'All SIM List',
    icon: 'icofont-home bg-c-blue',
    status: false
  }
}];
