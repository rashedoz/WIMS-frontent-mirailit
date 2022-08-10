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
import { Router,ActivatedRoute } from "@angular/router";
import { CommonService } from "./../_services/common.service";
import { ToastrService } from "ngx-toastr";
import { BlockUI, NgBlockUI } from "ng-block-ui";
import { BsDatepickerConfig } from "ngx-bootstrap/datepicker";
import { Page } from "./../_models/page";
import { ConfirmService } from '../_helpers/confirm-dialog/confirm.service';
import { SubscriptionStatus } from "./../_models/enums";

import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Subject, Observable, of, concat } from 'rxjs';
import { distinctUntilChanged, debounceTime, switchMap, tap, catchError, filter, map } from 'rxjs/operators';

@Component({
  selector: "app-sell-device",
  templateUrl: "./sell-device.component.html",
  encapsulation: ViewEncapsulation.None,
})
export class SellDeviceComponent implements OnInit {
  entryForm: FormGroup;
  itemHistoryList: FormArray;
  itemFormArray: any;

  fromRowData:any;

  oneTimeCharge:number = 0;
  netTotal:number = 0;
  subTotal:number =0;
  discount:number=0;
  paidAmount:number=0;
  SubscriptionStatus = SubscriptionStatus;
  submitted = false;
  @BlockUI() blockUI: NgBlockUI;
  modalTitle = "Add ";
  btnSaveText = "Sell Device";

  modalConfig: any = { class: "gray modal-lg", backdrop: "static" };
  modalRef: BsModalRef;

  page = new Page();
  pageDevice = new Page();
  rows = [];
  loadingIndicator = false;
  ColumnMode = ColumnMode;
  scrollBarHorizontal = window.innerWidth < 1200;
  bsConfig: Partial<BsDatepickerConfig>;

  customerList: Array<any> = [];
  deviceList: Array<any> = [];
  subscriptionList: Array<any> = [];
  // planList: Array<any> = [];
  customer_id = null;



    // for customer
    customers = [];
    customersBuffer = [];
    bufferSize = 50;
    numberOfItemsFromEndBeforeFetchingMore = 10;
    loading = false;
    count = 1;
    searchParam = '';
    input$ = new Subject<string>();

    // for sim
    devices = [];
    devicesBuffer = [];
    devicesBufferSize = 50;
    loadingDevice = false;
    devicesCount = 1;
    devicesSearchParam = '';
    devicesInput$ = new Subject<string>();


  constructor(
    private confirmService: ConfirmService,
    private modalService: BsModalService,
    public formBuilder: FormBuilder,
    private _service: CommonService,
    private http: HttpClient,
    private toastr: ToastrService,
    private router: Router,
    private route: ActivatedRoute
  ) {
   // this.customer_id = this.route.snapshot.params['customer_id'];

    this.page.pageNumber = 1;
    this.page.size = 50;

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
      subscription: [null],
      itemHistory: this.formBuilder.array([this.initItemHistory()]),
    });
    this.itemHistoryList = this.entryForm.get("itemHistory") as FormArray;
    this.itemFormArray = this.entryForm.get("itemHistory")["controls"];

    // this.getCustomerList();
    // this.getDeviceList();

    this.getCustomer();
    this.onSearch();

    this.getDevice();
    this.onSearchDevice();

  }




  onSearch() {
    this.input$.pipe(
      debounceTime(200),
      distinctUntilChanged(),
      switchMap(term => this.fakeServiceCustomer(term))
    ).subscribe((data: any) => {
      this.customers = data.results;
      this.page.totalElements = data.count;
      this.page.totalPages = Math.ceil(this.page.totalElements / this.page.size);
      this.customersBuffer = this.customers.slice(0, this.bufferSize);
    })
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
    if (this.count < this.page.totalPages) {
      this.count++;
      this.page.pageNumber = this.count;
      let obj;
      if (this.searchParam) {
        obj = {
          limit: this.page.size,
          page: this.page.pageNumber,
          search_param: this.searchParam
        };
      } else {
        obj = {
          limit: this.page.size,
          page: this.page.pageNumber
        };
      }
      this._service.get("get-customer-list", obj).subscribe(
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
        (err) => { }
      );
    }

  }


  getCustomer() {
    let obj;
    if (this.searchParam) {
      obj = {
        limit: this.page.size,
        page: this.page.pageNumber,
        search_param: this.searchParam
      };
    } else {
      obj = {
        limit: this.page.size,
        page: this.page.pageNumber
      };
    }

    this._service.get("get-customer-list", obj).subscribe(
      (res) => {
        this.customers = res.results;
        this.page.totalElements = res.count;
        this.page.totalPages = Math.ceil(this.page.totalElements / this.page.size);
        this.customersBuffer = this.customers.slice(0, this.bufferSize);
      },
      (err) => { }
    );
  }

  private fakeServiceCustomer(term) {

    this.page.size = 50;
    this.page.pageNumber = 1;
    this.searchParam = term;

    let obj;
    if (this.searchParam) {
      obj = {
        limit: this.page.size,
        page: this.page.pageNumber,
        search_param: this.searchParam
      };
    } else {
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

  customSearchFn(term: string, item: any) {
    term = term.toLocaleLowerCase();
    let name = item.first_name +" "+item.last_name;
    return item.customer_code.toLocaleLowerCase().indexOf(term) > -1 ||
           name.toLocaleLowerCase().indexOf(term) > -1 ||
           item.first_name.toLocaleLowerCase().indexOf(term) > -1 ||
           item.last_name.toLocaleLowerCase().indexOf(term) > -1 ||
           item.mobile.toLocaleLowerCase().indexOf(term) > -1;
    }


    onCustomerChange(e){
      this.entryForm.controls['subscription'].setValue(null);
      this.subscriptionList = [];
      if(e){
        this.getItemList(e.customer_code);
      }
    }

    // onSubChange(e){
    //   if(e && e.subscribed_items.length > 0){
    //    let item  = [];
    //     e.subscribed_items.forEach(element => {
    //       item.push({
    //         sim:this.getObj(element.sim,this.simListOld),
    //         plan:this.getObj(element.plan,this.planList),
    //       })
    //     });
    //     if(item.length > 0){
    //       this.subItemList = item;
    //     }

    //   }
    // }

    getItemList(code) {
      this._service.get("subscription/get-active-subscription-list?search_param="+code).subscribe(
        (res) => {
        //  this.itemList = res;

          this.subscriptionList = res.results;
          // const key = 'subscription';
          // this.subscriptionList = [...new Map(this.itemList.map(item =>
          //   [item[key], item])).values()];
        },
        (err) => {}
      );
    }

  initItemHistory() {
    return this.formBuilder.group({
      device: [null, [Validators.required]],
      IMEI: [null, [Validators.required]],
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

          if(this.customer_id){
            this.entryForm.controls['customer'].setValue(Number(this.customer_id));
          }

      },
      (err) => {}
    );
  }

  getDeviceList() {
    this._service.get("stock/get-available-device-list").subscribe(
      (res) => {
        this.deviceList = res;
      },
      (err) => {}
    );
  }

  // getPlanList() {
  //   this._service.get("subscription/get-data-plan-list").subscribe(
  //     (res) => {
  //       this.planList = res;
  //     },
  //     (err) => {}
  //   );
  // }

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


  onChangeOneTimeCharge(value) {
     this.oneTimeCharge = Number(value);

  }

  onChangeDiscount(value) {
    if (parseFloat(value) > this.subTotal) {
      this.discount = this.subTotal;
    }
  }

  // onChangePaid(value) {
  //   if (parseFloat(value) > this.subTotal - this.discount) {
  //     this.paidAmount = this.subTotal - this.discount;
  //   }
  // }

  inputFocused(event: any){
    event.target.select()
  }

  onFormSubmit() {
    this.submitted = true;
    if (this.entryForm.invalid) {
      return;
    }

    if(Number(this.oneTimeCharge) == 0){

      this.confirmService.confirm('One Time Charge is empty!', 'Want to procesed with empty value?')
      .subscribe(
          result => {
              if (result) {
                this.sellDevice();
              }
        });
     } else {
      this.sellDevice();
     }

  }


  sellDevice(){
    let device_sales_details = [];
    this.blockUI.start('Saving...');

    this.fromRowData.itemHistory.filter(x=> x.device && x.IMEI && x.amount).forEach(element => {
      device_sales_details.push({
        device: element.device.id,
        IMEI:element.IMEI,
        device_cost: Number(element.amount),
        subscription:this.entryForm.value.subscription
      });
    });



    const obj = {
      customer:this.entryForm.value.customer,
      one_time_charge : Number(this.oneTimeCharge),
      total_amount: Number(this.subTotal) + Number(this.oneTimeCharge),
      discount:Number(this.discount),
      payable_amount:(Number(this.subTotal) + Number(this.oneTimeCharge)) - Number(this.discount),
      so_far_paid:0,
      subscription:this.entryForm.value.subscription,
      device_sales_details:device_sales_details
    };



    this.confirmService.confirm('Are you sure?', 'You are selling device.')
    .subscribe(
        result => {
            if (result) {


                this._service.post('subscription/save-device-sales', obj).subscribe(
                  data => {
                    this.blockUI.stop();
                    if (data.IsReport == "Success") {
                      this.toastr.success(data.Msg, 'Success!', { closeButton: true, disableTimeOut: true });
                      this.formReset();

                      this.confirmService.confirm('Collect Payment Now?', '','No','Yes')
                      .subscribe(
                          result => {
                              if (result) {
                                this.router.navigate([]).then(result => { window.open('/payment-collection/'+ data.bill_id, '_blank'); });
                                //this.router.navigate(['payment-collection/'+ data.bill_id]);
                              }
                          },
                      );

                    } else if (data.IsReport == "Warning") {
                      this.toastr.warning(data.Msg, 'Warning!', { closeButton: true, disableTimeOut: true });
                    } else {
                      this.toastr.error(data.Msg, 'Error!',  { closeButton: true, disableTimeOut: true });
                    }
                  },
                  err => {
                    this.blockUI.stop();
                    this.toastr.error(err.Msg || err, 'Error!', { timeOut: 2000 });
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
      this.netTotal = Number(this.subTotal) + Number(this.oneTimeCharge) - Number(this.discount);
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
    this.oneTimeCharge=0;
    this.discount=0;
    this.paidAmount=0;

    this.getCustomer();
    this.getDevice();
  }


}
