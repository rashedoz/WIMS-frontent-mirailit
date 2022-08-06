import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

import { BillComponent } from './bill.component';
import { BillRoutes } from './bill.routing';
import {SharedModule} from '../shared/shared.module';
import { TabsModule } from 'ngx-bootstrap/tabs';

@NgModule({
  imports: [
      CommonModule,
      RouterModule.forChild(BillRoutes),
      SharedModule,
      TabsModule.forRoot()
  ],
  declarations: [BillComponent]
})

export class BillModule {}
