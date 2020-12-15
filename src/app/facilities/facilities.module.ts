import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

import { FacilitiesComponent } from './facilities.component';
import { FacilitiesRoutes } from './facilities.routing';
import {SharedModule} from '../shared/shared.module';

@NgModule({
  imports: [
      CommonModule,
      RouterModule.forChild(FacilitiesRoutes),
      SharedModule   

  ],
  declarations: [FacilitiesComponent]
})

export class FacilitiesModule {}
