import { Routes } from '@angular/router';

import { HomeComponent } from './home.component';

export const HomeRoutes: Routes = [{
  path: '',
  component: HomeComponent,
  data: {
    breadcrumb: 'Dashboard',
    icon: 'icofont-home bg-c-blue',
    status: false
  }
}];
