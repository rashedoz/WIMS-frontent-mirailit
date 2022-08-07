import { Component, TemplateRef, ViewChild, ElementRef, ViewEncapsulation, OnInit } from '@angular/core';
import { ColumnMode,DatatableComponent } from '@swimlane/ngx-datatable';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonService } from '../_services/common.service';
import { ToastrService } from 'ngx-toastr';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { Page } from '../_models/page';
import { BillStatus, StockStatus } from '../_models/enums';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
// import { jsPDF } from "jspdf";
// import 'jspdf-autotable';
import { DatePipe } from '@angular/common';
import { SubscriptionStatus,SubsItemsStaus,PaymentType,StatusTypes,SIMAndDeviceStatus } from '../_models/enums';
import { TabsetComponent } from 'ngx-bootstrap/tabs';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Subject, Observable, of, concat } from 'rxjs';
import { distinctUntilChanged, debounceTime, switchMap, tap, catchError, filter, map } from 'rxjs/operators';
import { ConfirmService } from '../_helpers/confirm-dialog/confirm.service';
import { PrintService } from '../_services/print.service';
import * as moment from 'moment';
import { BsDatepickerConfig, BsDaterangepickerConfig } from "ngx-bootstrap/datepicker";

@Component({
  selector: 'app-customer-details',
  templateUrl: './customer-details.component.html',
  styleUrls: ['./customer-details.component.css'],
  encapsulation: ViewEncapsulation.None
})

export class CustomerDetailsComponent implements OnInit {

  entryForm: FormGroup;
  receiveSIMForm: FormGroup;
  balanceLoadForm: FormGroup;
  submitted = false;
  @BlockUI() blockUI: NgBlockUI;
  SubscriptionStatus = SubscriptionStatus;
  StatusTypes = StatusTypes;
  StockStatus = StockStatus;
  SIMAndDeviceStatus = SIMAndDeviceStatus;
  PaymentType = PaymentType;
  page = new Page();
  pageTable = new Page();
  emptyGuid = '00000000-0000-0000-0000-000000000000';
  rows:any[] = [];
  tempRows = [];
  columnsWithSearch : string[] = [];
  loadingIndicator = false;
  iccidHistory:any = null;
  ColumnMode = ColumnMode;
  scrollBarHorizontal = (window.innerWidth < 1200);
  @ViewChild(DatatableComponent, { static: false }) table: DatatableComponent;
  @ViewChild('profileTabs', { static: false }) profileTabs?: TabsetComponent;
  modalConfig: any = { class: 'gray modal-md', backdrop: 'static' };
  modalRef: BsModalRef;
  modalRefICCID: BsModalRef;
  simLifecycleDetails : Array<any> = [];
  url = 'get-user-detail/';
  billStatus = BillStatus;
  searchParam = '';
  customer_id;
  customerObj = null;
  customerSIMDeviceCount = null;
  bsConfig: Partial<BsDaterangepickerConfig>;
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

  date = new Date();
  firstDay = new Date(this.date.getFullYear(), this.date.getMonth(), 1);
  lastDay = new Date(this.date.getFullYear(), this.date.getMonth() + 1, 0);

  paymentMethodList = [{id:1,name:'CASH'},{id:2,name:'FROM BALANCE'},{id:3,name:'CARD PAYMENT'},{id:4,name:'ONLINE BANKING'}]
  methodList = [];
  selectedMethod = {id:1,name:'CASH'};
  isbalanceDeduct = false;


  currentTab = 'Bills Items';
  subscriptionHistoryList = [];
  balanceHistoryList = [];
  @ViewChild('tablePaymentDetailsList', { static: false }) tablePaymentDetailsList: any;
  @ViewChild('tableDeviceSalesHistory', { static: false }) tableDeviceSalesHistory: any;
  @ViewChild('billItemsDetailTabs', { static: false }) billItemsDetailTabs: any;
  @ViewChild('billDetailTabs', { static: false }) billDetailTabs: any;

  rowItems = [];
  methodListWithoutFrom = [{"id":1,"name":"CASH"},{"id":3,"name":"CARD_PAYMENT"},{"id":4,"name":"ONLINE_BANKING"}]
  billItemDetailList = [];
  billDetailList = [];
  paymentDetailList = [];
  deviceSalesList = [];

  activeDeviceCount = 0;

  billType = 'Unpaid';
  billItemType = 'All Items';
  simBillItemStatus = null;
  deviceBillItemStatus = null;
  simObj = null;
  bsBillItemRangeValue: Date[];
  bsBillDetailsRangeValue: Date[];
  bsPaymentRangeValue: Date[];




  constructor(
    private confirmService: ConfirmService,
    public formBuilder: FormBuilder,
    private _service: CommonService,
    private toastr: ToastrService,
    public datepipe: DatePipe,
    private http: HttpClient,
    private modalService: BsModalService,
    private router: Router,
    private route: ActivatedRoute,
    public printService: PrintService
  ) {

    this.page.pageNumber = 1;
    this.page.size = 50;

    this.pageTable.pageNumber = 0;
    this.pageTable.size = 10;

    this.customer_id = this.route.snapshot.params['id'];

    window.onresize = () => {
      this.scrollBarHorizontal = (window.innerWidth < 1200);
    };
    // this.bsPaymentRangeValue = [];
     // console.log([this.firstDay,this.lastDay]);
  }



  ngOnInit() {

    this.bsConfig = Object.assign(

      {

        rangeInputFormat: 'DD/MM/YYYY',
        adaptivePosition: true,
        showClearButton: true,
        clearPosition: 'right'
      }
    );

    this.bsBillItemRangeValue = [this.firstDay,this.lastDay];

    if(this.customer_id){
      this.getCustomer();
      this.getCustomerSIMDeviceCount();
    }

    this.url = 'bill/customer-billing-items';
    this.getBillItemListWithPagination();

    this.balanceLoadForm = this.formBuilder.group({
      amount: [null, [Validators.required]],
      payment_method: [null, [Validators.required]]
    });

    this.receiveSIMForm = this.formBuilder.group({
      id: [null, [Validators.required]],
      ICCID_no: [null, [Validators.required]],
    });

  }

  get rs() {
    return this.receiveSIMForm.controls;
  }
  get b() {
    return this.balanceLoadForm.controls;
  }

  newPrint(id){
    this.printService.printInv(id);
  }

getCustomer(){
 // this.blockUI.start('Getting Data...');
  this._service.get(this.url+this.customer_id).subscribe(
    (res) => {
      this.customerObj = res;
    //  this.blockUI.stop();
    },
    (err) => {
      //this.blockUI.stop();
    }
  );
}

getCustomerSIMDeviceCount(){
 // this.blockUI.start('Getting Data...');
  this._service.get('bill/customer-sim-and-device-counts/'+this.customer_id).subscribe(
    (res) => {
      this.customerSIMDeviceCount = res;
    //  this.blockUI.stop();
    },
    (err) => {
      //this.blockUI.stop();
    }
  );
}

selectTab(tabId: number) {
  if (this.profileTabs?.tabs[tabId]) {
    this.profileTabs.tabs[tabId].active = true;
  }
}

  // 'Available', 'Subscribed', 'Cancelled', 'Permanently Cancelled'

  changeTab(type,e) {


    this.bsBillDetailsRangeValue = [this.firstDay,this.lastDay];
    this.bsPaymentRangeValue = [this.firstDay,this.lastDay];
   // this.searchParam = '';
    this.pageTable.pageNumber = 0;
    this.pageTable.size = 10;
    this.currentTab = type;
    this.searchParam = '';
    this.rowItems = [];
    switch (type) {
      case 'Bills Items':
      this.url = 'bill/customer-billing-items';
      this.billItemType = 'All Items';
      this.getBillItemListWithPagination();
       this.billItemsDetailTabs.tabs[0].active = true;
        break;
      case 'Bills Details':
        this.url = 'bill/get-bill-list';
        this.billType = 'Unpaid';
        this.getBillDetailsListWithPagination();
        this.billDetailTabs.tabs[0].active = true;
        break;
      case 'Payment Details':
        this.url = 'payment/get-payment-list';
     this.getListWithPagination();
        break;
      // case 'Balance':
      //   this.url = 'get-user-detail/';
      //   this.getCustomer();
      //   break;
      case 'Balance':
        this.url = 'get-customer-balance-loading-history/';
        this.getBalanceLoadList();
        break;
      case 'Basic Details':
          this.url = 'get-user-detail/';
          this.getCustomer();
          break;
      default:
        this.url = 'get-user-detail/';
        this.getCustomer();
        break;
      }
 }

 changeTabBillDetailsItem(type,e) {
  this.bsBillDetailsRangeValue = [this.firstDay,this.lastDay];
   this.searchParam = '';
   this.pageTable.pageNumber = 0;
   this.pageTable.size = 10;
   switch (type) {
     case 'Unpaid':
       this.url = 'bill/get-bill-list';
       this.billType = type;
       this.getBillDetailsListWithPagination();

       break;
     case 'Partially Paid':
       this.url = 'bill/get-bill-list';
       this.billType = type;
       this.getBillDetailsListWithPagination();

       break;
     case 'Fully Paid':
      this.url = 'bill/get-bill-list';
      this.billType = type;
       this.getBillDetailsListWithPagination();

       break;

     default:
       this.billType = type;
       break;
     }

}


 changeTabBillItem(type,e) {

  this.bsBillItemRangeValue = [this.firstDay,this.lastDay];
   this.searchParam = '';
   this.pageTable.pageNumber = 0;
   this.pageTable.size = 10;
   this.simBillItemStatus = null;
   this.deviceBillItemStatus = null;

   switch (type) {
     case 'All Items':
       this.url = 'bill/customer-billing-items';
       this.getBillItemListWithPagination();
       this.billItemType = type;
       break;
     case 'Frozen SIMs':
       this.url = 'bill/customer-billing-items';
       this.simBillItemStatus = 2;
       this.getBillItemListWithPagination();
       this.billItemType = type;
       break;
     case 'Cancelled SIMs':
      this.url = 'bill/customer-billing-items';
       this.simBillItemStatus = 4;
       this.getBillItemListWithPagination();
       this.billItemType = type;
       break;
     case 'Reissued SIMs':
      this.url = 'bill/customer-billing-items';
      this.simBillItemStatus = 6;
      this.getBillItemListWithPagination();
      this.billItemType = type;
       break;
     case 'Cancelled Devices':
      this.deviceBillItemStatus = 4;
      this.url = 'bill/customer-billing-items';
      this.getBillItemListWithPagination();
       this.billItemType = type;
       break;
     default:
       this.billItemType = type;
       break;
     }

}

//  toggleExpandRow(row) {
//     this._service.get('subscription/get-subscription-detail/'+row.id).subscribe(res => {
//       row.details = res;
//     }, err => { });

//   this.tableSubscriptionHistory.rowDetail.toggleExpandRow(row);

//   }

  loadItems(row) {
    this._service.get('subscription/get-subscription-detail/'+row.id).subscribe(res => {
      this.rowItems = res;
    }, err => { });
  }

 toggleExpandRowDevice(row) {
    this._service.get('get-device-sales-detail-subscriptionid/'+row.id).subscribe(res => {
      row.details = res;
    }, err => { });

  this.tableDeviceSalesHistory.rowDetail.toggleExpandRowDevice(row);

  }

  onBillItemDateValueChange(e){
    if(e){
      this.bsBillItemRangeValue = [e[0],e[1]];
    }else{
      this.bsBillItemRangeValue = null
    }
    this.getBillItemListWithPagination();
  }

  onBillDetailsDateValueChange(e){
    if(e){
      this.bsBillDetailsRangeValue = [e[0],e[1]];
    }else{
      this.bsBillDetailsRangeValue = null
    }
    this.getBillDetailsListWithPagination();
  }

  onPaymentDetailsDateValueChange(e){
    if(e){
      this.bsPaymentRangeValue = [e[0],e[1]];
    }else{
      this.bsPaymentRangeValue = null;
    }
      this.getListWithPagination();

  }


  setPage(pageInfo) {
    this.pageTable.pageNumber = pageInfo.offset;
    this.getList();
  }

  setPageWithPagination(pageInfo) {
    this.pageTable.pageNumber = pageInfo.offset;
    this.getListWithPagination();
  }

  setBillItemPageWithPagination(pageInfo) {
    this.pageTable.pageNumber = pageInfo.offset;
    this.getBillItemListWithPagination();
  }

  setBillDetailsPageWithPagination(pageInfo) {
    this.pageTable.pageNumber = pageInfo.offset;
    this.getBillDetailsListWithPagination();
  }

  filterSearch(e){
    if(e){
      this.pageTable.pageNumber = 0;
      this.pageTable.size = 10;
      this.searchParam = e.target.value;
      this.getBillItemListWithPagination();
    }
  }

    filterBillDetailsSearch(e){
    if(e){
      this.pageTable.pageNumber = 0;
      this.pageTable.size = 10;
      this.searchParam = e.target.value;
      this.getBillDetailsListWithPagination();
    }
  }

  paymentCheck(row){

     this.confirmService.confirm('Are you sure?', 'You are confirming the payment.')
     .subscribe(
         result => {
             if (result) {
               const request = this._service.patch('payment/confirm-payment-receival/' + row.id, {});
               request.subscribe(
                 data => {

                   if (data.IsReport == "Success") {
                     this.toastr.success(data.Msg, 'Success!', { timeOut: 2000 });
                     this.getListWithPagination();
                   } else if (data.IsReport == "Warning") {
                     this.toastr.warning(data.Msg, 'Warning!', { closeButton: true, disableTimeOut: true });
                   } else {
                     this.toastr.error(data.Msg, 'Error!',  { closeButton: true, disableTimeOut: true });
                   }
                 },
                 err => {

                   this.toastr.error(err.Message || err, 'Error!', { closeButton: true, disableTimeOut: true });
                 }
               );
             }
         },
     );
  }

  getListWithPagination() {

    this.loadingIndicator = true;
    const obj:any = {
      customer_id : this.customer_id,
      limit: this.pageTable.size,
      page: this.pageTable.pageNumber + 1,
      search_param: this.searchParam
    };

    if(this.bsPaymentRangeValue){
      obj.payment_entry_start_date = moment(this.bsPaymentRangeValue[0]).format('YYYY-MM-DD'),
      obj.payment_entry_end_date = moment(this.bsPaymentRangeValue[1]).format('YYYY-MM-DD')
    }


    this._service.get(this.url,obj).subscribe(res => {

      if (!res) {
        this.toastr.error(res.Message, 'Error!', { closeButton: true, disableTimeOut: true });
        return;
      }
      this.paymentDetailList = res.results;
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

  getBillItemListWithPagination() {

    // const date = new Date();
    // const firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
    // const lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0);

    this.loadingIndicator = true;
    const obj:any ={
    customer_id : this.customer_id,
    // billing_start_date : moment(firstDay).format('YYYY-MM-D'),
    // billing_end_date : moment(lastDay).format('YYYY-MM-D'),
    limit : this.pageTable.size,
    page : this.pageTable.pageNumber + 1,
    search_param : this.searchParam
    }
    if(this.simBillItemStatus){
      obj.sim_status = this.simBillItemStatus;
    }

    if(this.deviceBillItemStatus){
      obj.device_status = this.deviceBillItemStatus;
    }

    if(this.bsBillItemRangeValue){
      obj.billing_start_date = moment(this.bsBillItemRangeValue[0]).format('YYYY-MM-DD'),
      obj.billing_end_date = moment(this.bsBillItemRangeValue[1]).format('YYYY-MM-DD')
    }


    this._service.get(this.url,obj).subscribe(res => {

      if (!res) {
        this.toastr.error(res.Message, 'Error!', { closeButton: true, disableTimeOut: true });
        return;
      }
      this.billItemDetailList = res.results;
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

  getBillDetailsListWithPagination() {

    // const date = new Date();
    // const firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
    // const lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0);

    let status = null;
    switch (this.billType) {
      case 'Unpaid':
        status = 1;
        break;

      case 'Partially Paid':
        status = 2;
        break;

      case 'Fully Paid':
        status = 3;
        break;

      default:
        break;
    }

    this.loadingIndicator = true;
    const obj:any ={
    customer_id : this.customer_id,
    payment_status : status,
    limit : this.pageTable.size,
    page : this.pageTable.pageNumber + 1,
    search_param : this.searchParam
    }

    if(this.bsBillDetailsRangeValue){
      obj.billing_start_date = moment(this.bsBillDetailsRangeValue[0]).format('YYYY-MM-DD'),
      obj.billing_end_date = moment(this.bsBillDetailsRangeValue[1]).format('YYYY-MM-DD')
    }

    this._service.get(this.url,obj).subscribe(res => {
      if (!res) {
        this.toastr.error(res.Message, 'Error!', { closeButton: true, disableTimeOut: true });
        return;
      }
      this.billDetailList = res.results;
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


  getBalanceLoadList() {

    this.loadingIndicator = true;
    // const obj = {
    //   limit: this.pageTable.size,
    //   page: this.pageTable.pageNumber + 1
    // };
    this._service.get(this.url+this.customer_id).subscribe(res => {

      if (!res) {
        this.toastr.error(res.Message, 'Error!', { closeButton: true, disableTimeOut: true });
        return;
      }
     // this.tempRows = res;
      this.balanceHistoryList =  res.balance_history;
      // this.pageTable.totalElements = res.count;
      // this.pageTable.totalPages = Math.ceil(this.pageTable.totalElements / this.pageTable.size);
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


  // openModalBalanceLoad(template: TemplateRef<any>) {
  //   this.modalRef = this.modalService.show(template, this.modalConfig);
  // }

  // modalHideBalanceLoad() {
  //   this.modalRef.hide();
  //   this.balanceLoadForm.reset();
  // }


  onBalanceLoadFormSubmit() {
    this.submitted = true;
    if (this.balanceLoadForm.invalid) {
      return;
    }

    this.blockUI.start('Saving...');
    const obj = {
      customer: this.customer_id,
      paid_amount: Number(this.balanceLoadForm.value.amount),
      payment_method: this.balanceLoadForm.value.payment_method
    };

    this._service.post('load-customer-balance', obj).subscribe(
      data => {
        this.blockUI.stop();
        if (data.IsReport == "Success") {
          this.toastr.success(data.Msg, 'Success!', { timeOut: 2000 });
          this.modalHideLoadBalance();

          // if(this.pageType == 'Balance'){
          //   this.url = 'get-user-detail/';
          //   this.getCustomer();
          // }else if(this.pageType == 'BalanceHistory'){
          //   this.url = 'get-customer-balance-loading-history/';
          //   this.getBalanceLoadList();
          // }

          this.url = 'get-customer-balance-loading-history/';
          this.getBalanceLoadList();

          setTimeout(() => {
            this.url = 'get-user-detail/';
            this.getCustomer();
          }, 500);

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


  getList() {

    this.loadingIndicator = true;
    // const obj = {
    //   limit: this.pageTable.size,
    //   page: this.pageTable.pageNumber + 1
    // };
    this._service.get(this.url+this.customer_id).subscribe(res => {

      if (!res) {
        this.toastr.error(res.Message, 'Error!', { closeButton: true, disableTimeOut: true });
        return;
      }
     // this.tempRows = res;
      this.rows =  res;
      // this.pageTable.totalElements = res.count;
      // this.pageTable.totalPages = Math.ceil(this.pageTable.totalElements / this.pageTable.size);
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

  filterSearchPaymentDetails(e){
    if(e){
      this.pageTable.pageNumber = 0;
      this.pageTable.size = 10;
      this.searchParam = e.target.value;
      this.url = 'payment/get-payment-list';
      this.getListWithPagination();
    }
  }

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

  modalHideSIMRecieve() {
    this.modalRef.hide();
    this.simObj = null;
    this.submitted = false;
    this.receiveSIMForm.reset();
  }

  openModalSIMRecieve(item, template: TemplateRef<any>) {
    this.simObj = item;
    this.receiveSIMForm.controls['id'].setValue(item.id);
    this.modalRef = this.modalService.show(template, this.modalConfig);
  }


  onSubmitSIMReceive(){
    this.submitted = true;
    if (this.receiveSIMForm.invalid) {
      return;
    }
    const obj = {
      ICCID_no:this.receiveSIMForm.value.ICCID_no.trim()
    };

    this.confirmService.confirm('Are you sure?', 'You are receiving this sim from mother company.')
    .subscribe(
        result => {
            if (result) {
              this.blockUI.start('Saving...');
              const request = this._service.patch('bill/receive-sim-from-mother-company/'+this.receiveSIMForm.value.id, obj);
              request.subscribe(
                data => {
                  this.blockUI.stop();
                  if (data.IsReport == "Success") {
                    this.toastr.success(data.Msg, 'Success!', { timeOut: 2000 });
                    this.modalHideSIMRecieve();
                    this.getBillItemListWithPagination();
                  } else if (data.IsReport == "Warning") {
                    this.toastr.warning(data.Msg, 'Warning!', { closeButton: true, disableTimeOut: true });
                  } else {
                    this.toastr.error(data.Msg, 'Error!',  { closeButton: true, disableTimeOut: true });
                  }
                },
                err => {
                  this.blockUI.stop();
                  this.toastr.error(err.Message || err, 'Error!', { closeButton: true, disableTimeOut: true });
                }
              );
            }
        },
    );
  }


  onSubmitAction(type,action,row){
    let url = '';
    let txt = '';
    if(type == 'sim'){
      switch (action) {
        case 'freeze':
          url = 'bill/freeze-unfreeze-billing-item/'+row.id;
          txt = 'You are going to freeze this sim.';
          break;
        case 'unfreeze':
          url = 'bill/freeze-unfreeze-billing-item/'+row.id;
          txt = 'You are going to unfreeze this sim.';
          break;
        case 'advance-cacellation':
          url = 'bill/cancel-billing-items-in-advance/'+row.id;
          txt = 'You are going to cancel this sim in advance. The sim will not appear next month.';
          break;
        case 'undo-cacellation':
          url = 'bill/undo-billing-items-cacellation/'+row.id;
          txt = 'You are reverting your decision.';
          break;
        case 'return':
          url = 'bill/return-sim-to-stock/'+row.id;
          txt = 'The sim will be added to your stock.';
          break;
        case 'reissue':
          url = 'bill/send-sim-for-reissuance/'+row.id;
          txt = 'You are sending this sim for reissuance.';
          break;
        case 'receive':
          url = 'bill/receive-sim-from-mother-company/'+row.id;
          txt = 'You are receiving this sim from mother company.';
          break;

        default:
          break;
      }
    }else{
      switch (action) {
        case 'return':
          url = 'bill/return-device-to-stock/'+row.id;
          txt = 'This device will be added to your stock.';
          break;

        default:
          break;
      }
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
                    this.getBillItemListWithPagination();
                  } else if (data.IsReport == "Warning") {
                    this.toastr.warning(data.Msg, 'Warning!', { closeButton: true, disableTimeOut: true });
                  } else {
                    this.toastr.error(data.Msg, 'Error!',  { closeButton: true, disableTimeOut: true });
                  }
                },
                err => {
                  this.blockUI.stop();
                  this.toastr.error(err.Message || err, 'Error!', { closeButton: true, disableTimeOut: true });
                }
              );
            }
        },
    );
  }



  modalHideLoadBalance() {
    this.balanceLoadForm.reset();
    this.modalRef.hide();
    this.submitted = false;
  }

  openModalLoadBalance(template: TemplateRef<any>,type) {
    this.pageType = type;
    this.modalRef = this.modalService.show(template, this.modalConfig);
  }



}
