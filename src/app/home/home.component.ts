import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { AuthenticationService } from './../_services/authentication.service';
import { CommonService } from './../_services/common.service';
import { ColumnMode } from '@swimlane/ngx-datatable';
// import * as Highcharts from 'highcharts';
// import HC_exporting from 'highcharts/modules/exporting';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { Page } from '../_models/page';
// HC_exporting(Highcharts);
import * as moment from 'moment';
import { HttpClient } from '@angular/common/http';
import { BsDatepickerConfig, BsDaterangepickerConfig } from "ngx-bootstrap/datepicker";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  encapsulation: ViewEncapsulation.None
})

export class HomeComponent implements OnInit {

  public currentUser: any;
  public simStock: any;
  public deviceStock: any;
  public billCount: any;
  public customerDueList: Array<any> = [];
  page = new Page();
  loadingIndicator = false;
  ColumnMode = ColumnMode;
  // highcharts = Highcharts;
  @BlockUI() blockUI: NgBlockUI;
  bsConfigMonth: Partial<BsDatepickerConfig>;
  tabType = 'All Months';
  date = new Date();
  firstDay = new Date(this.date.getFullYear(), this.date.getMonth(), 1);
  lastDay = new Date(this.date.getFullYear(), this.date.getMonth() + 1, 0);

  bsMonthValue: Date;
  billCollectionMethodData = null;

  constructor(
    private authService: AuthenticationService,
    private toastr: ToastrService,
    private router: Router,
    private _service: CommonService,
    private http: HttpClient
  ) {
    this.page.pageNumber = 0;
    this.page.size = 6;
    this.currentUser = this.authService.currentUserDetails.value;
    // console.log(this.currentUser);
  }

  ngOnInit() {

    this.getBillCollectionMethodData();

    // this.getSIMCount();
    // this.getDeviceCount();
    // this.getBillCount();
   // this.getCustomerDueList();


    // this.getCourseEnrollmentCount();

    // this.http.get<any[]>('https://jsonplaceholder.typicode.com/photos').subscribe(photos => {
    //         this.photos = photos;
    //         this.photosBuffer = this.photos.slice(0, this.bufferSize);
    //     });



    this.bsConfigMonth = Object.assign(
      {
        dateInputFormat: 'MMMM',
        adaptivePosition: true,
        minMode :'month'
      }
    );

  }



  changeTab(type,e) {

    switch (type) {
      case 'All Months':
        this.tabType = type;
        this.getBillCollectionMethodData();
       break;
      case 'Current Month':
        this.bsMonthValue = this.firstDay;
        this.tabType = type;
        this.getBillCollectionMethodData();
       break;

    default:

      break;
    }

 }

 onMonthValueChange(e){

  if(e){
    this.bsMonthValue = e;
  }else{
    this.bsMonthValue = null
  }
  this.getBillCollectionMethodData();
}


getBillCollectionMethodData() {
  this.blockUI.start('Getting Data...');
  let obj:any ={};

  if( this.tabType == 'Current Month'){
      let monthLastDate = new Date(this.bsMonthValue.getFullYear(), this.bsMonthValue.getMonth() + 1, 0);
      obj.billing_start_date = moment(this.bsMonthValue).format('YYYY-MM-DD'),
      obj.billing_end_date = moment(monthLastDate).format('YYYY-MM-DD')
  } else{
    delete obj['billing_start_date'];
    delete obj['billing_end_date'];
  }

  this._service.get('bill-dashboard/payment-method-records',obj).subscribe(res => {
    this.blockUI.stop();
    if (!res) {
      this.toastr.error(res.Message, 'Error!', { closeButton: true, disableTimeOut: true });
      return;
    }
    this.billCollectionMethodData = res;
  }, err => {
    this.blockUI.stop();
    this.toastr.error(err.Msg || err, 'Error!', { closeButton: true, disableTimeOut: true });
  }
  );
}











  getSIMCount() {
    this._service.get('stock/get-current-sim-stock-history').subscribe(res => {
      this.simStock = res;

    }, err => { }
    );
  }

  getDeviceCount() {
    this._service.get('stock/get-current-device-stock-history').subscribe(res => {
      this.deviceStock = res;
    }, err => {}
    );
  }

  getBillCount() {
    this._service.get('subscription/get-bill-counts').subscribe(res => {
      this.billCount = res;
    }, err => {}
    );
  }
  getCustomerDueList() {
    const obj = {
      limit: this.page.size,
      page: this.page.pageNumber + 1,
      search_param:''
    };
    this._service.get('get-customer-list-with-due',obj).subscribe(res => {
      this.customerDueList = res.results;
      this.page.totalElements = res.count;
      this.page.totalPages = Math.ceil(this.page.totalElements / this.page.size);
     // console.log(this.customerDueList);
    }, err => {}
    );
  }

}
