import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

import { HomeComponent } from './home.component';
import { HomeRoutes } from './home.routing';
import {SharedModule} from '../shared/shared.module';
import { HighchartsChartModule } from 'highcharts-angular';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';

@NgModule({
  imports: [
      CommonModule,
      RouterModule.forChild(HomeRoutes),
      SharedModule,
      HighchartsChartModule,
      MatProgressSpinnerModule
  ],
  declarations: [HomeComponent]
})

export class HomeModule {}
