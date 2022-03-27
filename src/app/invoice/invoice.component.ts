import { Component, TemplateRef, ViewChild, ElementRef, ViewEncapsulation, OnInit } from '@angular/core';
import { ColumnMode } from '@swimlane/ngx-datatable';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { CommonService } from '../_services/common.service';
import { ToastrService } from 'ngx-toastr';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { Page } from '../_models/page';
import { ConfirmService } from '../_helpers/confirm-dialog/confirm.service';
import * as moment from 'moment';
import { Location } from '@angular/common';

@Component({
  selector: 'app-invoice',
  templateUrl: './invoice.component.html',
  styleUrls: ['./invoice.component.css'],
  encapsulation: ViewEncapsulation.None
})

export class InvoiceComponent implements OnInit {

  entryFormBill: FormGroup;
  submitted = false;
  @BlockUI() blockUI: NgBlockUI;
  bill_id:any = null;
  details:any = null;
  customerObj:any = null;

  balance = 0;
  isPayBalanceEnableShow = false;
  isPayBalanceEnable = false;
  remarks = null;

  paidAmount: number = 0;
  tempPaidAmount: number = 0;

  constructor(
    private confirmService: ConfirmService,
    public formBuilder: FormBuilder,
    private modalService: BsModalService,
    private _service: CommonService,
    private toastr: ToastrService,
    private router: Router,
    public location: Location,
    private route: ActivatedRoute
  ) {
    this.bill_id = this.route.snapshot.params['id'];
    if(this.bill_id) this.getBillDetails();
  }


  ngOnInit() {
    this.entryFormBill = this.formBuilder.group({
      invoice_month: [null, [Validators.required]],
    });

    this.entryFormBill.get('invoice_month').disable();
    this.entryFormBill.get('invoice_month').setValue(moment().format('MMM-YYYY'));
  }

  get f() {
    return this.entryFormBill.controls;
  }

  // goBack(){
  //   this._location.back();
  // }

  getBillDetails(){
    this.blockUI.start('Getting data...');
    this._service.get('subscription/get-bill-detail/' + this.bill_id).subscribe(res => {
      this.blockUI.stop();
      if (!res) {
        this.toastr.error(res.Msg, 'Error!', { timeOut: 2000 });
        return;
      }
      this.details = res;
      console.log(this.details);
      if(this.details){
        this._service.get('get-customer-current-balance/' + this.details.bill.customer).subscribe(
          res => {
            this.customerObj = res;
            this.balance = res.balance;
            if (Number(this.customerObj.balance) == 0) {
              this.isPayBalanceEnableShow = false;
            } else {
              this.isPayBalanceEnableShow = true;
            }
          },
          err => { }
        );
      }
    }, err => {
      this.blockUI.stop();
      this.toastr.error(err.Message || err, 'Error!', { timeOut: 2000 });
    });
  }

  inputFocused(event: any){
    event.target.select()
  }


  onChangePayBalance(e) {
    this.isPayBalanceEnable = e;
    let net = Number(this.details.bill.payable_amount); // - Number(this.discount);
    if (e) {
      if (Number(this.customerObj.balance) > net) {
        this.paidAmount = net;
        this.tempPaidAmount = net;
      } else if (Number(this.customerObj.balance) <= net) {
        this.paidAmount = Number(this.customerObj.balance);
      }
    }else {
      this.paidAmount = 0;
      this.tempPaidAmount = this.tempPaidAmount - net;
    }
  }

  onChangePaid(value) {
    if (parseFloat(value) > this.details.bill.payable_amount) {
      this.paidAmount = this.details.bill.payable_amount;
      this.toastr.warning("Paid amount can't be larger then Payable Amount", 'Warning!', { timeOut: 2000 });
    }
  }



  onFormSubmitBill() {
    this.submitted = true;

    if (Number(this.paidAmount) == 0) {
      this.toastr.warning("Paid amount can't be empty", 'Warning!', { closeButton: true, disableTimeOut: true });
      return;
    }
    this.blockUI.start('Saving...');
    const obj = {
      customer: this.details.bill.customer,
      bill: this.details.bill.id,
      transaction_type: "Payment In",
      payment_method: this.isPayBalanceEnable ? 2 : 1,
      session: this.details.bill.session,
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
          // this.modalHide();
          // this.getBillList();
          this.router.navigate([]).then(result => { window.open('/bill-list', '_blank'); });
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





}
