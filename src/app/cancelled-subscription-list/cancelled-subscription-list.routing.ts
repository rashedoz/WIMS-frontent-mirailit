import { Routes } from '@angular/router';

import { CancelledSubscriptionListComponent } from './cancelled-subscription-list.component';

export const CancelledSubscriptionListRoutes: Routes = [{
  path: '',
  component: CancelledSubscriptionListComponent,
  data: {
    breadcrumb: 'Cancelled Subscription List',
    icon: 'icofont-home bg-c-blue',
    status: false
  }
}];
