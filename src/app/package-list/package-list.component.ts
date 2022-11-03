import { Component, TemplateRef, ViewChild, ElementRef, ViewEncapsulation, OnInit } from '@angular/core';
import { ColumnMode } from '@swimlane/ngx-datatable';
import { FormBuilder, FormGroup, Validators, FormArray, FormControl } from '@angular/forms';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { Router } from '@angular/router';
import { CommonService } from '../_services/common.service';
import { ToastrService } from 'ngx-toastr';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { Page } from '../_models/page';


@Component({
  selector: 'app-package-list',
  templateUrl: './package-list.component.html',
  encapsulation: ViewEncapsulation.None
})

export class PackageListComponent implements OnInit {

  entryForm: FormGroup;
  planHistoryList: FormArray;
  planFormArray: any;
  searchParam;
  submitted = false;
  @BlockUI() blockUI: NgBlockUI;
  modalTitle = 'Create Package';
  btnSaveText = 'Save';
  modalConfig: any = { class: 'gray modal-md', backdrop: 'static' };
  modalConfigLg: any = { class: "gray modal-lg", backdrop: "static" };
  modalRef: BsModalRef;

  page = new Page();
  emptyGuid = '00000000-0000-0000-0000-000000000000';
  rows = [];
  offerList = [];
  planList = [];
  durationList = [];
  tempDurationList = [];
  loadingIndicator = false;
  ColumnMode = ColumnMode;
  packageObj = null;
  scrollBarHorizontal = (window.innerWidth < 1200);

  isDeviceEnable = false;
  isPhoneSimEnable = true;
  selectedOffer;
  selectedDuration;

  simTypeList = [{id:0,name:'All'},{id:1,name:'Phone SIM'},{id:2,name:'WiFi SIM '},{id:3,name:'Device Only'}]

  ceatePackageSimTypeList = [{id:1,name:'Phone SIM'},{id:2,name:'WiFi SIM '},{id:3,name:'Device Only'}]

  selectedCeatePackageSimType = {id:1,name:'Phone SIM'};

  selectedSimType = {id:0,name:'All'};

  constructor(
    private modalService: BsModalService,
    public formBuilder: FormBuilder,
    private _service: CommonService,
    private toastr: ToastrService,
    private router: Router
  ) {
    this.page.pageNumber = 0;
    this.page.size = 10;
    window.onresize = () => {
      this.scrollBarHorizontal = (window.innerWidth < 1200);
    };
  }


  ngOnInit() {
    this.entryForm = this.formBuilder.group({
      pckg_name: [null, [Validators.required, Validators.maxLength(550)]],
      pckg_offer: [null, [Validators.required]],
      pckg_plan: [null, [Validators.required]],
      is_phone_sim: [false],
      has_device_dependency: [true],
      pckg_duration: [null, [Validators.required]],
      device_deposit: [null],
      pckg_initial_fee: [null, [Validators.required]],
      pckg_shipping_charge: [null],
      pckg_price: [null, [Validators.required]],
      pckg_initial_discount: [null, [Validators.required]],
      pckg_first_bill_amount: [{value: null, disabled: true}, [Validators.required]],
      pckg_recurring_bill_amount: [null, [Validators.required]],
      pckg_cancellation_fee: [null],
      pckg_refundable_deposit: [null],
      sim_type:[null, [Validators.required]]

    });
    this.getList();
    this.getOfferList();
    this.getPlanList();
    this.getDurationList();
  }

  get f() {
    return this.entryForm.controls;
  }

  onOfferTypeChange(e){

    this.entryForm.controls["pckg_duration"].setValue(null);
    // this.tempDurationList = this.durationList.filter((x)=> x.pckg_duration_in_month <= e.pckg_offer_month_covers);
    this.selectedOffer = e;

  }

  onDurationChange(e){
    this.selectedDuration = e;
  }


  onCeatePackageSimTypeChange(e){
    if(e){
    this.selectedCeatePackageSimType = e;
      if(e.id == 1){
      this.isDeviceEnable = false;
      this.isPhoneSimEnable = true;

      this.entryForm.controls["has_device_dependency"].setValue(false);
      this.entryForm.controls["device_deposit"].setValidators(null);
      this.entryForm.controls["device_deposit"].updateValueAndValidity();

      this.entryForm.controls["pckg_refundable_deposit"].setValidators(null);
      this.entryForm.controls["pckg_refundable_deposit"].updateValueAndValidity();

      }else{
      this.isPhoneSimEnable = false;
      this.isDeviceEnable = true;
      this.entryForm.controls["has_device_dependency"].setValue(true);

      this.entryForm.controls["device_deposit"].setValidators([Validators.required]);
      this.entryForm.controls["device_deposit"].updateValueAndValidity();

      this.entryForm.controls["pckg_refundable_deposit"].setValidators([Validators.required]);
      this.entryForm.controls["pckg_refundable_deposit"].updateValueAndValidity();

      }

    }
  }

  // onPhoneSIMChange(e){
    // this.isPhoneSimEnable = e;
    // if(e){
    //   this.isDeviceEnable = false;

    //   this.entryForm.controls["has_device_dependency"].setValue(false);
    //   this.entryForm.controls["device_deposit"].setValidators(null);
    //   this.entryForm.controls["device_deposit"].updateValueAndValidity();

    //   this.entryForm.controls["pckg_refundable_deposit"].setValidators(null);
    //   this.entryForm.controls["pckg_refundable_deposit"].updateValueAndValidity();


    // }else{
    //   this.isDeviceEnable = true;
    //   this.entryForm.controls["has_device_dependency"].setValue(true);

    //   this.entryForm.controls["device_deposit"].setValidators([Validators.required]);
    //   this.entryForm.controls["device_deposit"].updateValueAndValidity();

    //   this.entryForm.controls["pckg_refundable_deposit"].setValidators([Validators.required]);
    //   this.entryForm.controls["pckg_refundable_deposit"].updateValueAndValidity();

    // }


    // if(!this.isDeviceEnable){
    //  this.entryForm.controls["device_deposit"].setValidators([Validators.required]);
    //  this.entryForm.controls["device_deposit"].updateValueAndValidity();

    //  this.entryForm.controls["pckg_refundable_deposit"].setValidators([Validators.required]);
    //  this.entryForm.controls["pckg_refundable_deposit"].updateValueAndValidity();
    // }else{
    //   this.entryForm.controls["device_deposit"].setValidators(null);
    //   this.entryForm.controls["device_deposit"].updateValueAndValidity();

    //   this.entryForm.controls["pckg_refundable_deposit"].setValidators(null);
    //   this.entryForm.controls["pckg_refundable_deposit"].updateValueAndValidity();
    // }

  // }

  onDeviceChange(e){
    this.entryForm.controls['device_deposit'].setValue(null);
    this.entryForm.controls['pckg_refundable_deposit'].setValue(null);

    this.isDeviceEnable = e;

    if(this.isDeviceEnable){
     this.entryForm.controls["device_deposit"].setValidators([Validators.required]);
     this.entryForm.controls["device_deposit"].updateValueAndValidity();

     this.entryForm.controls["pckg_refundable_deposit"].setValidators([Validators.required]);
     this.entryForm.controls["pckg_refundable_deposit"].updateValueAndValidity();
    }else{
      this.entryForm.controls["device_deposit"].setValidators(null);
      this.entryForm.controls["device_deposit"].updateValueAndValidity();

      this.entryForm.controls["pckg_refundable_deposit"].setValidators(null);
      this.entryForm.controls["pckg_refundable_deposit"].updateValueAndValidity();
    }
  }

  getOfferList() {
    this._service.get("package/get-package-offer-list").subscribe(
      (res) => {
        this.offerList = res.results;
      },
      (err) => {}
    );
  }

  getPlanList() {
    this._service.get("package/get-data-plan-list").subscribe(
      (res) => {
        this.planList = res.results;
      },
      (err) => {}
    );
  }

  getDurationList() {
    this._service.get("package/get-package-duration-list").subscribe(
      (res) => {
        this.durationList = res.results;
      },
      (err) => {}
    );
  }

  setPage(pageInfo) {
    this.page.pageNumber = pageInfo.offset;
    this.getList();
  }

  cal(){
    let amount = 0;
    const device_deposit =  Number(this.entryForm.value.device_deposit);
    const pckg_initial_fee =  Number(this.entryForm.value.pckg_initial_fee);
    const pckg_shipping_charge =  Number(this.entryForm.value.pckg_shipping_charge);
    const pckg_price =  Number(this.entryForm.value.pckg_price);
    let pckg_initial_discount =  Number(this.entryForm.value.pckg_initial_discount);
    const sub = device_deposit + pckg_initial_fee + pckg_shipping_charge + pckg_price;

    if(sub < pckg_initial_discount){
      this.entryForm.controls['pckg_initial_discount'].setValue(0);
      amount = sub;

    }else{
      amount = sub - pckg_initial_discount;
    }

    this.entryForm.controls['pckg_first_bill_amount'].setValue(amount);
  }


  filterSearch(e) {
    if (e) {
      this.page.pageNumber = 0;
      this.page.size = 10;
      this.searchParam = e.target.value;
      this.getList();
    }
  }

  onPhoneSIMChangeFilter(e){
    this.page.pageNumber = 0;
    this.page.size = 10;
    this.getList();
  }

  onSimTypeChange(e){
    this.page.pageNumber = 0;
    this.page.size = 10;
    if(e){
    this.selectedSimType = e;
    this.getList();
    }else{
      this.selectedSimType = {id:0,name:'All'};
      this.getList();
    }
  }

  getList() {
    this.loadingIndicator = true;

    let obj;
    if(this.searchParam){
      obj = {
        limit: this.page.size,
        page: this.page.pageNumber + 1,
        search_param:this.searchParam
      };
    }else{
       obj = {
        limit: this.page.size,
        page: this.page.pageNumber + 1
      };
    }

    if(this.selectedSimType.id != 0){
      obj.sim_type = this.selectedSimType.id;
    }

    // if(this.isPhoneSIM){
    //   obj.has_phone_sim_dependency = 1;
    // }else{
    //   obj.has_phone_sim_dependency = 0;
    // }

    this._service.get('package/get-package-list',obj).subscribe(res => {

      if (!res) {
        this.toastr.error(res.Message, 'Error!', { closeButton: true, disableTimeOut: true });
        return;
      }
      this.rows = res.results;
      this.page.totalElements = res.count;
      this.page.totalPages = Math.ceil(this.page.totalElements / this.page.size);
      setTimeout(() => {
        this.loadingIndicator = false;
      }, 1000);
    }, err => {
      this.toastr.error(err.Msg || err, 'Error!', { closeButton: true, disableTimeOut: true });
      setTimeout(() => {
        this.loadingIndicator = false;
      }, 1000);
    }
    );
  }

  // getItem(id) {
  //   this.blockUI.start('Getting data...');
  //   this._service.get('product-type/get/' + id).subscribe(res => {

  //     this.blockUI.stop();

  //     if (!res) {
  //       this.toastr.error(res.Message, 'Error!', { timeOut: 2000 });
  //       return;
  //     }
  //     this.formTitle = 'Update ProductType';
  //     this.btnSaveText = 'Update';
  //     this.entryForm.controls['Id'].setValue(res.Record.Id);
  //     this.entryForm.controls['Name'].setValue(res.Record.Name);

  //   }, err => {
  //     this.blockUI.stop();
  //     this.toastr.error(err.Msg || err, 'Error!', { closeButton: true, disableTimeOut: true });
  //   });
  // }

  onFormSubmit() {
    this.submitted = true;
    if (this.entryForm.invalid) {
      return;
    }


    if(this.selectedDuration.pckg_duration_in_month < this.selectedOffer.pckg_offer_month_covers){
      this.toastr.warning('Offer month and duration must be equal.', 'Warning!', { timeOut: 2000 });
      return;
    }


  this.blockUI.start('Saving...');

    let packageArray = [];
    let packageObj = {
      pckg_name: this.entryForm.value.pckg_name.trim(),
      pckg_offer: this.entryForm.value.pckg_offer,
      pckg_plan: this.entryForm.value.pckg_plan,
      has_device_dependency: this.entryForm.value.has_device_dependency,
      device_deposit: this.entryForm.value.device_deposit ? Number(this.entryForm.value.device_deposit) : 0,
      pckg_initial_fee: this.entryForm.value.pckg_initial_fee ? Number(this.entryForm.value.pckg_initial_fee) : 0,
      pckg_shipping_charge: this.entryForm.value.pckg_shipping_charge ? Number(this.entryForm.value.pckg_shipping_charge) : 0,
      pckg_price: this.entryForm.value.pckg_price ? Number(this.entryForm.value.pckg_price) : 0,
      pckg_initial_discount: this.entryForm.value.pckg_initial_discount ? Number(this.entryForm.value.pckg_initial_discount) : 0,
      pckg_first_bill_amount: this.entryForm.getRawValue().pckg_initial_discount ? Number(this.entryForm.getRawValue().pckg_first_bill_amount) : 0,
      pckg_recurring_bill_amount: this.entryForm.value.pckg_recurring_bill_amount ? Number(this.entryForm.value.pckg_recurring_bill_amount) : 0,
      pckg_cancellation_fee: this.entryForm.value.pckg_cancellation_fee ? Number(this.entryForm.value.pckg_cancellation_fee) : 0,
      pckg_refundable_deposit: this.entryForm.value.pckg_refundable_deposit ? Number(this.entryForm.value.pckg_refundable_deposit) : 0,
      pckg_duration: this.entryForm.value.pckg_duration,
      has_phone_sim_dependency:this.isPhoneSimEnable,
      sim_type:this.entryForm.value.sim_type.id
    };

    packageArray.push(packageObj);
    const obj = {
      packages: packageArray
    };

      const request = this._service.post('package/save-package', obj);

    request.subscribe(
      data => {
        this.blockUI.stop();
        if (data.IsReport == "Success") {
          this.toastr.success(data.Msg, 'Success!', { timeOut: 2000 });
          this.getList();
          this.modalHide();
        } else if (data.IsReport == "Warning") {
          this.toastr.warning(data.Msg, 'Warning!', { closeButton: true, disableTimeOut: true });
        } else {
          this.toastr.error(data.Msg, 'Error!', { closeButton: true, disableTimeOut: true });
        }
      },
      err => {
        this.blockUI.stop();
        this.toastr.error(err.Msg || err, 'Error!', { closeButton: true, disableTimeOut: true });
      }
    );

  }

  modalHide() {
    this.entryForm.reset();
    this.modalRef.hide();
    this.submitted = false;
    this.modalTitle = 'Create Package';
    this.btnSaveText = 'Save';

    this.selectedOffer = null;
    this.selectedDuration = null;
    this.selectedCeatePackageSimType = null;
  }

  openModal(template: TemplateRef<any>) {
      this.entryForm.controls["has_device_dependency"].setValue(true);
      this.isDeviceEnable = false;
      this.isPhoneSimEnable = true;
      this.entryForm.controls["sim_type"].setValue({id:1,name:'Phone SIM'});
      this.selectedCeatePackageSimType = {id:1,name:'Phone SIM'};

      this.modalRef = this.modalService.show(template, this.modalConfigLg);
  }

  modalHidePackageDetails() {
    this.modalRef.hide();
    this.packageObj = null;
  }

  openModalPackageDetails(template: TemplateRef<any>,row) {
    this.packageObj = row;
    this.modalRef = this.modalService.show(template, this.modalConfigLg);
  }
}
