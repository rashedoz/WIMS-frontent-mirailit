import { Component, TemplateRef, ViewChild, ElementRef, ViewEncapsulation, OnInit } from '@angular/core';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { ColumnMode } from '@swimlane/ngx-datatable';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonService } from './../_services/common.service';
import { ToastrService } from 'ngx-toastr';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { Page } from './../_models/page';
import { ProductType } from '../_models/enums';
import { BsDatepickerConfig } from "ngx-bootstrap/datepicker";
import { DatePipe } from '@angular/common';


@Component({
  selector: 'app-purchase-entry',
  templateUrl: './purchase-entry.component.html',
  encapsulation: ViewEncapsulation.None
})

export class PurchaseEntryComponent implements OnInit {

  ProductType = ProductType;
  entryFormSIM: FormGroup;
  entryFormDevice: FormGroup;
  entryFormSIMDevice: FormGroup;
  submitted = false;
  @BlockUI() blockUI: NgBlockUI;
  @ViewChild('dataTable', { static: false }) table: any;
  bsConfig: Partial<BsDatepickerConfig>;

  modalTitleSIM = 'Add SIM';
  modalTitleDevice = 'Add Device';
  modalTitleSIMDevice = 'Add SIM & Device';
  btnSaveText = 'Save';

  modalConfig: any = { class: 'gray modal-lg', backdrop: 'static' };
  modalConfigXL: any = { class: 'gray modal-xl', backdrop: 'static' };
  modalRef: BsModalRef;

  page = new Page();
  pageSupplementary = new Page();
  rows = [];
  loadingIndicator = false;
  ColumnMode = ColumnMode;

  scrollBarHorizontal = (window.innerWidth < 1200);
  supplierList : Array<any> = [];
  supplementaryList : Array<any> = [];
  productTypeList : Array<any> = [];
  purchaseItemList : Array<any> = [];
  typeList = [{'id':0,'name':"All"},{'id':1,'name':"SIM"},{'id':2,'name':"Device"}];
  totalAmount: number;
  ptype = {'id':0,'name':"All"};
  selectedSupplier;
  searchParamAll = null;

  today: Date;
  maxDate: Date;
  minDate: Date;

  simTypeList = [{id:2,name:'WiFi SIM'},{id:1,name:'Phone SIM'},{id:3,name:'Device Only'}]

  constructor(
    private modalService: BsModalService,
    public formBuilder: FormBuilder,
    private _service: CommonService,
    private toastr: ToastrService,
    private datePipe: DatePipe,
    private router: Router
  ) {
    this.page.pageNumber = 0;
    this.page.size = 10;

    window.onresize = () => {
      this.scrollBarHorizontal = (window.innerWidth < 1200);
    };

    this.bsConfig = Object.assign(
      {},
      {
        dateInputFormat: "DD-MMM-YYYY ",
      }
    );

    this.today = new Date();
    this.minDate =  this.today;
  }


  ngOnInit() {
    this.entryFormSIM = this.formBuilder.group({
      supplier: [null, [Validators.required]],
      supplement: [null, [Validators.required]],
      delivery_date: [null],
      sim_type: [null, [Validators.required]]
     // is_phone_sim:[false]
    });
    this.entryFormDevice = this.formBuilder.group({
      supplier: [null, [Validators.required]]
    });
    this.entryFormSIMDevice = this.formBuilder.group({
      supplier: [null, [Validators.required]],
      is_phone_sim:[false]
    });

    this.getList();
    this.getSupplierList();
   // this.getProductTypeList();
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
      this.supplierList = res.results;
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
    this.page.pageNumber = pageInfo.offset;
    this.getList();
  }

  searchFilter(e) {

    if(e){
      this.page.pageNumber = 0;
      this.page.size = 10;
      this.searchParamAll = e.target.value;
      this.getList();
    }
  }

  onProductTypeChange(e){
    if(e){
      this.ptype = e;
      this.getList();
    }
  }

  getList() {
    this.loadingIndicator = true;
    // const obj = {
    //   limit: this.page.size,
    //   page: this.page.pageNumber + 1
    // };

    let obj
    if(this.searchParamAll){
      obj = {
        limit: this.page.size,
        page: this.page.pageNumber + 1,
        search_param:this.searchParamAll
      };
    }else{
       obj = {
        limit: this.page.size,
        page: this.page.pageNumber + 1
      };
    }

    if(this.ptype.id != 0){
      obj.product_type = this.ptype.id;
    }

    this._service.get('purchase/get-purchase-list',obj).subscribe(res => {
      if (!res) {
        this.toastr.error(res.Message, 'Error!', { timeOut: 2000 });
        return;
      }
      this.rows = res.results;
      this.page.totalElements = res.count;
      this.page.totalPages = Math.ceil(this.page.totalElements / this.page.size);
      setTimeout(() => {
        this.loadingIndicator = false;
      }, 1000);
    }, err => {
      this.toastr.error(err.Msg || err, 'Error!', { timeOut: 2000 });
      setTimeout(() => {
        this.loadingIndicator = false;
      }, 1000);
    }
    );
  }

  getSupplementaryList() {
    const obj = {
      supplier_id: this.selectedSupplier.id,
      limit: 10000,
      page: 1
    };

    this._service.get('stock/get-supplementary-list',obj).subscribe(res => {
      if (!res) {
        this.toastr.error(res.Message, 'Error!', { timeOut: 2000 });
        return;
      }
      this.supplementaryList = res.results;

    }, err => {
      this.toastr.error(err.Msg || err, 'Error!', { timeOut: 2000 });
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


    this.purchaseItemList.filter(x=> Number(x.qty) != 0).forEach(element => {
      purchase_details.push({
        qty: Number(element.qty),
        total_amount: 0
      });
    });

    if(purchase_details.length < 1 ){
        this.toastr.warning("Qty can't be empty", 'Warning!', { timeOut: 4000 });
        return;
    }


    const obj = {
      supplier:this.entryFormSIM.value.supplier,
      total_amount:0,
      delivery_received_at: this.datePipe.transform(this.entryFormSIM.value.delivery_date, "yyyy-MM-dd"),
      model_name:this.purchaseItemList[0].model_name,
      plan_name:this.purchaseItemList[0].plan_name,
      plan_price_for_admin:Number(this.purchaseItemList[0].plan_price_for_admin),
      reissue_cost_for_admin:Number(this.purchaseItemList[0].reissue_cost_for_admin),
      payment_cycle_for_admin: Number(this.purchaseItemList[0].payment_cycle_for_admin),
      purchase_details:purchase_details,
      sim_type:this.entryFormSIM.value.sim_type.id
     // is_phone_sim:this.entryFormSIM.value.is_phone_sim ? this.entryFormSIM.value.is_phone_sim : false
    };

    this.blockUI.start('Saving...');
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
        this.toastr.error(err.Msg || err, 'Error!', { timeOut: 2000 });
      }
    );

  }

  onFormSubmitDevice() {
    this.submitted = true;
    if (this.entryFormDevice.invalid) {
      return;
    }
    let purchase_details = [];

    this.purchaseItemList.filter(x=> Number(x.qty) != 0 ).forEach(element => {
      purchase_details.push({

        qty: Number(element.qty),
        total_amount: 0
      });
    });

    if(purchase_details.length < 1 ){
        this.toastr.warning("Qty can't be empty", 'Warning!', { closeButton: true, disableTimeOut: true });
        return;
    }

    this.blockUI.start('Saving...');

    const obj = {
      supplier:this.entryFormDevice.value.supplier,
      total_amount: 0, //Number(this.totalAmount),
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
        this.toastr.error(err.Msg || err, 'Error!', { timeOut: 2000 });
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
      purchase_details:purchase_details,
      is_phone_sim: this.entryFormSIMDevice.value.is_phone_sim ? this.entryFormSIMDevice.value.is_phone_sim : false
    };

    this.blockUI.start('Saving...');

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
        this.toastr.error(err.Msg || err, 'Error!', { timeOut: 2000 });
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
    this.selectedSupplier = null;
  }

  modalHideDevice() {
    this.entryFormDevice.reset();
    this.modalRef.hide();
    this.submitted = false;
    this.modalTitleDevice = 'Add Device';
    this.btnSaveText = 'Save';
    this.purchaseItemList = [];
    this.totalAmount = 0;
    this.selectedSupplier = null;
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

  onSupplierChange(e){
    this.purchaseItemList = [];
    this.entryFormSIM.controls['supplement'].setValue(null);
    this.selectedSupplier = e;
    if(this.selectedSupplier){
      this.getSupplementaryList();
    }

  }

  onSupplementChange(e){
    this.purchaseItemList = [];
    this.purchaseItemList.push({
      "product_type":1,
      "model_name":e.model_name,
      "plan_name":e.plan_name,
      "plan_price_for_admin":e.plan_price_for_admin,
      "reissue_cost_for_admin":e.reissue_cost_for_admin,
      "payment_cycle_for_admin":e.payment_cycle_for_admin,
      "qty":0,
      "amount":0
    });
  }

  openModalSIM(template: TemplateRef<any>) {
  // let simProductList =  this.productTypeList.filter(x=> x.product_type == 1);
  // simProductList.forEach(element => {
  //   this.purchaseItemList.push({
  //     "product_type_id":element.id,
  //     "product_type":element.product_type,
  //     "qty":0,
  //     "amount":0
  //   });
  // });
    this.entryFormSIM.controls["sim_type"].setValue({id:2,name:'WiFi SIM'});

     this.modalRef = this.modalService.show(template, this.modalConfigXL);
  }

  openModalDevice(template: TemplateRef<any>) {
  // let deviceProductList =  this.productTypeList.filter(x=> x.product_type  != 1);

    this.purchaseItemList.push({

      "product_type":2,
      "qty":0
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
