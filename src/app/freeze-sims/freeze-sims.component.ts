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
  selector: "app-freeze-sims",
  templateUrl: "./freeze-sims.component.html",
  encapsulation: ViewEncapsulation.None,
})
export class FreezeSIMsComponent implements OnInit {
  entryForm: FormGroup;

  fromRowData: any;
  SubscriptionStatus = SubscriptionStatus;
  total_refund: number = 0;
  subTotal: number = 0;
  discount: number = 0;
  paidAmount: number = 0;
  selectedCustomer = null;
  submitted = false;
  @BlockUI() blockUI: NgBlockUI;
  modalTitle = "Add ";
  btnSaveText = "Save To Freeze SIM";
  isSubmitDisabled:boolean = true;
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


  // for customer
  customers = [];
  customersBuffer = [];
  bufferSize = 50;
  numberOfItemsFromEndBeforeFetchingMore = 10;
  loading = false;
  count = 1;
  searchParam = '';
  input$ = new Subject<string>();



  simSelected:boolean;
  checklist:any;
  checkedList:any;

  constructor(
    private confirmService: ConfirmService,
    private modalService: BsModalService,
    public formBuilder: FormBuilder,
    private _service: CommonService,
    private http: HttpClient,
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
    });

    this.getCustomer();
    this.onSearch();
    //  this.getCustomerList();
    // this.getSIMList();
    // this.getPlanList();
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



  customSearchFn(term: string, item: any) {
    term = term.toLocaleLowerCase();
    let name = item.first_name + " " + item.last_name;
    return item.customer_code.toLocaleLowerCase().indexOf(term) > -1 ||
      name.toLocaleLowerCase().indexOf(term) > -1 ||
      item.first_name.toLocaleLowerCase().indexOf(term) > -1 ||
      item.last_name.toLocaleLowerCase().indexOf(term) > -1 ||
      item.mobile.toLocaleLowerCase().indexOf(term) > -1;
  }

  onCustomerChange(e) {
    this.entryForm.controls['subscription'].setValue(null);
    this.subscriptionList = [];
    this.subscriptionItemList = [];

    if (e) {
      this.selectedCustomer = e;
      this.getItemList(e.customer_code);
    }else{
      this.selectedCustomer = null;
    }
  }

  onSubscriptionChange(e) {
    this.subscriptionItemList = [];
    if (e) {
      this.subscriptionItemList = e.subscribed_items.filter(x=>!x.is_frozen);

      this.subscriptionItemList.forEach(element => {
        element.is_selected = false;
     });

    }

  }






    // The master checkbox will check/ uncheck all items
    checkUncheckAll() {
      for (var i = 0; i < this.subscriptionItemList.length; i++) {
        this.subscriptionItemList[i].is_selected = this.simSelected;
      }
      this.getCheckedItemList();
    }

    // Check All Checkbox Checked
    isAllSelected() {
      this.simSelected = this.subscriptionItemList.every(function(item:any) {
          return item.is_selected == true;
        })
      this.getCheckedItemList();
    }

    // Get List of Checked Items
    getCheckedItemList(){
      this.checkedList = [];
      for (var i = 0; i < this.subscriptionItemList.length; i++) {
        if(this.subscriptionItemList[i].is_selected)
        this.checkedList.push(this.subscriptionItemList[i]);
      }
      this.checkedList = JSON.stringify(this.checkedList);
    }





  getItemList(code) {
    this._service.get("subscription/get-active-subscription-list?search_param=" + code).subscribe(
      (res) => {
        this.subscriptionList = res.results;
      },
      (err) => { }
    );
  }


  getCustomerList() {
    this._service.get("user-list?is_customer=true").subscribe(
      (res) => {
        this.customerList = res;
      },
      (err) => { }
    );
  }

  inputFocused(event: any){
    event.target.select()
  }


  onFormSubmit() {
    this.submitted = true;
    if (this.entryForm.invalid) {
      return;
    }
    let sim_list = [];
    this.subscriptionItemList.filter(x => x.is_selected).forEach(element => {
      sim_list.push({
        sim: element.sim
      });

    });

    if (sim_list.length == 0) {
      this.toastr.warning('No item selected', 'Warning!', { closeButton: true, disableTimeOut: false });
      return;
    }

   this.blockUI.start('Saving...');
    const obj = {
      sim_list: sim_list
    };

    this.confirmService.confirm('Are you sure?', 'You are freezing the SIM(s).')
      .subscribe(
        result => {
          if (result) {
            this._service.post('stock/freeze-sims', obj).subscribe(
              data => {
                this.blockUI.stop();
                if (data.IsReport == "Success") {
                  this.toastr.success(data.Msg, 'Success!', { closeButton: true, disableTimeOut: true });
                  this.formReset();
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
          else {
            this.blockUI.stop();
          }
        },

      );

  }


  // itemTotal(){
  //   this.fromRowData = this.entryForm.getRawValue();
  //   if(this.fromRowData.itemHistory.length > 0){
  //     this.subTotal = this.fromRowData.itemHistory.map(x => Number(x.amount)).reduce((a, b) => a + b);
  //   }
  // }

  formReset() {
    this.submitted = false;
    this.entryForm.reset();
    this.selectedCustomer = null;
    this.subscriptionList = [];
    this.subscriptionItemList = [];
    this.getCustomerList();
    // this.getSIMList();
    // this.getPlanList();
  }


}
