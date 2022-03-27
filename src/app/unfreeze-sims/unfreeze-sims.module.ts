import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

import { UnFreezeSIMsComponent } from './unfreeze-sims.component';
import { UnFreezeSIMsRoutes } from './unfreeze-sims.routing';
import {SharedModule} from './../shared/shared.module';

@NgModule({
  imports: [
      CommonModule,
      RouterModule.forChild(UnFreezeSIMsRoutes),
      SharedModule
  ],
  declarations: [UnFreezeSIMsComponent]
})

export class UnFreezeSIMsModule {}
