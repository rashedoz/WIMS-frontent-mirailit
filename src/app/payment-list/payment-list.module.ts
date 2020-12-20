import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

import { PaymentListComponent } from './payment-list.component';
import { PaymentListRoutes } from './payment-list.routing';
import {SharedModule} from '../shared/shared.module';

@NgModule({
  imports: [
      CommonModule,
      RouterModule.forChild(PaymentListRoutes),
      SharedModule
  ],
  declarations: [PaymentListComponent]
})

export class PaymentListModule {}
