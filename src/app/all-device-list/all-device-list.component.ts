import { Component, TemplateRef, ViewChild, ElementRef, ViewEncapsulation, OnInit } from '@angular/core';
import { ColumnMode } from '@swimlane/ngx-datatable';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonService } from '../_services/common.service';
import { ToastrService } from 'ngx-toastr';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { Page } from '../_models/page';
import { StockStatus } from '../_models/enums';
import { ConfirmService } from '../_helpers/confirm-dialog/confirm.service';
import { BsModalService, BsModalRef } from "ngx-bootstrap/modal";

@Component({
  selector: 'app-all-device-list',
  templateUrl: './all-device-list.component.html',
  encapsulation: ViewEncapsulation.None
})

export class AllDeviceListComponent implements OnInit {

  entryForm: FormGroup;
  submitted = false;
  @BlockUI() blockUI: NgBlockUI;

  StockStatus = StockStatus;

  page = new Page();
  emptyGuid = '00000000-0000-0000-0000-000000000000';
  rows = [];
  loadingIndicator = false;
  ColumnMode = ColumnMode;
  scrollBarHorizontal = (window.innerWidth < 1200);
  modalConfig: any = { class: "gray modal-xl", backdrop: "static" };
  modalRef: BsModalRef;
  searchParam = '';
  tabType = "Available";
  status = 1;
  stock = null;
  deviceLifecycleDetails: Array<any> = [];
  deviceObj = null;
  pageLifeCycle = new Page();

  constructor(
    private confirmService: ConfirmService,
    public formBuilder: FormBuilder,
    private _service: CommonService,
    private modalService: BsModalService,
    private toastr: ToastrService,
    private router: Router
  ) {
    this.page.pageNumber = 0;
    this.page.size = 100;
    this.pageLifeCycle.pageNumber = 0;
    this.pageLifeCycle.size = 100;
    window.onresize = () => {
      this.scrollBarHorizontal = (window.innerWidth < 1200);
    };
  }


  ngOnInit() {
    this.getDeviceStockData();
    this.getList();
  }


  filterDeviceLifecycleSearch(e) {
    if (e) {
      this.pageLifeCycle.pageNumber = 0;
      this.pageLifeCycle.size = 100;
      this.searchParam = e.target.value;
      this.getDeviceLifeCycle();
    }
  }

  getDeviceStockData() {
    this._service.get('stock/get-current-device-stock-history').subscribe(res => {
      this.stock = res;
    }, err => {}
    );
  }

setPage(pageInfo) {
    this.page.pageNumber = pageInfo.offset;
    this.getList();
}

setLifeCyclePage(pageInfo) {
  this.pageLifeCycle.pageNumber = pageInfo.offset;
  this.getDeviceLifeCycle();
}


changeTab(type, e) {
  this.searchParam = "";
  this.page.pageNumber = 0;
  this.page.size = 100;


  this.pageLifeCycle.pageNumber = 0;
  this.pageLifeCycle.size = 100;

  switch (type) {
    case "Available":
      this.status = 1;
      this.tabType = type;
      this.getList();
      break;
    case "Sold":
      this.status = 3;
      this.tabType = type;
      this.getList();
      break;
    case "Cancelled":
      this.status = 4;
      this.tabType = type;
      this.getList();
      break;
    case "Permanently Cancelled":
      this.status = 8;
      this.tabType = type;
      this.getList();
      break;
    default:
      this.getList();
      break;
  }
}

onSubmitAction(action,row){
  let url = '';
  let txt = '';

    switch (action) {
      case 'return':
        url = 'stock/return-device-to-stock/'+row.id;
        txt = 'You are returning this device to stock.';
        break;
      case 'permanently_cancel':
        url = 'stock/cancel-device-permanently/'+row.id;
        txt = 'You are marking this device as permanently cancelled.';
        break;
      default:
        break;
    }



  this.blockUI.start('Saving...');
  this.confirmService.confirm('Are you sure?', txt)
  .subscribe(
      result => {
          if (result) {
            const request = this._service.patch(url, {});
            request.subscribe(
              data => {
                this.blockUI.stop();
                if (data.IsReport == "Success") {
                  this.toastr.success(data.Msg, 'Success!', { timeOut: 2000 });
                  this.getList();
                } else if (data.IsReport == "Warning") {
                  this.toastr.warning(data.Msg, 'Warning!', { timeOut: 2000 });
                } else {
                  this.toastr.error(data.Msg, 'Error!',  { timeOut: 2000 });
                }
              },
              err => {
                this.blockUI.stop();
                this.toastr.error(err.Msg || err, 'Error!', { timeOut: 2000 });
              }
            );
          }else{
            this.blockUI.stop();
          }
      },
  );
}



  getList() {
    this.rows = [];
    this.loadingIndicator = true;
    const obj = {
      limit: this.page.size,
      page: this.page.pageNumber + 1,
      search_param: this.searchParam,
      status: this.status,
    };
    this._service.get('stock/get-device-list',obj).subscribe(res => {

      if (!res) {
        this.toastr.error(res.Message, 'Error!', { closeButton: true, disableTimeOut: true });
        return;
      }
      this.rows = res.results;
      this.page.totalElements = res.count;
      this.page.totalPages = Math.ceil(this.page.totalElements / this.page.size);
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

  filterSearch(e){
    if(e){
      this.page.pageNumber = 0;
      this.page.size = 100;
      this.searchParam = e.target.value;
      this.getList();
    }
  }


  modalHide() {
    this.modalRef.hide();
    this.deviceLifecycleDetails = [];
    this.deviceObj = null;
  }

  openModal(item, template: TemplateRef<any>) {
    this.searchParam = '';
    this.deviceObj = item;
    this.pageLifeCycle.pageNumber = 0;
    this.pageLifeCycle.size = 100;
    this.modalRef = this.modalService.show(template, this.modalConfig);
    this.getDeviceLifeCycle();
  }


  getDeviceLifeCycle() {
    this.loadingIndicator = true;
    const obj = {
      limit: this.pageLifeCycle.size,
      page: this.pageLifeCycle.pageNumber + 1,
      search_param: this.searchParam,
      device_id: this.deviceObj.id,
    };
    this._service.get("stock/device-traversal-history", obj).subscribe(
      (res) => {
        if (!res) {
          this.toastr.error(res.Message, "Error!", {
            closeButton: true,
            disableTimeOut: true,
          });
          return;
        }
        // this.tempRows = res;
        this.deviceLifecycleDetails = res.results;
        this.pageLifeCycle.totalElements = res.count;
        this.pageLifeCycle.totalPages = Math.ceil(
          this.pageLifeCycle.totalElements / this.pageLifeCycle.size
        );
        setTimeout(() => {
          this.loadingIndicator = false;
        }, 1000);
      },
      (err) => {
        this.toastr.error(err.Msg || err, "Error!", {
          closeButton: true,
          disableTimeOut: true,
        });
        setTimeout(() => {
          this.loadingIndicator = false;
        }, 1000);
      }
    );
  }


}
