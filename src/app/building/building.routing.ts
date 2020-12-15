import { Routes } from '@angular/router';

import { BuildingComponent } from './building.component';

export const BuildingRoutes: Routes = [{
  path: '',
  component: BuildingComponent,
  data: {
    breadcrumb: 'Building',
    icon: 'icofont-home bg-c-blue',
    status: false
  }
}];
