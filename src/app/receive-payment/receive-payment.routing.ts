import { Routes } from '@angular/router';

import { ReceivePaymentComponent } from './receive-payment.component';

export const ReceivePaymentRoutes: Routes = [{
  path: '',
  component: ReceivePaymentComponent,
  data: {
    breadcrumb: 'Receive Payment',
    icon: 'icofont-home bg-c-blue',
    status: false
  }
}];
