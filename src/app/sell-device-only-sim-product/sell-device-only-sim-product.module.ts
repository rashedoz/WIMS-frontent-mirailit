import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

import { SellDeviceOnlySimProductComponent } from './sell-device-only-sim-product.component';
import { SellDeviceOnlySimProductRoutes } from './sell-device-only-sim-product.routing';
import {SharedModule} from './../shared/shared.module';

@NgModule({
  imports: [
      CommonModule,
      RouterModule.forChild(SellDeviceOnlySimProductRoutes),
      SharedModule
  ],
  declarations: [SellDeviceOnlySimProductComponent]
})

export class SellDeviceOnlySimProductModule {}
