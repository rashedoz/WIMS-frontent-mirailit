import { Routes } from '@angular/router';

import { PurchaseEntryComponent } from './purchase-entry.component';

export const PurchaseEntryRoutes: Routes = [{
  path: '',
  component: PurchaseEntryComponent,
  data: {
    breadcrumb: 'Purchase Entry',
    icon: 'icofont-home bg-c-blue',
    status: false
  }
}];
