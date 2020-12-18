import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

import { CancelEntireSubNextMonthComponent } from './cancel-entire-sub-next-month.component';
import { CancelEntireSubNextMonthRoutes } from './cancel-entire-sub-next-month.routing';
import {SharedModule} from './../shared/shared.module';

@NgModule({
  imports: [
      CommonModule,
      RouterModule.forChild(CancelEntireSubNextMonthRoutes),
      SharedModule
  ],
  declarations: [CancelEntireSubNextMonthComponent]
})

export class CancelEntireSubNextMonthModule {}
