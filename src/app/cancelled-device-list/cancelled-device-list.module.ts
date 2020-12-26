import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

import { CancelledDeviceListComponent } from './cancelled-device-list.component';
import { CancelledDeviceListRoutes } from './cancelled-device-list.routing';
import {SharedModule} from '../shared/shared.module';

@NgModule({
  imports: [
      CommonModule,
      RouterModule.forChild(CancelledDeviceListRoutes),
      SharedModule
  ],
  declarations: [CancelledDeviceListComponent]
})

export class CancelledDeviceListModule {}
