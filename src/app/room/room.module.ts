import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

import { RoomComponent } from './room.component';
import { RoomRoutes } from './room.routing';
import {SharedModule} from './../shared/shared.module';

@NgModule({
  imports: [
      CommonModule,
      RouterModule.forChild(RoomRoutes),
      SharedModule
  ],
  declarations: [RoomComponent]
})

export class RoomModule {}
