import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

import { InvoiceLogComponent } from './invoice-log.component';
import { InvoiceLogRoutes } from './invoice-log.routing';
import {SharedModule} from '../shared/shared.module';


@NgModule({
  imports: [
      CommonModule,
      RouterModule.forChild(InvoiceLogRoutes),
      SharedModule
  ],
  declarations: [InvoiceLogComponent]
})

export class InvoiceLogModule {}
