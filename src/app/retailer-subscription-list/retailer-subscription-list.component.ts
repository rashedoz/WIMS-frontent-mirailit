import { Component, TemplateRef, ViewChild, ElementRef, ViewEncapsulation, OnInit } from '@angular/core';
import { ColumnMode,DatatableComponent } from '@swimlane/ngx-datatable';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonService } from '../_services/common.service';
import { ToastrService } from 'ngx-toastr';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { Page } from '../_models/page';
import { SubscriptionStatus,SubsItemsStaus } from '../_models/enums';


@Component({
  selector: 'app-retailer-subscription-list',
  templateUrl: './retailer-subscription-list.component.html',
  encapsulation: ViewEncapsulation.None
})

export class RetailerSubscriptionListComponent implements OnInit {

  entryForm: FormGroup;
  submitted = false;
  @BlockUI() blockUI: NgBlockUI;

  @ViewChild(DatatableComponent, { static: false }) table: DatatableComponent;
  // @ViewChild('dataTable', { static: false }) table: any;
  page = new Page();
  emptyGuid = '00000000-0000-0000-0000-000000000000';
  rows = [];
  tempRows = [];
  customerList = [];
  loadingIndicator = false;
  ColumnMode = ColumnMode;
  scrollBarHorizontal = (window.innerWidth < 1200);
  SubscriptionStatus = SubscriptionStatus;
  SubsItemsStaus = SubsItemsStaus;

  constructor(
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
   // this.getCustomerList();
   this.getList();
  }



  // setPage(pageInfo) {
  //   this.page.pageNumber = pageInfo.offset;
  //   this.getList();
  // }


  // getCustomerList() {
  //   this._service.get("user-list?is_customer=true&is_retailer=true").subscribe(
  //     (res) => {
  //       this.customerList = res;
  //     },
  //     (err) => {}
  //   );
  // }

  // onCustomerChange(e){
  //   if(e){
  //     this.getList(e.id);
  //   }
  // }


  getList() {
    this.loadingIndicator = true;
    // const obj = {
    //   size: this.page.size,
    //   pageNumber: this.page.pageNumber
    // };
    this._service.get('subscription/get-retailer-all-subscription-list').subscribe(res => {

      if (!res) {
        this.toastr.error(res.Message, 'Error!', { closeButton: true, disableTimeOut: true });
        return;
      }
      this.tempRows = res;
      this.customerList = res;
      // this.page.totalElements = res.Total;
      // this.page.totalPages = Math.ceil(this.page.totalElements / this.page.size);
      setTimeout(() => {
        this.loadingIndicator = false;
      }, 1000);
    }, err => {
      this.toastr.error(err.message || err, 'Error!', { closeButton: true, disableTimeOut: true });
      setTimeout(() => {
        this.loadingIndicator = false;
      }, 1000);
    }
    );
  }

  toggleExpandRow(row) {
    let items : any = [];
    if(row.future_state){
      row.subscribed_items.forEach(element => {
        items.push({
          sim:element.sim,
          plan:element.plan,
          status:null
        });
      });
    }else {
      row.subscribed_items.forEach(element => {
        items.push({
          sim:element.sim,
          plan:element.plan,
          status:element.status
        });
      });
    }
    row.details = items;
    this.table.rowDetail.toggleExpandRow(row);

  }

  updateFilter(event) {
    const val = event.target.value.toLowerCase();

    // filter our data
    const temp = this.tempRows.filter(function (d) {
      return d.customer.toLowerCase().indexOf(val) !== -1 ||
        !val;
    });

    // update the rows
    this.customerList = temp;
    // Whenever the filter changes, always go back to the first page
    this.table.offset = 0;
  }

}
