import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

import { BulkEntryComponent } from './bulk-entry.component';
import { BulkEntryRoutes } from './bulk-entry.routing';
import {SharedModule} from '../shared/shared.module';

@NgModule({
  imports: [
      CommonModule,
      RouterModule.forChild(BulkEntryRoutes),
      SharedModule
  ],
  declarations: [BulkEntryComponent]
})

export class BulkEntryModule {}
