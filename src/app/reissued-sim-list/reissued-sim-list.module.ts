import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

import { ReissuedSIMListComponent } from './reissued-sim-list.component';
import { ReissuedSIMListRoutes } from './reissued-sim-list.routing';
import {SharedModule} from '../shared/shared.module';

@NgModule({
  imports: [
      CommonModule,
      RouterModule.forChild(ReissuedSIMListRoutes),
      SharedModule
  ],
  declarations: [ReissuedSIMListComponent]
})

export class ReissuedSIMListModule {}
