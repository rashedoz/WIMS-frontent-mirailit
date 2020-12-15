import { Routes } from '@angular/router';

import { BookingComponent } from './booking.component';

export const BookingRoutes: Routes = [{
  path: '',
  component: BookingComponent,
  data: {
    breadcrumb: 'Booking',
    icon: 'icofont-home bg-c-blue',
    status: false
  }
}];
