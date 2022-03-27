import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

import { ActiveSubscriptionListComponent } from './active-subscription-list.component';
import { ActiveSubscriptionListRoutes } from './active-subscription-list.routing';
import {SharedModule} from '../shared/shared.module';

@NgModule({
  imports: [
      CommonModule,
      RouterModule.forChild(ActiveSubscriptionListRoutes),
      SharedModule
  ],
  declarations: [ActiveSubscriptionListComponent]
})

export class ActiveSubscriptionListModule {}
