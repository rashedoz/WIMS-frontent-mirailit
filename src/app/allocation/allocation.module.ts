import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

import { AllocationComponent } from './allocation.component';
import { AllocationRoutes } from './allocation.routing';
import {SharedModule} from '../shared/shared.module'

@NgModule({
  imports: [
      CommonModule,
      RouterModule.forChild(AllocationRoutes),
      SharedModule,
  ],
  declarations: [AllocationComponent]
})

export class AllocationModule {}
