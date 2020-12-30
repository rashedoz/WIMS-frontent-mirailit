import { Routes } from '@angular/router';

import { AllSIMListForReissueComponent } from './all-sim-list-for-reissue.component';

export const AllSIMListForReissueRoutes: Routes = [{
  path: '',
  component: AllSIMListForReissueComponent,
  data: {
    breadcrumb: 'All SIM List For Reissue',
    icon: 'icofont-home bg-c-blue',
    status: false
  }
}];
