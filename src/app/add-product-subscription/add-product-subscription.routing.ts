import { Routes } from '@angular/router';

import { AddProductSubscriptionComponent } from './add-product-subscription.component';

export const AddProductSubscriptionRoutes: Routes = [{
  path: '',
  component: AddProductSubscriptionComponent,
  data: {
    breadcrumb: 'Add Product Subscription',
    icon: 'icofont-home bg-c-blue',
    status: false
  }
}];
