import { Component, TemplateRef, ViewChild, ElementRef, ViewEncapsulation, OnInit } from '@angular/core';
import { ColumnMode } from '@swimlane/ngx-datatable';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonService } from '../_services/common.service';
import { ToastrService } from 'ngx-toastr';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { Page } from '../_models/page';
import { StockStatus } from '../_models/enums';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-permanently-cancelled-device-list',
  templateUrl: './permanently-cancelled-device-list.component.html',
  encapsulation: ViewEncapsulation.None
})

export class PermanentlyCancelledDeviceListComponent implements OnInit {

  entryForm: FormGroup;
  submitted = false;
  @BlockUI() blockUI: NgBlockUI;
  StockStatus = StockStatus;
  modalTitleDevice = 'Add Items For Return to Stock';
  btnSaveText = 'Return to Stock';
  modalConfig: any = { class: 'gray modal-md', backdrop: 'static' };
  modalRef: BsModalRef;

  deviceList = [];

  page = new Page();
  emptyGuid = '00000000-0000-0000-0000-000000000000';
  rows = [];
  loadingIndicator = false;
  ColumnMode = ColumnMode;
  scrollBarHorizontal = (window.innerWidth < 1200);

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
    this._service.get('stock/get-permanently-cancelled-device-list').subscribe((res:any) => {

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

  // onFormSubmitDevice() {

  //   let returned_device_list = [];
  // //
  //   this.deviceList.filter(x=>x.selected).forEach(element => {
  //     returned_device_list.push({
  //       id:element.id
  //     });
  //   });
  //   const obj = {
  //     returned_device_list : returned_device_list
  //   };

  //   if(returned_device_list.length == 0){
  //     this.toastr.warning('No item selected', 'Warning!', { closeButton: true, disableTimeOut: true });
  //     return;
  //   }
  //   this.blockUI.start('Returning...');
  //   this._service.post('stock/return-device-to-stock-from-cancellation', obj).subscribe(
  //     data => {
  //       this.blockUI.stop();
  //       if (data.IsReport == "Success") {
  //         this.toastr.success(data.Msg, 'Success!', { timeOut: 2000 });
  //         this.modalHideDevice();
  //         this.getList();

  //       } else if (data.IsReport == "Warning") {
  //         this.toastr.warning(data.Msg, 'Warning!', { closeButton: true, disableTimeOut: true });
  //       } else {
  //         this.toastr.error(data.Msg, 'Error!', { timeOut: 2000 });
  //       }
  //     },
  //     err => {
  //       this.blockUI.stop();
  //       this.toastr.error(err.Message || err, 'Error!', { timeOut: 2000 });
  //     }
  //   );

  // }


  // modalHideDevice() {
  //   this.modalRef.hide();
  //   this.submitted = false;
  //   this.deviceList = [];
  // }


  // openModalDevice(template: TemplateRef<any>) {
  //   this.rows.forEach(element => {
  //     this.deviceList.push({
  //       id: element.id,
  //       device_id: element.id,
  //       device: element.ICCID_no,
  //       selected: false
  //     })
  //   });
  //   this.modalRef = this.modalService.show(template, this.modalConfig);
  // }


}
