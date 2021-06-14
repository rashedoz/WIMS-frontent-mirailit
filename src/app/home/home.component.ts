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

import { HttpClient } from '@angular/common/http';

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



  // photos = [];
  // photosBuffer = [];
  // bufferSize = 50;
  // numberOfItemsFromEndBeforeFetchingMore = 10;
  // loading = false;



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
    this.getSIMCount();
    this.getDeviceCount();
    this.getBillCount();
    this.getCustomerDueList();
    // this.getCourseEnrollmentCount();

    // this.http.get<any[]>('https://jsonplaceholder.typicode.com/photos').subscribe(photos => {
    //         this.photos = photos;
    //         this.photosBuffer = this.photos.slice(0, this.bufferSize);
    //     });

  }



//   onScrollToEnd() {
//     this.fetchMore();
// }

// onScroll({ end }) {
//     if (this.loading || this.photos.length <= this.photosBuffer.length) {
//         return;
//     }

//     if (end + this.numberOfItemsFromEndBeforeFetchingMore >= this.photosBuffer.length) {
//         this.fetchMore();
//     }
// }

// private fetchMore() {
//     const len = this.photosBuffer.length;
//     const more = this.photos.slice(len, this.bufferSize + len);
//     this.loading = true;
//     // using timeout here to simulate backend API delay
//     setTimeout(() => {
//         this.loading = false;
//         this.photosBuffer = this.photosBuffer.concat(more);
//     }, 200)
// }













  setPage(pageInfo) {
    this.page.pageNumber = pageInfo.offset;
    this.getCustomerDueList();
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
