import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

import { FreezeSIMsComponent } from './freeze-sims.component';
import { FreezeSIMsRoutes } from './freeze-sims.routing';
import {SharedModule} from './../shared/shared.module';

@NgModule({
  imports: [
      CommonModule,
      RouterModule.forChild(FreezeSIMsRoutes),
      SharedModule
  ],
  declarations: [FreezeSIMsComponent]
})

export class FreezeSIMsModule {}
