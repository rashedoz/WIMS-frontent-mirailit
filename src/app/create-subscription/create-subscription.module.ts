import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

import { CreateSubscriptionComponent } from './create-subscription.component';
import { CreateSubscriptionRoutes } from './create-subscription.routing';
import {SharedModule} from './../shared/shared.module';

@NgModule({
  imports: [
      CommonModule,
      RouterModule.forChild(CreateSubscriptionRoutes),
      SharedModule
  ],
  declarations: [CreateSubscriptionComponent]
})

export class CreateSubscriptionModule {}
