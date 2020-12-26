import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

import { DeviceStockHistoryComponent } from './device-stock-history.component';
import { DeviceStockHistoryRoutes } from './device-stock-history.routing';
import {SharedModule} from '../shared/shared.module';

@NgModule({
  imports: [
      CommonModule,
      RouterModule.forChild(DeviceStockHistoryRoutes),
      SharedModule
  ],
  declarations: [DeviceStockHistoryComponent]
})

export class DeviceStockHistoryModule {}
