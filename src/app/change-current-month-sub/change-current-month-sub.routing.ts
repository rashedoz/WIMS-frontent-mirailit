import { Routes } from '@angular/router';

import { ChangeCurrentMonthSubComponent } from './change-current-month-sub.component';

export const ChangeCurrentMonthSubRoutes: Routes = [{
  path: '',
  component: ChangeCurrentMonthSubComponent,
  data: {
    breadcrumb: 'Change Current Month Subscription',
    icon: 'icofont-home bg-c-blue',
    status: false
  }
}];
