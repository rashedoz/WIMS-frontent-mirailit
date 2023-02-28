import { Routes } from '@angular/router';

import { InvoiceLogComponent } from './invoice-log.component';

export const InvoiceLogRoutes: Routes = [{
  path: '',
  component: InvoiceLogComponent,
  data: {
    breadcrumb: 'Invoice Log',
    icon: 'icofont-home bg-c-blue',
    status: false
  }
}];
