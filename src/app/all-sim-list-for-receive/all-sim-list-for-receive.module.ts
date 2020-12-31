import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

import { AllSIMListForReceiveComponent } from './all-sim-list-for-receive.component';
import { AllSIMListForReceiveRoutes } from './all-sim-list-for-receive.routing';
import {SharedModule} from '../shared/shared.module';

@NgModule({
  imports: [
      CommonModule,
      RouterModule.forChild(AllSIMListForReceiveRoutes),
      SharedModule
  ],
  declarations: [AllSIMListForReceiveComponent]
})

export class AllSIMListForReceiveModule {}
