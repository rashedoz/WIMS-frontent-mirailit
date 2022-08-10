import { Component, TemplateRef, ViewChild, ElementRef, ViewEncapsulation, OnInit } from '@angular/core';
import { ColumnMode,DatatableComponent } from '@swimlane/ngx-datatable';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { CommonService } from '../_services/common.service';
import { ToastrService } from 'ngx-toastr';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { Page } from '../_models/page';
import { PaymentType } from '../_models/enums';
import { ConfirmService } from '../_helpers/confirm-dialog/confirm.service';
import { PrintService } from '../_services/print.service';
import * as moment from 'moment';
import { BsDatepickerConfig, BsDaterangepickerConfig } from "ngx-bootstrap/datepicker";

@Component({
  selector: 'app-payment-list',
  templateUrl: './payment-list.component.html',
  encapsulation: ViewEncapsulation.None
})

export class PaymentListComponent implements OnInit {

  entryForm: FormGroup;
  submitted = false;
  @BlockUI() blockUI: NgBlockUI;

  page = new Page();
  emptyGuid = '00000000-0000-0000-0000-000000000000';
  columnsWithSearch : string[] = [];
  PaymentType = PaymentType;
  modalTitle = 'Payment';
  btnSaveText = 'Save';
  modalConfig: any = { class: 'gray modal-md', backdrop: 'static' };
  modalRef: BsModalRef;
  @ViewChild(DatatableComponent, { static: false }) table: DatatableComponent;
  rows = [];
  tempRows = [];
  paymentList = [];
  loadingIndicator = false;
  ColumnMode = ColumnMode;
  scrollBarHorizontal = (window.innerWidth < 1200);

  bsConfig: Partial<BsDaterangepickerConfig>;
  customer;
  customerList: Array<any> = [];
  itemList: Array<any> = [];

  date = new Date();
  firstDay = new Date(this.date.getFullYear(), this.date.getMonth(), 1);
  lastDay = new Date(this.date.getFullYear(), this.date.getMonth() + 1, 0);

  paymentMethodList = [{id:1,name:'CASH'},{id:2,name:'FROM BALANCE'},{id:3,name:'CARD PAYMENT'},{id:4,name:'ONLINE BANKING'}]

  subTotal:number =0;
  discount:number=0;
  paidAmount:number=0;
  billItem;
  searchParam = '';

  bsPaymentRangeValue: Date[];
  selectedPaymentMethod = null;
  customerType = 'all';

  paymentConfirmableCount = 0;

  constructor(
    private confirmService: ConfirmService,
    private modalService: BsModalService,
    public formBuilder: FormBuilder,
    private _service: CommonService,
    private toastr: ToastrService,
    private router: Router,
    public printService: PrintService
  ) {
    this.page.pageNumber = 0;
    this.page.size = 10;
    window.onresize = () => {
      this.scrollBarHorizontal = (window.innerWidth < 1200);
    };

    this.bsConfig = Object.assign(

      {

        rangeInputFormat: 'DD/MM/YYYY',
        adaptivePosition: true,
        showClearButton: true,
        clearPosition: 'right'
      }
    );

    this.bsPaymentRangeValue = [this.firstDay,this.lastDay];


  }


  ngOnInit() {
   this.getPaymentList();
  }

  newPrint(id){
    this.printService.printInv(id);
  }

  onCustomerChange(e){
    switch (e) {
      case 'all':
        this.getPaymentList();
        break;
      case 'wholesaler':
        this.getPaymentList();
        break;
      case 'retailer':
        this.getPaymentList();
        break;

      default:
        break;
    }
  }


  setPage(pageInfo) {
    this.page.pageNumber = pageInfo.offset;
    this.getPaymentList();
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
                    this.getPaymentList();
                  } else if (data.IsReport == "Warning") {
                    this.toastr.warning(data.Msg, 'Warning!', { closeButton: true, disableTimeOut: true });
                  } else {
                    this.toastr.error(data.Msg, 'Error!',  { closeButton: true, disableTimeOut: true });
                  }
                },
                err => {

                  this.toastr.error(err.Msg || err, 'Error!', { closeButton: true, disableTimeOut: true });
                }
              );
            }
        },
    );
 }

  getPaymentList() {
    this.loadingIndicator = true;
    const obj:any = {
      limit: this.page.size,
      page: this.page.pageNumber + 1,
      search_param: this.searchParam
    };

    if(this.bsPaymentRangeValue){
      obj.payment_entry_start_date = moment(this.bsPaymentRangeValue[0]).format('YYYY-MM-DD'),
      obj.payment_entry_end_date = moment(this.bsPaymentRangeValue[1]).format('YYYY-MM-DD')
    }
    if(this.selectedPaymentMethod){
      obj.payment_method = this.selectedPaymentMethod;
    }

    if(this.customerType == 'wholesaler'){
      obj.is_wholesaler = 1;
      obj.is_retailer = 0;
    }else if(this.customerType == 'retailer'){
      obj.is_wholesaler = 0;
      obj.is_retailer = 1;
    }else{
      delete obj['is_wholesaler'];
      delete obj['is_retailer'];
    }

    this._service.get("payment/get-payment-list",obj).subscribe(
      (res) => {

        this.paymentList = res.results;
        this.page.totalElements = res.count;
        this.page.totalPages = Math.ceil(this.page.totalElements / this.page.size);
        this.paymentConfirmableCount = 0;
        this.paymentList.forEach(element => {
          if(!element.is_payment_confirmed)this.paymentConfirmableCount++;
        });
        setTimeout(() => {
          this.loadingIndicator = false;
        }, 1000);
      },
      (err) => {
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
      this.getPaymentList();
    }
  }

  onPaymentDetailsDateValueChange(e){
    if(e){
      this.bsPaymentRangeValue = [e[0],e[1]];
    }else{
      this.bsPaymentRangeValue = null;
    }
      this.getPaymentList();
  }

  onPaymentMethodChange(e){
    if(e){
      this.selectedPaymentMethod = e.id;
    }else{
      this.selectedPaymentMethod = null;
    }
    this.getPaymentList()
  }


}
