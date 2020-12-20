import { Routes } from '@angular/router';

import { BillListComponent } from './bill-list.component';

export const BillListRoutes: Routes = [{
  path: '',
  component: BillListComponent,
  data: {
    breadcrumb: 'Bills',
    icon: 'icofont-home bg-c-blue',
    status: false
  }
}];
