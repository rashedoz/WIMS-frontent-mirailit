import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

import { HoldEntireSubNextMonthComponent } from './hold-entire-sub-next-month.component';
import { HoldEntireSubNextMonthRoutes } from './hold-entire-sub-next-month.routing';
import {SharedModule} from './../shared/shared.module';

@NgModule({
  imports: [
      CommonModule,
      RouterModule.forChild(HoldEntireSubNextMonthRoutes),
      SharedModule
  ],
  declarations: [HoldEntireSubNextMonthComponent]
})

export class HoldEntireSubNextMonthModule {}
