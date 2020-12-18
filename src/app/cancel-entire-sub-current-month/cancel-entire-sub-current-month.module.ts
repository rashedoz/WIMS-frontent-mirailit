import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

import { CancelEntireSubCurrentMonthComponent } from './cancel-entire-sub-current-month.component';
import { CancelEntireSubCurrentMonthRoutes } from './cancel-entire-sub-current-month.routing';
import {SharedModule} from './../shared/shared.module';

@NgModule({
  imports: [
      CommonModule,
      RouterModule.forChild(CancelEntireSubCurrentMonthRoutes),
      SharedModule
  ],
  declarations: [CancelEntireSubCurrentMonthComponent]
})

export class CancelEntireSubCurrentMonthModule {}
