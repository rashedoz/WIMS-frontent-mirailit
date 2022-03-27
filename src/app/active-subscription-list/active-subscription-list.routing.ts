import { Routes } from '@angular/router';

import { ActiveSubscriptionListComponent } from './active-subscription-list.component';

export const ActiveSubscriptionListRoutes: Routes = [{
  path: '',
  component: ActiveSubscriptionListComponent,
  data: {
    breadcrumb: 'Active Subscription List',
    icon: 'icofont-home bg-c-blue',
    status: false
  }
}];
