import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

import { RequisitionComponent } from './requisition.component';
import { RequisitionRoutes } from './requisition.routing';
import {SharedModule} from './../shared/shared.module';

@NgModule({
  imports: [
      CommonModule,
      RouterModule.forChild(RequisitionRoutes),
      SharedModule
  ],
  declarations: [RequisitionComponent]
})

export class RequisitionModule {}
