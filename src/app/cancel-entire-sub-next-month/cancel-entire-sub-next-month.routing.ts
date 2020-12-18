import { Routes } from '@angular/router';

import { CancelEntireSubNextMonthComponent } from './cancel-entire-sub-next-month.component';

export const CancelEntireSubNextMonthRoutes: Routes = [{
  path: '',
  component: CancelEntireSubNextMonthComponent,
  data: {
    breadcrumb: 'Cancel Entrie Subscription From Next Month',
    icon: 'icofont-home  bg-c-blue',
    status: false
  }
}];
