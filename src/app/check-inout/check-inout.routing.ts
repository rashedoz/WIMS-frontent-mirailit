import { Routes } from '@angular/router';

import { CheckInoutComponent } from './check-inout.component';

export const CheckInoutRoutes: Routes = [{
  path: '',
  component: CheckInoutComponent,
  data: {
    breadcrumb: 'Check In/Out',
    icon: 'icofont-home bg-c-blue',
    status: false
  }
}];
