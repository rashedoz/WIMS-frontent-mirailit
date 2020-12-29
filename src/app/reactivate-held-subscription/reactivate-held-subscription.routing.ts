import { Routes } from '@angular/router';

import { ReactivateHeldSubscriptionComponent } from './reactivate-held-subscription.component';

export const ReactivateHeldSubscriptionRoutes: Routes = [{
  path: '',
  component: ReactivateHeldSubscriptionComponent,
  data: {
    breadcrumb: 'Reactivate Held Subscription',
    icon: 'icofont-home bg-c-blue',
    status: false
  }
}];
