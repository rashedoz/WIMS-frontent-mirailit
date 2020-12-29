import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

import { SellSIMComponent } from './sell-sim.component';
import { SellSIMRoutes } from './sell-sim.routing';
import {SharedModule} from './../shared/shared.module';

@NgModule({
  imports: [
      CommonModule,
      RouterModule.forChild(SellSIMRoutes),
      SharedModule
  ],
  declarations: [SellSIMComponent]
})

export class SellSIMModule {}
