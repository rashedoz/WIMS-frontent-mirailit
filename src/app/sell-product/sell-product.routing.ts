import { Routes } from '@angular/router';

import { SellProductComponent } from './sell-product.component';

export const SellProductRoutes: Routes = [{
  path: '',
  component: SellProductComponent,
  data: {
    breadcrumb: 'Sell Product',
    icon: 'icofont-home bg-c-blue',
    status: false
  }
}];
