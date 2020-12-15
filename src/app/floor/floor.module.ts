import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

import { FloorComponent } from './floor.component';
import { FloorRoutes } from './floor.routing';
import {SharedModule} from '../shared/shared.module';

@NgModule({
  imports: [
      CommonModule,
      RouterModule.forChild(FloorRoutes),
      SharedModule
  ],
  declarations: [FloorComponent]
})

export class FloorModule {}
