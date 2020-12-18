import { Routes } from '@angular/router';

import { CancelEntireSubCurrentMonthComponent } from './cancel-entire-sub-current-month.component';

export const CancelEntireSubCurrentMonthRoutes: Routes = [{
  path: '',
  component: CancelEntireSubCurrentMonthComponent,
  data: {
    breadcrumb: 'Cancel Entrie Subscription From Current Month',
    icon: 'icofont-home  bg-c-blue',
    status: false
  }
}];
