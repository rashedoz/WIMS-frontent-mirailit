import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

import { ProfileEditComponent } from './profile-edit.component';
import { ProfileEditRoutes } from './profile-edit.routing';
import {SharedModule} from '../shared/shared.module';
import { HighchartsChartModule } from 'highcharts-angular';

@NgModule({
  imports: [
      CommonModule,
      RouterModule.forChild(ProfileEditRoutes),
      SharedModule,
      HighchartsChartModule
  ],
  declarations: [ProfileEditComponent]
})

export class ProfileEditModule {}
