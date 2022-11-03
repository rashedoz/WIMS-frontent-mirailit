import { Routes } from '@angular/router';

import { SellDeviceOnlySimProductComponent } from './sell-device-only-sim-product.component';

export const SellDeviceOnlySimProductRoutes: Routes = [{
  path: '',
  component: SellDeviceOnlySimProductComponent,
  data: {
    breadcrumb: 'Sell Device Only SIM',
    icon: 'icofont-home bg-c-blue',
    status: false
  }
}];
