import { Routes } from '@angular/router';

import { DataPlanComponent } from './data-plan.component';

export const DataPlanRoutes: Routes = [{
  path: '',
  component: DataPlanComponent,
  data: {
    breadcrumb: 'Data Plan',
    icon: 'icofont-home bg-c-blue',
    status: false
  }
}];
