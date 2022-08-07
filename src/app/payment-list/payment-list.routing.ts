import { Routes } from '@angular/router';

import { PaymentListComponent } from './payment-list.component';

export const PaymentListRoutes: Routes = [{
  path: '',
  component: PaymentListComponent,
  data: {
    breadcrumb: 'Payment Collection',
    icon: 'icofont-home bg-c-blue',
    status: false
  }
}];
