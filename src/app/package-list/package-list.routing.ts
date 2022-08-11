import { Routes } from '@angular/router';

import { PackageListComponent } from './package-list.component';

export const PackageListRoutes: Routes = [{
  path: '',
  component: PackageListComponent,
  data: {
    breadcrumb: 'Package List',
    icon: 'icofont-home bg-c-blue',
    status: false
  }
}];
