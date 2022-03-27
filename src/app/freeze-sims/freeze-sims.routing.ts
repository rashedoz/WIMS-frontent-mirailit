import { Routes } from '@angular/router';

import { FreezeSIMsComponent } from './freeze-sims.component';

export const FreezeSIMsRoutes: Routes = [{
  path: '',
  component: FreezeSIMsComponent,
  data: {
    breadcrumb: 'Freeze SIM',
    icon: 'icofont-home  bg-c-blue',
    status: false
  }
}];
