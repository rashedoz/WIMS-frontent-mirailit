import { Routes } from '@angular/router';

import { AllocationComponent } from './allocation.component';

export const AllocationRoutes: Routes = [{
  path: '',
  component: AllocationComponent,
  data: {
    breadcrumb: 'Allocation',
    icon: 'icofont-home bg-c-blue',
    status: false
  }
}];
