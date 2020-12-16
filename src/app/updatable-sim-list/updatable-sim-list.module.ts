import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

import { UpdatableSIMListComponent } from './updatable-sim-list.component';
import { UpdatableSIMListRoutes } from './updatable-sim-list.routing';
import {SharedModule} from '../shared/shared.module';

@NgModule({
  imports: [
      CommonModule,
      RouterModule.forChild(UpdatableSIMListRoutes),
      SharedModule
  ],
  declarations: [UpdatableSIMListComponent]
})

export class UpdatableSIMListModule {}
