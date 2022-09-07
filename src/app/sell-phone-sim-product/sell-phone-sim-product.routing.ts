import { Routes } from '@angular/router';

import { SellPhoneSIMProductComponent } from './sell-phone-sim-product.component';

export const SellPhoneSIMProductRoutes: Routes = [{
  path: '',
  component: SellPhoneSIMProductComponent,
  data: {
    breadcrumb: 'Sell Phone SIM Product',
    icon: 'icofont-home bg-c-blue',
    status: false
  }
}];
