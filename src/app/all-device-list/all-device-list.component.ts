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

  searchParam = '';
  tabType = "Available";
  status = 1;
  stock = null;
  constructor(
    private confirmService: ConfirmService,
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
    this.getDeviceStockData();
    this.getList();
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


changeTab(type, e) {
  this.searchParam = "";
  this.page.pageNumber = 0;
  this.page.size = 10;


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
      this.page.size = 10;
      this.searchParam = e.target.value;
      this.getList();
    }
  }

}
