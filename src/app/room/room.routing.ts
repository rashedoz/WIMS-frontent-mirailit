import { Routes } from '@angular/router';

import { RoomComponent } from './room.component';

export const RoomRoutes: Routes = [{
  path: '',
  component: RoomComponent,
  data: {
    breadcrumb: 'Room',
    icon: 'icofont-home bg-c-blue',
    status: false
  }
}];
