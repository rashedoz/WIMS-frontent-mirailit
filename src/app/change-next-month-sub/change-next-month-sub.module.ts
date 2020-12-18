import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

import { ChangeNextMonthSubComponent } from './change-next-month-sub.component';
import { ChangeNextMonthSubRoutes } from './change-next-month-sub.routing';
import {SharedModule} from './../shared/shared.module';

@NgModule({
  imports: [
      CommonModule,
      RouterModule.forChild(ChangeNextMonthSubRoutes),
      SharedModule
  ],
  declarations: [ChangeNextMonthSubComponent]
})

export class ChangeNextMonthSubModule {}
