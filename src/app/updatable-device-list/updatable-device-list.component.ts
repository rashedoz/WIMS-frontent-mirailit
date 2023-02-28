import { Component, TemplateRef, ViewChild, ElementRef, ViewEncapsulation, OnInit } from '@angular/core';
import { ColumnMode } from '@swimlane/ngx-datatable';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonService } from '../_services/common.service';
import { ToastrService } from 'ngx-toastr';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { Page } from '../_models/page';


@Component({
  selector: 'app-updatable-device-list',
  templateUrl: './updatable-device-list.component.html',
  encapsulation: ViewEncapsulation.None
})

export class UpdatableDeviceListComponent implements OnInit {

  entryForm: FormGroup;
  submitted = false;
  @BlockUI() blockUI: NgBlockUI;
  modalTitleDevice = 'Add Device Details';
  btnSaveText = 'Save';
  modalConfig: any = { class: 'modal-dialog-scrollable gray modal-md', backdrop: 'static' };
  modalRef: BsModalRef;

  page = new Page();
  emptyGuid = '00000000-0000-0000-0000-000000000000';
  rows = [];
  loadingIndicator = false;
  ColumnMode = ColumnMode;
  scrollBarHorizontal = (window.innerWidth < 1200);

  deviceItemList: Array<any> = [];

  constructor(
    private modalService: BsModalService,
    public formBuilder: FormBuilder,
    private _service: CommonService,
    private toastr: ToastrService,
    private router: Router
  ) {
    this.page.pageNumber = 0;
    this.page.size = 100;
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
    this._service.get('stock/get-updatable-device-list').subscribe(res => {

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
      this.toastr.error(err.Msg || err, 'Error!', { closeButton: true, disableTimeOut: true });
      setTimeout(() => {
        this.loadingIndicator = false;
      }, 1000);
    }
    );
  }



  onFormSubmitDevice() {

    let device_details = [];
    this.blockUI.start('Updating...');
    this.deviceItemList.filter(x=>x.IMEI).forEach(element => {
      device_details.push({
        id:element.id,
        IMEI: element.IMEI,
      });
    });
    const obj = {
      device_details : device_details
    };
    this._service.put('stock/update-bulk-device-detail', obj).subscribe(
      data => {
        this.blockUI.stop();
        if (data.IsReport == "Success") {
          this.toastr.success(data.Msg, 'Success!', { timeOut: 2000 });
          this.modalHideDevice();
          this.getList();

        } else if (data.IsReport == "Warning") {
          this.toastr.warning(data.Msg, 'Warning!', { closeButton: true, disableTimeOut: true });
        } else {
          this.toastr.error(data.Msg, 'Error!', { timeOut: 2000 });
        }
      },
      err => {
        this.blockUI.stop();
        this.toastr.error(err.Msg || err, 'Error!', { timeOut: 2000 });
      }
    );

  }


  modalHideDevice() {

    this.modalRef.hide();
    this.submitted = false;
    this.modalTitleDevice = 'Add Device Details';
    this.btnSaveText = 'Save';
    this.deviceItemList = [];
  }


  openModalDevice(template: TemplateRef<any>) {
    this.rows.forEach(element => {
      this.deviceItemList.push({
        "id":element.id,
        "DID_no":element.DID_no,
        "IMEI":"",
      });
    });
    this.modalRef = this.modalService.show(template, this.modalConfig);
  }

}
