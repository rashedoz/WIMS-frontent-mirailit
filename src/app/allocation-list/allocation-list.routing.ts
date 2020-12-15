import { Routes } from '@angular/router';

import { AllocationListComponent } from './allocation-list.component';

export const AllocationListRoutes: Routes = [{
  path: '',
  component: AllocationListComponent,
  data: {
    breadcrumb: 'Allocations',
    icon: 'icofont-home bg-c-blue',
    status: false
  }
}];
