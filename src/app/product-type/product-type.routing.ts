import { Routes } from '@angular/router';

import { ProductTypeComponent } from './product-type.component';

export const ProductTypeRoutes: Routes = [{
  path: '',
  component: ProductTypeComponent,
  data: {
    breadcrumb: 'Product Type',
    icon: 'icofont-home bg-c-blue',
    status: false
  }
}];
