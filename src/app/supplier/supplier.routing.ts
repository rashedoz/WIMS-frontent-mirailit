import { Routes } from '@angular/router';

import { SupplierComponent } from './supplier.component';

export const SupplierRoutes: Routes = [{
  path: '',
  component: SupplierComponent,
  data: {
    breadcrumb: 'Supplier',
    icon: 'icofont-home bg-c-blue',
    status: false
  }
}];
