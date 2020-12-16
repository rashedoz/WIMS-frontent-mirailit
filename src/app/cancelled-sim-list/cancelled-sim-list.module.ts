import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

import { CancelledSIMListComponent } from './cancelled-sim-list.component';
import { CancelledSIMListRoutes } from './cancelled-sim-list.routing';
import {SharedModule} from '../shared/shared.module';

@NgModule({
  imports: [
      CommonModule,
      RouterModule.forChild(CancelledSIMListRoutes),
      SharedModule
  ],
  declarations: [CancelledSIMListComponent]
})

export class CancelledSIMListModule {}
