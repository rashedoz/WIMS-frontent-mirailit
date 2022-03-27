import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

import { InvoiceComponent } from './invoice.component';
import { InvoiceRoutes } from './invoice.routing';
import {SharedModule} from '../shared/shared.module';

@NgModule({
  imports: [
      CommonModule,
      RouterModule.forChild(InvoiceRoutes),
      SharedModule
  ],
  declarations: [InvoiceComponent]
})

export class InvoiceModule {}
