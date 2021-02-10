import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

import { SoldDeviceListComponent } from './sold-device-list.component';
import { SoldDeviceListRoutes } from './sold-device-list.routing';
import {SharedModule} from '../shared/shared.module';

@NgModule({
  imports: [
      CommonModule,
      RouterModule.forChild(SoldDeviceListRoutes),
      SharedModule
  ],
  declarations: [SoldDeviceListComponent]
})

export class SoldDeviceListModule {}
