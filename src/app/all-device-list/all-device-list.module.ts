import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

import { AllDeviceListComponent } from './all-device-list.component';
import { AllDeviceListRoutes } from './all-device-list.routing';
import {SharedModule} from '../shared/shared.module';

@NgModule({
  imports: [
      CommonModule,
      RouterModule.forChild(AllDeviceListRoutes),
      SharedModule
  ],
  declarations: [AllDeviceListComponent]
})

export class AllDeviceListModule {}
