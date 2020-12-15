import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

import { BuildingComponent } from './building.component';
import { BuildingRoutes } from './building.routing';
import {SharedModule} from '../shared/shared.module';

@NgModule({
  imports: [
      CommonModule,
      RouterModule.forChild(BuildingRoutes),
      SharedModule
  ],
  declarations: [BuildingComponent]
})

export class BuildingModule {}
