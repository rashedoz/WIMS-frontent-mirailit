import { Component, TemplateRef, ViewChild, ElementRef, ViewEncapsulation, OnInit } from '@angular/core';
import { ColumnMode,DatatableComponent } from '@swimlane/ngx-datatable';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { CommonService } from '../_services/common.service';
import { ToastrService } from 'ngx-toastr';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { Page } from '../_models/page';
import { BillStatus } from '../_models/enums';
import { ConfirmService } from '../_helpers/confirm-dialog/confirm.service';

@Component({
  selector: 'app-bill-list',
  templateUrl: './bill-list.component.html',
  encapsulation: ViewEncapsulation.None
})

export class BillListComponent implements OnInit {

  entryForm: FormGroup;
  entryFormBill: FormGroup;
  submitted = false;
  @BlockUI() blockUI: NgBlockUI;

  billStatus = BillStatus;
  page = new Page();
  emptyGuid = '00000000-0000-0000-0000-000000000000';
  activeTable = 0;
  modalTitle = 'Payment';
  modalTitleBill = 'Generate Monthly Bill';
  btnSaveTextBill = 'Generate';
  btnSaveText = 'Save';
  modalConfig: any = { class: 'gray modal-md', backdrop: 'static' };
  modalRef: BsModalRef;
  @ViewChild(DatatableComponent, { static: false }) table: DatatableComponent;
  @ViewChild(DatatableComponent, { static: false }) tableSIM: DatatableComponent;
  @ViewChild(DatatableComponent, { static: false }) tableDevice: DatatableComponent;

  rows = [];

  tempRows = [];
  bilList = [];
  subscriptionBilList = [];
  simBilList = [];
  deviceBilList = [];


  loadingIndicator = false;
  ColumnMode = ColumnMode;
  scrollBarHorizontal = (window.innerWidth < 1200);

  customer;
  customerList: Array<any> = [];
  itemList: Array<any> = [];

  newTotal:number =0;
  subTotal:number =0;
  discount:number=0;
  paidAmount:number=0;
  billItem;

  constructor(
    private confirmService: ConfirmService,
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

  // this.getCustomerList();
   this.entryFormBill = this.formBuilder.group({
    invoice_month: [null, [Validators.required]],
  });


  this.getBillList();

  }

  getBillStatus(id){
    return  this.billStatus[id];
  }

  // getCustomerList() {
  //   this._service.get("user-list?is_customer=true").subscribe(
  //     (res) => {
  //       this.customerList = res;
  //     },
  //     (err) => {}
  //   );
  // }

  // onCustomerChange(e){
  //   if(e){
  //     this.getSubscriptionBillList(e.id);
  //   }
  // }

  showBillTable(id){
    switch (id) {
      case 0:
        this.getBillList();
        break;
      case 1:
        this.getSubscriptionBillList();
        break;
      case 2:
        this.getSIMBillList();
        break;
      case 3:
        this.getDeviceBillList();
        break;

    }
  }


  getBillList() {
    this._service.get("subscription/get-bill-list").subscribe(
      (res) => {
        this.activeTable = 0;
        this.tempRows = res;
        this.bilList = res;

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


  getSubscriptionBillList() {
    this._service.get("subscription/get-bill-list").subscribe(
      (res) => {
        this.activeTable = 1;
        this.tempRows = res.filter(x=>x.subscription != null);
        this.subscriptionBilList = res.filter(x=>x.subscription != null);

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

  getSIMBillList() {
    this._service.get("subscription/get-sim-sales-list").subscribe(
      (res) => {
        this.activeTable = 2;
        this.tempRows = res;
        this.simBilList = res;
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

  getDeviceBillList() {
    this._service.get("subscription/get-device-sales-list").subscribe(
      (res) => {
        this.activeTable = 3;
        this.tempRows = res;
        this.deviceBilList = res;
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



   if(Number(this.paidAmount) == 0){
    this.toastr.warning("Paid amount can't be empty", 'Warning!', { closeButton: true, disableTimeOut: true });
    return;
   }
   this.blockUI.start('Saving...');
    const obj = {
      customer:this.billItem.customer_id,
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
          this.getBillList();
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
    this.billItem = {};
    this.newTotal = 0;
    this.subTotal = 0;
    this.discount = 0;
    this.paidAmount = 0;
  }

  openModal(row, template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(template, this.modalConfig);
    this.subTotal = row.payable_amount;
    this.billItem = row;
    this.newTotal =  Number(this.subTotal) - Number(this.billItem.so_far_paid);
  //  this.discount = row.discount;

  }



  get f() {
    return this.entryFormBill.controls;
  }

  onFormSubmitBill() {
    this.submitted = true;
    if (this.entryFormBill.invalid) {
      return;
    }

    this.blockUI.start('Saving...');

    const obj = {
     invoice_month: this.entryFormBill.value.invoice_month.trim()
    };

    this.confirmService.confirm('Are you sure?', 'You are generating the monthly bill.')
    .subscribe(
        result => {
            if (result) {
              const request = this._service.post('subscription/generate-monthly-bill', obj);
              request.subscribe(
                data => {
                  this.blockUI.stop();
                  if (data.IsReport == "Success") {
                    this.toastr.success(data.Msg, 'Success!', { timeOut: 2000 });
                    this.modalHide();
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
            else{
                this.blockUI.stop();
            }
        },

    );


  }



  modalHideBill() {
    this.entryFormBill.reset();
    this.modalRef.hide();
    this.submitted = false;
  }

  openModalBill(template: TemplateRef<any>) {
      this.modalRef = this.modalService.show(template, this.modalConfig);

  }

  updateFilterBill(event) {
    const val = event.target.value.toLowerCase();

    // filter our data
    const temp = this.tempRows.filter(function (d) {
      return d.customer.toLowerCase().indexOf(val) !== -1 ||
        !val;
    });

    // update the rows
    this.bilList = temp;
    // Whenever the filter changes, always go back to the first page
    this.table.offset = 0;
  }

  updateFilterSubscription(event) {
    const val = event.target.value.toLowerCase();

    // filter our data
    const temp = this.tempRows.filter(function (d) {
      return d.customer.toLowerCase().indexOf(val) !== -1 ||
        !val;
    });

    // update the rows
    this.subscriptionBilList = temp;
    // Whenever the filter changes, always go back to the first page
    this.table.offset = 0;
  }

  updateFilterSIM(event) {
    const val = event.target.value.toLowerCase();

    // filter our data
    const temp = this.tempRows.filter(function (d) {
      return d.customer.toLowerCase().indexOf(val) !== -1 ||
        !val;
    });

    // update the rows
    this.simBilList = temp;
    // Whenever the filter changes, always go back to the first page
    this.tableSIM.offset = 0;
  }

  updateFilterDevice(event) {
    const val = event.target.value.toLowerCase();

    // filter our data
    const temp = this.tempRows.filter(function (d) {
      return d.customer.toLowerCase().indexOf(val) !== -1 ||
        !val;
    });

    // update the rows
    this.deviceBilList = temp;
    // Whenever the filter changes, always go back to the first page
    this.tableDevice.offset = 0;
  }

}
