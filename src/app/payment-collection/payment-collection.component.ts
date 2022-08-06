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
import { BillStatus, PaymentType } from "./../_models/enums";

@Component({
  selector: 'app-payment-collection',
  templateUrl: './payment-collection.component.html',
  styleUrls: ['./payment-collection.component.css'],
  encapsulation: ViewEncapsulation.None
})

export class PaymentCollectionComponent implements OnInit {

  entryFormBill: FormGroup;
  submitted = false;
  @BlockUI() blockUI: NgBlockUI;
  bill_id: any = null;
  details: any = null;
  customerObj: any = null;
  BillStatus = BillStatus;
  PaymentType = PaymentType;
  balance = 0;
  isPayBalanceEnableShow = false;
  isPayBalanceEnable = false;
  remarks = null;
  isbalanceDeduct = false;
  paidAmount: number = 0;
  tempPaidAmount: number = 0;
  paymentMethodList = [{ id: 1, name: 'CASH' }, { id: 2, name: 'FROM BALANCE' }, { id: 3, name: 'CARD PAYMENT' }, { id: 4, name: 'ONLINE BANKING' }]
  methodList = [];
  selectedMethod = { id: 1, name: 'CASH' };

  grand_total = 0;
  refund_amount = 0;
  due = 0;
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
    if (this.bill_id) this.getBillDetails();
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

  getBillDetails() {
    this.blockUI.start('Getting data...');
    this._service.get('bill/get-customer-invoice-detail/' + this.bill_id).subscribe(res => {
      this.blockUI.stop();
      if (!res) {
        this.toastr.error(res.Msg, 'Error!', { timeOut: 2000 });
        return;
      }
      this.details = res;
      console.log(this.details);
      this.balance = res.customer_balance;
      if (Number(this.details.customer_balance) == 0) {
        this.isPayBalanceEnableShow = false;
        this.methodList = this.paymentMethodList.filter(x => x.id !== 2);
      } else {
        this.isPayBalanceEnableShow = true;
        this.methodList = this.paymentMethodList;
      }


      this.grand_total = Number(this.details.grand_total);
      this.due = Number(this.details.due);


      // if(this.details){
      //   this._service.get('get-customer-current-balance/' + this.details.bill.customer).subscribe(
      //     res => {
      //       this.customerObj = res;



      //       this.balance = res.balance;
      //       // if (Number(this.customerObj.balance) == 0) {
      //       //   this.isPayBalanceEnableShow = false;
      //       // } else {
      //       //   this.isPayBalanceEnableShow = true;
      //       // }

      //       if (Number(this.customerObj.balance) == 0) {
      //         this.isPayBalanceEnableShow = false;
      //         this.methodList = this.paymentMethodList.filter(x => x.id !== 2);
      //       }else {
      //         this.isPayBalanceEnableShow = true;
      //         this.methodList = this.paymentMethodList;
      //       }

      //     },
      //     err => { }
      //   );
      // }
    }, err => {
      this.blockUI.stop();
      this.toastr.error(err.Message || err, 'Error!', { timeOut: 2000 });
    });
  }

  inputFocused(event: any) {
    event.target.select()
  }



  onChangePayBalance(e) {
    this.isPayBalanceEnable = e.id == 2 ? true : false;
  //  let net = Number(this.details.grand_total); // - Number(this.discount);
    if (this.isPayBalanceEnable) {
      this.isbalanceDeduct = true;
      if (Number(this.balance) > this.due) {
        if (this.due > 0) {
          this.paidAmount = this.due;
          this.tempPaidAmount = this.due;
        } 

      } else if (Number(this.balance) <= this.due) {
        this.tempPaidAmount = Number(this.balance);
        this.paidAmount = Number(this.balance);
      }
    } else {
      this.paidAmount = 0;
      if (this.isbalanceDeduct) {
        this.tempPaidAmount = 0;
        this.balance = Number(this.balance);
      }

      this.isbalanceDeduct = false;
    }
  }

  // onChangePayBalance(e) {
  //   this.isPayBalanceEnable = e.id == 2 ? true : false;
  //   let net = Number(this.details.grand_total); // - Number(this.discount);
  //   if (this.isPayBalanceEnable) {
  //     this.isbalanceDeduct = true;
  //     if (Number(this.balance) > net) {
  //       if (this.due > 0) {
  //         this.paidAmount = this.due;
  //         this.tempPaidAmount = this.due;
  //       } else {
  //         this.paidAmount = net;
  //         this.tempPaidAmount = net;
  //       }

  //     } else if (Number(this.balance) <= net) {
  //       this.tempPaidAmount = Number(this.balance);
  //       this.paidAmount = Number(this.balance);
  //     }
  //   } else {
  //     this.paidAmount = 0;
  //     if (this.isbalanceDeduct) {
  //       this.tempPaidAmount = 0;
  //       this.balance = Number(this.balance);
  //     }

  //     this.isbalanceDeduct = false;
  //   }
  // }

  onChangePaid(value) {
    if (parseFloat(value) > this.details.due) {
      this.paidAmount = this.details.due;
      this.toastr.warning("Paid amount can't be greater than Due Amount", 'Warning!', { timeOut: 2000 });
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
    
      bill: this.details.id,     
      payment_method: this.selectedMethod.id,
      amount_paid: Number(this.paidAmount),      
      payment_remarks: this.remarks
    };


    this.confirmService.confirm('Do you want to collect payment now?', '','No','Yes')
    .subscribe(
        result => {
            if (result) {                               
              this._service.post('payment/save-payment', obj).subscribe(
                data => {
                  this.blockUI.stop();
                  if (data.IsReport == "Success") {
                    this.toastr.success(data.Msg, 'Success!', { closeButton: true, disableTimeOut: true });
                
                    this.router.navigate(['customer-details/' + this.details.customer]);
          
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
            else{
              this.blockUI.stop();
          }
        },
    );




  }





}
