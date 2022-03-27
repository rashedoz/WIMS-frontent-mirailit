import { Routes } from '@angular/router';

import { UnFreezeSIMsComponent } from './unfreeze-sims.component';

export const UnFreezeSIMsRoutes: Routes = [{
  path: '',
  component: UnFreezeSIMsComponent,
  data: {
    breadcrumb: 'Unfreeze SIM',
    icon: 'icofont-home bg-c-blue',
    status: false
  }
}];
