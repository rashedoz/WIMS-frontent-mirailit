import { Routes } from '@angular/router';

import { BookingListComponent } from './booking-list.component';

export const BookingListRoutes: Routes = [{
  path: '',
  component: BookingListComponent,
  data: {
    breadcrumb: 'Booking List',
    icon: 'icofont-home bg-c-blue',
    status: false
  }
}];
