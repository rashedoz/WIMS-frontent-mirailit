import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

import { MemberListComponent } from './member-list.component';
import { MemberListRoutes } from './member-list.routing';
import {SharedModule} from '../shared/shared.module';

@NgModule({
  imports: [
      CommonModule,
      RouterModule.forChild(MemberListRoutes),
      SharedModule
  ],
  declarations: [MemberListComponent]
})

export class MemberListModule {}
