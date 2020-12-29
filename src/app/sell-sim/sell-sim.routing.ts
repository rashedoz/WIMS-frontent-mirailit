import { Routes } from '@angular/router';

import { SellSIMComponent } from './sell-sim.component';

export const SellSIMRoutes: Routes = [{
  path: '',
  component: SellSIMComponent,
  data: {
    breadcrumb: 'Sell SIM',
    icon: 'icofont-home bg-c-blue',
    status: false
  }
}];
