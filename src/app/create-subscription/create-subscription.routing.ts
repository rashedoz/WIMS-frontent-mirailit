import { Routes } from '@angular/router';

import { CreateSubscriptionComponent } from './create-subscription.component';

export const CreateSubscriptionRoutes: Routes = [{
  path: '',
  component: CreateSubscriptionComponent,
  data: {
    breadcrumb: 'Create Subscription',
    icon: 'icofont-home bg-c-blue',
    status: false
  }
}];
