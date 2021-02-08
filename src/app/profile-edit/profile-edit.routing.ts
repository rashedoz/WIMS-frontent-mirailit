import { Routes } from '@angular/router';

import { ProfileEditComponent } from './profile-edit.component';

export const ProfileEditRoutes: Routes = [{
  path: '',
  component: ProfileEditComponent,
  data: {
    breadcrumb: 'Profile',
    icon: 'icofont-home bg-c-blue',
    status: false
  }
}];
