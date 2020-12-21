import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

import { UpdatableDeviceListComponent } from './updatable-device-list.component';
import { UpdatableDeviceListRoutes } from './updatable-device-list.routing';
import {SharedModule} from '../shared/shared.module';

@NgModule({
  imports: [
      CommonModule,
      RouterModule.forChild(UpdatableDeviceListRoutes),
      SharedModule
  ],
  declarations: [UpdatableDeviceListComponent]
})

export class UpdatableDeviceListModule {}
