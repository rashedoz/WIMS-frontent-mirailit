import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

import { AddProductSubscriptionComponent } from './add-product-subscription.component';
import { AddProductSubscriptionRoutes } from './add-product-subscription.routing';
import {SharedModule} from './../shared/shared.module';

@NgModule({
  imports: [
      CommonModule,
      RouterModule.forChild(AddProductSubscriptionRoutes),
      SharedModule
  ],
  declarations: [AddProductSubscriptionComponent]
})

export class AddProductSubscriptionModule {}
