import {
  Component,
  TemplateRef,
  ViewChild,
  ElementRef,
  ViewEncapsulation,
  OnInit,
} from "@angular/core";
import { BsModalService, BsModalRef } from "ngx-bootstrap/modal";
import { ColumnMode } from "@swimlane/ngx-datatable";
import {
  FormBuilder,
  FormGroup,
  Validators,
  FormArray,
  FormControl,
} from "@angular/forms";
import { Router } from "@angular/router";
import { CommonService } from "./../_services/common.service";
import { ToastrService } from "ngx-toastr";
import { BlockUI, NgBlockUI } from "ng-block-ui";
import { BsDatepickerConfig } from "ngx-bootstrap/datepicker";
import { Page } from "./../_models/page";
import { ConfirmService } from '../_helpers/confirm-dialog/confirm.service';
import { AuthenticationService } from './../_services/authentication.service';
import * as moment from 'moment';

import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Subject, Observable, of, concat } from 'rxjs';
import { distinctUntilChanged, debounceTime, switchMap, tap, catchError, filter, map } from 'rxjs/operators';

import { PrintService } from '../_services/print.service';

@Component({
  selector: "app-sell-product",
  templateUrl: "./sell-product.component.html",
  encapsulation: ViewEncapsulation.None,
})
export class SellProductComponent implements OnInit {
  RegistrerForm: FormGroup;
  entryForm: FormGroup;
  itemHistoryList: FormArray;
  itemFormArray: any;

  fromRowData:any;

  subTotal:number =0;
  discount:number=0;
  grandTotal:number=0;

  submitted = false;
  submittedCustomer = false;
  @BlockUI() blockUI: NgBlockUI;
  modalTitle = "Add ";
  btnSaveText = "CONFIRM & CREATE INVOICE";

  modalConfig: any = { class: "gray modal-md", backdrop: "static" };
  modalConfigLg: any = { class: "gray modal-lg", backdrop: "static" };
  modalRef: BsModalRef;

  page = new Page();
  pageSIM = new Page();
  pageDevice = new Page();
  rows = [];
  loadingIndicator = false;
  ColumnMode = ColumnMode;
  scrollBarHorizontal = window.innerWidth < 1200;
  bsConfig: Partial<BsDatepickerConfig>;

  customerList: Array<any> = [];
  packageList: Array<any> = [];
  simList: Array<any> = [];
  deviceList: Array<any> = [];
  platformList: Array<any> = [];
  remarks = '';

  packageObj = null;

// for customer
  selectedCustomer = null;
  customers = [];
  customersBuffer = [];
  bufferSize = 50;
  numberOfItemsFromEndBeforeFetchingMore = 10;
  loading = false;
  count=1;
  searchParam = '';
  input$ = new Subject<string>();

// for sim
  sims = [];
  simsBuffer = [];
  simsBufferSize = 50;
  loadingSIM = false;
  simsCount=1;
  simsSearchParam = '';
  simsInput$ = new Subject<string>();

   // for device
   devices = [];
   devicesBuffer = [];
   devicesBufferSize = 50;
   loadingDevice = false;
   devicesCount = 1;
   devicesSearchParam = '';
   devicesInput$ = new Subject<string>();


  constructor(
    private authService: AuthenticationService,
    private confirmService: ConfirmService,
    private modalService: BsModalService,
    public formBuilder: FormBuilder,
    private _service: CommonService,
    private toastr: ToastrService,
    private http: HttpClient,
    private router: Router,
    public printService: PrintService
  ) {
    this.page.pageNumber = 1;
    this.page.size = 50;

    this.pageSIM.pageNumber = 1;
    this.pageSIM.size = 50;

    this.pageDevice.pageNumber = 1;
    this.pageDevice.size = 50;

    window.onresize = () => {
      this.scrollBarHorizontal = window.innerWidth < 1200;
    };
    this.bsConfig = Object.assign(
      {},
      {
        dateInputFormat: "DD-MMM-YYYY ",
      }
    );
  }

  ngOnInit() {
    this.entryForm = this.formBuilder.group({
      id: [null],
      customer: [null, [Validators.required]],
      session: [null, [Validators.required]],
      itemHistory: this.formBuilder.array([this.initItemHistory()]),
    });

    this.RegistrerForm = this.formBuilder.group({
      email: [null, [Validators.required, Validators.email, Validators.maxLength(50)]],
      mobile: [null, [Validators.required]],
      firstName: [null, [Validators.required]],
      lastName: [null, [Validators.required]],
      customerType: ['Wholesaler']
    });

    this.entryForm.get('session').disable();
    this.entryForm.get('session').setValue(moment().format('MMM-YYYY'));
    this.itemHistoryList = this.entryForm.get("itemHistory") as FormArray;
    this.itemFormArray = this.entryForm.get("itemHistory")["controls"];

   // this.getCustomerList();
    this.getPackageList();
    this.getPlatformList();

    this.getCustomer();
    this.onSearch();

    this.getSIM();
    this.onSearchSIM();

    this.getDevice();
    this.onSearchDevice();

  }


   
  

onSearch() {
    this.input$.pipe(
      debounceTime(200),
      distinctUntilChanged(),
      switchMap(term => this.fakeServiceCustomer(term))
    ).subscribe((data : any) => {
      this.customers = data.results;
      this.page.totalElements = data.count;
      this.page.totalPages = Math.ceil(this.page.totalElements / this.page.size);
      this.customersBuffer = this.customers.slice(0, this.bufferSize);
      })
  }

  onCustomerChange(e){
    if(e){
      this.selectedCustomer = e;
    }else{
      this.selectedCustomer = null;
    }
  }

onScrollToEnd() {
      this.fetchMore();
  }

onScroll({ end }) {
    if (this.loading || this.customers.length <= this.customersBuffer.length) {
        return;
    }

    if (end + this.numberOfItemsFromEndBeforeFetchingMore >= this.customersBuffer.length) {
        this.fetchMore();
    }
}

private fetchMore() {

    let more;
   // const len = this.customersBuffer.length;
    if(this.count < this.page.totalPages){
    this.count++;
    this.page.pageNumber = this.count;
    let obj;
    if(this.searchParam){
       obj = {
        limit: this.page.size,
        page: this.page.pageNumber,
        search_param:this.searchParam
      };
    }else{
       obj = {
        limit: this.page.size,
        page: this.page.pageNumber
      };
    }
      this._service.get("get-customer-list",obj).subscribe(
        (res) => {
          more = res.results;
          //  const more = this.customers.slice(len, this.bufferSize + len);
          this.loading = true;
          // using timeout here to simulate backend API delay
          setTimeout(() => {
              this.loading = false;
              this.customersBuffer = this.customersBuffer.concat(more);
          }, 100)
        },
        (err) => {}
      );
    }

}


getCustomer(){
  let obj;
  if(this.searchParam){
     obj = {
      limit: this.page.size,
      page: this.page.pageNumber,
      search_param:this.searchParam
    };
  }else{
     obj = {
      limit: this.page.size,
      page: this.page.pageNumber
    };
  }

  this._service.get("get-customer-list",obj).subscribe(
    (res) => {
      this.customers = res.results;
      this.page.totalElements = res.count;
      this.page.totalPages = Math.ceil(this.page.totalElements / this.page.size);
      this.customersBuffer = this.customers.slice(0, this.bufferSize);
    },
    (err) => {}
  );
}

private fakeServiceCustomer(term) {

  this.page.size = 50;
  this.page.pageNumber = 1;
  this.searchParam = term;

  let obj;
  if(this.searchParam){
     obj = {
      limit: this.page.size,
      page: this.page.pageNumber,
      search_param:this.searchParam
    };
  }else{
     obj = {
      limit: this.page.size,
      page: this.page.pageNumber
    };
  }

  let params = new HttpParams();
  if (obj) {
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        params = params.append(key, obj[key]);
      }
    }
  }
  return this.http.get<any>(environment.apiUrl + 'get-customer-list', { params }).pipe(
    map(res => {
      return res;
    })
  );
}



/// for SIM
  onSearchSIM() {
    this.simsInput$.pipe(
      debounceTime(200),
      distinctUntilChanged(),
      switchMap(term => this.fakeServiceSIM(term))
    ).subscribe((data : any) => {
      this.sims = data.results;
      this.pageSIM.totalElements = data.count;
      this.pageSIM.totalPages = Math.ceil(this.pageSIM.totalElements / this.pageSIM.size);
      this.simsBuffer = this.sims.slice(0, this.simsBufferSize);
      })
  }

 onScrollToEndSIM() {
      this.fetchMoreSIM();
  }

onScrollSIM({ end }) {
    if (this.loadingSIM || this.sims.length <= this.simsBuffer.length) {
        return;
    }

    if (end + this.numberOfItemsFromEndBeforeFetchingMore >= this.simsBuffer.length) {
        this.fetchMoreSIM();
    }
}

private fetchMoreSIM() {

    let more;

    if(this.simsCount < this.pageSIM.totalPages){
    this.simsCount++;
    this.pageSIM.pageNumber = this.simsCount;
    let obj;
    if(this.simsSearchParam){
       obj = {
        limit: this.pageSIM.size,
        page: this.pageSIM.pageNumber,
        search_param:this.simsSearchParam
      };
    }else{
       obj = {
        limit: this.pageSIM.size,
        page: this.pageSIM.pageNumber
      };
    }
      this._service.get("stock/get-subscriptable-sim-list",obj).subscribe(
        (res) => {
          console.log(res);
          more = res.results;
          //  const more = this.customers.slice(len, this.bufferSize + len);
          this.loadingSIM = true;
          // using timeout here to simulate backend API delay
          setTimeout(() => {
              this.loadingSIM = false;
              this.simsBuffer = this.simsBuffer.concat(more);
          }, 100)
        },
        (err) => {}
      );
    }

}


getSIM(){
  let obj;
  if(this.simsSearchParam){
     obj = {
      limit: this.pageSIM.size,
      page: this.pageSIM.pageNumber,
      search_param:this.simsSearchParam
    };
  }else{
     obj = {
      limit: this.pageSIM.size,
      page: this.pageSIM.pageNumber
    };
  }

  this._service.get("stock/get-subscriptable-sim-list",obj).subscribe(
    (res) => {
      this.sims = res.results;
      this.pageSIM.totalElements = res.count;
      this.pageSIM.totalPages = Math.ceil(this.pageSIM.totalElements / this.pageSIM.size);
      this.simsBuffer = this.sims.slice(0, this.simsBufferSize);
    },
    (err) => {}
  );
}

private fakeServiceSIM(term) {

  this.pageSIM.size = 50;
  this.pageSIM.pageNumber = 1;
  this.simsSearchParam = term;

  let obj;
  if(this.simsSearchParam){
     obj = {
      limit: this.pageSIM.size,
      page: this.pageSIM.pageNumber,
      search_param:this.simsSearchParam
    };
  }else{
     obj = {
      limit: this.pageSIM.size,
      page: this.pageSIM.pageNumber
    };
  }

  let params = new HttpParams();
  if (obj) {
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        params = params.append(key, obj[key]);
      }
    }
  }
  return this.http.get<any>(environment.apiUrl + 'stock/get-subscriptable-sim-list', { params }).pipe(
    map(res => {
      return res;
    })
  );
}



  /// for Device
  onSearchDevice() {
    this.devicesInput$.pipe(
      debounceTime(200),
      distinctUntilChanged(),
      switchMap(term => this.fakeServiceDevice(term))
    ).subscribe((data: any) => {
      this.devices = data.results;
      this.pageDevice.totalElements = data.count;
      this.pageDevice.totalPages = Math.ceil(this.pageDevice.totalElements / this.pageDevice.size);
      this.devicesBuffer = this.devices.slice(0, this.devicesBufferSize);
    })
  }

  onScrollToEndDevice() {
    this.fetchMoreDevice();
  }

  onScrollDevice({ end }) {
    if (this.loadingDevice || this.devices.length <= this.devicesBuffer.length) {
      return;
    }

    if (end + this.numberOfItemsFromEndBeforeFetchingMore >= this.devicesBuffer.length) {
      this.fetchMoreDevice();
    }
  }

  private fetchMoreDevice() {

    let more;

    if (this.devicesCount < this.pageDevice.totalPages) {
      this.devicesCount++;
      this.pageDevice.pageNumber = this.devicesCount;
      let obj;
      if (this.devicesSearchParam) {
        obj = {
          limit: this.pageDevice.size,
          page: this.pageDevice.pageNumber,
          search_param: this.devicesSearchParam
        };
      } else {
        obj = {
          limit: this.pageDevice.size,
          page: this.pageDevice.pageNumber
        };
      }
      this._service.get("stock/get-available-device-list", obj).subscribe(
        (res) => {
          more = res.results;
          //  const more = this.customers.slice(len, this.bufferSize + len);
          this.loadingDevice = true;
          // using timeout here to simulate backend API delay
          setTimeout(() => {
            this.loadingDevice = false;
            this.devicesBuffer = this.devicesBuffer.concat(more);
          }, 100)
        },
        (err) => { }
      );
    }

  }


  getDevice() {
    let obj;
    if (this.devicesSearchParam) {
      obj = {
        limit: this.pageDevice.size,
        page: this.pageDevice.pageNumber,
        search_param: this.devicesSearchParam
      };
    } else {
      obj = {
        limit: this.pageDevice.size,
        page: this.pageDevice.pageNumber
      };
    }

    this._service.get("stock/get-available-device-list", obj).subscribe(
      (res) => {
        this.devices = res.results;
        this.pageDevice.totalElements = res.count;
        this.pageDevice.totalPages = Math.ceil(this.pageDevice.totalElements / this.pageDevice.size);
        this.devicesBuffer = this.devices.slice(0, this.devicesBufferSize);
      },
      (err) => { }
    );
  }

  private fakeServiceDevice(term) {

    this.pageDevice.size = 50;
    this.pageDevice.pageNumber = 1;
    this.devicesSearchParam = term;

    let obj;
    if (this.devicesSearchParam) {
      obj = {
        limit: this.pageDevice.size,
        page: this.pageDevice.pageNumber,
        search_param: this.devicesSearchParam
      };
    } else {
      obj = {
        limit: this.pageDevice.size,
        page: this.pageDevice.pageNumber
      };
    }

    let params = new HttpParams();
    if (obj) {
      for (const key in obj) {
        if (obj.hasOwnProperty(key)) {
          params = params.append(key, obj[key]);
        }
      }
    }
    return this.http.get<any>(environment.apiUrl + 'stock/get-available-device-list', { params }).pipe(
      map(res => {
        return res;
      })
    );
  }



  get f() {
    return this.entryForm.controls;
  }

  get item_his(): FormArray {
    return this.entryForm.get("itemHistory") as FormArray;
  }

  get c() {
    return this.RegistrerForm.controls;
  }

  customSearchFn(term: string, item: any) {
    term = term.toLocaleLowerCase();
    let name = item.first_name +" "+item.last_name;
    return item.customer_code.toLocaleLowerCase().indexOf(term) > -1 ||
           name.toLocaleLowerCase().indexOf(term) > -1 ||
           item.first_name.toLocaleLowerCase().indexOf(term) > -1 ||
           item.last_name.toLocaleLowerCase().indexOf(term) > -1 ||
           item.mobile.toLocaleLowerCase().indexOf(term) > -1;
    }

  initItemHistory() {
    return this.formBuilder.group({
      package: [null, [Validators.required]],
      package_item: [null],
      has_device_dependency : [true],
      platform: [null, [Validators.required]],
      sim: [null, [Validators.required]],
      phone_number: [null, [Validators.required]],
      sim_iccid: [null, [Validators.required]],
      device: [null],
      IMEI: [null],
      plan: [null, [Validators.required]],
      actual_amount: [{value: null, disabled: true}, [Validators.required]],
      discount: [{value: 0, disabled: true}],
      amount: [null, [Validators.required]],
    });
  }

  addItemHistory() {
    this.itemHistoryList.push(this.initItemHistory());
  }

  removeItemHistory(i) {
    if (this.itemHistoryList.length > 1) {
      this.itemHistoryList.removeAt(i);
    }
  }





  getCustomerList() {
    this._service.get("user-list?is_customer=true").subscribe(
      (res) => {
        this.customerList = res;
      },
      (err) => {}
    );
  }

  getSIMList() {
    this._service.get("stock/get-subscriptable-sim-list").subscribe(
      (res) => {
        this.simList = res;
      },
      (err) => {}
    );
  }

  getPackageList() {
    this._service.get("package/get-package-list").subscribe(
      (res) => {
        this.packageList = res.results;
      },
      (err) => {}
    );
  }

  getPlatformList() {
    this._service.get("package/get-package-selling-platform-list").subscribe(
      (res) => {
        this.platformList = res.results;
      },
      (err) => {}
    );
  }

  onSIMChange(e, item) {
    if(e){
      if (e.ICCID_no){
        item.controls["sim_iccid"].setValue(e.ICCID_no);
        item.controls["sim_iccid"].disable();

        if (e.phone_number){
         item.controls["phone_number"].setValue(e.phone_number);
         item.controls["phone_number"].disable();
        }else{
         item.controls["phone_number"].setValue(null);
         item.controls["phone_number"].enable();
        }

       }else {
         item.controls["sim_iccid"].setValue(null);
         item.controls["sim_iccid"].enable();

         item.controls["phone_number"].setValue(null);
         item.controls["phone_number"].enable();
       }
    }else{
      item.controls["sim_iccid"].setValue(null);
      item.controls["phone_number"].setValue(null);
      item.controls["sim_iccid"].disable();
      item.controls["phone_number"].disable();
    }


  }

  onDeviceChange(e, item) {
    if(e){
      if (e.IMEI){
        item.controls["IMEI"].setValue(e.IMEI);
        item.controls["IMEI"].disable();
       }else {
         item.controls["IMEI"].setValue(null);
         item.controls["IMEI"].enable();
       }
    }else{
      item.controls["IMEI"].setValue(null);
      item.controls["IMEI"].disable();
    }

  }

  onPackageChange(e, item) {

    item.controls["sim"].setValue(null);
    item.controls["sim_iccid"].setValue(null);
    item.controls["phone_number"].setValue(null);
    item.controls["device"].setValue(null);
    item.controls["IMEI"].setValue(null);
    item.controls["plan"].setValue(null);

    if (e){
      console.log(e);
      
       item.controls["package_item"].setValue(e);      
       item.controls["plan"].setValue(e.plan);
       item.controls["has_device_dependency"].setValue(e.has_device_dependency);
       if(e.has_device_dependency){
        item.controls["device"].setValidators([Validators.required]);
        item.controls["device"].updateValueAndValidity();

        item.controls["IMEI"].setValidators([Validators.required]);
        item.controls["IMEI"].updateValueAndValidity();
       }else{
        item.controls["device"].setValidators(null);
        item.controls["device"].updateValueAndValidity();

        item.controls["IMEI"].setValidators(null);
        item.controls["IMEI"].updateValueAndValidity();
       }
       item.controls["amount"].setValue(e.pckg_first_bill_amount);
      }else {
        item.controls["platform"].setValue(null);
      }
  }

  onChangeDiscount(value) {
    if (Number(value) > this.subTotal) {
      this.toastr.warning('Discount amount can\'t be greater then total amount : '+this.subTotal, 'Warning!',  { timeOut: 4000 });
      this.discount = 0;
    }else if(value == ''){
      this.discount = 0;
    }else {
      this.discount = Number(value);     
    }
  }



  inputFocused(event: any){
    event.target.select()
  }

  onFormSubmit() {
    this.submitted = true;
    if (this.entryForm.invalid) {
      return;
    }
    let bill_items = [];
    let sim_assigned = 0;
    let device_assigned = 0;
   // this.blockUI.start('Saving...');

    this.fromRowData.itemHistory.filter(x=> x.package).forEach(element => {
      bill_items.push({
            sim:element.sim.id,
            ICCID_no: element.sim_iccid,
            phone_number: element.phone_number,
            device:element.has_device_dependency ? element.device.id : null,
            IMEI: element.has_device_dependency ? element.IMEI : null,
			      pckg_name:element.package_item.pckg_name,
			      pckg_offer_name:element.package_item.pckg_offer_name,
            pckg_offer_month_covers:element.package_item.pckg_offer_month_covers,
			      plan:element.package_item.plan,
            pckg_duration_name:element.package_item.pckg_duration_name,
            pckg_duration_in_month:element.package_item.pckg_duration_in_month,
            has_device_dependency:element.package_item.has_device_dependency,
            device_deposit:element.package_item.device_deposit,
            pckg_initial_fee:element.package_item.pckg_initial_fee,
            pckg_shipping_charge:element.package_item.pckg_shipping_charge,
            pckg_price:element.package_item.pckg_price,
            pckg_initial_discount:element.package_item.pckg_initial_discount,
            pckg_first_bill_amount:element.package_item.pckg_first_bill_amount,
            pckg_recurring_bill_amount:element.package_item.pckg_recurring_bill_amount,
            pckg_cancellation_fee:element.package_item.pckg_cancellation_fee,
            pckg_refundable_deposit:element.package_item.pckg_refundable_deposit,
            selling_platform:element.platform
      });
      sim_assigned++;
      if(element.device != null) device_assigned++;
    });

    this.grandTotal = this.subTotal - this.discount;
    const obj = {
      customer:this.entryForm.value.customer,
      total_sim_assigned:sim_assigned,
      total_device_assigned:device_assigned,
      total_amount:Number(this.subTotal),
      overall_discount:Number(this.discount),
      grand_total:Number(this.grandTotal),
      bill_remarks:this.remarks,
      bill_items : bill_items

    };

    this.confirmService.confirm('Are you sure?', 'You are selling the product(s).')
    .subscribe(
        result => {
            if (result) {
            
                this._service.post('bill/create-new-bill', obj).subscribe(
                  data => {
                    this.blockUI.stop();
                    if (data.IsReport == "Success") {
                      this.toastr.success(data.Msg, 'Success!', { closeButton: true, disableTimeOut: true });
                      const customer_id = this.entryForm.value.customer;
                      this.formReset();
                      this.printService.printInv(data.bill_id);

                      this.confirmService.confirm('Do you want to collect payment now?', '','NOT NOW','Yes')
                      .subscribe(
                          result => {
                              if (result) {                               
                               this.router.navigate(['/payment-collection/'+data.bill_id]);
                              }else{
                                this.router.navigate(['/customer-details/'+customer_id]);
                              }
                          },
                      );


                      // this.router.navigate([]).then(result => { window.open('/payment-collection/'+ data.bill_id, '_blank'); });                     
                      // this.entryForm.get('session').disable();
                      // this.entryForm.get('session').setValue(moment().format('MMM-YYYY'));
                      // this.confirmService.confirm('Do You Want To Sell Device?', '','Close','Sell Device')
                      // .subscribe(
                      //     result => {
                      //         if (result) {
                      //           this.router.navigate([]).then(result => { window.open('/sell-device-by-customer/'+customer_id, '_blank'); });
                      //         //  this.router.navigate(['sell-device-by-customer/'+customer_id]);
                      //         }
                      //     },
                      // );

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
            else{
                this.blockUI.stop();
            }
        },

    );





  }



  itemTotal(){
    this.fromRowData = this.entryForm.getRawValue();
    if(this.fromRowData.itemHistory.length > 0){
      this.subTotal = this.fromRowData.itemHistory.map(x => Number(x.amount)).reduce((a, b) => a + b);
    }
  }

  formReset(){
    this.submitted = false;
    this.entryForm.reset();
    Object.keys(this.entryForm.controls).forEach(key => {
      this.entryForm.controls[key].setErrors(null)
    });
    let itemHistoryControl = <FormArray>(
      this.entryForm.controls.itemHistory
    );
    while (this.itemHistoryList.length !== 1) {
      itemHistoryControl.removeAt(0);
    }
    this.subTotal=0;
    this.discount=0;
    this.grandTotal=0;

    this.getCustomer();
    this.getSIM();
    this.getPackageList();
    this.getDevice();
    this.getPlatformList();
  }

  onFormSubmitCustomer() {
    this.submittedCustomer = true;
    if (this.RegistrerForm.invalid) {
      return;
    }

    this.blockUI.start('Saving...');

    const obj = {
      email: this.RegistrerForm.value.email.trim(),
      password: "123456",
      first_name: this.RegistrerForm.value.firstName.trim(),
      last_name: this.RegistrerForm.value.lastName.trim(),
      mobile: this.RegistrerForm.value.mobile.trim(),
      is_customer: 1,
      is_wholesaler: this.RegistrerForm.value.customerType === 'Wholesaler' ? 1 : 0 ,
      is_retailer: this.RegistrerForm.value.customerType === 'Retailer' ? 1 : 0 ,
      is_staff: 0,
      is_superuser:0
    };

    this.authService.registerSystemAdmin('auth/users/', obj).subscribe(
      data => {
        this.blockUI.stop();
        if (data) {
          this.toastr.success(data.Msg, 'Success!', { timeOut: 2000 });
          this.modalHideCustomer();
          this.getCustomer();
          this.entryForm.controls['customer'].setValue(data.id);
        }
        // else if (data.IsReport == "Warning") {
        //   this.toastr.warning(data.Msg, 'Warning!', { closeButton: true, disableTimeOut: true });
        else {
          this.toastr.error(data.Msg, 'Error!',  { closeButton: true, disableTimeOut: true });
        }
      },
      err => {
        this.blockUI.stop();
        this.toastr.error(err.Message || err, 'Error!', { timeOut: 2000 });
      }
    );

  }


  modalHideCustomer() {
    this.RegistrerForm.reset();
    this.modalRef.hide();
    this.submittedCustomer = false;
  }

  openModalCustomer(template: TemplateRef<any>) {
    this.RegistrerForm.controls['customerType'].setValue('Wholesaler');
    this.modalRef = this.modalService.show(template, this.modalConfig);
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
