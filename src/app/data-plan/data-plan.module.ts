import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

import { DataPlanComponent } from './data-plan.component';
import { DataPlanRoutes } from './data-plan.routing';
import {SharedModule} from '../shared/shared.module';

@NgModule({
  imports: [
      CommonModule,
      RouterModule.forChild(DataPlanRoutes),
      SharedModule
  ],
  declarations: [DataPlanComponent]
})

export class DataPlanModule {}
