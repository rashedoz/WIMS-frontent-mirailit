import { Component, TemplateRef, ViewChild, ElementRef, ViewEncapsulation, OnInit } from '@angular/core';
import { ColumnMode,DatatableComponent } from '@swimlane/ngx-datatable';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonService } from '../_services/common.service';
import { ToastrService } from 'ngx-toastr';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { Page } from '../_models/page';
import { BillStatus, StockStatus } from '../_models/enums';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
// import { jsPDF } from "jspdf";
// import 'jspdf-autotable';
import { DatePipe } from '@angular/common';

import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Subject, Observable, of, concat } from 'rxjs';
import { distinctUntilChanged, debounceTime, switchMap, tap, catchError, filter, map } from 'rxjs/operators';

@Component({
  selector: 'app-customer-details',
  templateUrl: './customer-details.component.html',
  encapsulation: ViewEncapsulation.None
})

export class CustomerDetailsComponent implements OnInit {

  entryForm: FormGroup;
  submitted = false;
  @BlockUI() blockUI: NgBlockUI;

  StockStatus = StockStatus;
  page = new Page();
  pageTable = new Page();
  emptyGuid = '00000000-0000-0000-0000-000000000000';
  rows = [];
  tempRows = [];
  columnsWithSearch : string[] = [];
  loadingIndicator = false;
  iccidHistory:any = null;
  ColumnMode = ColumnMode;
  scrollBarHorizontal = (window.innerWidth < 1200);
  @ViewChild(DatatableComponent, { static: false }) table: DatatableComponent;
  modalConfig: any = { class: 'gray modal-md', backdrop: 'static' };
  modalRef: BsModalRef;
  modalRefICCID: BsModalRef;
  simLifecycleDetails : Array<any> = [];
  url = 'subscription/get-subscription-type-bills-by-customerid/';
  billStatus = BillStatus;
  searchParam = '';

  // for customer
  selectedCustomer = null;
  customers = [];
  customersBuffer = [];
  bufferSize = 50;
  numberOfItemsFromEndBeforeFetchingMore = 10;
  loading = false;
  count=1;
  input$ = new Subject<string>();

  newTotal: number = 0;
  subTotal: number = 0;
  discount: number = 0;
  paidAmount: number = 0;
  tempPaidAmount: number = 0;
  remarks = null;
  billItem;
  balanceObj;
  balance: number = 0;
  isPayBalanceEnableShow = false;
  isPayBalanceEnable = false;
  pageType = null;
  btnSaveText = "Save";
  // fontSizes: any = {
  //   HeadTitleFontSize: 18,
  //   Head2TitleFontSize: 16,
  //   TitleFontSize: 14,
  //   SubTitleFontSize: 12,
  //   NormalFontSize: 10,
  //   SmallFontSize: 8
  // };

  // lineSpacing: any = {
  //   NormalSpacing: 12
  // };


  paymentMethodList = [{id:1,name:'CASH'},{id:2,name:'FROM BALANCE'},{id:3,name:'CARD PAYMENT'},{id:4,name:'ONLINE BANKING'}]
  methodList = [];
  selectedMethod = {id:1,name:'CASH'};
  isbalanceDeduct = false;


  constructor(
    public formBuilder: FormBuilder,
    private _service: CommonService,
    private toastr: ToastrService,
    public datepipe: DatePipe,
    private http: HttpClient,
    private modalService: BsModalService,
    private router: Router
  ) {

    this.page.pageNumber = 1;
    this.page.size = 50;

    this.pageTable.pageNumber = 0;
    this.pageTable.size = 10;

    window.onresize = () => {
      this.scrollBarHorizontal = (window.innerWidth < 1200);
    };
  }


  ngOnInit() {
    this.getCustomer();
    this.onSearch();
  }


  onSearch() {
    this.input$.pipe(
      debounceTime(200),
      distinctUntilChanged(),
      switchMap(term => this.fakeServiceCustomer(term))
    ).subscribe((data : any) => {
      this.customers = data.results;
      this.page.totalElements = data.count;
      this.page.totalPages = Math.ceil(this.page.totalElements / this.page.size);
      this.customersBuffer = this.customers.slice(0, this.bufferSize);
      })
  }

  onCustomerChange(e){
    if(e){
      this.selectedCustomer = e;
      this.getList();
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
    if(this.count <= this.page.totalPages){
    this.count++;
    this.page.pageNumber = this.count;
    let obj;
    if(this.searchParam){
       obj = {
        limit: this.page.size,
        page: this.page.pageNumber,
        search_param:this.searchParam
      };
    }else{
       obj = {
        limit: this.page.size,
        page: this.page.pageNumber
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
          }, 200)
        },
        (err) => {}
      );
    }

}


getCustomer(){
  let obj;
  if(this.searchParam){
     obj = {
      limit: this.page.size,
      page: this.page.pageNumber,
      search_param:this.searchParam
    };
  }else{
     obj = {
      limit: this.page.size,
      page: this.page.pageNumber
    };
  }

  this._service.get("get-customer-list",obj).subscribe(
    (res) => {
      this.customers = res.results;
      this.page.totalElements = res.count;
      this.page.totalPages = Math.ceil(this.page.totalElements / this.page.size);
      this.customersBuffer = this.customers.slice(0, this.bufferSize);
    },
    (err) => {}
  );
}

private fakeServiceCustomer(term) {

  this.page.size = 50;
  this.page.pageNumber = 1;
  this.searchParam = term;

  let obj;
  if(this.searchParam){
     obj = {
      limit: this.page.size,
      page: this.page.pageNumber,
      search_param:this.searchParam
    };
  }else{
     obj = {
      limit: this.page.size,
      page: this.page.pageNumber
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


  // 'Available', 'Subscribed', 'Cancelled', 'Permanently Cancelled'

  changeTab(type,e) {

   // this.searchParam = '';
    this.pageTable.pageNumber = 0;
    this.pageTable.size = 10;

    switch (type) {
      case 'Subscription Bill':
        this.url = 'subscription/get-subscription-type-bills-by-customerid/';
        this.getList();
        break;
      case 'Device Bill':
        this.url = 'subscription/get-device-type-bills-by-customerid/';
     this.getList();
        break;
      default:
        this.url = 'subscription/get-subscription-type-bills-by-customerid/';
        this.getList();
        break;
      }

 }


  setPage(pageInfo) {
    this.pageTable.pageNumber = pageInfo.offset;
    this.getList();
  }

  getList() {
    this.loadingIndicator = true;
    const obj = {
      limit: this.pageTable.size,
      page: this.pageTable.pageNumber + 1
    };
    this._service.get(this.url+this.selectedCustomer.id,obj).subscribe(res => {

      if (!res) {
        this.toastr.error(res.Message, 'Error!', { closeButton: true, disableTimeOut: true });
        return;
      }
     // this.tempRows = res;
      this.rows =  res.results.filter(x=> x.status != 4);
      this.pageTable.totalElements = res.count;
      this.pageTable.totalPages = Math.ceil(this.pageTable.totalElements / this.pageTable.size);
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


  onFormSubmit() {
    this.submitted = true;



    if (Number(this.paidAmount) == 0) {
      this.toastr.warning("Paid amount can't be empty", 'Warning!', { timeOut: 4000 });
      return;
    }


    if (Number(this.paidAmount) > this.newTotal) {
      this.toastr.warning("Paid amount can't be greater then payable amount!", 'Warning!', { timeOut: 4000 });
      return;
    }

   this.blockUI.start('Saving...');
    const obj = {
      customer: this.billItem.customer_id,
      bill: this.billItem.id,
      transaction_type: "Payment In",
      payment_method: this.selectedMethod.id,
      session: this.billItem.session,
      discount: 0,//Number(this.discount),
      paid_amount: Number(this.paidAmount),
      refund_amount: 0,
      due: 0,
      balance: 0,
      remarks: this.remarks
    };

    this._service.post('payment/save-payment', obj).subscribe(
      data => {
        this.blockUI.stop();
        if (data.IsReport == "Success") {
          this.toastr.success(data.Msg, 'Success!', { closeButton: true, disableTimeOut: true });
          this.modalHide();
          this.getList();
        } else if (data.IsReport == "Warning") {
          this.toastr.warning(data.Msg, 'Warning!', { closeButton: true, disableTimeOut: true });
        } else {
          this.toastr.error(data.Msg, 'Error!', { closeButton: true, disableTimeOut: true });
        }
      },
      err => {
        this.blockUI.stop();
        this.toastr.error(err.Message || err, 'Error!', { timeOut: 2000 });
      }
    );

  }

  // filterSearch(e){
  //   if(e){
  //     this.pageTable.pageNumber = 0;
  //     this.pageTable.size = 10;
  //     this.searchParam = e.target.value;
  //     this.getList();
  //   }
  // }

  inputFocused(event: any){
    event.target.select()
  }

  onChangePaid(value) {
    if (parseFloat(value) > this.newTotal) {
      this.toastr.warning("Paid amount can't be greater then payable amount!", 'Warning!', { timeOut: 4000 });
      return;
    }
  }



  onChangePayBalance(e) {
    this.isPayBalanceEnable = e.id == 2 ? true : false;
    let net = Number(this.newTotal); // - Number(this.discount);
    if (this.isPayBalanceEnable) {
      this.isbalanceDeduct = true;
      if (Number(this.balanceObj.balance) > net) {
        this.paidAmount = net;
        this.tempPaidAmount = net;
      } else if (Number(this.balanceObj.balance) <= net) {
        this.tempPaidAmount = Number(this.balanceObj.balance);
        this.paidAmount = Number(this.balanceObj.balance);
      }
    } else {
      this.paidAmount = 0;
      if(this.isbalanceDeduct){
        this.tempPaidAmount = 0;
        this.balance = Number(this.balanceObj.balance);
      }

      this.isbalanceDeduct = false;
    }
  }



  modalHide() {
    this.modalRef.hide();
    this.submitted = false;
    this.btnSaveText = 'Save';
    this.billItem = {};
    this.newTotal = 0;
    this.subTotal = 0;
    this.discount = 0;
    this.paidAmount = 0;
    this.tempPaidAmount = 0;
    this.balance = 0;
    this.remarks = null;
    this.selectedMethod = null;
    this.isPayBalanceEnableShow = false;
    this.isPayBalanceEnable = false;
  }

  openModal(row, template: TemplateRef<any>) {
    this.selectedMethod = {id:1,name:'CASH'};
    this.subTotal = row.payable_amount;
    this.billItem = row;
    let so_far_paid = Number(this.billItem.so_far_paid) - Number(this.billItem.parent_refund_amount);
    this.newTotal = Number(this.subTotal) - so_far_paid;
    //  this.discount = row.discount;
    this._service.get('get-customer-current-balance/' + row.customer_id).subscribe(
      res => {
        this.balanceObj = res;
        this.balance = res.balance;
        if (Number(this.balanceObj.balance) == 0) {
          this.isPayBalanceEnableShow = false;
          this.methodList = this.paymentMethodList.filter(x => x.id !== 2);
        }else {
          this.methodList = this.paymentMethodList;
        }
      },
      err => { }
    );

    this.modalRef = this.modalService.show(template, this.modalConfig);

  }





}
