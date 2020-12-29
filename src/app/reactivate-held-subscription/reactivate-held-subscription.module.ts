import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

import { ReactivateHeldSubscriptionComponent } from './reactivate-held-subscription.component';
import { ReactivateHeldSubscriptionRoutes } from './reactivate-held-subscription.routing';
import {SharedModule} from './../shared/shared.module';

@NgModule({
  imports: [
      CommonModule,
      RouterModule.forChild(ReactivateHeldSubscriptionRoutes),
      SharedModule
  ],
  declarations: [ReactivateHeldSubscriptionComponent]
})

export class ReactivateHeldSubscriptionModule {}
