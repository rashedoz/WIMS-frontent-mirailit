import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

import { CustomerBalanceListComponent } from './customer-balance-list.component';
import { CustomerBalanceListRoutes } from './customer-balance-list.routing';
import {SharedModule} from '../shared/shared.module';

@NgModule({
  imports: [
      CommonModule,
      RouterModule.forChild(CustomerBalanceListRoutes),
      SharedModule
  ],
  declarations: [CustomerBalanceListComponent]
})

export class CustomerBalanceListModule {}
