import { Routes } from '@angular/router';

import { RemoveProductSubscriptionComponent } from './remove-product-subscription.component';

export const RemoveProductSubscriptionRoutes: Routes = [{
  path: '',
  component: RemoveProductSubscriptionComponent,
  data: {
    breadcrumb: 'Remove Product From Current Month',
    icon: 'icofont-home  bg-c-blue',
    status: false
  }
}];
