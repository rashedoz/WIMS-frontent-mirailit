import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

import { RetailerSubscriptionListComponent } from './retailer-subscription-list.component';
import { RetailerSubscriptionListRoutes } from './retailer-subscription-list.routing';
import {SharedModule} from '../shared/shared.module';

@NgModule({
  imports: [
      CommonModule,
      RouterModule.forChild(RetailerSubscriptionListRoutes),
      SharedModule
  ],
  declarations: [RetailerSubscriptionListComponent]
})

export class RetailerSubscriptionListModule {}
