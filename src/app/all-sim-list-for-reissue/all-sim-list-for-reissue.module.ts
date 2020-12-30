import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

import { AllSIMListForReissueComponent } from './all-sim-list-for-reissue.component';
import { AllSIMListForReissueRoutes } from './all-sim-list-for-reissue.routing';
import {SharedModule} from '../shared/shared.module';

@NgModule({
  imports: [
      CommonModule,
      RouterModule.forChild(AllSIMListForReissueRoutes),
      SharedModule
  ],
  declarations: [AllSIMListForReissueComponent]
})

export class AllSIMListForReissueModule {}
