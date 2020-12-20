import { Routes } from '@angular/router';

import { WholesalerListComponent } from './wholesaler-list.component';

export const WholesalerListRoutes: Routes = [{
  path: '',
  component: WholesalerListComponent,
  data: {
    breadcrumb: 'Wholesaler List',
    icon: 'icofont-home bg-c-blue',
    status: false
  }
}];
