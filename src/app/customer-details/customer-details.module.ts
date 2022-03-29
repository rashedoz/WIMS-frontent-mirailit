import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

import { CustomerDetailsComponent } from './customer-details.component';
import { CustomerDetailsRoutes } from './customer-details.routing';
import {SharedModule} from '../shared/shared.module';
import { TabsModule } from 'ngx-bootstrap/tabs';

@NgModule({
  imports: [
      CommonModule,
      RouterModule.forChild(CustomerDetailsRoutes),
      SharedModule,
      TabsModule.forRoot()
  ],
  declarations: [CustomerDetailsComponent]
})

export class CustomerDetailsModule {}
