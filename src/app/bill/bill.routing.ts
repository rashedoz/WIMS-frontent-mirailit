import { Routes } from '@angular/router';

import { BillComponent } from './bill.component';

export const BillRoutes: Routes = [{
  path: '',
  component: BillComponent,
  data: {
    breadcrumb: 'Bill',
    icon: 'icofont-home bg-c-blue',
    status: false
  }
}];
