import { Routes } from '@angular/router';

import { RetailerSubscriptionListComponent } from './retailer-subscription-list.component';

export const RetailerSubscriptionListRoutes: Routes = [{
  path: '',
  component: RetailerSubscriptionListComponent,
  data: {
    breadcrumb: 'Retailer Subscription List',
    icon: 'icofont-home bg-c-blue',
    status: false
  }
}];
