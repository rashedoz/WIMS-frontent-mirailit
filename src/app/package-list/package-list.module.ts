import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

import { PackageListComponent } from './package-list.component';
import { PackageListRoutes } from './package-list.routing';
import {SharedModule} from '../shared/shared.module';

@NgModule({
  imports: [
      CommonModule,
      RouterModule.forChild(PackageListRoutes),
      SharedModule
  ],
  declarations: [PackageListComponent]
})

export class PackageListModule {}
