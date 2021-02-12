import { Component, TemplateRef, ViewChild, ElementRef, ViewEncapsulation, OnInit } from '@angular/core';
import { ColumnMode,DatatableComponent } from '@swimlane/ngx-datatable';
import { DatePipe } from '@angular/common';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { CommonService } from '../_services/common.service';
import { ToastrService } from 'ngx-toastr';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { Page } from '../_models/page';
import { BillStatus } from '../_models/enums';
import { ConfirmService } from '../_helpers/confirm-dialog/confirm.service';
// import { NgxSmartModalComponent, NgxSmartModalService } from 'ngx-smart-modal';
import { jsPDF } from "jspdf";
import 'jspdf-autotable';
import * as moment from 'moment';

@Component({
  selector: 'app-bill-list',
  templateUrl: './bill-list.component.html',
  styleUrls:['./bill-list.component.css'],
  encapsulation: ViewEncapsulation.None
})

export class BillListComponent implements OnInit {

  entryForm: FormGroup;
  entryFormBill: FormGroup;
  submitted = false;
  @BlockUI() blockUI: NgBlockUI;
  columnsWithSearch : string[] = [];
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
  modalRefInv: BsModalRef;
  @ViewChild(DatatableComponent, { static: false }) table: DatatableComponent;
  @ViewChild(DatatableComponent, { static: false }) tableSIM: DatatableComponent;
  @ViewChild(DatatableComponent, { static: false }) tableDevice: DatatableComponent;
  @ViewChild('pdfViewerOnDemand', { static: false }) pdfViewerOnDemand: any;
  // @ViewChild(TemplateRef, { static: false }) tpl: TemplateRef<any>;
  // invModal: NgxSmartModalComponent;
  @ViewChild('htmlData', {static: false}) htmlData:ElementRef;

  rows = [];
  tempRows = [];
  bilList = [];
  subscriptionBilList = [];
  simBilList = [];
  deviceBilList = [];
  isbuttonActive = true;

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
  tempPaidAmount:number=0;
  remarks =  null;
  billItem;
  balanceObj;
  balance:number=0;
  isPayBalanceEnableShow = false;
  isPayBalanceEnable = false;


  fontSizes: any = {
    HeadTitleFontSize: 18,
    Head2TitleFontSize: 16,
    TitleFontSize: 14,
    SubTitleFontSize: 12,
    NormalFontSize: 10,
    SmallFontSize: 8
  };

  lineSpacing: any = {
    NormalSpacing: 12
  };


  constructor(
    // private ngxSmartModalService : NgxSmartModalService,
    private confirmService: ConfirmService,
    private modalService: BsModalService,
    public formBuilder: FormBuilder,
    private _service: CommonService,
    private toastr: ToastrService,
    public datepipe: DatePipe,
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

  // this.entryFormBill.get('invoice_month').disable();
  this.entryFormBill.get('invoice_month').setValue(moment().format('MMM-YYYY'));

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
    this.isbuttonActive = false;
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
      case 4:
        this.getFullPaidBillList();
        break;
      case 5:
        this.getUnpaidBillList();
        break;
      case 6:
        this.getPartiallypaidBillList();
        break;
    }
  }
 


  getBillList() {
    this.loadingIndicator = true;
    this._service.get("subscription/get-bill-list").subscribe(
      (res) => {
        this.activeTable = 0;
        this.tempRows = res;
        this.bilList = res;
        if(this.bilList.length > 0) this.columnsWithSearch = Object.keys(this.bilList[0]);
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
    this.loadingIndicator = true;
    this._service.get("subscription/get-bill-list").subscribe(
      (res) => {
        this.activeTable = 1;
        this.tempRows = res.filter(x=>x.subscription != null);
        this.subscriptionBilList = res.filter(x=>x.subscription != null);
        if(this.subscriptionBilList.length > 0) this.columnsWithSearch = Object.keys(this.subscriptionBilList[0]);
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
    this.loadingIndicator = true;
    this._service.get("subscription/get-sim-sales-list").subscribe(
      (res) => {
        this.activeTable = 2;
        this.tempRows = res;
        this.simBilList = res;
        
        if(this.simBilList.length > 0)  this.columnsWithSearch = Object.keys(this.simBilList[0]);
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
    this.loadingIndicator = true;
    this._service.get("subscription/get-device-sales-list").subscribe(
      (res) => {
        this.activeTable = 3;
        this.tempRows = res;
        this.deviceBilList = res;
        this.columnsWithSearch = Object.keys(this.deviceBilList[0]);
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

  getFullPaidBillList() {
    this.loadingIndicator = true;
    this._service.get("subscription/get-fully-paid-bill-list").subscribe(
      (res) => {
        this.activeTable = 4;
        this.tempRows = res;
        this.bilList = res;
        if(this.bilList.length > 0) this.columnsWithSearch = Object.keys(this.bilList[0]);
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

  getPartiallypaidBillList() {
    this.loadingIndicator = true;
    this._service.get("subscription/get-partially-paid-bill-list").subscribe(
      (res) => {
        this.activeTable = 6;
        this.tempRows = res;
        this.bilList = res;
        if(this.bilList.length > 0) this.columnsWithSearch = Object.keys(this.bilList[0]);
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

  getUnpaidBillList() {
    this.loadingIndicator = true;
    this._service.get("subscription/get-unpaid-bill-list").subscribe(
      (res) => {
        this.activeTable = 5;
        this.tempRows = res;
        this.bilList = res;
        if(this.bilList.length > 0) this.columnsWithSearch = Object.keys(this.bilList[0]);
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
    // if (parseFloat(value) > this.subTotal) {
    //   this.discount = this.subTotal;
    // }
  }

  onChangePaid(value) {
    if (parseFloat(value) > this.newTotal) {
      this.paidAmount = this.newTotal;
    }
  }

  onFormSubmit() {
    this.submitted = true;



   if(Number(this.paidAmount) == 0){
    this.toastr.warning("Paid amount can't be empty", 'Warning!', { closeButton: true, disableTimeOut: true });
    return;
   }
 //  this.blockUI.start('Saving...');
    const obj = {
      customer:this.billItem.customer_id,
      bill:this.billItem.id,
      transaction_type:"Payment In",
      payment_method: this.isPayBalanceEnable ? 2:1,
      session:this.billItem.session,
      discount: 0,//Number(this.discount),
      paid_amount:Number(this.paidAmount),
      refund_amount:0,
      due:0,
      balance:0,
      remarks: this.remarks
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
    this.tempPaidAmount = 0;
    this.balance = 0;
    this.remarks = null;
    this.isPayBalanceEnableShow = false;
    this.isPayBalanceEnable = false;
  }

  openModal(row, template: TemplateRef<any>) {

    this.subTotal = row.payable_amount;
    this.billItem = row;
    let so_far_paid = Number(this.billItem.so_far_paid) - Number(this.billItem.parent_refund_amount);
    this.newTotal =  Number(this.subTotal) - so_far_paid;
  //  this.discount = row.discount;
  this._service.get('get-customer-current-balance/'+ row.customer_id).subscribe(
    res => {
     this.balanceObj = res;
     this.balance = res.balance;
     if(Number(this.balanceObj.balance) == 0){
      this.isPayBalanceEnableShow = false;
     } else {
      this.isPayBalanceEnableShow = true;
     }
    },
    err => {}
  );

  this.modalRef = this.modalService.show(template, this.modalConfig);

  }

  onChangePayBalance(e){
    this.isPayBalanceEnable = e;
    let net = Number(this.newTotal); // - Number(this.discount);
    if(e){
      if(Number(this.balanceObj.balance) > net){
        this.paidAmount = net;
        this.tempPaidAmount = net;
        } else if(Number(this.balanceObj.balance) <= net){
          this.paidAmount = Number(this.balanceObj.balance);
        }
    } else {
      this.paidAmount = 0;
      this.tempPaidAmount =  this.tempPaidAmount - net;
    }
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
     invoice_month: this.entryFormBill.get('invoice_month').value
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
                    this.getBillList();
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


  printInv(row){


    this.blockUI.start('Generating invoice...');
    this._service.get("reports/generate-customer-invoice/"+row.id).subscribe(res => {
      // this.invModal = this.ngxSmartModalService.create('invModal', this.tpl);
      // this.invModal.open();

      // this.pdfViewerOnDemand.pdfSrc = res;
      // this.pdfViewerOnDemand.refresh();

      // const url = window.URL.createObjectURL(res);
      // var link = document.createElement('a');
      // link.href = url;
      // link.target = '_blank';
      // //  link.download = "invoice.pdf";
      // link.click();

      console.log(res);
      const doc = new jsPDF("p", "mm", "a4");
      doc.setProperties({
        title: "Invoice"
      });
      let addressObj = {
        company: 'Gold Lavender Co. Ltd',
        postCode: '169-0073',
        address: 'Tokyo to shinjuku ku hyakunincho 2-9-2',
        address2: 'Okayama Business Build 201',
        tel: '03-6869-6171',
        email: 'goldlavender15@gmail.com'
      };


      let invoiceDate = this.datepipe.transform(new Date(), 'yyyy-MM-dd');

      let rightStartCol1 = 140;
      let rightStartCol2 = 150;

      let InitialstartX = 40;
      let startX = 12;
      let InitialstartY = 10;
      let startY = 10;


      doc.setFontSize(this.fontSizes.SmallFontSize);
      doc.setFont("times", "bold");
      doc.text("Date: " + invoiceDate, 200, 10, null, "right");
      doc.line(10, 18, 200, 18);
      doc.setFontSize(this.fontSizes.HeadTitleFontSize);
      doc.setFont("times", "bold");
      doc.text("INVOICE", InitialstartX + 65,  (InitialstartY += this.lineSpacing.NormalSpacing + 2),null,"center");
      doc.line(10, 26, 200, 26);

      doc.setFontSize(this.fontSizes.SubTitleFontSize);
      doc.setFont("times", "normal");
      doc.text("WiFi Rental Service Agreement Form", InitialstartX + 65,  (startY += this.lineSpacing.NormalSpacing + 9),null,"center");


      /** Left part */
      doc.setFontSize(this.fontSizes.SubTitleFontSize);
      doc.setFont("times", "normal");
      doc.text("Consignee-",startX,(startY += this.lineSpacing.NormalSpacing + 7),null,"left" );

      doc.setFontSize(this.fontSizes.TitleFontSize);
      doc.setFont("times", "bold");
      doc.text(res.customer.first_name +" "+res.customer.last_name,startX,(startY += 6),null,"left" );

      doc.setFontSize(this.fontSizes.NormalFontSize);
      doc.setFont("times", "normal");
      doc.text("Phone: "+ res.customer.mobile,startX,(startY += 5),null,"left" );

      doc.setFontSize(this.fontSizes.NormalFontSize);
      doc.setFont("times", "normal");
      doc.text("Email: "+ res.customer.email,startX,(startY += 5),null,"left" );



      /** Right part */
      let tempY = InitialstartY + 26;
      doc.setFontSize(this.fontSizes.TitleFontSize);
      doc.setFont("times", "bold");
      doc.text(addressObj.company, rightStartCol1, (tempY),null,'left');

      doc.setFontSize(this.fontSizes.NormalFontSize);
      doc.setFont("times", "normal");
      doc.text(addressObj.postCode, rightStartCol1, (tempY += 5),null,'left');

      doc.setFontSize(this.fontSizes.NormalFontSize);
      doc.setFont("times", "normal");
      doc.text(addressObj.address, rightStartCol1, (tempY += 5),null,'left');

      doc.setFontSize(this.fontSizes.NormalFontSize);
      doc.setFont("times", "normal");
      doc.text(addressObj.address2, rightStartCol1, (tempY += 5),null,'left');

      doc.setFontSize(this.fontSizes.NormalFontSize);
      doc.setFont("times", "normal");
      doc.text("Tel: " +addressObj.tel, rightStartCol1, (tempY += 5),null,'left');

      doc.setFontSize(this.fontSizes.NormalFontSize);
      doc.setFont("times", "normal");
      doc.text("Email: " +addressObj.email, rightStartCol1, (tempY += 5),null,'left');


      let columns = [];

       if(row.bill_type == "Device Sales"){

        columns = [
          { title: 'DID No', dataKey: 'DID_no' },
          { title: 'IMEI', dataKey: 'IMEI' },
          { title: 'Amount', dataKey: 'device_cost',halign: 'right' }
        ];

        let dataArray = [];
        res.sold_device_items.forEach(element => {
          dataArray.push({
            DID_no:element.device.DID_no,
            IMEI:element.device.IMEI,
            device_cost:element.device_cost
          });
        });

      /** Table */
      // @ts-ignore
      doc.autoTable(columns, dataArray, {
        theme: 'plain',
        startY: startY + 25,
        headStyles:{amount: {cellWidth: 30,halign: 'right'}},
        columnStyles: {DID_no: {cellWidth: 60}, IMEI: {cellWidth: 80},device_cost: {cellWidth: 40,halign: 'right'}},
        styles: {
          font: 'times',
          lineWidth: 0.4,
          overflow: 'linebreak',
          fontSize: 10
        },
        cellPadding: 5
      });

      }else if(row.bill_type == "SIM Sales"){

        columns = [
          { title: 'SIM CID No', dataKey: 'CID_no' },
          { title: 'SIM ICCID No', dataKey: 'ICCID_no' },
          { title: 'Phone Number', dataKey: 'phone_number' },
          { title: 'Amount', dataKey: 'sim_cost',halign: 'right' }
        ];

        let dataArray = [];
        res.sold_sim_items.forEach(element => {
          dataArray.push({
            CID_no:element.sim.CID_no,
            ICCID_no:element.sim.ICCID_no,
            phone_number:element.sim.phone_number ? element.sim.phone_number : '--',
            sim_cost:element.sim_cost
          });
        });

        /** Table */
      // @ts-ignore
      doc.autoTable(columns, dataArray, {
        theme: 'plain',
        startY: startY + 25,
        headStyles:{amount: {cellWidth: 30,halign: 'right'}},
        columnStyles: {CID_no: {cellWidth: 40}, ICCID_no: {cellWidth: 50}, phone_number: {cellWidth: 50},sim_cost: {cellWidth: 40,halign: 'right'}},
        styles: {
          font: 'times',
          lineWidth: 0.4,
          overflow: 'linebreak',
          fontSize: 10
        },
        cellPadding: 5
      });

      } else {
        doc.setFontSize(this.fontSizes.NormalFontSize);
        doc.setFont("times", "bold");
        doc.text( "Bill Session: " + res.session,startX + 2, (startY += this.lineSpacing.NormalSpacing + 15),null, 'left' );

        columns = [
          { title: 'SIM CID No', dataKey: 'CID_no' },
          { title: 'SIM ICCID No', dataKey: 'ICCID_no' },
          { title: 'Phone Number', dataKey: 'phone_number' },
          { title: 'Amount', dataKey: 'amount',halign: 'right' }
        ];

        let dataArray = [];
        res.subscribed_items.forEach(element => {
          dataArray.push({
            CID_no:element.sim.CID_no,
            ICCID_no:element.sim.ICCID_no,
            phone_number:element.sim.phone_number ? element.sim.phone_number : '--',
            amount:element.amount
          });
        });

      /** Table */
      // @ts-ignore
      doc.autoTable(columns, dataArray, {
        theme: 'plain',
        startY: startY + 5,
        headStyles:{amount: {cellWidth: 30,halign: 'right'}},
        columnStyles: {CID_no: {cellWidth: 40}, ICCID_no: {cellWidth: 50}, phone_number: {cellWidth: 50},amount: {cellWidth: 40,halign: 'right'}},
        styles: {
          font: 'times',
          lineWidth: 0.4,
          overflow: 'linebreak',
          fontSize: 10
        },
        cellPadding: 5
      });

      }






      // @ts-ignore
      startY = doc.previousAutoTable.finalY + 8;


      if(row.bill_type != "Subscription"){
        
        doc.setFontSize(this.fontSizes.SubTitleFontSize);
        doc.setFont("times", "bold");
        doc.text('One Time Charge', rightStartCol2 - 20,startY,null, 'left' );

        doc.setFontSize(this.fontSizes.SubTitleFontSize);
        doc.setFont("times", "bold");
        doc.text( res.one_time_charge,rightStartCol2 + 42, startY ,null, 'right' );

        
        doc.setFontSize(this.fontSizes.SubTitleFontSize);
        doc.setFont("times", "bold");
        doc.text('Sub Total', rightStartCol2-5,startY += 8,null, 'left' );


        doc.setFontSize(this.fontSizes.SubTitleFontSize);
        doc.setFont("times", "bold");
        doc.text( res.total_amount,rightStartCol2 + 42, startY,null, 'right' );


        if(Number(res.parent_refund_amount) > 0){
          doc.setFontSize(this.fontSizes.SubTitleFontSize);
          doc.setFont("times", "bold");
          doc.text('Refund Amount', rightStartCol2 - 18,startY += 8,null, 'left' );
  
          doc.setFontSize(this.fontSizes.SubTitleFontSize);
          doc.setFont("times", "bold");
          doc.text( res.parent_refund_amount,rightStartCol2 + 42, startY ,null, 'right' );
        }
        if(Number(res.discount) > 0){
          doc.setFontSize(this.fontSizes.SubTitleFontSize);
          doc.setFont("times", "bold");
          doc.text('Discount', rightStartCol2 - 4,startY += 8,null, 'left' );
  
          doc.setFontSize(this.fontSizes.SubTitleFontSize);
          doc.setFont("times", "bold");
          doc.text("- "+ res.discount,rightStartCol2 + 42, startY ,null, 'right' );
        }

        if(Number(res.so_far_paid) > 0){

          if(res.status === 3 || res.status === 4){
            doc.setFontSize(this.fontSizes.TitleFontSize);
            doc.setFont("times", "bold");
            doc.text('Payable Amount', rightStartCol2-24,(startY += 8),null, 'left' );
    
    
            doc.setFontSize(this.fontSizes.TitleFontSize);
            doc.setFont("times", "bold");
            doc.text( res.payable_amount,rightStartCol2 + 42, startY,null, 'right' );
          }else {
         
          doc.setFontSize(this.fontSizes.SubTitleFontSize);
          doc.setFont("times", "bold");
          doc.text('So Far Paid', rightStartCol2 - 10,startY += 8,null, 'left' );
  
          doc.setFontSize(this.fontSizes.SubTitleFontSize);
          doc.setFont("times", "bold");
          doc.text( "- "+res.so_far_paid,rightStartCol2 + 42, startY ,null, 'right' );

          
          doc.setFontSize(this.fontSizes.TitleFontSize);
          doc.setFont("times", "bold");
          doc.text('Payable Amount', rightStartCol2-24,(startY += 8),null, 'left' );
  
          let amount_with_so_far_paid = Number(res.payable_amount) - Number(res.so_far_paid);
          doc.setFontSize(this.fontSizes.TitleFontSize);
          doc.setFont("times", "bold");
          doc.text( amount_with_so_far_paid.toString(),rightStartCol2 + 42, startY,null, 'right' );
        }

        }else{
          doc.setFontSize(this.fontSizes.TitleFontSize);
          doc.setFont("times", "bold");
          doc.text('Payable Amount', rightStartCol2-24,(startY += 8),null, 'left' );
  
  
          doc.setFontSize(this.fontSizes.TitleFontSize);
          doc.setFont("times", "bold");
          doc.text( res.payable_amount,rightStartCol2 + 42, startY,null, 'right' );
        }        

      } else {

        doc.setFontSize(this.fontSizes.SubTitleFontSize);
        doc.setFont("times", "bold");
        doc.text('Sub Total', rightStartCol2-5,startY += 8,null, 'left' );


        doc.setFontSize(this.fontSizes.SubTitleFontSize);
        doc.setFont("times", "bold");
        doc.text( res.total_amount,rightStartCol2 + 42, startY,null, 'right' );
        
        if(Number(res.parent_refund_amount) > 0){
          doc.setFontSize(this.fontSizes.SubTitleFontSize);
          doc.setFont("times", "bold");
          doc.text('Refund Amount', rightStartCol2 - 18,startY += 8,null, 'left' );
  
          doc.setFontSize(this.fontSizes.SubTitleFontSize);
          doc.setFont("times", "bold");
          doc.text( res.parent_refund_amount,rightStartCol2 + 42, startY ,null, 'right' );
        }

        if(Number(res.discount) > 0){
          doc.setFontSize(this.fontSizes.SubTitleFontSize);
          doc.setFont("times", "bold");
          doc.text('Discount', rightStartCol2 - 5,startY += 8,null, 'left' );
  
          doc.setFontSize(this.fontSizes.SubTitleFontSize);
          doc.setFont("times", "bold");
          doc.text( res.discount,rightStartCol2 + 42, startY ,null, 'right' );
        }

        if(Number(res.so_far_paid) > 0){

          if(res.status === 3 || res.status === 4){
            doc.setFontSize(this.fontSizes.TitleFontSize);
            doc.setFont("times", "bold");
            doc.text('Payable Amount', rightStartCol2-24,(startY += 8),null, 'left' );
    
    
            doc.setFontSize(this.fontSizes.TitleFontSize);
            doc.setFont("times", "bold");
            doc.text( res.payable_amount,rightStartCol2 + 42, startY,null, 'right' );
          }else {
         
          doc.setFontSize(this.fontSizes.SubTitleFontSize);
          doc.setFont("times", "bold");
          doc.text('So Far Paid', rightStartCol2 - 10,startY += 8,null, 'left' );
  
          doc.setFontSize(this.fontSizes.SubTitleFontSize);
          doc.setFont("times", "bold");
          doc.text( "- "+res.so_far_paid,rightStartCol2 + 42, startY ,null, 'right' );

          
          doc.setFontSize(this.fontSizes.TitleFontSize);
          doc.setFont("times", "bold");
          doc.text('Payable Amount', rightStartCol2-24,(startY += 8),null, 'left' );
  
          let amount_with_so_far_paid = Number(res.payable_amount) - Number(res.so_far_paid);
          doc.setFontSize(this.fontSizes.TitleFontSize);
          doc.setFont("times", "bold");
          doc.text( amount_with_so_far_paid.toString(),rightStartCol2 + 42, startY,null, 'right' );
        }

        }else{
          doc.setFontSize(this.fontSizes.TitleFontSize);
          doc.setFont("times", "bold");
          doc.text('Payable Amount', rightStartCol2-24,(startY += 8),null, 'left' );
  
  
          doc.setFontSize(this.fontSizes.TitleFontSize);
          doc.setFont("times", "bold");
          doc.text( res.payable_amount,rightStartCol2 + 42, startY,null, 'right' );
        }  
      }

      if(res.status === 3 || res.status === 4){
        var img = new Image()
        img.src = 'assets/images/paid.png'
        doc.addImage(img, 'png', startX + 100 , startY + 50, 80, 60)
      }

      /** Terms and conditions */
      doc.setFontSize(this.fontSizes.SubTitleFontSize);
      doc.setFont("times", "bolditalic");
      doc.text( "Terms and Conditions",startX, (startY += this.lineSpacing.NormalSpacing + 15),null, 'left' );

      doc.setFontSize(this.fontSizes.NormalFontSize);
      doc.setFont("times", "normal");
      doc.text( "* Minimum 2 year contract, if you cancel before 2 year extra pay 2500 yen.",startX, (startY += 6),null, 'left' );

      doc.setFontSize(this.fontSizes.NormalFontSize);
      doc.setFont("times", "normal");
      doc.text( "* For Wifi machine damage, lost penalty up to 10000 yen.",startX, (startY += 5),null, 'left' );

      doc.setFontSize(this.fontSizes.NormalFontSize);
      doc.setFont("times", "normal");
      doc.text( "* 2 year contract, after 2 year if you cancel must be return (Box, Charger and main device) is in good condition.",startX, (startY += 5),null, 'left' );

      doc.setFontSize(this.fontSizes.NormalFontSize);
      doc.setFont("times", "normal");
      doc.text( "* Wifi Reconnect Line open tie minimum 48 Hours.",startX, (startY += 5),null, 'left' );

      doc.setFontSize(this.fontSizes.NormalFontSize);
      doc.setFont("times", "normal");
      doc.text( "* Payment Date - Every month before 25th of the month.",startX, (startY += 5),null, 'left' );

      doc.setFontSize(this.fontSizes.NormalFontSize);
      doc.setFont("times", "normal");
      doc.text( "* Pak code change 3500 yen.",startX, (startY += 5),null, 'left' );



      window.open(URL.createObjectURL(doc.output("blob")));
      this.blockUI.stop();
    },
      error => {

        this.blockUI.stop();
        this.toastr.error(error.message || error, 'Error!', { closeButton: true, disableTimeOut: true });
      });
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

    // // filter our data
    // const temp = this.tempRows.filter(function (d) {
    //   return d.customer.toLowerCase().indexOf(val) !== -1 ||
    //     !val;
    // });

    // assign filtered matches to the active datatable
    const temp = this.tempRows.filter(item => {
      // iterate through each row's column data
      for (let i = 0; i < this.columnsWithSearch.length; i++){
        var colValue = item[this.columnsWithSearch[i]] ;
        // if no filter OR colvalue is NOT null AND contains the given filter
        if (!val || (!!colValue && colValue.toString().toLowerCase().indexOf(val) !== -1)) {
          // found match, return true to add to result set
          return true;
        }
      }
    });

    // update the rows
    this.bilList = temp;
    // Whenever the filter changes, always go back to the first page
    this.table.offset = 0;
  }

  updateFilterSubscription(event) {
    const val = event.target.value.toLowerCase();

    // // filter our data
    // const temp = this.tempRows.filter(function (d) {
    //   return d.customer.toLowerCase().indexOf(val) !== -1 ||
    //     !val;
    // });

    // assign filtered matches to the active datatable
    const temp = this.tempRows.filter(item => {
      // iterate through each row's column data
      for (let i = 0; i < this.columnsWithSearch.length; i++){
        var colValue = item[this.columnsWithSearch[i]] ;
        // if no filter OR colvalue is NOT null AND contains the given filter
        if (!val || (!!colValue && colValue.toString().toLowerCase().indexOf(val) !== -1)) {
          // found match, return true to add to result set
          return true;
        }
      }
    });

    // update the rows
    this.subscriptionBilList = temp;
    // Whenever the filter changes, always go back to the first page
    this.table.offset = 0;
  }

  updateFilterSIM(event) {
    const val = event.target.value.toLowerCase();

    // // filter our data
    // const temp = this.tempRows.filter(function (d) {
    //   return d.customer.toLowerCase().indexOf(val) !== -1 ||
    //     !val;
    // });

    // assign filtered matches to the active datatable
    const temp = this.tempRows.filter(item => {
      // iterate through each row's column data
      for (let i = 0; i < this.columnsWithSearch.length; i++){
        var colValue = item[this.columnsWithSearch[i]] ;
        // if no filter OR colvalue is NOT null AND contains the given filter
        if (!val || (!!colValue && colValue.toString().toLowerCase().indexOf(val) !== -1)) {
          // found match, return true to add to result set
          return true;
        }
      }
    });

    // update the rows
    this.simBilList = temp;
    // Whenever the filter changes, always go back to the first page
    this.tableSIM.offset = 0;
  }

  updateFilterDevice(event) {
    const val = event.target.value.toLowerCase();

    // // filter our data
    // const temp = this.tempRows.filter(function (d) {
    //   return d.customer.toLowerCase().indexOf(val) !== -1 ||
    //     !val;
    // });

    // assign filtered matches to the active datatable
    const temp = this.tempRows.filter(item => {
      // iterate through each row's column data
      for (let i = 0; i < this.columnsWithSearch.length; i++){
        var colValue = item[this.columnsWithSearch[i]] ;
        // if no filter OR colvalue is NOT null AND contains the given filter
        if (!val || (!!colValue && colValue.toString().toLowerCase().indexOf(val) !== -1)) {
          // found match, return true to add to result set
          return true;
        }
      }
    });



    // update the rows
    this.deviceBilList = temp;
    // Whenever the filter changes, always go back to the first page
    this.tableDevice.offset = 0;
  }

}
