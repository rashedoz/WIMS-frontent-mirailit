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
import { SubscriptionStatus } from "./../_models/enums";
import { ConfirmService } from '../_helpers/confirm-dialog/confirm.service';


import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Subject, Observable, of, concat } from 'rxjs';
import { distinctUntilChanged, debounceTime, switchMap, tap, catchError, filter, map } from 'rxjs/operators';


@Component({
  selector: "app-change-current-month-sub",
  templateUrl: "./change-current-month-sub.component.html",
  encapsulation: ViewEncapsulation.None,
})
export class ChangeCurrentMonthSubComponent implements OnInit {
  entryForm: FormGroup;
  itemHistoryList: FormArray;
  itemFormArray: any;

  fromRowData:any;

  subTotal:number =0;
  discount:number=0;
  paidAmount:number=0;
  SubscriptionStatus = SubscriptionStatus;
  submitted = false;
  @BlockUI() blockUI: NgBlockUI;
  modalTitle = "Add ";
  btnSaveText = "Change Current Month Subscription";

  modalConfig: any = { class: "gray modal-lg", backdrop: "static" };
  modalRef: BsModalRef;

  page = new Page();
  rows = [];
  loadingIndicator = false;
  ColumnMode = ColumnMode;
  scrollBarHorizontal = window.innerWidth < 1200;
  bsConfig: Partial<BsDatepickerConfig>;

  customerList: Array<any> = [];
  itemList: Array<any> = [];
  subscriptionList: Array<any> = [];
  subscriptionItemList: Array<any> = [];
  simList: Array<any> = [];
  planList: Array<any> = [];



  // for customer
  customers = [];
  customersBuffer = [];
  bufferSize = 50;
  numberOfItemsFromEndBeforeFetchingMore = 10;
  loading = false;
  count = 1;
  searchParam = '';
  input$ = new Subject<string>();


  constructor(
    private confirmService: ConfirmService,
    private modalService: BsModalService,
    public formBuilder: FormBuilder,
    private http: HttpClient,
    private _service: CommonService,
    private toastr: ToastrService,
    private router: Router
  ) {
    this.page.pageNumber = 1;
    this.page.size = 50;
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
      subscription: [null, [Validators.required]],
      itemHistory: this.formBuilder.array([]),
    });
    this.itemHistoryList = this.entryForm.get("itemHistory") as FormArray;
    this.itemFormArray = this.entryForm.get("itemHistory")["controls"];

    this.getCustomer();

  //  this.getCustomerList();
    this.getSIMList();
    this.getPlanList();
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
    let itemHistoryControl = <FormArray>(
      this.entryForm.controls.itemHistory
    );
    while (this.itemHistoryList.length !== 0) {
      itemHistoryControl.removeAt(0);
    }
    if(e){
      this.getItemList(e.id);
    }
  }

  onSubscriptionChange(e){
    if(e){
    //  this.subscriptionItemList = this.itemList.filter(x=>x.subscription == e.subscription);
     this.subscriptionItemList = e.subscribed_items;

     if (this.subscriptionItemList.length > 0) {
      let itemHistoryControl = <FormArray>(
        this.entryForm.controls.itemHistory
      );
      while (this.itemHistoryList.length !== 0) {
        itemHistoryControl.removeAt(0);
      }
      this.subscriptionItemList.forEach(element => {
        // this.getObjFromArray(this.degreeDropDownList,element.DegreeId);
        itemHistoryControl.push(
          this.formBuilder.group({
            id: new FormControl({value:element.id, disabled: true}, Validators.required),
            // session: new FormControl({value:element.session, disabled: true}, Validators.required),
            sim: new FormControl({value:element.sim, disabled: true}, Validators.required),
            plan: new FormControl({value:element.plan, disabled: true}, Validators.required),
            amount: new FormControl({value:element.amount, disabled: true}, Validators.required),
            plan_changes: new FormControl({value:null, disabled: true}),
            new_plan: new FormControl(null),
            changes_price: new FormControl({value:null, disabled: true}),
            actual_price: new FormControl({value:null, disabled: true}),
            payable_amount: new FormControl({value:null, disabled: true}),
            refund_amount: new FormControl({value:null, disabled: true})
          })
        );
      });

    }


    }
  }

  initItemHistory() {
    return this.formBuilder.group({
      id: [null],
      session: [null],
      sim: [{value:null, disabled: true}, [Validators.required]],
      plan: [{value:null, disabled: true}, [Validators.required]],
      amount: [{value:null, disabled: true}, [Validators.required]],
      plan_changes: [{value:null, disabled: true}],
      new_plan: [null],
      changes_price: [{value:null, disabled: true}],
      actual_price: [{value:null, disabled: true}],
      payable_amount: [{value:null, disabled: true}],
      refund_amount: [{value:null, disabled: true}]
    });
  }

  // addItemHistory() {
  //   this.itemHistoryList.push(this.initItemHistory());
  // }

  // removeItemHistory(i) {
  //   if (this.itemHistoryList.length > 1) {
  //     this.itemHistoryList.removeAt(i);
  //   }
  // }

  getItemList(customerId) {
    this._service.get("subscription/get-active-subscription-list?customer="+customerId).subscribe(
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
        this.planList = res.results;
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

  onPlanChange(e, item) {
    if (e){

     let old_price =   Number(item.controls["amount"].value);
     item.controls["actual_price"].setValue(Number(e.plan_unit_price));
     let new_price =   Math.abs(old_price - Number(e.plan_unit_price));
     item.controls["changes_price"].setValue(new_price);
     item.controls["payable_amount"].setValue(new_price);

     let old_plan = this.arrayToPlan(this.planList,item.controls["plan"].value);
     let new_plan = this.arrayToPlan(this.planList,e.id);
    //  console.log(old_plan.length);
    //  console.log(new_plan.length);
     let old_plan_number =  old_plan.substring(0, old_plan.length - 2);
     let new_plan_number =  new_plan.substring(0, new_plan.length - 2);

     let change_number =  new_plan_number - old_plan_number;
     if(change_number > 0){
      item.controls["plan_changes"].setValue("+"+change_number+"GB");
      item.controls["payable_amount"].enable();
      item.controls["refund_amount"].disable();
     }else {
      item.controls["plan_changes"].setValue(change_number+"GB");

      item.controls["refund_amount"].enable();
      item.controls["refund_amount"].setValidators([Validators.required]);
      item.controls["refund_amount"].updateValueAndValidity();
      item.controls["payable_amount"].setValue(null);
      item.controls["payable_amount"].disable();
      item.controls["refund_amount"].enable();

     }

      } else {
        item.controls["plan_changes"].setValue(null);
        item.controls["actual_price"].setValue(null);
        item.controls["changes_price"].setValue(null);
        item.controls["payable_amount"].setValue(null);
        item.controls["refund_amount"].setValue(null);
        item.controls["refund_amount"].disable();
        item.controls["refund_amount"].setValidators(null);
        item.controls["refund_amount"].updateValueAndValidity();;
        // item.controls["changes_price"].enable();
        // item.controls["payable_amount"].enable();
        // item.controls["actual_price"].enable();
      }
  }


  onFormSubmit() {
    this.submitted = true;
    if (this.entryForm.invalid) {
      return;
    }
    let subscribed_items = [];
    let subscribed_relocation_items = [];

   this.fromRowData = this.entryForm.getRawValue();
    this.fromRowData.itemHistory.filter(x=> x.plan_changes && x.new_plan && x.changes_price && x.actual_price && (x.payable_amount || x.refund_amount) ).forEach(element => {
      subscribed_items.push({
        id: element.id,
        subscription:this.entryForm.value.subscription,
        session:element.session,
        customer:this.entryForm.value.customer,
        sim: element.sim,
        plan: element.new_plan,
        amount: Number(element.actual_price),

      });

      // subscribed_relocation_items.push({
      //   subscription:this.entryForm.value.subscription,
      //   customer:this.entryForm.value.customer,
      //   sim: element.sim,
      //   plan: element.new_plan,
      //   plan_changes: element.plan_changes,
      //   changes_price: Math.abs(element.amount - element.new_amount),
      //   actual_price: Number(element.new_amount),
      //   discount:0,
      //   payable_amount: Math.abs(element.amount - element.new_amount),
      //   refund_amount:0,
      // });

      subscribed_relocation_items.push({
        subscription:this.entryForm.value.subscription,
        customer:this.entryForm.value.customer,
        sim: element.sim,
        plan: element.new_plan,
        plan_changes: element.plan_changes,
        changes_price: Number(element.changes_price),
        actual_price: Number(element.actual_price),
        discount:0,
        payable_amount: Number(element.payable_amount),
        refund_amount:Number(element.refund_amount),
      });


    });


    if(subscribed_items.length === 0 && subscribed_relocation_items.length === 0){
      this.toastr.warning('Please change at least 1 item', 'Warning!',  { closeButton: true, disableTimeOut: true });
      return;
    }

   this.blockUI.start('Saving...');

    const obj = {
      subscription:this.entryForm.value.subscription,
      customer:this.entryForm.value.customer,
      subscribed_items:subscribed_items,
      subscribed_relocation_items:subscribed_relocation_items
    };


    this.confirmService.confirm('Are you sure?', 'You are changing the current month subscription.')
    .subscribe(
        result => {
            if (result) {
              this._service.post('subscription/change-current-month-data-plan', obj).subscribe(
                data => {
                  this.blockUI.stop();
                  if (data.IsReport == "Success") {
                    this.toastr.success(data.Msg, 'Success!', { closeButton: true, disableTimeOut: true });
                    this.formReset();

                  } else if (data.IsReport == "Warning") {
                    this.toastr.warning(data.Msg, 'Warning!', { closeButton: true, disableTimeOut: true });
                  } else {
                    this.toastr.error(data.Msg, 'Error!',  { closeButton: true, disableTimeOut: true });
                  }
                },
                err => {
                  this.blockUI.stop();
                  this.toastr.error(err.Message || err, 'Error!', { timeOut: 3000 });
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
    Object.keys(this.entryForm.controls).forEach((key,i) => {
      this.entryForm.controls[key].setErrors(null);
    });

    let itemHistoryControl = <FormArray>(
      this.entryForm.controls.itemHistory
    );
    while (this.itemHistoryList.length !== 0) {
      itemHistoryControl.removeAt(0);
    }
    this.itemList = [];
    this.subscriptionList = [];
    this.subscriptionItemList = [];


    this.getCustomerList();
    this.getSIMList();
    this.getPlanList();
  }

  arrayToPlan(array,id){
    return array.find(x=>x.id == id).plan;
  }


}
