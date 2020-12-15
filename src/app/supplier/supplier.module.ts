import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

import { SupplierComponent } from './supplier.component';
import { SupplierRoutes } from './supplier.routing';
import {SharedModule} from './../shared/shared.module';

@NgModule({
  imports: [
      CommonModule,
      RouterModule.forChild(SupplierRoutes),
      SharedModule
  ],
  declarations: [SupplierComponent]
})

export class SupplierModule {}
