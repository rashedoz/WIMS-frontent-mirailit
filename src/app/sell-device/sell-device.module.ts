import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

import { SellDeviceComponent } from './sell-device.component';
import { SellDeviceRoutes } from './sell-device.routing';
import {SharedModule} from './../shared/shared.module';

@NgModule({
  imports: [
      CommonModule,
      RouterModule.forChild(SellDeviceRoutes),
      SharedModule
  ],
  declarations: [SellDeviceComponent]
})

export class SellDeviceModule {}
