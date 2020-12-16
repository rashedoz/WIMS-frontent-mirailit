import { Routes } from '@angular/router';

import { SubscriptionListComponent } from './subscription-list.component';

export const SubscriptionListRoutes: Routes = [{
  path: '',
  component: SubscriptionListComponent,
  data: {
    breadcrumb: 'Subscription List',
    icon: 'icofont-home bg-c-blue',
    status: false
  }
}];
