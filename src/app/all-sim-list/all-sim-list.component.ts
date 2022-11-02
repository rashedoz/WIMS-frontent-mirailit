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
import { BsDatepickerConfig, BsDaterangepickerConfig } from "ngx-bootstrap/datepicker";
import { DatePipe } from '@angular/common';

@Component({
  selector: "app-all-sim-list",
  templateUrl: "./all-sim-list.component.html",
  encapsulation: ViewEncapsulation.None,
})
export class AllSIMListComponent implements OnInit {
  entryForm: FormGroup;
  updateSIMForm: FormGroup;
  receiveSIMForm: FormGroup;
  submitted = false;
  @BlockUI() blockUI: NgBlockUI;
  bsConfig: Partial<BsDatepickerConfig>;
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
  modalConfigLg: any = { class: "gray modal-lg", backdrop: "static" };
  modalConfig: any = { class: "gray modal-xl", backdrop: "static" };
  modalRef: BsModalRef;
  modalRefICCID: BsModalRef;
  simLifecycleDetails: Array<any> = [];
  url = "stock/get-available-sim-list";
  searchParam = "";
  simObj = null;
  tabType = "Available";
  status = 1;
  stock: any = null;
  isFrozen = false;
  isPhoneSIM = false;

  simTypeList = [{id:0,name:'All'},{id:1,name:'Phone SIM'},{id:2,name:'WiFi SIM '},{id:3,name:'Device Only'}]
  selectedSimType = {id:0,name:'All'};

  constructor(
    public formBuilder: FormBuilder,
    private _service: CommonService,
    private toastr: ToastrService,
    private modalService: BsModalService,
    private router: Router,
    private datePipe: DatePipe,
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

    this.bsConfig = Object.assign(

      {

        rangeInputFormat: 'DD/MM/YYYY',
        adaptivePosition: true,
      }
    );

    this.getSIMStockData();
    this.getList();
    this.receiveSIMForm = this.formBuilder.group({
      id: [null, [Validators.required]],
      ICCID_no: [null, [Validators.required]],
      phone_number: [null]
    });

    this.updateSIMForm = this.formBuilder.group({
      id: [null, [Validators.required]],
      IMEI_pair: [null],
      ssid: [null],
      wifi_password: [null],
      model_name: [null],
      plan_name: [null],
      plan_price_for_admin: [null],
      reissue_cost_for_admin: [null],
      payment_cycle_for_admin: [null],
      sn: [null],
      service_start_date: [null],
      inventory_reg_date: [null],
      delivery_received_at: [null]
    });

  }

  get us() {
    return this.updateSIMForm.controls;
  }

  getSIMStockData() {
    this._service.get("stock/get-current-sim-stock-history").subscribe(
      (res) => {
        this.stock = res;
      },
      (err) => {}
    );
  }

  // onPhoneSIMChange(e){
  //   this.searchParam = "";
  //   this.page.pageNumber = 0;
  //   this.page.size = 10;
  //   this.getList();
  // }

  onSimTypeChange(e){
    this.searchParam = "";
    this.page.pageNumber = 0;
    this.page.size = 10;
    if(e){
    this.selectedSimType = e;
    this.getList();
    }else{
      this.selectedSimType = {id:0,name:'All'};
      this.getList();
    }
  }


  // 'Available', 'Subscribed', 'Cancelled', 'Permanently Cancelled'

  changeTab(type, e) {
    this.searchParam = "";
    this.page.pageNumber = 0;
    this.page.size = 10;

    this.pageLifeCycle.pageNumber = 0;
    this.pageLifeCycle.size = 10;
    this.isFrozen = false;

    switch (type) {
      case "Available":
        this.status = 1;
        this.tabType = type;
        this.getList();
        break;
      case "Frozen":
        this.isFrozen = true;
        this.status = 2;
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
      case "Will Be Cancelled":
        this.status = 2;
        this.tabType = type;
        this.getList();
        break;
      case "Reissued":
        this.status = 6;
        this.tabType = type;
        this.getList();
        break;
      case "Permanently Cancelled":
        this.status = 8;
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
    this.rows = [];
    this.loadingIndicator = true;
    let obj:any = {
      limit: this.page.size,
      page: this.page.pageNumber + 1,
      search_param: this.searchParam,
      status: this.status,
    };

    if(this.tabType == 'Frozen'){
      obj.is_frozen = 1;
    }

    if(this.tabType == 'Will Be Cancelled'){
      obj.is_adv_cancelled = 1;
    }

    // if(this.isPhoneSIM){
    //   obj.is_phone_sim = 1;
    // }else{
    //   obj.is_phone_sim = 0;
    // }
    if(this.selectedSimType.id != 0){
      obj.sim_type = this.selectedSimType.id;
    }

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
      case "unfreeze":
        url = "stock/freeze-unfreeze-sim/" + row.id;
        txt = "You are going to unfreeze this sim.";
        break;
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
        txt = "This sim will be added to your stock.";
        break;
      case "undo-cacellation":
        url = 'stock/undo-sim-cancellation/'+row.id;
        txt = 'You are reverting your decision.';
        break;
      case "permanently_cancelled":
        url = "stock/cancel-sim-permanently/" + row.id;
        txt = "This sim will be Permanently Cancelled.";
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
    this.receiveSIMForm.controls["id"].setValue(item.id);
    this.modalRef = this.modalService.show(template, this.modalConfigMd);
  }

  modalHide() {
    this.modalRef.hide();
    this.simLifecycleDetails = [];
    this.simObj = null;
  }

  openModal(item, template: TemplateRef<any>) {
    this.searchParam = "";
    this.simObj = item;
    this.pageLifeCycle.pageNumber = 0;
    this.pageLifeCycle.size = 10;
    this.modalRef = this.modalService.show(template, this.modalConfig);
    this.getSIMLifeCycle();
  }

  onSubmitSIMReceive() {
    this.submitted = true;
    if (this.receiveSIMForm.invalid) {
      return;
    }

    if(!this.receiveSIMForm.value.phone_number){
      this.receiveSIMForm.controls['phone_number'].setValue(this.simObj.phone_number);
    }

    const obj = {
      ICCID_no: this.receiveSIMForm.value.ICCID_no.trim(),
      phone_number: this.receiveSIMForm.value.phone_number
    };



    this.confirmService
      .confirm(
        "Are you sure?",
        "You are receiving this sim from mother company."
      )
      .subscribe((result) => {
        if (result) {
          this.blockUI.start("Saving...");
          const request = this._service.patch(
            "stock/receive-sim-from-mother-company/" +
              this.receiveSIMForm.value.id,
            obj
          );
          request.subscribe(
            (data) => {
              this.blockUI.stop();
              if (data.IsReport == "Success") {
                this.toastr.success(data.Msg, "Success!", { timeOut: 2000 });
                this.modalHideSIMRecieve();
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
        }
      });
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
    this._service.get("stock/get-sim-iccid-phone-history/" + item.id).subscribe(
      (res) => {
        this.iccidHistory = res;
        this.modalRefICCID = this.modalService.show(
          template,
          this.modalConfigLg
        );
      },
      (err) => {}
    );
  }



  modalHideSIMDetails() {
    this.modalRef.hide();
    this.simObj = null;
    this.submitted = false;
    this.updateSIMForm.reset();
  }

  openModalSIMDetailsUpdate(item, template: TemplateRef<any>) {
    this.simObj = item;
    this.updateSIMForm.controls["id"].setValue(item.id);
    this.updateSIMForm.controls["IMEI_pair"].setValue(item.IMEI_pair);
    this.updateSIMForm.controls["ssid"].setValue(item.ssid);
    this.updateSIMForm.controls["wifi_password"].setValue(item.wifi_password);
    this.updateSIMForm.controls["model_name"].setValue(item.model_name);
    this.updateSIMForm.controls["plan_name"].setValue(item.plan_name);
    this.updateSIMForm.controls["plan_price_for_admin"].setValue(item.plan_price_for_admin);
    this.updateSIMForm.controls["reissue_cost_for_admin"].setValue(item.reissue_cost_for_admin);
    this.updateSIMForm.controls["payment_cycle_for_admin"].setValue(item.payment_cycle_for_admin);
    this.updateSIMForm.controls["delivery_received_at"].setValue(item.delivery_received_at);
    this.updateSIMForm.controls["sn"].setValue(item.sn);
    this.updateSIMForm.controls["service_start_date"].setValue(item.service_start_date ? new Date(item.service_start_date) : null);;
    this.updateSIMForm.controls["inventory_reg_date"].setValue(item.inventory_reg_date ? new Date(item.inventory_reg_date) : null);;
    this.modalRef = this.modalService.show(template, this.modalConfig);
  }


  onSubmitSIMDetails() {
    this.submitted = true;
    if (this.updateSIMForm.invalid) {
      return;
    }


    const obj = {
      IMEI_pair: this.updateSIMForm.value.IMEI_pair,
      ssid: this.updateSIMForm.value.ssid,
      wifi_password: this.updateSIMForm.value.wifi_password,
      model_name: this.updateSIMForm.value.model_name,
      plan_name: this.updateSIMForm.value.plan_name,
      sn: this.updateSIMForm.value.sn,
      service_start_date: this.updateSIMForm.value.service_start_date ? this.datePipe.transform(this.updateSIMForm.value.service_start_date, "yyyy-MM-dd") : null,
      inventory_reg_date: this.updateSIMForm.value.inventory_reg_date ? this.datePipe.transform(this.updateSIMForm.value.inventory_reg_date, "yyyy-MM-dd") : null,
      plan_price_for_admin: this.updateSIMForm.value.plan_price_for_admin ? Number(this.updateSIMForm.value.plan_price_for_admin) : this.updateSIMForm.value.plan_price_for_admin,
      reissue_cost_for_admin: this.updateSIMForm.value.reissue_cost_for_admin ? Number(this.updateSIMForm.value.reissue_cost_for_admin) : this.updateSIMForm.value.reissue_cost_for_admin,
      payment_cycle_for_admin: this.updateSIMForm.value.payment_cycle_for_admin ? Number(this.updateSIMForm.value.payment_cycle_for_admin): this.updateSIMForm.value.payment_cycle_for_admin
    };

        this.blockUI.start("Updating...");
          const request = this._service.patch(
            "stock/update-sim-detail/" +this.updateSIMForm.value.id, obj
          );
          request.subscribe(
            (data) => {
              this.blockUI.stop();
              if (data.IsReport == "Success") {
                this.toastr.success(data.Msg, "Success!", { timeOut: 2000 });
                this.modalHideSIMDetails();
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


  }




}
