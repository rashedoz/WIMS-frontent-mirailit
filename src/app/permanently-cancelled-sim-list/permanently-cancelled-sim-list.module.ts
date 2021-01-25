import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

import { PermanentlyCancelledSIMListComponent } from './permanently-cancelled-sim-list.component';
import { PermanentlyCancelledSIMListRoutes } from './permanently-cancelled-sim-list.routing';
import {SharedModule} from '../shared/shared.module';

@NgModule({
  imports: [
      CommonModule,
      RouterModule.forChild(PermanentlyCancelledSIMListRoutes),
      SharedModule
  ],
  declarations: [PermanentlyCancelledSIMListComponent]
})

export class PermanentlyCancelledSIMListModule {}
