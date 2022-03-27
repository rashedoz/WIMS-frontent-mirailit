import { Component, TemplateRef, ViewChild, ElementRef, ViewEncapsulation, OnInit } from '@angular/core';
import { ColumnMode,DatatableComponent } from '@swimlane/ngx-datatable';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router,ActivatedRoute } from '@angular/router';
import { CommonService } from '../_services/common.service';
import { ToastrService } from 'ngx-toastr';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { Page } from '../_models/page';
import { SubscriptionStatus,SubsItemsStaus } from '../_models/enums';
import { ConfirmService } from '../_helpers/confirm-dialog/confirm.service';
@Component({
  selector: 'app-active-subscription-list',
  templateUrl: './active-subscription-list.component.html',
  styleUrls:['./active-subscription-list.component.css'],
  encapsulation: ViewEncapsulation.None
})

export class ActiveSubscriptionListComponent implements OnInit {

  entryForm: FormGroup;
  submitted = false;
  @BlockUI() blockUI: NgBlockUI;
   isbuttonActiveTab1 = true;
  isbuttonActiveTab2 = false;
  activeTable = 0;
  @ViewChild(DatatableComponent, { static: false }) table: DatatableComponent;
  @ViewChild(DatatableComponent, { static: false }) tableWholesaler: DatatableComponent;
  @ViewChild(DatatableComponent, { static: false }) tableRetailer: DatatableComponent;

  page = new Page();
  emptyGuid = '00000000-0000-0000-0000-000000000000';
  rows = [];
  tempRows = [];
  customerList = [];
  wholesalerList = [];
  retailerList = [];
  loadingIndicator = false;
  ColumnMode = ColumnMode;
  scrollBarHorizontal = (window.innerWidth < 1200);
  SubscriptionStatus = SubscriptionStatus;
  SubsItemsStaus = SubsItemsStaus;

  searchParamAll = '';
  searchParamWholesaler = '';
  searchParamRetailer = '';

  tab;

  constructor(
    private confirmService: ConfirmService,
    public formBuilder: FormBuilder,
    private _service: CommonService,
    private toastr: ToastrService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.page.pageNumber = 0;
    this.page.size = 10;
    window.onresize = () => {
      this.scrollBarHorizontal = (window.innerWidth < 1200);
    };

    this.route.queryParams.subscribe(params => {
      this.tab = params['tab'];
      if(this.tab){
        switch (this.tab) {
          case 'wholesaler':
            this.showSubTable(1);
            break;
          case 'retailer':
            this.showSubTable(2);
            break;
        }
      }else {
        this.getListWholesaler();
      }
    });
  }


  ngOnInit() {


  }



  // setPage(pageInfo) {
  //   this.page.pageNumber = pageInfo.offset;
  //   this.getList();
  // }

  getList() {
    this.loadingIndicator = true;
    const obj = {
      limit: this.page.size,
      page: this.page.pageNumber + 1,
      search_param:this.searchParamAll
    };
    this._service.get('subscription/get-all-subscription-list',obj).subscribe(res => {

      if (!res) {
        this.toastr.error(res.Message, 'Error!', { closeButton: true, disableTimeOut: true });
        return;
      }
      this.activeTable = 0;
    //  this.tempRows = res;
      this.customerList = res.results;
      //   this.rows = res.results;
         this.page.totalElements = res.count;
         this.page.totalPages = Math.ceil(this.page.totalElements / this.page.size);
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

  getListWholesaler() {
    this.loadingIndicator = true;
    const obj = {
      limit: this.page.size,
      page: this.page.pageNumber + 1,
      search_param:this.searchParamWholesaler
    };
    this._service.get('subscription/get-wholesaler-active-subscription-list',obj).subscribe(res => {

      if (!res) {
        this.toastr.error(res.Message, 'Error!', { closeButton: true, disableTimeOut: true });
        return;
      }

      this.activeTable = 1;
    //  this.tempRows = res;
      this.wholesalerList = res.results;
      this.page.totalElements = res.count;
      this.page.totalPages = Math.ceil(this.page.totalElements / this.page.size);
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

  getListRetailer() {
    this.loadingIndicator = true;
    const obj = {
      limit: this.page.size,
      page: this.page.pageNumber + 1,
      search_param:this.searchParamRetailer
    };
    this._service.get('subscription/get-retailer-active-subscription-list',obj).subscribe(res => {

      if (!res) {
        this.toastr.error(res.Message, 'Error!', { closeButton: true, disableTimeOut: true });
        return;
      }
      this.activeTable = 2;
     // this.tempRows = res;
      this.retailerList = res.results;
      this.page.totalElements = res.count;
      this.page.totalPages = Math.ceil(this.page.totalElements / this.page.size);
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
     console.log(row);
     if(!row.details){
      this._service.get('subscription/get-subscription-detail/'+row.id).subscribe(res => {
        row.details = res;
        console.log(res);
      }, err => { });
     }

    this.table.rowDetail.toggleExpandRow(row);



    }


  updateFilter(e) {
    if(e){
      this.page.pageNumber = 0;
      this.page.size = 10;
      this.searchParamAll = e.target.value;
      this.getList();
    }
    // const val = event.target.value.toLowerCase();

    // // filter our data
    // const temp = this.tempRows.filter(function (d) {
    //   return d.customer.first_name.toLowerCase().indexOf(val) !== -1 ||
    //          d.customer.last_name.toLowerCase().indexOf(val) !== -1 ||
    //          d.customer.email.toLowerCase().indexOf(val) !== -1 ||
    //          d.customer.mobile.toLowerCase().indexOf(val) !== -1 ||
    //          d.customer.customer_code.toLowerCase().indexOf(val) !== -1 ||
    //     !val;
    // });
    // this.customerList = temp;
    // this.table.offset = 0;
  }
  updateFilterWholesaler(e) {

    if(e){
      this.page.pageNumber = 0;
      this.page.size = 10;
      this.searchParamWholesaler = e.target.value;
      this.getListWholesaler();
    }
  }

  updateFilterRetailer(e) {

    if(e){
      this.page.pageNumber = 0;
      this.page.size = 10;
      this.searchParamRetailer = e.target.value;
      this.getListRetailer();
    }
  }

  undoSubscription(row){
    const obj = {
      customer:row.customer_id,
      subscription:row.id
     };
     this.confirmService.confirm('Are you sure?', 'You are undo the subscription for held state.')
     .subscribe(
         result => {
             if (result) {
               const request = this._service.post('subscription/undo-future-held-subscription', obj);
               request.subscribe(
                 data => {

                   if (data.IsReport == "Success") {
                     this.toastr.success(data.Msg, 'Success!', { timeOut: 2000 });
                     this.getList();
                   } else if (data.IsReport == "Warning") {
                     this.toastr.warning(data.Msg, 'Warning!', { closeButton: true, disableTimeOut: true });
                   } else {
                     this.toastr.error(data.Msg, 'Error!',  { closeButton: true, disableTimeOut: true });
                   }
                 },
                 err => {

                   this.toastr.error(err.Message || err, 'Error!', { closeButton: true, disableTimeOut: true });
                 }
               );
             }
         },

     );
  }

  setPageAll(pageInfo) {
    this.page.pageNumber = pageInfo.offset;
    this.getList();
  }
  setPageWholesaler(pageInfo) {
    this.page.pageNumber = pageInfo.offset;
    this.getListWholesaler();
  }
  setPageRetailer(pageInfo) {
    this.page.pageNumber = pageInfo.offset;
    this.getListRetailer();
  }

  showSubTable(id){
   // this.isbuttonActive = false;
    switch (id) {

      case 1:
        this.isbuttonActiveTab1 = true;
        this.isbuttonActiveTab2 = false;

        this.page.pageNumber = 0;
        this.page.size = 10;
       this.getListWholesaler();
        break;
      case 2:
        this.isbuttonActiveTab1 = false;
        this.isbuttonActiveTab2 = true;

        this.page.pageNumber = 0;
        this.page.size = 10;
       this.getListRetailer();
        break;
    }
  }



}
