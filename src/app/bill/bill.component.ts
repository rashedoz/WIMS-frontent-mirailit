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
import { jsPDF } from "jspdf";
import 'jspdf-autotable';
import { DatePipe } from '@angular/common';
import { PrintService } from '../_services/print.service';
import { BsDatepickerConfig, BsDaterangepickerConfig } from "ngx-bootstrap/datepicker";
import * as moment from 'moment';

@Component({
  selector: 'app-bill',
  templateUrl: './bill.component.html',
  encapsulation: ViewEncapsulation.None
})

export class BillComponent implements OnInit {

  entryForm: FormGroup;
  submitted = false;
  @BlockUI() blockUI: NgBlockUI;

  StockStatus = StockStatus;
  page = new Page();
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
  simLifecycleDetails : Array<any> = [];
  billStatus = BillStatus;
  searchParam = '';
  bsConfig: Partial<BsDaterangepickerConfig>;
  date = new Date();
  firstDay = new Date(this.date.getFullYear(), this.date.getMonth(), 1);
  lastDay = new Date(this.date.getFullYear(), this.date.getMonth() + 1, 0);
  billType = 'Unpaid';
  remarks = null;
  billItem;
  balanceObj;
  balance: number = 0;
  isPayBalanceEnableShow = false;
  isPayBalanceEnable = false;
  pageType = null;
  btnSaveText = "Save";
  bsBillRangeValue: Date[];

  paymentMethodList = [{id:1,name:'CASH'},{id:2,name:'FROM BALANCE'},{id:3,name:'CARD PAYMENT'},{id:4,name:'ONLINE BANKING'}]
  methodList = [];
  selectedMethod = {id:1,name:'CASH'};
  isbalanceDeduct = false;
  customerType = 'all';


  constructor(
    public formBuilder: FormBuilder,
    private _service: CommonService,
    private toastr: ToastrService,
    public datepipe: DatePipe,
    private modalService: BsModalService,
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

    this.bsBillRangeValue = [this.firstDay,this.lastDay];

  }


  ngOnInit() {
    this.getList();
  }


  onCustomerChange(e){
    switch (e) {
      case 'all':
        this.getList();
        break;
      case 'wholesaler':
        this.getList();
        break;
      case 'retailer':
        this.getList();
        break;

      default:
        break;
    }
  }


  changeTab(type,e) {

    this.searchParam = '';
    this.page.pageNumber = 0;
    this.page.size = 10;

    switch (type) {
      case 'Unpaid':
        this.billType = type;
       this.getList();
       break;
     case 'Partially Paid':
      this.billType = type;
       this.getList();
       break;
     case 'Fully Paid':
      this.billType = type;
       this.getList();
       break;
    default:
      this.getList();
      break;
    }

 }


  setPage(pageInfo) {
    this.page.pageNumber = pageInfo.offset;
    this.getList();
  }

  filterSearch(e){
    if(e){
      this.page.pageNumber = 0;
      this.page.size = 10;
      this.searchParam = e.target.value;
      this.getList();
    }
  }

  onBillDetailsDateValueChange(e){
    if(e){
      this.bsBillRangeValue = [e[0],e[1]];
    }else{
      this.bsBillRangeValue = null
    }
    this.getList();
  }

  newPrint(id){
    this.printService.printInv(id);
  }

  getList() {

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
      // customer_id : this.customer_id,
      payment_status : status,
      limit : this.page.size,
      page : this.page.pageNumber + 1,
      search_param : this.searchParam
      }

      if(this.bsBillRangeValue){
        obj.billing_start_date = moment(this.bsBillRangeValue[0]).format('YYYY-MM-DD'),
        obj.billing_end_date = moment(this.bsBillRangeValue[1]).format('YYYY-MM-DD')
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


    this._service.get('bill/get-bill-list',obj).subscribe(res => {

      if (!res) {
        this.toastr.error(res.Message, 'Error!', { closeButton: true, disableTimeOut: true });
        return;
      }
     // this.tempRows = res;
      this.rows =  res.results;
      this.page.totalElements = res.count;
      this.page.totalPages = Math.ceil(this.page.totalElements / this.page.size);
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













}
