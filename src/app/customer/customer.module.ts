import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

import { CustomerComponent } from './customer.component';
import { CustomerRoutes } from './customer.routing';
import {SharedModule} from './../shared/shared.module';
// import { NgxSmartModalModule } from 'ngx-smart-modal';
@NgModule({
  imports: [
      CommonModule,
      RouterModule.forChild(CustomerRoutes),
      SharedModule
  ],
  declarations: [CustomerComponent]
})

export class CustomerModule {}
