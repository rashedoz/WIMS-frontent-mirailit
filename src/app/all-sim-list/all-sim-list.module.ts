import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

import { AllSIMListComponent } from './all-sim-list.component';
import { AllSIMListRoutes } from './all-sim-list.routing';
import {SharedModule} from '../shared/shared.module';
import { TabsModule } from 'ngx-bootstrap/tabs';

@NgModule({
  imports: [
      CommonModule,
      RouterModule.forChild(AllSIMListRoutes),
      SharedModule,
      TabsModule.forRoot()
  ],
  declarations: [AllSIMListComponent]
})

export class AllSIMListModule {}
