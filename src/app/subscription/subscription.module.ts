import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

import { SubscriptionComponent } from './subscription.component';
import { SubscriptionRoutes } from './subscription.routing';
import {SharedModule} from '../shared/shared.module';

@NgModule({
  imports: [
      CommonModule,
      RouterModule.forChild(SubscriptionRoutes),
      SharedModule
  ],
  declarations: [SubscriptionComponent]
})

export class SubscriptionModule {}
