import { Routes } from '@angular/router';

import { SellProductComponent } from './sell-product.component';

export const SellProductRoutes: Routes = [{
  path: '',
  component: SellProductComponent,
  data: {
    breadcrumb: 'Sell Wifi SIM',
    icon: 'icofont-home bg-c-blue',
    status: false
  }
}];
