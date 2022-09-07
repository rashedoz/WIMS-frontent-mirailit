import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

import { SellPhoneSIMProductComponent } from './sell-phone-sim-product.component';
import { SellPhoneSIMProductRoutes } from './sell-phone-sim-product.routing';
import {SharedModule} from './../shared/shared.module';

@NgModule({
  imports: [
      CommonModule,
      RouterModule.forChild(SellPhoneSIMProductRoutes),
      SharedModule
  ],
  declarations: [SellPhoneSIMProductComponent]
})

export class SellPhoneSIMProductModule {}
