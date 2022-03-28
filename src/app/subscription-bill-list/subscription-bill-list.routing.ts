import { Routes } from '@angular/router';

import { SubscriptionBillListComponent } from './subscription-bill-list.component';

export const SubscriptionBillListRoutes: Routes = [{
  path: '',
  component: SubscriptionBillListComponent,
  data: {
    breadcrumb: 'Subscription Bill List',
    icon: 'icofont-home bg-c-blue',
    status: false
  }
}];
