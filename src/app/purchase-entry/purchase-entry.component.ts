import { Component, TemplateRef, ViewChild, ElementRef, ViewEncapsulation, OnInit } from '@angular/core';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { ColumnMode } from '@swimlane/ngx-datatable';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonService } from './../_services/common.service';
import { ToastrService } from 'ngx-toastr';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { Page } from './../_models/page';


@Component({
  selector: 'app-purchase-entry',
  templateUrl: './purchase-entry.component.html',
  encapsulation: ViewEncapsulation.None
})

export class PurchaseEntryComponent implements OnInit {

  entryFormSIM: FormGroup;
  entryFormDevice: FormGroup;
  entryFormSIMDevice: FormGroup;
  submitted = false;
  @BlockUI() blockUI: NgBlockUI;
  @ViewChild('dataTable', { static: false }) table: any;

  modalTitleSIM = 'Add SIM';
  modalTitleDevice = 'Add Device';
  modalTitleSIMDevice = 'Add SIM & Device';
  btnSaveText = 'Save';

  modalConfig: any = { class: 'gray modal-lg', backdrop: 'static' };
  modalRef: BsModalRef;

  page = new Page();
  rows = [];
  loadingIndicator = false;
  ColumnMode = ColumnMode;

  scrollBarHorizontal = (window.innerWidth < 1200);
  supplierList : Array<any> = [];
  productTypeList : Array<any> = [];
  purchaseItemList : Array<any> = [];
  totalAmount: number;

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
    this.entryFormSIM = this.formBuilder.group({
      supplier: [null, [Validators.required]]
    });
    this.entryFormDevice = this.formBuilder.group({
      supplier: [null, [Validators.required]]
    });
    this.entryFormSIMDevice = this.formBuilder.group({
      supplier: [null, [Validators.required]]
    });

    this.getList();
    this.getSupplierList();
    this.getProductTypeList();
  }

  get s() {
    return this.entryFormSIM.controls;
  }
  get d() {
    return this.entryFormDevice.controls;
  }
  get sd() {
    return this.entryFormSIMDevice.controls;
  }

  getSupplierList(){
    this._service.get('supplier/get-supplier-list').subscribe(res=> {
      this.supplierList = res;
    }, err => { }
    );
  }

  getProductTypeList(){
    this._service.get('product/get-product-type-list').subscribe(res=> {
      this.productTypeList = res;
    }, err => { }
    );
  }

  setPage(pageInfo) {
   // this.page.pageNumber = pageInfo.offset;
    this.getList();
  }

  getList() {
    this.loadingIndicator = true;
    this._service.get('purchase/get-purchase-list').subscribe(res => {
      if (!res) {
        this.toastr.error(res.Message, 'Error!', { timeOut: 2000 });
        return;
      }
      this.rows = res;
      // this.page.totalElements = res.Total;
      // this.page.totalPages = Math.ceil(this.page.totalElements / this.page.size);
      setTimeout(() => {
        this.loadingIndicator = false;
      }, 1000);
    }, err => {
      this.toastr.error(err.Message || err, 'Error!', { timeOut: 2000 });
      setTimeout(() => {
        this.loadingIndicator = false;
      }, 1000);
    }
    );
  }

  toggleExpandRow(row) {
    if(!row.details) row.details = row.purchase_details;
    this.table.rowDetail.toggleExpandRow(row);

  }



  onFormSubmitSIM() {
    this.submitted = true;
    if (this.entryFormSIM.invalid) {
      return;
    }
    let purchase_details = [];
    this.blockUI.start('Saving...');

    this.purchaseItemList.forEach(element => {
      purchase_details.push({
        product_type:element.product_type_id,
        qty: Number(element.qty),
        total_amount: Number(element.amount)
      });
    });

    const obj = {
      supplier:this.entryFormSIM.value.supplier,
      total_amount:this.totalAmount,
      purchase_details:purchase_details
    };

    this._service.post('purchase/entry-sim-purchase', obj).subscribe(
      data => {
        this.blockUI.stop();
        if (data.IsReport == "Success") {
          this.toastr.success(data.Msg, 'Success!', { timeOut: 2000 });
          this.modalHideSIM();
          this.getList();

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

  onFormSubmitDevice() {
    this.submitted = true;
    if (this.entryFormDevice.invalid) {
      return;
    }
    let purchase_details = [];
    this.blockUI.start('Saving...');

    this.purchaseItemList.forEach(element => {
      purchase_details.push({
        product_type:element.product_type_id,
        qty: Number(element.qty),
        total_amount: Number(element.amount)
      });
    });

    const obj = {
      supplier:this.entryFormDevice.value.supplier,
      total_amount: Number(this.totalAmount),
      purchase_details:purchase_details
    };

    this._service.post('purchase/entry-device-purchase', obj).subscribe(
      data => {
        this.blockUI.stop();
        if (data.IsReport == "Success") {
          this.toastr.success(data.Msg, 'Success!', { timeOut: 2000 });
          this.modalHideSIM();
          this.getList();

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

  onFormSubmitSIMDevice() {
    this.submitted = true;
    if (this.entryFormSIMDevice.invalid) {
      return;
    }
    let purchase_details = [];
    let emptyList = [];
    // this.purchaseItemList.forEach(element => {
    //   if(Number(element.qty) == 0 && Number(element.amount) == 0){
    //     this.toastr.warning("Qty and Amount can't be empty", 'Warning!', { closeButton: true, disableTimeOut: true });
    //     return;
    //   }
    // });

    // this.purchaseItemList.forEach(element => {
    //   if(Number(element.qty) == 0 && Number(element.amount) == 0){
    //    emptyList.push({product_type:element.product_type_id});
    //   }
    // });

   this.blockUI.start('Saving...');

    this.purchaseItemList.filter(x=> Number(x.qty) != 0 && Number(x.amount) != 0).forEach(element => {
      purchase_details.push({
        product_type:element.product_type_id,
        qty: Number(element.qty),
        total_amount: Number(element.amount)
      });
    });

    if(purchase_details.length < 2 ){
        this.toastr.warning("Qty and Amount can't be empty", 'Warning!', { closeButton: true, disableTimeOut: true });
        return;
    }
    const obj = {
      supplier:this.entryFormSIMDevice.value.supplier,
      total_amount: Number(this.totalAmount),
      purchase_details:purchase_details
    };

 
    this._service.post('purchase/entry-sim-device-purchase', obj).subscribe(
      data => {
        this.blockUI.stop();
        if (data.IsReport == "Success") {
          this.toastr.success(data.Msg, 'Success!', { timeOut: 2000 });
          this.modalHideSIM();
          this.getList();

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


  modalHideSIM() {
    this.entryFormSIM.reset();
    this.modalRef.hide();
    this.submitted = false;
    this.modalTitleSIM = 'Add SIM';
    this.btnSaveText = 'Save';
    this.purchaseItemList = [];
    this.totalAmount = 0;
  }

  modalHideDevice() {
    this.entryFormDevice.reset();
    this.modalRef.hide();
    this.submitted = false;
    this.modalTitleDevice = 'Add Device';
    this.btnSaveText = 'Save';
    this.purchaseItemList = [];
    this.totalAmount = 0;
  }

  modalHideSIMDevice() {
    this.entryFormSIMDevice.reset();
    this.modalRef.hide();
    this.submitted = false;
    this.modalTitleSIMDevice = 'Add SIM & Device';
    this.btnSaveText = 'Save';
    this.purchaseItemList = [];
    this.totalAmount = 0;
  }

  itemTotal(){
    // this.totalAmount = this.purchaseItemList.map(x => x.qty * x.amount).reduce((a, b) => a + b, 0);
    if(this.purchaseItemList.length > 0){
      this.totalAmount = this.purchaseItemList.map(x => Number(x.amount)).reduce((a, b) => a + b);
      return this.totalAmount;
    }

  }

  openModalSIM(template: TemplateRef<any>) {
  let simProductList =  this.productTypeList.filter(x=> x.product_type === "SIM");
  simProductList.forEach(element => {
    this.purchaseItemList.push({
      "product_type_id":element.id,
      "product_type":element.product_type,
      "qty":0,
      "amount":0
    });
  });
  this.modalRef = this.modalService.show(template, this.modalConfig);
  }

  openModalDevice(template: TemplateRef<any>) {
  let deviceProductList =  this.productTypeList.filter(x=> x.product_type  != "SIM");
  deviceProductList.forEach(element => {
    this.purchaseItemList.push({
      "product_type_id":element.id,
      "product_type":element.product_type,
      "qty":0,
      "amount":0
    });
  });
  this.modalRef = this.modalService.show(template, this.modalConfig);
  }

 openModalSIMDevice(template: TemplateRef<any>) {
  this.productTypeList.forEach(element => {
    this.purchaseItemList.push({
      "product_type_id":element.id,
      "product_type":element.product_type,
      "qty":0,
      "amount":0
    });
  });
  this.modalRef = this.modalService.show(template, this.modalConfig);
  }
}
