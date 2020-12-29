import { Routes } from '@angular/router';

import { HoldEntireSubNextMonthComponent } from './hold-entire-sub-next-month.component';

export const HoldEntireSubNextMonthRoutes: Routes = [{
  path: '',
  component: HoldEntireSubNextMonthComponent,
  data: {
    breadcrumb: 'Hold Entrie Subscription From Next Month',
    icon: 'icofont-home  bg-c-blue',
    status: false
  }
}];
