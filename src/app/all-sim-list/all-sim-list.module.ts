import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

import { AllSIMListComponent } from './all-sim-list.component';
import { AllSIMListRoutes } from './all-sim-list.routing';
import {SharedModule} from '../shared/shared.module';

@NgModule({
  imports: [
      CommonModule,
      RouterModule.forChild(AllSIMListRoutes),
      SharedModule
  ],
  declarations: [AllSIMListComponent]
})

export class AllSIMListModule {}
