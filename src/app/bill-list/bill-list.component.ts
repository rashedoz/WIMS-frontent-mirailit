import { Component, TemplateRef, ViewChild, ElementRef, ViewEncapsulation, OnInit } from '@angular/core';
import { ColumnMode } from '@swimlane/ngx-datatable';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { CommonService } from '../_services/common.service';
import { ToastrService } from 'ngx-toastr';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { Page } from '../_models/page';
import { BillStatus } from '../_models/enums';


@Component({
  selector: 'app-bill-list',
  templateUrl: './bill-list.component.html',
  encapsulation: ViewEncapsulation.None
})

export class BillListComponent implements OnInit {

  entryForm: FormGroup;
  submitted = false;
  @BlockUI() blockUI: NgBlockUI;

  billStatus = BillStatus;
  page = new Page();
  emptyGuid = '00000000-0000-0000-0000-000000000000';

  modalTitle = 'Payment';
  btnSaveText = 'Save';
  modalConfig: any = { class: 'gray modal-md', backdrop: 'static' };
  modalRef: BsModalRef;

  rows = [];
  loadingIndicator = false;
  ColumnMode = ColumnMode;
  scrollBarHorizontal = (window.innerWidth < 1200);

  customer;
  customerList: Array<any> = [];
  itemList: Array<any> = [];

  subTotal:number =0;
  discount:number=0;
  paidAmount:number=0;
  billItem;

  constructor(
    private modalService: BsModalService,
    public formBuilder: FormBuilder,
    private _service: CommonService,
    private toastr: ToastrService,
    private router: Router
  ) {
    // this.page.pageNumber = 0;
    // this.page.size = 10;
    window.onresize = () => {
      this.scrollBarHorizontal = (window.innerWidth < 1200);
    };


  }


  ngOnInit() {

   this.getCustomerList();
  }

  getBillStatus(id){
    return  this.billStatus[id];
  }

  getCustomerList() {
    this._service.get("user-list?is_customer=true").subscribe(
      (res) => {
        this.customerList = res;
      },
      (err) => {}
    );
  }

  onCustomerChange(e){
    if(e){
      this.getBillListByCustomer(e.id);
    }
  }

  getBillListByCustomer(customerId) {
    this._service.get("subscription/get-bill-list?customer="+customerId).subscribe(
      (res) => {
        this.rows = res;
        console.log(this.rows);
        // this.page.totalElements = res.Total;
        // this.page.totalPages = Math.ceil(this.page.totalElements / this.page.size);
        setTimeout(() => {
          this.loadingIndicator = false;
        }, 1000);
        // const key = 'subscription';
        // this.subscriptionList = [...new Map(this.itemList.map(item =>
        //   [item[key], item])).values()];
      },
      (err) => {
        this.toastr.error(err.message || err, 'Error!', { closeButton: true, disableTimeOut: true });
      setTimeout(() => {
        this.loadingIndicator = false;
      }, 1000);
      }
    );
  }

  onChangeDiscount(value) {
    if (parseFloat(value) > this.subTotal) {
      this.discount = this.subTotal;
    }
  }

  onChangePaid(value) {
    if (parseFloat(value) > this.subTotal - this.discount) {
      this.paidAmount = this.subTotal - this.discount;
    }
  }

  onFormSubmit() {
    this.submitted = true;



   if(this.paidAmount === 0 ||  this.paidAmount === null){
    this.toastr.warning("Paid amount can't be empty", 'Warning!', { closeButton: true, disableTimeOut: true });
    return;
   }
   this.blockUI.start('Saving...');
    const obj = {
      customer:this.customer,
      bill:this.billItem.id,
      transaction_type:"Payment In",
      payment_method:1,
      session:this.billItem.session,
      discount:Number(this.discount),
      paid_amount:Number(this.paidAmount),
      refund_amount:0,
      due:0,
      balance:0
    };



    this._service.post('payment/save-payment', obj).subscribe(
      data => {
        this.blockUI.stop();
        if (data.IsReport == "Success") {
          this.toastr.success(data.Msg, 'Success!', { closeButton: true, disableTimeOut: true });
          this.modalHide();
        } else if (data.IsReport == "Warning") {
          this.toastr.warning(data.Msg, 'Warning!', { closeButton: true, disableTimeOut: true });
        } else {
          this.toastr.error(data.Msg, 'Error!',  { closeButton: true, disableTimeOut: true });
        }
      },
      err => {
        this.blockUI.stop();
        this.toastr.error(err.Message || err, 'Error!', { timeOut: 2000 });
      }
    );

  }



  modalHide() {
    this.modalRef.hide();
    this.submitted = false;
    this.btnSaveText = 'Save';
    this.billItem = null;
    this.customer = null;
    this.subTotal = 0;
    this.discount = 0;
  }

  openModal(row, template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(template, this.modalConfig);
    this.subTotal = row.payable_amount;
    this.billItem = row;
  //  this.discount = row.discount;

  }

}
