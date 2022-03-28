import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

import { DeviceSalesBillListComponent } from './device-sales-bill-list.component';
import { DeviceSalesBillListRoutes } from './device-sales-bill-list.routing';
import {SharedModule} from '../shared/shared.module';
import { TabsModule } from 'ngx-bootstrap/tabs';

@NgModule({
  imports: [
      CommonModule,
      RouterModule.forChild(DeviceSalesBillListRoutes),
      SharedModule,
      TabsModule.forRoot()
  ],
  declarations: [DeviceSalesBillListComponent]
})

export class DeviceSalesBillListModule {}
