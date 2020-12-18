import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

import { RemoveProductNextMonthComponent } from './remove-product-next-month.component';
import { RemoveProductNextMonthRoutes } from './remove-product-next-month.routing';
import {SharedModule} from './../shared/shared.module';

@NgModule({
  imports: [
      CommonModule,
      RouterModule.forChild(RemoveProductNextMonthRoutes),
      SharedModule
  ],
  declarations: [RemoveProductNextMonthComponent]
})

export class RemoveProductNextMonthModule {}
