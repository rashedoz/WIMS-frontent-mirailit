import { Routes } from '@angular/router';

import { MemberListComponent } from './member-list.component';

export const MemberListRoutes: Routes = [{
  path: '',
  component: MemberListComponent,
  data: {
    breadcrumb: 'Members',
    icon: 'icofont-home bg-c-blue',
    status: false
  }
}];
