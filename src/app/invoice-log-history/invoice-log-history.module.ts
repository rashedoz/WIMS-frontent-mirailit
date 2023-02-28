import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

import { InvoiceLogHistoryComponent } from './invoice-log-history.component';
import { InvoiceLogHistoryRoutes } from './invoice-log-history.routing';
import {SharedModule} from '../shared/shared.module';


@NgModule({
  imports: [
      CommonModule,
      RouterModule.forChild(InvoiceLogHistoryRoutes),
      SharedModule
  ],
  declarations: [InvoiceLogHistoryComponent]
})

export class InvoiceLogHistoryModule {}
