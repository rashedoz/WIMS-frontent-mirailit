import { Routes } from '@angular/router';

import { InvoiceLogHistoryComponent } from './invoice-log-history.component';

export const InvoiceLogHistoryRoutes: Routes = [{
  path: '',
  component: InvoiceLogHistoryComponent,
  data: {
    breadcrumb: 'Invoice Log History',
    icon: 'icofont-home bg-c-blue',
    status: false
  }
}];
