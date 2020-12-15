import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

import { BookingListComponent } from './booking-list.component';
import { BookingListRoutes } from './booking-list.routing';
import {SharedModule} from './../shared/shared.module';

@NgModule({
  imports: [
      CommonModule,
      RouterModule.forChild(BookingListRoutes),
      SharedModule
  ],
  declarations: [BookingListComponent] 
})

export class BookingListModule {}
