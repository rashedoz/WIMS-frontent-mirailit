import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

import { ChangePasswordComponent } from './change-password.component';
import { ChangePasswordRoutes } from './change-password.routing';
import {SharedModule} from '../shared/shared.module';
@NgModule({
  imports: [
      CommonModule,
      RouterModule.forChild(ChangePasswordRoutes),
      SharedModule,
  ],
  declarations: [ChangePasswordComponent]
})

export class ChangePasswordModule {}
