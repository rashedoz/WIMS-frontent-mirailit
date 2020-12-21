import { Routes } from '@angular/router';

import { SIMStockHistoryComponent } from './sim-stock-history.component';

export const SIMStockHistoryRoutes: Routes = [{
  path: '',
  component: SIMStockHistoryComponent,
  data: {
    breadcrumb: 'SIM Stock History',
    icon: 'icofont-home bg-c-blue',
    status: false
  }
}];
