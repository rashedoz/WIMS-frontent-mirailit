import { Component, TemplateRef, ViewChild, ElementRef, ViewEncapsulation, OnInit } from '@angular/core';
import { ColumnMode } from '@swimlane/ngx-datatable';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonService } from '../_services/common.service';
import { ToastrService } from 'ngx-toastr';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { Page } from '../_models/page';
import { StockStatus } from '../_models/enums';

@Component({
  selector: 'app-updatable-sim-list',
  templateUrl: './updatable-sim-list.component.html',
  encapsulation: ViewEncapsulation.None
})

export class UpdatableSIMListComponent implements OnInit {

  entryForm: FormGroup;
  submitted = false;
  @BlockUI() blockUI: NgBlockUI;
  modalTitleSIM = 'Add SIM Details';
  btnSaveText = 'Save';
  modalConfig: any = { class: 'modal-dialog-scrollable gray modal-lg', backdrop: 'static' };
  modalRef: BsModalRef;
  StockStatus = StockStatus;
  page = new Page();
  emptyGuid = '00000000-0000-0000-0000-000000000000';
  rows = [];
  loadingIndicator = false;
  ColumnMode = ColumnMode;
  scrollBarHorizontal = (window.innerWidth < 1200);

  SIMItemList: Array<any> = [];

  constructor(
    private modalService: BsModalService,
    public formBuilder: FormBuilder,
    private _service: CommonService,
    private toastr: ToastrService,
    private router: Router
  ) {
    this.page.pageNumber = 0;
    this.page.size = 10;
    window.onresize = () => {
      this.scrollBarHorizontal = (window.innerWidth < 1200);
    };
  }


  ngOnInit() {

    this.getList();
  }



  // setPage(pageInfo) {
  //   this.page.pageNumber = pageInfo.offset;
  //   this.getList();
  // }

  getList() {
    this.loadingIndicator = true;
    // const obj = {
    //   size: this.page.size,
    //   pageNumber: this.page.pageNumber
    // };
    this._service.get('stock/get-updatable-sim-list').subscribe(res => {

      if (!res) {
        this.toastr.error(res.Message, 'Error!', { closeButton: true, disableTimeOut: true });
        return;
      }
      this.rows = res;
      // this.page.totalElements = res.Total;
      // this.page.totalPages = Math.ceil(this.page.totalElements / this.page.size);
      setTimeout(() => {
        this.loadingIndicator = false;
      }, 1000);
    }, err => {
      this.toastr.error(err.message || err, 'Error!', { closeButton: true, disableTimeOut: true });
      setTimeout(() => {
        this.loadingIndicator = false;
      }, 1000);
    }
    );
  }



  onFormSubmitSIM() {

    let sim_details = [];
    this.blockUI.start('Updating...');
    this.SIMItemList.filter(x=>x.iccid && x.phone_number).forEach(element => {
      sim_details.push({
        id:element.id,
        ICCID_no: element.iccid,
        phone_number: element.phone_number,
      });
    });
    const obj = {
      sim_details : sim_details
    };
    this._service.put('stock/update-bulk-sim-detail', obj).subscribe(
      data => {
        this.blockUI.stop();
        if (data.IsReport == "Success") {
          this.toastr.success(data.Msg, 'Success!', { timeOut: 2000 });
          this.modalHideSIM();
          this.getList();

        } else if (data.IsReport == "Warning") {
          this.toastr.warning(data.Msg, 'Warning!', { closeButton: true, disableTimeOut: true });
        } else {
          this.toastr.error(data.Msg, 'Error!', { timeOut: 2000 });
        }
      },
      err => {
        this.blockUI.stop();
        this.toastr.error(err.Message || err, 'Error!', { timeOut: 2000 });
      }
    );

  }


  modalHideSIM() {

    this.modalRef.hide();
    this.submitted = false;
    this.modalTitleSIM = 'Add SIM Details';
    this.btnSaveText = 'Save';
    this.SIMItemList = [];
  }


  openModalSIM(template: TemplateRef<any>) {
    this.rows.forEach(element => {
      this.SIMItemList.push({
        "id":element.id,
        "CID_no":element.CID_no,
        "iccid":"",
        "phone_number":"",
      });
    });
    this.modalRef = this.modalService.show(template, this.modalConfig);
  }

}
