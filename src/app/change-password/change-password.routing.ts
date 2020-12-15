import { Routes } from '@angular/router';

import { ChangePasswordComponent } from './change-password.component';

export const ChangePasswordRoutes: Routes = [{
  path: '',
  component: ChangePasswordComponent,
  data: {
    breadcrumb: 'Change Password',
    icon: 'icofont-home bg-c-blue',
    status: false
  }
}];
