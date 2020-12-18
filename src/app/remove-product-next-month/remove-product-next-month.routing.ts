import { Routes } from '@angular/router';

import { RemoveProductNextMonthComponent } from './remove-product-next-month.component';

export const RemoveProductNextMonthRoutes: Routes = [{
  path: '',
  component: RemoveProductNextMonthComponent,
  data: {
    breadcrumb: 'Remove Product From Next Month',
    icon: 'icofont-home  bg-c-blue',
    status: false
  }
}];
