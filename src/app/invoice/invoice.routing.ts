import { Routes } from '@angular/router';

import { InvoiceComponent } from './invoice.component';

export const InvoiceRoutes: Routes = [{
  path: '',
  component: InvoiceComponent,
  data: {
    breadcrumb: 'Invoice',
    icon: 'icofont-home bg-c-blue',
    status: false
  }
}];
