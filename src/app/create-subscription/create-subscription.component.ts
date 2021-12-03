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

@Component({
  selector: "app-create-subscription",
  templateUrl: "./create-subscription.component.html",
  encapsulation: ViewEncapsulation.None,
})
export class CreateSubscriptionComponent implements OnInit {
  RegistrerForm: FormGroup;
  entryForm: FormGroup;
  itemHistoryList: FormArray;
  itemFormArray: any;

  fromRowData:any;

  subTotal:number =0;
  discount:number=0;
  paidAmount:number=0;

  submitted = false;
  submittedCustomer = false;
  @BlockUI() blockUI: NgBlockUI;
  modalTitle = "Add ";
  btnSaveText = "Create Subscription";

  modalConfig: any = { class: "gray modal-md", backdrop: "static" };
  modalRef: BsModalRef;

  page = new Page();
  pageSIM = new Page();
  rows = [];
  loadingIndicator = false;
  ColumnMode = ColumnMode;
  scrollBarHorizontal = window.innerWidth < 1200;
  bsConfig: Partial<BsDatepickerConfig>;

  customerList: Array<any> = [];
  simList: Array<any> = [];
  planList: Array<any> = [];


// for customer
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



  constructor(
    private authService: AuthenticationService,
    private confirmService: ConfirmService,
    private modalService: BsModalService,
    public formBuilder: FormBuilder,
    private _service: CommonService,
    private toastr: ToastrService,
    private http: HttpClient,
    private router: Router
  ) {
    this.page.pageNumber = 1;
    this.page.size = 50;

    this.pageSIM.pageNumber = 1;
    this.pageSIM.size = 50;

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
  //  this.getSIMList();
    this.getPlanList();

    this.getCustomer();
    this.onSearch();

    this.getSIM();
    this.onSearchSIM();

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
    if(this.count <= this.page.totalPages){
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
          }, 200)
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
  
    if(this.simsCount <= this.pageSIM.totalPages){
    this.count++;
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
          more = res.results;
          //  const more = this.customers.slice(len, this.bufferSize + len);
          this.loadingSIM = true;
          // using timeout here to simulate backend API delay
          setTimeout(() => {
              this.loadingSIM = false;
              this.simsBuffer = this.simsBuffer.concat(more);
          }, 200)
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
      sim: [null, [Validators.required]],
      sim_iccid: [null, [Validators.required]],
      plan: [null, [Validators.required]],
      actual_amount: [null, [Validators.required]],
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

  getPlanList() {
    this._service.get("subscription/get-data-plan-list").subscribe(
      (res) => {
        this.planList = res;
      },
      (err) => {}
    );
  }

  onSIMChange(e, item) {
    if (e.ICCID_no){
       item.controls["sim_iccid"].setValue(e.ICCID_no);
       item.controls["sim_iccid"].disable();
      }else {
        item.controls["sim_iccid"].setValue(null);
        item.controls["sim_iccid"].enable();
      }
  }

  onPlanChange(e, item) {
    if (e){
       item.controls["actual_amount"].setValue(e.plan_unit_price);
       item.controls["amount"].setValue(e.plan_unit_price);
      // item.controls["amount"].disable();
      }
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
    if (this.entryForm.invalid) {
      return;
    }
    let subscribed_items = [];
    let subscribed_relocation_items = [];
    this.blockUI.start('Saving...');

    this.fromRowData.itemHistory.filter(x=> x.sim && x.sim_iccid && x.plan && x.amount).forEach(element => {
      subscribed_items.push({
        session:this.entryForm.get('session').value,
        sim: element.sim.id,
        ICCID_no:element.sim_iccid,
        plan: element.plan,
        amount: Number(element.amount),
        customer:this.entryForm.value.customer
      });

      subscribed_relocation_items.push({
        sim: element.sim.id,
        plan: element.plan,
        actual_price: Number(element.actual_amount),
        discount:0,
        payable_amount: Number(element.amount),
        changes_price:0,
        refund_amount:0,
        customer:this.entryForm.value.customer
      });


    });

    const bill ={
        total_amount:Number(this.subTotal),
        discount:Number(this.discount),
        payable_amount: Number(this.subTotal) - Number(this.discount),
        session:this.entryForm.get('session').value,
        customer:this.entryForm.value.customer,
        so_far_paid:0,
        parent_refund_amount:0
    }


    const obj = {
      customer:this.entryForm.value.customer,
      bill:bill,
      subscribed_items:subscribed_items,
      subscribed_relocation_items:subscribed_relocation_items

    };



    this.confirmService.confirm('Are you sure?', 'You are creating a new subscription.')
    .subscribe(
        result => {
            if (result) {


                this._service.post('subscription/create-new-subscription', obj).subscribe(
                  data => {
                    this.blockUI.stop();
                    if (data.IsReport == "Success") {
                      this.toastr.success(data.Msg, 'Success!', { closeButton: true, disableTimeOut: true });
                      const customer_id = this.entryForm.value.customer;
                      this.formReset();
                      this.entryForm.get('session').disable();
                      this.entryForm.get('session').setValue(moment().format('MMM-YYYY'));
                      this.confirmService.confirm('Do you want to sell device?', '','Yes')
                      .subscribe(
                          result => {
                              if (result) {
                                this.router.navigate(['sell-device-by-customer/'+customer_id]);
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
    this.paidAmount=0;

    this.getCustomer();
    this.getSIM();
    this.getPlanList();
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
          console.log(data);
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


}
