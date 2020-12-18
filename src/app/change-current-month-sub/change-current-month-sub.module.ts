import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

import { ChangeCurrentMonthSubComponent } from './change-current-month-sub.component';
import { ChangeCurrentMonthSubRoutes } from './change-current-month-sub.routing';
import {SharedModule} from './../shared/shared.module';

@NgModule({
  imports: [
      CommonModule,
      RouterModule.forChild(ChangeCurrentMonthSubRoutes),
      SharedModule
  ],
  declarations: [ChangeCurrentMonthSubComponent]
})

export class ChangeCurrentMonthSubModule {}
