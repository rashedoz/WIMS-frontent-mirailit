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
import { SubscriptionStatus,SubsItemsStaus,PaymentType,StatusTypes } from '../_models/enums';
import { TabsetComponent } from 'ngx-bootstrap/tabs';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Subject, Observable, of, concat } from 'rxjs';
import { distinctUntilChanged, debounceTime, switchMap, tap, catchError, filter, map } from 'rxjs/operators';
import { ConfirmService } from '../_helpers/confirm-dialog/confirm.service';
import { PrintService } from '../_services/print.service';

@Component({
  selector: 'app-customer-details',
  templateUrl: './customer-details.component.html',
  styleUrls: ['./customer-details.component.css'],
  encapsulation: ViewEncapsulation.None
})

export class CustomerDetailsComponent implements OnInit {

  entryForm: FormGroup;
  balanceLoadForm: FormGroup;
  submitted = false;
  @BlockUI() blockUI: NgBlockUI;
  SubscriptionStatus = SubscriptionStatus;
  StatusTypes = StatusTypes;
  StockStatus = StockStatus;
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


  currentTab = 'Basic Details';
  subscriptionHistoryList = [];
  balanceHistoryList = [];
  @ViewChild('tablePaymentDetailsList', { static: false }) tablePaymentDetailsList: any;
  @ViewChild('tableDeviceSalesHistory', { static: false }) tableDeviceSalesHistory: any;
  @ViewChild('billDetailTabs', { static: false }) billDetailTabs: any;

  rowItems = [];
  methodListWithoutFrom = [{"id":1,"name":"CASH"},{"id":3,"name":"CARD_PAYMENT"},{"id":4,"name":"ONLINE_BANKING"}]
  paymentDetailList = [];
  deviceSalesList = [];

  activeDeviceCount = 0;

  billType = '';

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
  }



  ngOnInit() {
    if(this.customer_id)this.getCustomer();
    this.balanceLoadForm = this.formBuilder.group({
      amount: [null, [Validators.required]],
      payment_method: [null, [Validators.required]]
    });

  }


  get b() {
    return this.balanceLoadForm.controls;
  }

  newPrint(row){
    this.printService.printInv(row.id);
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

selectTab(tabId: number) {
  if (this.profileTabs?.tabs[tabId]) {
    this.profileTabs.tabs[tabId].active = true;
  }
}

  // 'Available', 'Subscribed', 'Cancelled', 'Permanently Cancelled'

  changeTab(type,e) {

   // this.searchParam = '';
    this.pageTable.pageNumber = 0;
    this.pageTable.size = 10;
    this.currentTab = type;
    this.searchParam = '';
    this.rowItems = [];
    switch (type) {
      case 'Basic Details':
        this.url = 'get-user-detail/';
        this.getCustomer();
        break;
      case 'Subscription Details':
        this.url = 'subscription/get-subscription-list-by-customer-id/';
     this.getSubscriptionList();
        break;
      case 'Device Sales Details':
        this.url = 'subscription/get-customer-current-device-history/';
     this.getDeviceSalesList();
        break;
      case 'Due Details':
        this.url = 'get-user-detail/';
        this.getCustomer();
        break;
      case 'Bills Details':
        this.url = 'subscription/get-subscription-type-bills-by-customerid/';
       this.getListWithPagination();
       this.billType = 'Subscription Bill';
       this.billDetailTabs.tabs[0].active = true;
        break;
      case 'Payment Details':
        this.url = 'payment/get-payment-list-by-customerid/';
     this.getListWithPagination();
        break;
      case 'Balance':
        this.url = 'get-user-detail/';
        this.getCustomer();
        break;
      case 'Balance Loading History':
        this.url = 'get-customer-balance-loading-history/';
     this.getBalanceLoadList();
        break;
      default:
        this.url = 'get-user-detail/';
        this.getCustomer();
        break;
      }
 }

 changeTabBill(type,e) {

  // this.searchParam = '';
   this.pageTable.pageNumber = 0;
   this.pageTable.size = 10;

   switch (type) {
     case 'Subscription Bill':
       this.url = 'subscription/get-subscription-type-bills-by-customerid/';
       this.getListWithPagination();
       this.billType = type;
       break;
     case 'Device Bill':
       this.url = 'subscription/get-device-type-bills-by-customerid/';
    this.getListWithPagination();
    this.billType = type;
       break;
     default:
       this.url = 'subscription/get-subscription-type-bills-by-customerid/';
       this.getListWithPagination();
       this.billType = type;
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


  setPage(pageInfo) {
    this.pageTable.pageNumber = pageInfo.offset;
    this.getList();
  }

  setPageWithPagination(pageInfo) {
    this.pageTable.pageNumber = pageInfo.offset;
    this.getListWithPagination();
  }

  paymentCheck(row,item){
    let txt = '';
    let url = '';
    if(item == 1){
      txt = 'initially';
      url = 'payment/check-payment-receival/';
    }else {
      txt = 'finally';
      url = 'payment/check-payment-receival-finally/';
    }

     this.confirmService.confirm('Are you sure?', 'You are '+txt+' checking the payment.')
     .subscribe(
         result => {
             if (result) {
               const request = this._service.patch(url + row.id, {});
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
    const obj = {
      limit: this.pageTable.size,
      page: this.pageTable.pageNumber + 1,
      search_param: this.searchParam
    };
    this._service.get(this.url+this.customer_id,obj).subscribe(res => {

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
          if(this.pageType == 'Balance'){
            this.url = 'get-user-detail/';
            this.getCustomer();
          }else if(this.pageType == 'BalanceHistory'){
            this.url = 'get-customer-balance-loading-history/';
            this.getBalanceLoadList();
          }

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


  getSubscriptionList() {

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
      this.subscriptionHistoryList =  res;
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

  getDeviceSalesList() {
    this.activeDeviceCount = 0;
    this._service.get(this.url+this.customer_id).subscribe(res => {

      if (!res) {
        this.toastr.error(res.Message, 'Error!', { closeButton: true, disableTimeOut: true });
        return;
      }
      this.deviceSalesList =  res.results;
      res.results.forEach(element => {
        if(element.status == 1){
          this.activeDeviceCount += 1;
        }
      });

    }, err => {
      this.toastr.error(err.message || err, 'Error!', { closeButton: true, disableTimeOut: true });
      setTimeout(() => {
        this.loadingIndicator = false;
      }, 1000);
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
      this.url = 'payment/get-payment-list-by-customerid/';
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
