import { Component, TemplateRef, ViewChild, ElementRef, ViewEncapsulation, OnInit } from '@angular/core';
import { ColumnMode,SelectionType,DatatableComponent } from '@swimlane/ngx-datatable';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { Router } from '@angular/router';
import { CommonService } from '../_services/common.service';
import { ToastrService } from 'ngx-toastr';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { Page } from '../_models/page';
import { StockStatus,ReissuanceStatus,PaymentType } from '../_models/enums';
import { ConfirmService } from '../_helpers/confirm-dialog/confirm.service';

import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Subject, Observable, of, concat } from 'rxjs';
import { distinctUntilChanged, debounceTime, switchMap, tap, catchError, filter, map } from 'rxjs/operators';

@Component({
  selector: 'app-customer-balance-list',
  templateUrl: './customer-balance-list.component.html',
  encapsulation: ViewEncapsulation.None
})

export class CustomerBalanceListComponent implements OnInit {

  entryForm: FormGroup;
  submitted = false;
  @BlockUI() blockUI: NgBlockUI;
  modalTitle = 'Load Customer Balance';
  btnSaveText = 'Save';
  StockStatus = StockStatus;
  ReissuanceStatus = ReissuanceStatus;
  PaymentType = PaymentType;
  page = new Page();
  pageCustomer = new Page();
  emptyGuid = '00000000-0000-0000-0000-000000000000';
  rows = [];
  tempRows = [];
  customerList = [];
  wholesalerList = [];
  retailerList = [];
  loadingIndicator = false;
  ColumnMode = ColumnMode;
  SelectionType = SelectionType;
  scrollBarHorizontal = (window.innerWidth < 1200);
  @ViewChild(DatatableComponent, { static: false }) table: DatatableComponent;
  @ViewChild(DatatableComponent, { static: false }) tableWholesaler: DatatableComponent;
  @ViewChild(DatatableComponent, { static: false }) tableRetailer: DatatableComponent;
  isbuttonActive = true;
  activeTable = 0;
  modalConfig: any = { class: 'gray modal-lg', backdrop: 'static' };
  modalConfigLg: any = { class: 'gray modal-lg', backdrop: 'static' };
  modalRef: BsModalRef;
  balanceDetails : any = {};
  item;

  searchParamAll = '';
  searchParamWholesaler = '';
  searchParamRetailer = '';


  // for customer
  selectedCustomer = null;
  customers = [];
  customersBuffer = [];
  bufferSize = 50;
  numberOfItemsFromEndBeforeFetchingMore = 10;
  loading = false;
  count=1;
  searchParam = '';
  input$ = new Subject<string>();

  paymentMethodList = [{"id":1,"name":"CASH"},{"id":3,"name":"CARD_PAYMENT"},{"id":4,"name":"ONLINE_BANKING"}]

  constructor(
    private modalService: BsModalService,
    private confirmService: ConfirmService,
    public formBuilder: FormBuilder,
    private http: HttpClient,
    private _service: CommonService,
    private toastr: ToastrService,
    private router: Router
  ) {
    this.pageCustomer.pageNumber = 1;
    this.pageCustomer.size = 50;

    this.page.pageNumber = 0;
    this.page.size = 10;
    window.onresize = () => {
      this.scrollBarHorizontal = (window.innerWidth < 1200);
    };
  }


  ngOnInit() {
    this.entryForm = this.formBuilder.group({
      customer: [null, [Validators.required]],
      amount: [null, [Validators.required]],
      payment_method: [null, [Validators.required]]

    });
    this.getCustomer();
    this.onSearch();

    this.getList();
  }


  get f() {
    return this.entryForm.controls;
  }


  setPageAll(pageInfo) {
    this.page.pageNumber = pageInfo.offset;
    this.getList();
  }
  setPageWholesaler(pageInfo) {
    this.page.pageNumber = pageInfo.offset;
    this.getWholesalerList();
  }
  setPageRetailer(pageInfo) {
    this.page.pageNumber = pageInfo.offset;
    this.getRetailerList();
  }

  // customSearchFn(term: string, item: any) {
  //   term = term.toLocaleLowerCase();
  //   let name = item.first_name +" "+item.last_name;
  //   return item.customer_code.toLocaleLowerCase().indexOf(term) > -1 ||
  //          name.toLocaleLowerCase().indexOf(term) > -1 ||
  //          item.first_name.toLocaleLowerCase().indexOf(term) > -1 ||
  //          item.last_name.toLocaleLowerCase().indexOf(term) > -1 ||
  //          item.mobile.toLocaleLowerCase().indexOf(term) > -1;
  //   }


  showCustomerTable(id){
    this.isbuttonActive = false;
    switch (id) {
      case 0:
        this.searchParamAll = '';
        this.page.pageNumber = 0;
        this.page.size = 10;
        this.getList();
        break;
      case 1:
        this.searchParamWholesaler = '';
        this.page.pageNumber = 0;
        this.page.size = 10;
        this.getWholesalerList();
        break;
      case 2:
        this.searchParamRetailer = '';
        this.page.pageNumber = 0;
        this.page.size = 10;
        this.getRetailerList();
        break;

    }
  }
  getList() {
    this.loadingIndicator = true;
    const obj = {
      limit: this.page.size,
      page: this.page.pageNumber + 1,
      search_param:this.searchParamAll
    };

    this._service.get('get-customer-list-with-balance',obj).subscribe(res => {
      this.activeTable = 0;
      this.customerList = res.results;
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

  getWholesalerList() {
    this.loadingIndicator = true;
    const obj = {
      limit: this.page.size,
      page: this.page.pageNumber + 1,
      search_param:this.searchParamWholesaler
    };
    this._service.get('get-wholesaler-list-with-balance',obj).subscribe(res => {
      if (!res) {
        this.toastr.error(res.Message, 'Error!', { timeOut: 2000 });
        return;
      }
      this.activeTable = 1;
    //  this.tempRows = res;
      this.wholesalerList = res.results;
      this.page.totalElements = res.count;
      this.page.totalPages = Math.ceil(this.page.totalElements / this.page.size);
      setTimeout(() => {
        this.loadingIndicator = false;
      }, 1000);
    }, err => {
      this.toastr.error(err.Msg || err, 'Error!', { timeOut: 2000 });
      setTimeout(() => {
        this.loadingIndicator = false;
      }, 1000);
    }
    );
  }

  getRetailerList() {
    const obj = {
      limit: this.page.size,
      page: this.page.pageNumber + 1,
      search_param:this.searchParamRetailer
    };
    this.loadingIndicator = true;
    this._service.get('get-retailer-list-with-balance',obj).subscribe(res => {
      if (!res) {
        this.toastr.error(res.Message, 'Error!', { timeOut: 2000 });
        return;
      }
      this.activeTable = 2;
     // this.tempRows = res;
      this.retailerList = res.results;
      this.page.totalElements = res.count;
      this.page.totalPages = Math.ceil(this.page.totalElements / this.page.size);
      setTimeout(() => {
        this.loadingIndicator = false;
      }, 1000);
    }, err => {
      this.toastr.error(err.Msg || err, 'Error!', { timeOut: 2000 });
      setTimeout(() => {
        this.loadingIndicator = false;
      }, 1000);
    }
    );
  }

  getBalanceDetails(row,template: TemplateRef<any>){
    this.item = row;
    this._service.get('get-customer-balance-loading-history/'+row.id).subscribe(res => {
      this.balanceDetails = res;
      console.log(this.balanceDetails);
      this.modalRef = this.modalService.show(template, this.modalConfigLg);
    }, err => {}
    );
  }




  onFormSubmit() {
    this.submitted = true;
    if (this.entryForm.invalid) {
      return;
    }

    this.blockUI.start('Saving...');
    const obj = {
      customer: this.entryForm.controls['customer'].value,
      paid_amount: Number(this.entryForm.value.amount),
      payment_method: this.entryForm.controls['payment_method'].value
    };

    this._service.post('load-customer-balance', obj).subscribe(
      data => {
        this.blockUI.stop();
        if (data.IsReport == "Success") {
          this.toastr.success(data.Msg, 'Success!', { timeOut: 2000 });
          this.modalHide();
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


  updateFilter(e) {
    if(e){
      this.page.pageNumber = 0;
      this.page.size = 10;
      this.searchParamAll = e.target.value;
      this.getList();
    }

    // const val = event.target.value.toLowerCase();

    // // filter our data
    // const temp = this.tempRows.filter(function (d) {
    //   return d.first_name.toLowerCase().indexOf(val) !== -1 ||
    //          d.last_name.toLowerCase().indexOf(val) !== -1 ||
    //          d.customer_code.toLowerCase().indexOf(val) !== -1 ||
    //          d.mobile.indexOf(val) !== -1 ||
    //     !val;
    // });

    // // update the rows
    // this.rows = temp;
    // // Whenever the filter changes, always go back to the first page
    // this.table.offset = 0;
  }

  updateFilterWholesaler(e) {
    if(e){
      this.page.pageNumber = 0;
      this.page.size = 10;
      this.searchParamWholesaler = e.target.value;
      this.getWholesalerList();
    }
    // const val = event.target.value.toLowerCase();

    // // filter our data
    // const temp = this.tempRows.filter(function (d) {
    //   return d.first_name.toLowerCase().indexOf(val) !== -1 ||
    //          d.last_name.toLowerCase().indexOf(val) !== -1 ||
    //          d.customer_code.toLowerCase().indexOf(val) !== -1 ||
    //          d.mobile.indexOf(val) !== -1 ||
    //     !val;
    // });

    // // update the rows
    // this.wholesalerList = temp;
    // // Whenever the filter changes, always go back to the first page
    // this.tableWholesaler.offset = 0;
  }

  updateFilterRetailer(e) {
    if(e){
      this.page.pageNumber = 0;
      this.page.size = 10;
      this.searchParamRetailer = e.target.value;
      this.getRetailerList();
    }
    // const val = event.target.value.toLowerCase();

    // // filter our data
    // const temp = this.tempRows.filter(function (d) {
    //   return d.first_name.toLowerCase().indexOf(val) !== -1 ||
    //          d.last_name.toLowerCase().indexOf(val) !== -1 ||
    //          d.customer_code.toLowerCase().indexOf(val) !== -1 ||
    //          d.mobile.indexOf(val) !== -1 ||
    //     !val;
    // });

    // // update the rows
    // this.retailerList = temp;
    // // Whenever the filter changes, always go back to the first page
    // this.tableRetailer.offset = 0;

  }



  modalHide() {
    this.entryForm.reset();
    this.entryForm.controls['customer'].enable();
    this.modalRef.hide();
    this.submitted = false;
  }

  openModal(template: TemplateRef<any>) {
    this.getCustomer();
    this.modalRef = this.modalService.show(template, this.modalConfig);
  }

  openModalRow(item,template: TemplateRef<any>) {

    this.entryForm.controls['customer'].setValue(item.id);
    this.entryForm.controls['customer'].disable();
    this.modalRef = this.modalService.show(template, this.modalConfig);
  }

  modalHideBalance() {
    this.modalRef.hide();
    this.item = null;
  }










  onSearch() {
    this.input$.pipe(
      debounceTime(200),
      distinctUntilChanged(),
      switchMap(term => this.fakeServiceCustomer(term))
    ).subscribe((data : any) => {
      this.customers = data.results;
      this.pageCustomer.totalElements = data.count;
      this.pageCustomer.totalPages = Math.ceil(this.pageCustomer.totalElements / this.pageCustomer.size);
      this.customersBuffer = this.customers.slice(0, this.bufferSize);
      })
  }

  onCustomerChange(e){
    if(e){
      this.selectedCustomer = e;
    }else{
      this.selectedCustomer = null;
    }
  }

onScrollToEnd() {
      this.fetchMore();
  }

onScroll({ end }) {
    if (this.loading || this.customers.length <= this.customersBuffer.length) {
        return;
    }

    if (end + this.numberOfItemsFromEndBeforeFetchingMore >= this.customersBuffer.length) {
        this.fetchMore();
    }
}

private fetchMore() {

    let more;
   // const len = this.customersBuffer.length;
    if(this.count < this.pageCustomer.totalPages){
    this.count++;
    this.pageCustomer.pageNumber = this.count;
    let obj;
    if(this.searchParam){
       obj = {
        limit: this.pageCustomer.size,
        page: this.pageCustomer.pageNumber,
        search_param:this.searchParam
      };
    }else{
       obj = {
        limit: this.pageCustomer.size,
        page: this.pageCustomer.pageNumber
      };
    }
      this._service.get("get-customer-list",obj).subscribe(
        (res) => {
          more = res.results;
          //  const more = this.customers.slice(len, this.bufferSize + len);
          this.loading = true;
          // using timeout here to simulate backend API delay
          setTimeout(() => {
              this.loading = false;
              this.customersBuffer = this.customersBuffer.concat(more);
          }, 100)
        },
        (err) => {}
      );
    }

}


getCustomer(){
  let obj;
  if(this.searchParam){
     obj = {
      limit: this.pageCustomer.size,
      page: this.pageCustomer.pageNumber,
      search_param:this.searchParam
    };
  }else{
     obj = {
      limit: this.pageCustomer.size,
      page: this.pageCustomer.pageNumber
    };
  }

  this._service.get("get-customer-list",obj).subscribe(
    (res) => {
      this.customers = res.results;
      this.pageCustomer.totalElements = res.count;
      this.pageCustomer.totalPages = Math.ceil(this.pageCustomer.totalElements / this.pageCustomer.size);
      this.customersBuffer = this.customers.slice(0, this.bufferSize);
    },
    (err) => {}
  );
}

private fakeServiceCustomer(term) {

  this.pageCustomer.size = 50;
  this.pageCustomer.pageNumber = 1;
  this.searchParam = term;

  let obj;
  if(this.searchParam){
     obj = {
      limit: this.pageCustomer.size,
      page: this.pageCustomer.pageNumber,
      search_param:this.searchParam
    };
  }else{
     obj = {
      limit: this.pageCustomer.size,
      page: this.pageCustomer.pageNumber
    };
  }

  let params = new HttpParams();
  if (obj) {
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        params = params.append(key, obj[key]);
      }
    }
  }
  return this.http.get<any>(environment.apiUrl + 'get-customer-list', { params }).pipe(
    map(res => {
      return res;
    })
  );
}


}
