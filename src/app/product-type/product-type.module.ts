import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

import { ProductTypeComponent } from './product-type.component';
import { ProductTypeRoutes } from './product-type.routing';
import {SharedModule} from '../shared/shared.module';

@NgModule({
  imports: [
      CommonModule,
      RouterModule.forChild(ProductTypeRoutes),
      SharedModule
  ],
  declarations: [ProductTypeComponent]
})

export class ProductTypeModule {}
