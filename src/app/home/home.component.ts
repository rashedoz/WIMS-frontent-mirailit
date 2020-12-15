import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { AuthenticationService } from './../_services/authentication.service';
import { CommonService } from './../_services/common.service';
import * as Highcharts from 'highcharts';
import HC_exporting from 'highcharts/modules/exporting';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
HC_exporting(Highcharts);

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  encapsulation: ViewEncapsulation.None
})

export class HomeComponent implements OnInit {

  public currentUser: any;
  public allContent: any;
  courseOptions: any = null;
  highcharts = Highcharts;
  @BlockUI() blockUI: NgBlockUI;

  constructor(
    private authService: AuthenticationService,
    private toastr: ToastrService,
    private router: Router,
    private _service: CommonService
  ) {
    this.currentUser = this.authService.currentUserDetails.value;
    // console.log(this.currentUser);
  }

  ngOnInit() {
    // this.getAllCount();
    // this.getCourseEnrollmentCount();
  }

  getAllCount() {
    this._service.get('Company/GetAllCount').subscribe(res => {
      this.allContent = res.Record;
      console.log('all content', res.Record);
    }, err => { }
    );
  }

  getCourseEnrollmentCount() {
    const self = this;
    this._service.get("Course/GetCourseEnrollmentCount")
      .subscribe(
        res => {

          if (!res.Success) {
            this.toastr.error(res.Message, 'Error!', { timeOut: 2000 });
            return;
          }
          let dataArr = [];
          let nameArr = [];

          res.Records.forEach((element) => {
            nameArr.push(element.Title);
            dataArr.push({
              'y': element.Count,
              'name': element.Title,
              'id': element.Id
            });
          });

          this.courseOptions = {
            chart: {
              type: "column",
              scrollablePlotArea: {
                minWidth: 700,
                scrollPositionX: 1
              }
            },
            exporting: {
              buttons: {
                contextButton: {
                  menuItems: [{
                    "textKey": "printChart",
                    onclick: function () {
                      this.print();
                    }
                  }, {
                    "separator": true
                  }, {
                    "text": "Download Excel",
                    onclick: function () {
                      self.downloadExcelFile();
                    }
                  }, {
                    "separator": true
                  }, {
                    "textKey": "downloadPNG",
                    onclick: function () {
                      this.exportChart();
                    }
                  }, {
                    "textKey": "downloadJPEG",
                    onclick: function () {
                      this.exportChart({
                        type: 'image/jpeg'
                      });
                    }
                  }, {
                    "textKey": "downloadPDF",
                    onclick: function () {
                      this.exportChart({
                        type: 'application/pdf'
                      });
                    }
                  }, {
                    "textKey": "downloadSVG",
                    onclick: function () {
                      this.exportChart({
                        type: 'image/svg+xml'
                      });
                    }
                  }]
                }
              },
              //  fallbackToExportServer: false
            },
            title: {
              text: "Course Wise Enrolled Employees"
            },
            xAxis: {
              categories: nameArr,
              labels: {
                rotation: -45,
                style: {
                  fontSize: '12px',
                  fontFamily: 'Verdana, sans-serif'
                },
                overflow: 'justify'

              },
              title: {
                text: "Course(s)"
              }
            },

            yAxis: {
              labels: {
                format: '{value}'
              },
              title: {
                text: "No Of Employee Enrolled"
              }
            },
            credits: {
              enabled: false
            },
            legend: {
              enabled: false
            },
            plotOptions: {
              area: {
                fillOpacity: 0.5
              },
              series: {
                borderWidth: 0,
                cursor: 'pointer',
                point: {
                  events: {
                    click: function (event) {
                      console.log(event.point.options);
                      self.router.navigate(['/course-details-dashboard', event.point.options.id]);
                      //this.filter.emit([this.category, this.serie.name]);
                      // alert('Name: '+ this.category + ', Value: ' + this.y + ', Series :' + this.series.name);
                    }
                  }
                }
              }
            },
            tooltip: {
              // headerFormat:
              //   '<span style="font-size:11px">{series.name}</span><br>',
              pointFormat:
                '<b>{point.y} employee(s) have been enrolled </b>'
            },

            series: [
              {
                name: "Watched Duration",
                data: dataArr,
                dataLabels: {
                  enabled: true,
                  rotation: -90,
                  color: '#FFFFFF',
                  align: 'right',
                  format: '{point.y}', // one decimal
                  y: 20, // 10 pixels down from the top
                  style: {
                    fontSize: '13px',
                    fontFamily: 'Verdana, sans-serif'
                  }
                }
              }
            ]
          };
        },
        err => { }
      );
  }

  onPointSelect($event) {
    console.log($event);
  }

  downloadExcelFile() {

    this.blockUI.start('Generating report. Please wait...');
    this._service.downloadFile('Course/GetCourseEnrollmentCountExcel').subscribe(res => {
      this.blockUI.stop();
      const url = window.URL.createObjectURL(res);
      var link = document.createElement('a');
      link.href = url;
      link.download = "Course_Wise_Enrolled_Employees_Report.xlsx";
      link.click();

    },
      error => {
        this.blockUI.stop();
      });
  }
}
