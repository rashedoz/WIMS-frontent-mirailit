import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

import { BillListComponent } from './bill-list.component';
import { BillListRoutes } from './bill-list.routing';
import {SharedModule} from '../shared/shared.module';
// import { PdfJsViewerModule } from 'ng2-pdfjs-viewer';
// import { NgxSmartModalModule } from 'ngx-smart-modal';

@NgModule({
  imports: [
      CommonModule,
      RouterModule.forChild(BillListRoutes),
      SharedModule     
  ],
  declarations: [BillListComponent]
})

export class BillListModule {}
