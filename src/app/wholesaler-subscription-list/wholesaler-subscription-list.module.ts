import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

import { WholesalerSubscriptionListComponent } from './wholesaler-subscription-list.component';
import { WholesalerSubscriptionListRoutes } from './wholesaler-subscription-list.routing';
import {SharedModule} from '../shared/shared.module';

@NgModule({
  imports: [
      CommonModule,
      RouterModule.forChild(WholesalerSubscriptionListRoutes),
      SharedModule
  ],
  declarations: [WholesalerSubscriptionListComponent]
})

export class WholesalerSubscriptionListModule {}
