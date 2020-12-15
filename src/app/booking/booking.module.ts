import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

import { BookingComponent } from './booking.component';
import { BookingRoutes } from './booking.routing';
import {SharedModule} from '../shared/shared.module'

@NgModule({
  imports: [
      CommonModule,
      RouterModule.forChild(BookingRoutes),
      SharedModule,
  ],
  declarations: [BookingComponent]
})

export class BookingModule {}
