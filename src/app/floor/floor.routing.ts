import { Routes } from '@angular/router';

import { FloorComponent } from './floor.component';

export const FloorRoutes: Routes = [{
  path: '',
  component: FloorComponent,
  data: {
    breadcrumb: 'Floor',
    icon: 'icofont-home bg-c-blue',
    status: false
  }
}];
