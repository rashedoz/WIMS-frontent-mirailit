import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { AuthenticationService } from './../_services/authentication.service';
import { CommonService } from './../_services/common.service';
// import * as Highcharts from 'highcharts';
// import HC_exporting from 'highcharts/modules/exporting';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
// HC_exporting(Highcharts);

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
  // highcharts = Highcharts;
  @BlockUI() blockUI: NgBlockUI;

  constructor(
    private authService: AuthenticationService,
    private toastr: ToastrService,
    private router: Router,
    private _service: CommonService
  ) {
   // this.currentUser = this.authService.currentUserDetails.value;
    // console.log(this.currentUser);
  }

  ngOnInit() {
    this.getSIMCount();
    this.getDeviceCount();
    this.getBillCount();
    this.getCustomerDueList();
    // this.getCourseEnrollmentCount();
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
    this._service.get('get-customer-list-with-due').subscribe(res => {    
      this.customerDueList = res;    
      console.log(this.customerDueList); 
    }, err => {}
    );
  }

}
 