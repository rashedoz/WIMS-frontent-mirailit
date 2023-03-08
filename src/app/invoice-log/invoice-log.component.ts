import {
  Component,
  TemplateRef,
  ViewChild,
  ElementRef,
  ViewEncapsulation,
  OnInit,
} from "@angular/core";
import { ColumnMode, DatatableComponent } from "@swimlane/ngx-datatable";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { CommonService } from "../_services/common.service";
import { ToastrService } from "ngx-toastr";
import { BlockUI, NgBlockUI } from "ng-block-ui";
import { Page } from "../_models/page";
import { InvoiceLogStatus } from "../_models/enums";
import { BsModalService, BsModalRef } from "ngx-bootstrap/modal";
import { ConfirmService } from "../_helpers/confirm-dialog/confirm.service";
import { DatePipe } from "@angular/common";
import {
  BsDatepickerConfig,
  BsDaterangepickerConfig,
} from "ngx-bootstrap/datepicker";
import * as moment from "moment";

@Component({
  selector: "app-invoice-log",
  templateUrl: "./invoice-log.component.html",
  encapsulation: ViewEncapsulation.None,
})
export class InvoiceLogComponent implements OnInit {
  entryForm: FormGroup;
  submitted = false;
  @BlockUI() blockUI: NgBlockUI;

  InvoiceLogStatus = InvoiceLogStatus;
  page = new Page();
  emptyGuid = "00000000-0000-0000-0000-000000000000";
  rows = [];
  tempRows = [];
  columnsWithSearch: string[] = [];
  loadingIndicator = false;
  iccidHistory: any = null;
  ColumnMode = ColumnMode;
  scrollBarHorizontal = window.innerWidth < 1200;
  @ViewChild(DatatableComponent, { static: false }) table: DatatableComponent;
  modalConfig: any = { class: "gray modal-md", backdrop: "static" };
  modalRef: BsModalRef;

  searchParam = "";
  bsConfig: Partial<BsDaterangepickerConfig>;
  date = new Date();
  // firstDay = new Date(this.date.getFullYear(), this.date.getMonth(), 1);
  // lastDay = new Date(this.date.getFullYear(), this.date.getMonth() + 1, 0);
  firstDay = null;
  lastDay = null;

  pageType = null;
  btnSaveText = "Save";
  bsLogRangeValue: Date[];

  invStatusList = [
    { id: 100, name: "All" },
    { id: 0, name: "NOT APPLICABLE" },
    { id: 1, name: "NOT STARTED" },
    { id: 2, name: "IN PROGRESS" },
    { id: 3, name: "COMPLETED" },
    { id: 4, name: "FAILED" },
  ];

  selectedInvStatus = { id: 100, name: "All" };

  constructor(
    public formBuilder: FormBuilder,
    private _service: CommonService,
    private toastr: ToastrService,
    public datepipe: DatePipe,
    private modalService: BsModalService,
    private router: Router,
    private confirmService: ConfirmService
  ) {
    this.page.pageNumber = 0;
    this.page.size = 100;
    window.onresize = () => {
      this.scrollBarHorizontal = window.innerWidth < 1200;
    };

    this.bsConfig = Object.assign({
      rangeInputFormat: "DD/MM/YYYY",
      adaptivePosition: true,
      showClearButton: true,
      clearPosition: "right",
    });

    this.bsLogRangeValue = [this.firstDay, this.lastDay];
  }

  ngOnInit() {
    this.getList();
  }

  setPage(pageInfo) {
    this.page.pageNumber = pageInfo.offset;
    this.getList();
  }

  onLogsDateValueChange(e) {
    if (e) {
      this.bsLogRangeValue = [e[0], e[1]];
    } else {
      this.bsLogRangeValue = null;
    }
    this.getList();
  }

  onInvStatusChange(e) {
    this.page.pageNumber = 0;
    this.page.size = 100;
    if (e) {
      this.selectedInvStatus = e;
      this.getList();
    } else {
      this.selectedInvStatus = { id: 100, name: "All" };
      this.getList();
    }
  }

  onGenerateAction() {
    const obj = {
      requested_month: moment().format("YYYY-MM-DD"),
    };

    this.blockUI.start("Generating...");
    this.confirmService
      .confirm("Are you sure?", "You are generating the bill.")
      .subscribe((result) => {
        if (result) {
          const request = this._service.post(
            "bill/generate-monthly-invoice-all-customer",
            obj
          );
          request.subscribe(
            (data) => {
              this.blockUI.stop();
              if (data.IsReport == "Success") {
                this.toastr.success(data.Msg, "Success!", { timeOut: 2000 });
                this.getList();
              } else if (data.IsReport == "Warning") {
                this.toastr.warning(data.Msg, "Warning!", {
                  closeButton: true,
                  disableTimeOut: true,
                });
              } else {
                this.toastr.error(data.Msg, "Error!", {
                  closeButton: true,
                  disableTimeOut: true,
                });
              }
            },
            (err) => {
              this.blockUI.stop();

              if (err.IsReport == "Warning") {
                this.toastr.warning(err.Msg, "Warning!", {
                  closeButton: true,
                  disableTimeOut: true,
                });
              } else {
                this.toastr.error(err.Msg || err, "Error!", {
                  closeButton: true,
                  disableTimeOut: true,
                });
              }

              // this.toastr.error(err.Msg || err, "Error!", {
              //   closeButton: true,
              //   disableTimeOut: true,
              // });
            }
          );
        } else {
          this.blockUI.stop();
        }
      });
  }

  getList() {
    this.loadingIndicator = true;
    const obj: any = {
      limit: this.page.size,
      page: this.page.pageNumber + 1,
    };

    if (this.selectedInvStatus.id != 100) {
      obj.invoice_status = this.selectedInvStatus.id;
    }

    if (this.bsLogRangeValue[0]) {
      (obj.invoice_start_date = moment(this.bsLogRangeValue[0]).format(
        "YYYY-MM-DD"
      )),
        (obj.invoice_end_date = moment(this.bsLogRangeValue[1]).format(
          "YYYY-MM-DD"
        ));
    }

    this._service.get("bill/invoice-log-list", obj).subscribe(
      (res) => {
        if (!res) {
          this.toastr.error(res.Message, "Error!", {
            closeButton: true,
            disableTimeOut: true,
          });
          return;
        }
        // this.tempRows = res;
        this.rows = res.results;
        this.page.totalElements = res.count;
        this.page.totalPages = Math.ceil(
          this.page.totalElements / this.page.size
        );
        setTimeout(() => {
          this.loadingIndicator = false;
        }, 1000);
      },
      (err) => {
        this.toastr.error(err.Msg || err, "Error!", {
          closeButton: true,
          disableTimeOut: true,
        });
        setTimeout(() => {
          this.loadingIndicator = false;
        }, 1000);
      }
    );
  }
}
