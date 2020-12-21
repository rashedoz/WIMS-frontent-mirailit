import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

import { RetailerListComponent } from './retailer-list.component';
import { RetailerListRoutes } from './retailer-list.routing';
import {SharedModule} from './../shared/shared.module';

@NgModule({
  imports: [
      CommonModule,
      RouterModule.forChild(RetailerListRoutes),
      SharedModule
  ],
  declarations: [RetailerListComponent]
})

export class RetailerListModule {}
