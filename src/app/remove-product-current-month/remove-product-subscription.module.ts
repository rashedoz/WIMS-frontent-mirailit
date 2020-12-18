import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

import { RemoveProductSubscriptionComponent } from './remove-product-subscription.component';
import { RemoveProductSubscriptionRoutes } from './remove-product-subscription.routing';
import {SharedModule} from './../shared/shared.module';

@NgModule({
  imports: [
      CommonModule,
      RouterModule.forChild(RemoveProductSubscriptionRoutes),
      SharedModule
  ],
  declarations: [RemoveProductSubscriptionComponent]
})

export class RemoveProductSubscriptionModule {}
