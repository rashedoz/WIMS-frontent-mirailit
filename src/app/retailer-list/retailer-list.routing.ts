import { Routes } from '@angular/router';

import { RetailerListComponent } from './retailer-list.component';

export const RetailerListRoutes: Routes = [{
  path: '',
  component: RetailerListComponent,
  data: {
    breadcrumb: 'Retailer List',
    icon: 'icofont-home bg-c-blue',
    status: false
  }
}];
