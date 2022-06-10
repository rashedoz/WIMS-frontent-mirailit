import { Routes } from '@angular/router';

import { PaymentCollectionComponent } from './payment-collection.component';

export const PaymentCollectionRoutes: Routes = [{
  path: '',
  component: PaymentCollectionComponent,
  data: {
    breadcrumb: 'PaymentCollection',
    icon: 'icofont-home bg-c-blue',
    status: false
  }
}];
