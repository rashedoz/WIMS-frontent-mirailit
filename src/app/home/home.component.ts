import { Component, OnInit, ViewEncapsulation } from "@angular/core";
import { AuthenticationService } from "./../_services/authentication.service";
import { CommonService } from "./../_services/common.service";
import { ColumnMode } from "@swimlane/ngx-datatable";
import * as Highcharts from "highcharts";
import HC_exporting from "highcharts/modules/exporting";
HC_exporting(Highcharts);
import { ToastrService } from "ngx-toastr";
import { Router } from "@angular/router";
import { BlockUI, NgBlockUI } from "ng-block-ui";
import { Page } from "../_models/page";
import * as moment from "moment";
import { HttpClient } from "@angular/common/http";
import {
  BsDatepickerConfig,
  BsDaterangepickerConfig,
} from "ngx-bootstrap/datepicker";

@Component({
  selector: "app-home",
  templateUrl: "./home.component.html",
  styleUrls: ["./home.component.css"],
  encapsulation: ViewEncapsulation.None,
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
  highcharts = Highcharts;
  @BlockUI() blockUI: NgBlockUI;
  bsConfigMonth: Partial<BsDatepickerConfig>;
  tabType = "Current Month"; //'All Months';
  date = new Date();
  firstDay = new Date(this.date.getFullYear(), this.date.getMonth(), 1);
  lastDay = new Date(this.date.getFullYear(), this.date.getMonth() + 1, 0);

  bsMonthValue: Date;
  billCollectionMethodData = null;

  eligibleRetailersCount = 0;
  retailersPeripheralsCount = null;
  retailersBillRecords = null;

  eligibleWholesalersCount = 0;
  wholesalersPeripheralsCount = null;
  wholesalersBillRecords = null;

  pieChartOptions: any;
  pieChartArray = [];

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

    this.bsConfigMonth = Object.assign({
      dateInputFormat: "MMMM",
      adaptivePosition: true,
      minMode: "month",
    });
    this.bsMonthValue = this.firstDay;
  }

  ngOnInit() {
    // this.getBillCollectionMethodData();

    // this.getBillEligibleRetailersCountData();
    // this.getRetailersPeripheralsCountData();
    // this.getRetailersBillRecordsData();

    // this.getBillEligibleWholesalersCountData();
    // this.getWholesalersPeripheralsCountData();
    // this.getWholesalersBillRecordsData();


    Promise.all([
      this.getBillCollectionMethodData(),
      this.getBillEligibleRetailersCountData(),
      this.getRetailersPeripheralsCountData(),
      this.getRetailersBillRecordsData(),
      this.getBillEligibleWholesalersCountData(),
      this.getWholesalersPeripheralsCountData(),
      this.getWholesalersBillRecordsData(),
    ]).then(values => {
     // console.log(values);
        this.showPicChart();
  });

    // setTimeout(() => {
    //   this.showPicChart();
    // }, 1500);

    // this.getSIMCount();
    // this.getDeviceCount();
    // this.getBillCount();
    // this.getCustomerDueList();

    // this.getCourseEnrollmentCount();

    // this.http.get<any[]>('https://jsonplaceholder.typicode.com/photos').subscribe(photos => {
    //         this.photos = photos;
    //         this.photosBuffer = this.photos.slice(0, this.bufferSize);
    //     });
  }

  changeTab(type, e) {
    switch (type) {
      case "All Months":
        this.tabType = type;
        // this.getBillCollectionMethodData();

        // this.getBillEligibleRetailersCountData();
        // this.getRetailersPeripheralsCountData();
        // this.getRetailersBillRecordsData();

        // this.getBillEligibleWholesalersCountData();
        // this.getWholesalersPeripheralsCountData();
        // this.getWholesalersBillRecordsData();

        // this.showPicChart();

        Promise.all([
          this.getBillCollectionMethodData(),
          this.getBillEligibleRetailersCountData(),
          this.getRetailersPeripheralsCountData(),
          this.getRetailersBillRecordsData(),
          this.getBillEligibleWholesalersCountData(),
          this.getWholesalersPeripheralsCountData(),
          this.getWholesalersBillRecordsData(),
        ]).then(values => {
         // console.log(values);
            this.showPicChart();
      });

        break;
      case "Current Month":
        this.bsMonthValue = this.firstDay;
        this.tabType = type;
        // this.getBillCollectionMethodData();

        // this.getBillEligibleRetailersCountData();
        // this.getRetailersPeripheralsCountData();
        // this.getRetailersBillRecordsData();

        // this.getBillEligibleWholesalersCountData();
        // this.getWholesalersPeripheralsCountData();
        // this.getWholesalersBillRecordsData();

        // this.showPicChart();

        Promise.all([
          this.getBillCollectionMethodData(),
          this.getBillEligibleRetailersCountData(),
          this.getRetailersPeripheralsCountData(),
          this.getRetailersBillRecordsData(),
          this.getBillEligibleWholesalersCountData(),
          this.getWholesalersPeripheralsCountData(),
          this.getWholesalersBillRecordsData(),
        ]).then(values => {
         // console.log(values);
            this.showPicChart();
      });

        break;

      default:
        break;
    }
  }

  onMonthValueChange(e) {
    if (e) {
      this.bsMonthValue = e;
    } else {
      this.bsMonthValue = null;
    }
    // this.getBillCollectionMethodData();

    // this.getBillEligibleRetailersCountData();
    // this.getRetailersPeripheralsCountData();
    // this.getRetailersBillRecordsData();

    // this.getBillEligibleWholesalersCountData();
    // this.getWholesalersPeripheralsCountData();
    // this.getWholesalersBillRecordsData();

    Promise.all([
      this.getBillCollectionMethodData(),
      this.getBillEligibleRetailersCountData(),
      this.getRetailersPeripheralsCountData(),
      this.getRetailersBillRecordsData(),
      this.getBillEligibleWholesalersCountData(),
      this.getWholesalersPeripheralsCountData(),
      this.getWholesalersBillRecordsData(),
    ]).then(values => {
     // console.log(values);
        this.showPicChart();
  });

  }

  getBillCollectionMethodData() {
    return new Promise((resolve, reject) => {
      this.blockUI.start("Getting Data...");
      let obj: any = {};

      if (this.tabType == "Current Month") {
        let monthLastDate = new Date(
          this.bsMonthValue.getFullYear(),
          this.bsMonthValue.getMonth() + 1,
          0
        );
        (obj.billing_start_date = moment(this.bsMonthValue).format(
          "YYYY-MM-DD"
        )),
          (obj.billing_end_date = moment(monthLastDate).format("YYYY-MM-DD"));
      } else {
        delete obj["billing_start_date"];
        delete obj["billing_end_date"];
      }

      this._service.get("bill-dashboard/payment-method-records", obj).subscribe(
        (res) => {
          this.blockUI.stop();
          if (!res) {
            this.toastr.error(res.Message, "Error!", {
              closeButton: true,
              disableTimeOut: true,
            });
            return;
          }
          this.billCollectionMethodData = res;
          resolve(this.billCollectionMethodData);
        },
        (err) => {
          this.blockUI.stop();
          reject(err.Msg);
          this.toastr.error(err.Msg || err, "Error!", {
            closeButton: true,
            disableTimeOut: true,
          });
        }
      );
    });
  }

  // getBillCollectionMethodData() {
  //   this.blockUI.start('Getting Data...');
  //   let obj:any ={};

  //   if( this.tabType == 'Current Month'){
  //       let monthLastDate = new Date(this.bsMonthValue.getFullYear(), this.bsMonthValue.getMonth() + 1, 0);
  //       obj.billing_start_date = moment(this.bsMonthValue).format('YYYY-MM-DD'),
  //       obj.billing_end_date = moment(monthLastDate).format('YYYY-MM-DD')
  //   } else{
  //     delete obj['billing_start_date'];
  //     delete obj['billing_end_date'];
  //   }

  //   this._service.get('bill-dashboard/payment-method-records',obj).subscribe(res => {
  //     this.blockUI.stop();
  //     if (!res) {
  //       this.toastr.error(res.Message, 'Error!', { closeButton: true, disableTimeOut: true });
  //       return;
  //     }
  //     this.billCollectionMethodData = res;
  //   }, err => {
  //     this.blockUI.stop();
  //     this.toastr.error(err.Msg || err, 'Error!', { closeButton: true, disableTimeOut: true });
  //   }
  //   );
  // }
  getBillEligibleRetailersCountData() {
    return new Promise((resolve, reject) => {

      this.blockUI.start("Getting Data...");
      let obj: any = {};

      if (this.tabType == "Current Month") {
        let monthLastDate = new Date(
          this.bsMonthValue.getFullYear(),
          this.bsMonthValue.getMonth() + 1,
          0
        );
        (obj.billing_start_date = moment(this.bsMonthValue).format(
          "YYYY-MM-DD"
        )),
          (obj.billing_end_date = moment(monthLastDate).format("YYYY-MM-DD"));
      } else {
        delete obj["billing_start_date"];
        delete obj["billing_end_date"];
      }

      this._service
        .get("bill-dashboard/bill-eligible-retailers-count", obj)
        .subscribe(
          (res) => {
            this.blockUI.stop();
            if (!res) {
              this.toastr.error(res.Message, "Error!", {
                closeButton: true,
                disableTimeOut: true,
              });
              return;
            }
            this.eligibleRetailersCount = res.eligible_retailer_count;
            resolve(this.eligibleRetailersCount);
          },
          (err) => {
            this.blockUI.stop();
            reject(err.Msg);
            this.toastr.error(err.Msg || err, "Error!", {
              closeButton: true,
              disableTimeOut: true,
            });
          }
        );
    });
  }

  // getBillEligibleRetailersCountData() {
  //   this.blockUI.start("Getting Data...");
  //   let obj: any = {};

  //   if (this.tabType == "Current Month") {
  //     let monthLastDate = new Date(
  //       this.bsMonthValue.getFullYear(),
  //       this.bsMonthValue.getMonth() + 1,
  //       0
  //     );
  //     (obj.billing_start_date = moment(this.bsMonthValue).format("YYYY-MM-DD")),
  //       (obj.billing_end_date = moment(monthLastDate).format("YYYY-MM-DD"));
  //   } else {
  //     delete obj["billing_start_date"];
  //     delete obj["billing_end_date"];
  //   }

  //   this._service
  //     .get("bill-dashboard/bill-eligible-retailers-count", obj)
  //     .subscribe(
  //       (res) => {
  //         this.blockUI.stop();
  //         if (!res) {
  //           this.toastr.error(res.Message, "Error!", {
  //             closeButton: true,
  //             disableTimeOut: true,
  //           });
  //           return;
  //         }
  //         this.eligibleRetailersCount = res.eligible_retailer_count;
  //       },
  //       (err) => {
  //         this.blockUI.stop();
  //         this.toastr.error(err.Msg || err, "Error!", {
  //           closeButton: true,
  //           disableTimeOut: true,
  //         });
  //       }
  //     );
  // }

  getRetailersPeripheralsCountData() {
  return new Promise((resolve, reject) => {

    this.blockUI.start("Getting Data...");
    let obj: any = {};

    if (this.tabType == "Current Month") {
      let monthLastDate = new Date(
        this.bsMonthValue.getFullYear(),
        this.bsMonthValue.getMonth() + 1,
        0
      );
      (obj.billing_start_date = moment(this.bsMonthValue).format("YYYY-MM-DD")),
        (obj.billing_end_date = moment(monthLastDate).format("YYYY-MM-DD"));
    } else {
      delete obj["billing_start_date"];
      delete obj["billing_end_date"];
    }

    this._service
      .get("bill-dashboard/retailers-peripherals-count", obj)
      .subscribe(
        (res) => {
          this.blockUI.stop();
          if (!res) {
            this.toastr.error(res.Message, "Error!", {
              closeButton: true,
              disableTimeOut: true,
            });
            return;
          }
          this.retailersPeripheralsCount = res;
          resolve(this.retailersPeripheralsCount);
        },
        (err) => {
          this.blockUI.stop();
          reject(err.Msg);
          this.toastr.error(err.Msg || err, "Error!", {
            closeButton: true,
            disableTimeOut: true,
          });
        }
      );

  });

  }


  // getRetailersPeripheralsCountData() {
  //   this.blockUI.start("Getting Data...");
  //   let obj: any = {};

  //   if (this.tabType == "Current Month") {
  //     let monthLastDate = new Date(
  //       this.bsMonthValue.getFullYear(),
  //       this.bsMonthValue.getMonth() + 1,
  //       0
  //     );
  //     (obj.billing_start_date = moment(this.bsMonthValue).format("YYYY-MM-DD")),
  //       (obj.billing_end_date = moment(monthLastDate).format("YYYY-MM-DD"));
  //   } else {
  //     delete obj["billing_start_date"];
  //     delete obj["billing_end_date"];
  //   }

  //   this._service
  //     .get("bill-dashboard/retailers-peripherals-count", obj)
  //     .subscribe(
  //       (res) => {
  //         this.blockUI.stop();
  //         if (!res) {
  //           this.toastr.error(res.Message, "Error!", {
  //             closeButton: true,
  //             disableTimeOut: true,
  //           });
  //           return;
  //         }
  //         this.retailersPeripheralsCount = res;
  //       },
  //       (err) => {
  //         this.blockUI.stop();
  //         this.toastr.error(err.Msg || err, "Error!", {
  //           closeButton: true,
  //           disableTimeOut: true,
  //         });
  //       }
  //     );
  // }

  getRetailersBillRecordsData(){

    return new Promise((resolve, reject) => {
    this.blockUI.start("Getting Data...");
    let obj: any = {};

    if (this.tabType == "Current Month") {
      let monthLastDate = new Date(
        this.bsMonthValue.getFullYear(),
        this.bsMonthValue.getMonth() + 1,
        0
      );
      (obj.billing_start_date = moment(this.bsMonthValue).format("YYYY-MM-DD")),
        (obj.billing_end_date = moment(monthLastDate).format("YYYY-MM-DD"));
    } else {
      delete obj["billing_start_date"];
      delete obj["billing_end_date"];
    }

    this._service.get("bill-dashboard/retailers-bill-records", obj).subscribe(
      (res) => {
        this.blockUI.stop();
        if (!res) {
          this.toastr.error(res.Message, "Error!", {
            closeButton: true,
            disableTimeOut: true,
          });
          return;
        }
        this.retailersBillRecords = res;
        resolve(this.retailersBillRecords);
      },
      (err) => {
        this.blockUI.stop();
        reject(err.Msg);
        this.toastr.error(err.Msg || err, "Error!", {
          closeButton: true,
          disableTimeOut: true,
        });
      }
    );

  });

  }

  // getRetailersBillRecordsData() {
  //   this.blockUI.start("Getting Data...");
  //   let obj: any = {};

  //   if (this.tabType == "Current Month") {
  //     let monthLastDate = new Date(
  //       this.bsMonthValue.getFullYear(),
  //       this.bsMonthValue.getMonth() + 1,
  //       0
  //     );
  //     (obj.billing_start_date = moment(this.bsMonthValue).format("YYYY-MM-DD")),
  //       (obj.billing_end_date = moment(monthLastDate).format("YYYY-MM-DD"));
  //   } else {
  //     delete obj["billing_start_date"];
  //     delete obj["billing_end_date"];
  //   }

  //   this._service.get("bill-dashboard/retailers-bill-records", obj).subscribe(
  //     (res) => {
  //       this.blockUI.stop();
  //       if (!res) {
  //         this.toastr.error(res.Message, "Error!", {
  //           closeButton: true,
  //           disableTimeOut: true,
  //         });
  //         return;
  //       }
  //       this.retailersBillRecords = res;
  //     },
  //     (err) => {
  //       this.blockUI.stop();
  //       this.toastr.error(err.Msg || err, "Error!", {
  //         closeButton: true,
  //         disableTimeOut: true,
  //       });
  //     }
  //   );
  // }

  getBillEligibleWholesalersCountData(){
    return new Promise((resolve, reject) => {
  this.blockUI.start("Getting Data...");
    let obj: any = {};

    if (this.tabType == "Current Month") {
      let monthLastDate = new Date(
        this.bsMonthValue.getFullYear(),
        this.bsMonthValue.getMonth() + 1,
        0
      );
      (obj.billing_start_date = moment(this.bsMonthValue).format("YYYY-MM-DD")),
        (obj.billing_end_date = moment(monthLastDate).format("YYYY-MM-DD"));
    } else {
      delete obj["billing_start_date"];
      delete obj["billing_end_date"];
    }

    this._service
      .get("bill-dashboard/bill-eligible-wholesalers-count", obj)
      .subscribe(
        (res) => {
          this.blockUI.stop();
          if (!res) {
            this.toastr.error(res.Message, "Error!", {
              closeButton: true,
              disableTimeOut: true,
            });
            return;
          }
          this.eligibleWholesalersCount = res.eligible_wholesaler_count;
          resolve(this.eligibleWholesalersCount);
        },
        (err) => {
          this.blockUI.stop();
          reject(err.Msg);
          this.toastr.error(err.Msg || err, "Error!", {
            closeButton: true,
            disableTimeOut: true,
          });
        }
      );
    });

  }

  // getBillEligibleWholesalersCountData() {
  //   this.blockUI.start("Getting Data...");
  //   let obj: any = {};

  //   if (this.tabType == "Current Month") {
  //     let monthLastDate = new Date(
  //       this.bsMonthValue.getFullYear(),
  //       this.bsMonthValue.getMonth() + 1,
  //       0
  //     );
  //     (obj.billing_start_date = moment(this.bsMonthValue).format("YYYY-MM-DD")),
  //       (obj.billing_end_date = moment(monthLastDate).format("YYYY-MM-DD"));
  //   } else {
  //     delete obj["billing_start_date"];
  //     delete obj["billing_end_date"];
  //   }

  //   this._service
  //     .get("bill-dashboard/bill-eligible-wholesalers-count", obj)
  //     .subscribe(
  //       (res) => {
  //         this.blockUI.stop();
  //         if (!res) {
  //           this.toastr.error(res.Message, "Error!", {
  //             closeButton: true,
  //             disableTimeOut: true,
  //           });
  //           return;
  //         }
  //         this.eligibleWholesalersCount = res.eligible_wholesaler_count;
  //       },
  //       (err) => {
  //         this.blockUI.stop();
  //         this.toastr.error(err.Msg || err, "Error!", {
  //           closeButton: true,
  //           disableTimeOut: true,
  //         });
  //       }
  //     );
  // }

  getWholesalersPeripheralsCountData(){
    return new Promise((resolve, reject) => {

    this.blockUI.start("Getting Data...");
    let obj: any = {};

    if (this.tabType == "Current Month") {
      let monthLastDate = new Date(
        this.bsMonthValue.getFullYear(),
        this.bsMonthValue.getMonth() + 1,
        0
      );
      (obj.billing_start_date = moment(this.bsMonthValue).format("YYYY-MM-DD")),
        (obj.billing_end_date = moment(monthLastDate).format("YYYY-MM-DD"));
    } else {
      delete obj["billing_start_date"];
      delete obj["billing_end_date"];
    }

    this._service
      .get("bill-dashboard/wholesalers-peripherals-count", obj)
      .subscribe(
        (res) => {
          this.blockUI.stop();
          if (!res) {
            this.toastr.error(res.Message, "Error!", {
              closeButton: true,
              disableTimeOut: true,
            });
            return;
          }
          this.wholesalersPeripheralsCount = res;
          resolve(this.wholesalersPeripheralsCount);
        },
        (err) => {
          this.blockUI.stop();
          reject(err.Msg);
          this.toastr.error(err.Msg || err, "Error!", {
            closeButton: true,
            disableTimeOut: true,
          });
        }
      );

    })
  }

  // getWholesalersPeripheralsCountData() {
  //   this.blockUI.start("Getting Data...");
  //   let obj: any = {};

  //   if (this.tabType == "Current Month") {
  //     let monthLastDate = new Date(
  //       this.bsMonthValue.getFullYear(),
  //       this.bsMonthValue.getMonth() + 1,
  //       0
  //     );
  //     (obj.billing_start_date = moment(this.bsMonthValue).format("YYYY-MM-DD")),
  //       (obj.billing_end_date = moment(monthLastDate).format("YYYY-MM-DD"));
  //   } else {
  //     delete obj["billing_start_date"];
  //     delete obj["billing_end_date"];
  //   }

  //   this._service
  //     .get("bill-dashboard/wholesalers-peripherals-count", obj)
  //     .subscribe(
  //       (res) => {
  //         this.blockUI.stop();
  //         if (!res) {
  //           this.toastr.error(res.Message, "Error!", {
  //             closeButton: true,
  //             disableTimeOut: true,
  //           });
  //           return;
  //         }
  //         this.wholesalersPeripheralsCount = res;
  //       },
  //       (err) => {
  //         this.blockUI.stop();
  //         this.toastr.error(err.Msg || err, "Error!", {
  //           closeButton: true,
  //           disableTimeOut: true,
  //         });
  //       }
  //     );
  // }

  getWholesalersBillRecordsData(){
    return new Promise((resolve, reject) => {
    this.blockUI.start("Getting Data...");
    let obj: any = {};

    if (this.tabType == "Current Month") {
      let monthLastDate = new Date(
        this.bsMonthValue.getFullYear(),
        this.bsMonthValue.getMonth() + 1,
        0
      );
      (obj.billing_start_date = moment(this.bsMonthValue).format("YYYY-MM-DD")),
        (obj.billing_end_date = moment(monthLastDate).format("YYYY-MM-DD"));
    } else {
      delete obj["billing_start_date"];
      delete obj["billing_end_date"];
    }

    this._service.get("bill-dashboard/wholesalers-bill-records", obj).subscribe(
      (res) => {
        this.blockUI.stop();
        if (!res) {
          this.toastr.error(res.Message, "Error!", {
            closeButton: true,
            disableTimeOut: true,
          });
          return;
        }
        this.wholesalersBillRecords = res;

        resolve(this.wholesalersBillRecords);
      },
      (err) => {
        this.blockUI.stop();
        reject(err.Msg);
        this.toastr.error(err.Msg || err, "Error!", {
          closeButton: true,
          disableTimeOut: true,
        });
      }
    );
    })
  }

  // getWholesalersBillRecordsData() {
  //   this.blockUI.start("Getting Data...");
  //   let obj: any = {};

  //   if (this.tabType == "Current Month") {
  //     let monthLastDate = new Date(
  //       this.bsMonthValue.getFullYear(),
  //       this.bsMonthValue.getMonth() + 1,
  //       0
  //     );
  //     (obj.billing_start_date = moment(this.bsMonthValue).format("YYYY-MM-DD")),
  //       (obj.billing_end_date = moment(monthLastDate).format("YYYY-MM-DD"));
  //   } else {
  //     delete obj["billing_start_date"];
  //     delete obj["billing_end_date"];
  //   }

  //   this._service.get("bill-dashboard/wholesalers-bill-records", obj).subscribe(
  //     (res) => {
  //       this.blockUI.stop();
  //       if (!res) {
  //         this.toastr.error(res.Message, "Error!", {
  //           closeButton: true,
  //           disableTimeOut: true,
  //         });
  //         return;
  //       }
  //       this.wholesalersBillRecords = res;
  //     },
  //     (err) => {
  //       this.blockUI.stop();
  //       this.toastr.error(err.Msg || err, "Error!", {
  //         closeButton: true,
  //         disableTimeOut: true,
  //       });
  //     }
  //   );
  // }

  showPicChart() {
    let arr = [];
    // data.forEach((element) => {
    //   arr.push({
    //     'name': element.AgeRange + '(' + element.Count + ')',
    //     'y': element.Count
    //   });
    // });

    if (this.retailersBillRecords && this.wholesalersBillRecords) {

      let relailer_total_due = (this.retailersBillRecords.retailer_collectable_bill_amount - this.retailersBillRecords.retailer_collected_bill_amount) +  this.retailersBillRecords.retailer_carry_over_due;

      let wholesaler_total_due = (this.wholesalersBillRecords.wholesaler_collectable_bill_amount - this.wholesalersBillRecords.wholesaler_collected_bill_amount) +  this.wholesalersBillRecords.wholesaler_carry_over_due;


      let collectableAmount =  this.retailersBillRecords.retailer_collectable_bill_amount + this.wholesalersBillRecords.wholesaler_collectable_bill_amount + relailer_total_due + wholesaler_total_due;
      let collectedAmount =  this.retailersBillRecords.retailer_collected_bill_amount + this.wholesalersBillRecords.wholesaler_collected_bill_amount;
      let due = relailer_total_due + wholesaler_total_due;

      arr.push({
        name: "Collectable Amount",
        y: collectableAmount,
      });

      arr.push({
        name: "Collected Amount",
        y: collectedAmount,
      });

      arr.push({
        name: "Due",
        y: due,
      });

      console.log(collectableAmount);
      console.log(collectedAmount);
      console.log(arr);

      this.pieChartOptions = {
        chart: {
          plotBorderWidth: null,
          margin: [0, 0, 50, 0],
          spacingTop: 0,
          spacingBottom: 0,
          spacingLeft: 0,
          spacingRight: 0,
          height: 240,
          plotShadow: false,
        },

        title: {
          text: "",
        },
        tooltip: {
          pointFormat: "<b>{point.percentage:.1f}%</b>",
        },
        accessibility: {
          point: {
            valueSuffix: '%'
          }
        },
        exporting: {
          enabled: false
        },
        plotOptions: {
          pie: {
            allowPointSelect: true,
            cursor: "pointer",
            size: "190",
            dataLabels: {
              enabled: false,
              formatter: function () {
                return Math.round(this.percentage * 100) / 100 + " %";
              },
              distance: -20,
              color: "white",
            },
            showInLegend: true,
          },
        },
        credits: {
          enabled: false,
        },
        legend: {
          symbolRadius: 0,
          align: "left",
          x: 10,
        },
        series: [
          {
            type: "pie",
            //name: 'Amount Collection Pie Chart',
            data: arr,
            colors: ["#3498db", "#2ecc71", "#c0392b"],
            dataLabels: {
              enabled: true,
              formatter: function () {
                return (
                  Math.round(Math.round(this.percentage * 100) / 100) + " %"
                );
              },
              distance: -20,
              color: "black",
              style: {
                textOutline: false,
              },
            },
          },
        ],

      };
    }
  }
}
