import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

import { SellProductComponent } from './sell-product.component';
import { SellProductRoutes } from './sell-product.routing';
import {SharedModule} from './../shared/shared.module';

@NgModule({
  imports: [
      CommonModule,
      RouterModule.forChild(SellProductRoutes),
      SharedModule
  ],
  declarations: [SellProductComponent]
})

export class SellProductModule {}
