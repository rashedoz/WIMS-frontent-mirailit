import { Routes } from '@angular/router';

import { PaymentCollectionComponent } from './payment-collection.component';

export const PaymentCollectionRoutes: Routes = [{
  path: '',
  component: PaymentCollectionComponent,
  data: {
    breadcrumb: 'Payment Collection',
    icon: 'icofont-home bg-c-blue',
    status: false
  }
}];
