import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

import { ReceivePaymentComponent } from './receive-payment.component';
import { ReceivePaymentRoutes } from './receive-payment.routing';
import {SharedModule} from '../shared/shared.module';
import { TabsModule } from 'ngx-bootstrap/tabs';

@NgModule({
  imports: [
      CommonModule,
      RouterModule.forChild(ReceivePaymentRoutes),
      SharedModule,
      TabsModule.forRoot()
  ],
  declarations: [ReceivePaymentComponent]
})

export class ReceivePaymentModule {}
