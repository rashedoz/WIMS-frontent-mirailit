import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

import { PaymentCollectionComponent } from './payment-collection.component';
import { PaymentCollectionRoutes } from './payment-collection.routing';
import {SharedModule} from '../shared/shared.module';

@NgModule({
  imports: [
      CommonModule,
      RouterModule.forChild(PaymentCollectionRoutes),
      SharedModule
  ],
  declarations: [PaymentCollectionComponent]
})

export class PaymentCollectionModule {}
