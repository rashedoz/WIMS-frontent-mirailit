import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

import { SubscriptionListComponent } from './subscription-list.component';
import { SubscriptionListRoutes } from './subscription-list.routing';
import {SharedModule} from '../shared/shared.module';

@NgModule({
  imports: [
      CommonModule,
      RouterModule.forChild(SubscriptionListRoutes),
      SharedModule
  ],
  declarations: [SubscriptionListComponent]
})

export class SubscriptionListModule {}
