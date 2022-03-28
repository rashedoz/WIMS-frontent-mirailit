import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

import { SubscriptionBillListComponent } from './subscription-bill-list.component';
import { SubscriptionBillListRoutes } from './subscription-bill-list.routing';
import {SharedModule} from '../shared/shared.module';
import { TabsModule } from 'ngx-bootstrap/tabs';

@NgModule({
  imports: [
      CommonModule,
      RouterModule.forChild(SubscriptionBillListRoutes),
      SharedModule,
      TabsModule.forRoot()
  ],
  declarations: [SubscriptionBillListComponent]
})

export class SubscriptionBillListModule {}
