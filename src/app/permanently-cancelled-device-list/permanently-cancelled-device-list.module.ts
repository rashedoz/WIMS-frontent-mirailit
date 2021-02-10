import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

import { PermanentlyCancelledDeviceListComponent } from './permanently-cancelled-device-list.component';
import { PermanentlyCancelledDeviceListRoutes } from './permanently-cancelled-device-list.routing';
import {SharedModule} from '../shared/shared.module';

@NgModule({
  imports: [
      CommonModule,
      RouterModule.forChild(PermanentlyCancelledDeviceListRoutes),
      SharedModule
  ],
  declarations: [PermanentlyCancelledDeviceListComponent]
})

export class PermanentlyCancelledDeviceListModule {}
