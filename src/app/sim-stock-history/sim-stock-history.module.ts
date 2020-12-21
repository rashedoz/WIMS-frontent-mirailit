import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

import { SIMStockHistoryComponent } from './sim-stock-history.component';
import { SIMStockHistoryRoutes } from './sim-stock-history.routing';
import {SharedModule} from '../shared/shared.module';

@NgModule({
  imports: [
      CommonModule,
      RouterModule.forChild(SIMStockHistoryRoutes),
      SharedModule
  ],
  declarations: [SIMStockHistoryComponent]
})

export class SIMStockHistoryModule {}
