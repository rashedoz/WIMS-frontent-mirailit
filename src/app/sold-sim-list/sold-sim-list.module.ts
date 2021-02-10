import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

import { SoldSIMListComponent } from './sold-sim-list.component';
import { SoldSIMListRoutes } from './sold-sim-list.routing';
import {SharedModule} from '../shared/shared.module';

@NgModule({
  imports: [
      CommonModule,
      RouterModule.forChild(SoldSIMListRoutes),
      SharedModule
  ],
  declarations: [SoldSIMListComponent]
})

export class SoldSIMListModule {}
