import { Routes } from '@angular/router';

import { RequisitionComponent } from './requisition.component';

export const RequisitionRoutes: Routes = [{
  path: '',
  component: RequisitionComponent,
  data: {
    breadcrumb: 'Requisition',
    icon: 'icofont-home bg-c-blue',
    status: false
  }
}];
