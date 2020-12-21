import { Component, TemplateRef, ViewChild, ElementRef, ViewEncapsulation, OnInit } from '@angular/core';
import { ColumnMode } from '@swimlane/ngx-datatable';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { CommonService } from '../_services/common.service';
import { ToastrService } from 'ngx-toastr';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { Page } from '../_models/page';


@Component({
  selector: 'app-sim-stock-history',
  templateUrl: './sim-stock-history.component.html',
  styleUrls: ['./sim-stock-history.component.css'],
  encapsulation: ViewEncapsulation.None
})

export class SIMStockHistoryComponent implements OnInit {

  entryFormBill: FormGroup;
  submitted = false;
  @BlockUI() blockUI: NgBlockUI;


  // modalTitle = 'Generate Monthly Bill';
  // btnSaveText = 'Save';
  // modalConfig: any = { class: 'gray modal-md', backdrop: 'static' };
  // modalRef: BsModalRef;


  page = new Page();
  emptyGuid = '00000000-0000-0000-0000-000000000000';
  rows = [];
  stock :any = {};
  loadingIndicator = false;
  ColumnMode = ColumnMode;
  scrollBarHorizontal = (window.innerWidth < 1200);

  constructor(
    public formBuilder: FormBuilder,
    private modalService: BsModalService,
    private _service: CommonService,
    private toastr: ToastrService,
    private router: Router
  ) {
    // this.page.pageNumber = 0;
    // this.page.size = 10;
    window.onresize = () => {
      this.scrollBarHorizontal = (window.innerWidth < 1200);
    };
  }


  ngOnInit() {
    this.getData();
   
  }

  getData() {
    this._service.get('stock/get-current-sim-stock-history').subscribe(res => {    
      this.stock = res;    
    }, err => {}
    );
  }





  // modalHide() {
  //   this.entryFormBill.reset();
  //   this.modalRef.hide();
  //   this.submitted = false;
  //   this.btnSaveText = 'Save';
  // }

  // openModal(template: TemplateRef<any>) {

  //     this.modalRef = this.modalService.show(template, this.modalConfig);

  // }


  // setPage(pageInfo) {
  //   this.page.pageNumber = pageInfo.offset;
  //   this.getList();
  // }



}
