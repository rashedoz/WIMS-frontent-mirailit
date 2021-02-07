import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

import { CustomerDueListComponent } from './customer-due-list.component';
import { CustomerDueListRoutes } from './customer-due-list.routing';
import {SharedModule} from './../shared/shared.module';

@NgModule({
  imports: [
      CommonModule,
      RouterModule.forChild(CustomerDueListRoutes),
      SharedModule
  ],
  declarations: [CustomerDueListComponent]
})

export class CustomerDueListModule {}
