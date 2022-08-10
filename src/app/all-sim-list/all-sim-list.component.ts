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
import { StockStatus, SubscriptionStatus } from "../_models/enums";
import { BsModalService, BsModalRef } from "ngx-bootstrap/modal";
import { ConfirmService } from "../_helpers/confirm-dialog/confirm.service";

@Component({
  selector: "app-all-sim-list",
  templateUrl: "./all-sim-list.component.html",
  encapsulation: ViewEncapsulation.None,
})
export class AllSIMListComponent implements OnInit {
  entryForm: FormGroup;
  receiveSIMForm: FormGroup;
  submitted = false;
  @BlockUI() blockUI: NgBlockUI;

  StockStatus = StockStatus;
  SubscriptionStatus = SubscriptionStatus;
  page = new Page();
  pageLifeCycle = new Page();
  emptyGuid = "00000000-0000-0000-0000-000000000000";
  rows = [];
  tempRows = [];
  columnsWithSearch: string[] = [];
  loadingIndicator = false;
  iccidHistory: any = null;
  ColumnMode = ColumnMode;
  scrollBarHorizontal = window.innerWidth < 1200;
  @ViewChild(DatatableComponent, { static: false }) table: DatatableComponent;
  modalConfigMd: any = { class: "gray modal-md", backdrop: "static" };
  modalConfig: any = { class: "gray modal-xl", backdrop: "static" };
  modalRef: BsModalRef;
  modalRefICCID: BsModalRef;
  simLifecycleDetails: Array<any> = [];
  url = "stock/get-available-sim-list";
  searchParam = "";
  simObj = null;
  tabType = "Available";
  status = 1;
  stock :any = null;

  constructor(
    public formBuilder: FormBuilder,
    private _service: CommonService,
    private toastr: ToastrService,
    private modalService: BsModalService,
    private router: Router,
    private confirmService: ConfirmService
  ) {
    this.page.pageNumber = 0;
    this.page.size = 10;
    this.pageLifeCycle.pageNumber = 0;
    this.pageLifeCycle.size = 10;
    window.onresize = () => {
      this.scrollBarHorizontal = window.innerWidth < 1200;
    };
  }

  ngOnInit() {
    this.getSIMStockData();
    this.getList();
    this.receiveSIMForm = this.formBuilder.group({
      id: [null, [Validators.required]],
      ICCID_no: [null, [Validators.required]],
    });
  }

  getSIMStockData() {
    this._service.get('stock/get-current-sim-stock-history').subscribe(res => {
      this.stock = res;
      console.log(this.stock);
    }, err => {}
    );
  }

  // 'Available', 'Subscribed', 'Cancelled', 'Permanently Cancelled'

  changeTab(type, e) {
    this.searchParam = "";
    this.page.pageNumber = 0;
    this.page.size = 10;

    this.pageLifeCycle.pageNumber = 0;
    this.pageLifeCycle.size = 10;

    switch (type) {
      case "Available":
        this.status = 1;
        this.tabType = type;
        this.getList();
        break;
      case "Subscribed":
        this.status = 2;
        this.tabType = type;
        this.getList();
        break;
      case "Cancelled":
        this.status = 4;
        this.tabType = type;
        this.getList();
        break;
      case "Reissued":
        this.status = 6;
        this.tabType = type;
        this.getList();
        break;
      default:
        this.getList();
        break;
    }
  }


  get rs() {
    return this.receiveSIMForm.controls;
  }

  setPage(pageInfo) {
    this.page.pageNumber = pageInfo.offset;
    this.getList();
  }

  setLifeCyclePage(pageInfo) {
    this.pageLifeCycle.pageNumber = pageInfo.offset;
    this.getSIMLifeCycle();
  }

  getList() {
    this.loadingIndicator = true;
    const obj = {
      limit: this.page.size,
      page: this.page.pageNumber + 1,
      search_param: this.searchParam,
      status: this.status,
    };
    this._service.get("stock/get-sim-list", obj).subscribe(
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

  filterSearch(e) {
    if (e) {
      this.page.pageNumber = 0;
      this.page.size = 10;
      this.searchParam = e.target.value;
      this.getList();
    }
  }

  filterSimLifecycleSearch(e) {
    if (e) {
      this.pageLifeCycle.pageNumber = 0;
      this.pageLifeCycle.size = 10;
      this.searchParam = e.target.value;
      this.getSIMLifeCycle();
    }
  }

  onSubmitAction(action, row) {
    let url = "";
    let txt = "";
    switch (action) {
      case "reissuance":
        url = "stock/send-sim-for-reissuance/" + row.id;
        txt = "You are sending this sim for reissuance.";
        break;
      case "receive":
        url = "stock/receive-sim-from-mother-company/" + row.id;
        txt = "You are receiving this sim from mother company.";
        break;
      case "return":
        url = "stock/return-sim-to-stock/" + row.id;
        txt = "The sim will be added to your stock.";
        break;
      default:
        break;
    }

    this.blockUI.start("Saving...");
    this.confirmService.confirm("Are you sure?", txt).subscribe((result) => {
      if (result) {
        const request = this._service.patch(url, {});
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
            this.toastr.error(err.Msg || err, "Error!", {
              closeButton: true,
              disableTimeOut: true,
            });
          }
        );
      } else {
        this.blockUI.stop();
      }
    });
  }


  modalHideSIMRecieve() {
    this.modalRef.hide();
    this.simObj = null;
    this.submitted = false;
    this.receiveSIMForm.reset();
  }

  openModalSIMRecieve(item, template: TemplateRef<any>) {
    this.simObj = item;
    this.receiveSIMForm.controls['id'].setValue(item.id);
    this.modalRef = this.modalService.show(template, this.modalConfigMd);
  }

  modalHide() {
    this.modalRef.hide();
    this.simLifecycleDetails = [];
    this.simObj = null;
  }

  openModal(item, template: TemplateRef<any>) {
    this.searchParam = '';
    this.simObj = item;
    this.pageLifeCycle.pageNumber = 0;
    this.pageLifeCycle.size = 10;
    this.modalRef = this.modalService.show(template, this.modalConfig);
    this.getSIMLifeCycle();
  }

  onSubmitSIMReceive(){
    this.submitted = true;
    if (this.receiveSIMForm.invalid) {
      return;
    }
    const obj = {
      ICCID_no:this.receiveSIMForm.value.ICCID_no.trim()
    };

    this.confirmService.confirm('Are you sure?', 'You are receiving this sim from mother company.')
    .subscribe(
        result => {
            if (result) {
              this.blockUI.start('Saving...');
              const request = this._service.patch('stock/receive-sim-from-mother-company/'+this.receiveSIMForm.value.id, obj);
              request.subscribe(
                data => {
                  this.blockUI.stop();
                  if (data.IsReport == "Success") {
                    this.toastr.success(data.Msg, 'Success!', { timeOut: 2000 });
                    this.modalHideSIMRecieve();
                    this.getList();
                  } else if (data.IsReport == "Warning") {
                    this.toastr.warning(data.Msg, 'Warning!', { closeButton: true, disableTimeOut: true });
                  } else {
                    this.toastr.error(data.Msg, 'Error!',  { closeButton: true, disableTimeOut: true });
                  }
                },
                err => {
                  this.blockUI.stop();
                  this.toastr.error(err.Msg || err, 'Error!', { closeButton: true, disableTimeOut: true });
                }
              );
            }
        },
    );
  }

  getSIMLifeCycle() {
    this.loadingIndicator = true;
    const obj = {
      limit: this.pageLifeCycle.size,
      page: this.pageLifeCycle.pageNumber + 1,
      search_param: this.searchParam,
      sim_id: this.simObj.id,
    };
    this._service.get("stock/sim-traversal-history", obj).subscribe(
      (res) => {
        if (!res) {
          this.toastr.error(res.Message, "Error!", {
            closeButton: true,
            disableTimeOut: true,
          });
          return;
        }
        // this.tempRows = res;
        this.simLifecycleDetails = res.results;
        this.pageLifeCycle.totalElements = res.count;
        this.pageLifeCycle.totalPages = Math.ceil(
          this.pageLifeCycle.totalElements / this.pageLifeCycle.size
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

  modalHideICCID() {
    this.modalRefICCID.hide();
    this.iccidHistory = null;
  }

  openModalICCID(item, template: TemplateRef<any>) {
    this._service.get("stock/get-sim-iccid-history/" + item.id).subscribe(
      (res) => {
        this.iccidHistory = res;
        this.modalRefICCID = this.modalService.show(template, this.modalConfigMd);
      },
      (err) => {}
    );
  }
}
