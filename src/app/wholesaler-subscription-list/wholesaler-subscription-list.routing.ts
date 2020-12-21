import { Routes } from '@angular/router';

import { WholesalerSubscriptionListComponent } from './wholesaler-subscription-list.component';

export const WholesalerSubscriptionListRoutes: Routes = [{
  path: '',
  component: WholesalerSubscriptionListComponent,
  data: {
    breadcrumb: 'Wholesaler Subscription List',
    icon: 'icofont-home bg-c-blue',
    status: false
  }
}];
