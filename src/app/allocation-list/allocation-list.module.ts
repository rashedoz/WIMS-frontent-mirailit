import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

import { AllocationListComponent } from './allocation-list.component';
import { AllocationListRoutes } from './allocation-list.routing';
import {SharedModule} from './../shared/shared.module';

@NgModule({
  imports: [
      CommonModule,
      RouterModule.forChild(AllocationListRoutes),
      SharedModule
  ],
  declarations: [AllocationListComponent] 
})

export class AllocationListModule {}
