import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

import { SellDeviceByCustomerComponent } from './sell-device-by-customer.component';
import { SellDeviceByCustomerRoutes } from './sell-device-by-customer.routing';
import {SharedModule} from './../shared/shared.module';

@NgModule({
  imports: [
      CommonModule,
      RouterModule.forChild(SellDeviceByCustomerRoutes),
      SharedModule
  ],
  declarations: [SellDeviceByCustomerComponent]
})

export class SellDeviceByCustomerModule {}
