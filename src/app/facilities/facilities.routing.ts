import { Routes } from '@angular/router';

import { FacilitiesComponent } from './facilities.component';

export const FacilitiesRoutes: Routes = [{
  path: '',
  component: FacilitiesComponent,
  data: {
    breadcrumb: 'Facilities',
    icon: 'icofont-home bg-c-blue',
    status: false
  }
}];
