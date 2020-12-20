import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

import { WholesalerListComponent } from './wholesaler-list.component';
import { WholesalerListRoutes } from './wholesaler-list.routing';
import {SharedModule} from './../shared/shared.module';

@NgModule({
  imports: [
      CommonModule,
      RouterModule.forChild(WholesalerListRoutes),
      SharedModule
  ],
  declarations: [WholesalerListComponent]
})

export class WholesalerListModule {}
