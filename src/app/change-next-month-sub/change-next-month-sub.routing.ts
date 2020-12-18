import { Routes } from '@angular/router';

import { ChangeNextMonthSubComponent } from './change-next-month-sub.component';

export const ChangeNextMonthSubRoutes: Routes = [{
  path: '',
  component: ChangeNextMonthSubComponent,
  data: {
    breadcrumb: 'Change Next Month Subscription',
    icon: 'icofont-home bg-c-blue',
    status: false
  }
}];
