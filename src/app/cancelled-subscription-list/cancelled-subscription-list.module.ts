import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

import { CancelledSubscriptionListComponent } from './cancelled-subscription-list.component';
import { CancelledSubscriptionListRoutes } from './cancelled-subscription-list.routing';
import {SharedModule} from '../shared/shared.module';

@NgModule({
  imports: [
      CommonModule,
      RouterModule.forChild(CancelledSubscriptionListRoutes),
      SharedModule
  ],
  declarations: [CancelledSubscriptionListComponent]
})

export class CancelledSubscriptionListModule {}
