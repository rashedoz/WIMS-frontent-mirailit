import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

import { PurchaseEntryComponent } from './purchase-entry.component';
import { PurchaseEntryRoutes } from './purchase-entry.routing';
import {SharedModule} from './../shared/shared.module';

@NgModule({
  imports: [
      CommonModule,
      RouterModule.forChild(PurchaseEntryRoutes),
      SharedModule
  ],
  declarations: [PurchaseEntryComponent]
})

export class PurchaseEntryModule {}
