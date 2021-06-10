import { Routes } from '@angular/router';

import { BulkEntryComponent } from './bulk-entry.component';

export const BulkEntryRoutes: Routes = [{
  path: '',
  component: BulkEntryComponent,
  data: {
    breadcrumb: 'Bulk Entry',
    icon: 'icofont-home bg-c-blue',
    status: false
  }
}];
