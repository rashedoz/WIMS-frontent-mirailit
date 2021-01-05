import { Routes } from '@angular/router';

import { AllSIMListForReceiveComponent } from './all-sim-list-for-receive.component';

export const AllSIMListForReceiveRoutes: Routes = [{
  path: '',
  component: AllSIMListForReceiveComponent,
  data: {
    breadcrumb: 'Reissued SIM list for receive',
    icon: 'icofont-home bg-c-blue',
    status: false
  }
}];
