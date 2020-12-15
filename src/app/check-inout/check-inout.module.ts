import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

import { CheckInoutComponent } from './check-inout.component';
import { CheckInoutRoutes } from './check-inout.routing';
import {SharedModule} from '../shared/shared.module';

@NgModule({
  imports: [
      CommonModule,
      RouterModule.forChild(CheckInoutRoutes),
      SharedModule
  ],
  declarations: [CheckInoutComponent] 
})

export class CheckInoutModule {}
