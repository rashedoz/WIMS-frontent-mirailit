import { Component, TemplateRef, ViewChild, ElementRef, ViewEncapsulation, OnInit } from '@angular/core';
import { ColumnMode } from '@swimlane/ngx-datatable';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonService } from '../_services/common.service';
import { ToastrService } from 'ngx-toastr';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { Page } from '../_models/page';
import { StockStatus } from '../_models/enums';
import { DatePipe } from '@angular/common';

import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Subject, Observable, of, concat } from 'rxjs';
import { distinctUntilChanged, debounceTime, switchMap, tap, catchError, filter, map } from 'rxjs/operators';
import { BsDatepickerConfig, BsDaterangepickerConfig } from "ngx-bootstrap/datepicker";


@Component({
  selector: 'app-updatable-sim-list',
  templateUrl: './updatable-sim-list.component.html',
  encapsulation: ViewEncapsulation.None
})

export class UpdatableSIMListComponent implements OnInit {

  entryForm: FormGroup;
  updateSIMForm: FormGroup;
  submitted = false;
  @BlockUI() blockUI: NgBlockUI;
  modalTitleSIM = 'Add SIM Details';
  btnSaveText = 'Save';
  modalConfig: any = { class: 'modal-dialog-scrollable gray modal-lg', backdrop: 'static' };
  modalConfigXL: any = { class: 'modal-dialog-scrollable gray modal-xxl', backdrop: 'static' };
  modalRef: BsModalRef;
  StockStatus = StockStatus;
  page = new Page();
  bsConfig: Partial<BsDatepickerConfig>;
  pageSIMUpdate = new Page();
  pageSupplier = new Page();
  emptyGuid = '00000000-0000-0000-0000-000000000000';
  rows = [];
  loadingIndicator = false;
  ColumnMode = ColumnMode;
  scrollBarHorizontal = (window.innerWidth < 1200);

  SIMItemList = [];
  isPhoneSIM = false;

  // for customer
  selectedSupplier = null;
  suppliers = [];
  suppliersBuffer = [];
  bufferSize = 50;
  numberOfItemsFromEndBeforeFetchingMore = 10;
  loading = false;
  count=1;
  searchParam = '';
  input$ = new Subject<string>();

  simObj = null;

  simTypeList = [{id:2,name:'WiFi SIM'},{id:1,name:'Phone SIM'},{id:3,name:'Device Only'}]

  selectedSimType = {id:2,name:'WiFi SIM'};


  constructor(
    private modalService: BsModalService,
    public formBuilder: FormBuilder,
    private _service: CommonService,
    private toastr: ToastrService,
    private http: HttpClient,
    private datePipe: DatePipe,
    private router: Router
  ) {
    this.page.pageNumber = 0;
    this.page.size = 100;

    this.pageSIMUpdate.pageNumber = 0;
    this.pageSIMUpdate.size = 20;

    this.pageSupplier.pageNumber = 1;
    this.pageSupplier.size = 50;

    window.onresize = () => {
      this.scrollBarHorizontal = (window.innerWidth < 1200);
    };
  }


  ngOnInit() {
    this.getSupplier();
    this.onSearch();

    this.bsConfig = Object.assign(
      {},
      {
        dateInputFormat: "DD-MMM-YYYY ",
      }
    );

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

  onSearch() {
    this.input$.pipe(
      debounceTime(200),
      distinctUntilChanged(),
      switchMap(term => this.fakeServiceSupplier(term))
    ).subscribe((data: any) => {
      this.suppliers = data.results;
      this.pageSupplier.totalElements = data.count;
      this.pageSupplier.totalPages = Math.ceil(this.pageSupplier.totalElements / this.pageSupplier.size);
      this.suppliersBuffer = this.suppliers.slice(0, this.bufferSize);
    })
  }

  onSupplierChange(e) {
    this.page.pageNumber = 0;
    this.page.size = 100;
    if (e) {
      this.selectedSupplier = e;
      this.getList();
    } else {
      this.selectedSupplier = null;
      this.rows = [];
    }
  }

  onScrollToEnd() {
    this.fetchMore();
  }

  onScroll({ end }) {
    if (this.loading || this.suppliers.length <= this.suppliersBuffer.length) {
      return;
    }

    if (end + this.numberOfItemsFromEndBeforeFetchingMore >= this.suppliersBuffer.length) {
      this.fetchMore();
    }
  }

  private fetchMore() {

    let more;
    // const len = this.suppliersBuffer.length;
    if (this.count < this.pageSupplier.totalPages) {
      this.count++;
      this.pageSupplier.pageNumber = this.count;
      let obj;
      if (this.searchParam) {
        obj = {
          limit: this.pageSupplier.size,
          page: this.pageSupplier.pageNumber,
          search_param: this.searchParam
        };
      } else {
        obj = {
          limit: this.pageSupplier.size,
          page: this.pageSupplier.pageNumber
        };
      }
      this._service.get("supplier/get-customer-list", obj).subscribe(
        (res) => {
          more = res.results;
          //  const more = this.suppliers.slice(len, this.bufferSize + len);
          this.loading = true;
          // using timeout here to simulate backend API delay
          setTimeout(() => {
            this.loading = false;
            this.suppliersBuffer = this.suppliersBuffer.concat(more);
          }, 200)
        },
        (err) => { }
      );
    }

  }


  getSupplier() {
    let obj;
    if (this.searchParam) {
      obj = {
        limit: this.pageSupplier.size,
        page: this.pageSupplier.pageNumber,
        search_param: this.searchParam
      };
    } else {
      obj = {
        limit: this.pageSupplier.size,
        page: this.pageSupplier.pageNumber
      };
    }

    this._service.get("supplier/get-supplier-list", obj).subscribe(
      (res) => {
        this.suppliers = res.results;
        this.pageSupplier.totalElements = res.count;
        this.pageSupplier.totalPages = Math.ceil(this.pageSupplier.totalElements / this.pageSupplier.size);
        this.suppliersBuffer = this.suppliers.slice(0, this.bufferSize);
      },
      (err) => { }
    );
  }

  private fakeServiceSupplier(term) {

    this.pageSupplier.size = 50;
    this.pageSupplier.pageNumber = 1;
    this.searchParam = term;

    let obj;
    if (this.searchParam) {
      obj = {
        limit: this.pageSupplier.size,
        page: this.pageSupplier.pageNumber,
        search_param: this.searchParam
      };
    } else {
      obj = {
        limit: this.pageSupplier.size,
        page: this.pageSupplier.pageNumber
      };
    }

    let params = new HttpParams();
    if (obj) {
      for (const key in obj) {
        if (obj.hasOwnProperty(key)) {
          params = params.append(key, obj[key]);
        }
      }
    }
    return this.http.get<any>(environment.apiUrl + 'supplier/get-supplier-list', { params }).pipe(
      map(res => {
        return res.results;
      })
    );
  }



  // onPhoneSIMChange(e){
  //   this.page.pageNumber = 0;
  //   this.page.size = 10;
  //   this.getList();
  // }

  onSimTypeChange(e){
    this.page.pageNumber = 0;
    this.page.size = 100;
    if(e){
    this.selectedSimType = e;
    this.getList();
    }
  }


  setPage(pageInfo) {
    this.page.pageNumber = pageInfo.offset;
    this.getList();
  }

  setPageSIMUpdate(pageInfo) {
    this.pageSIMUpdate.pageNumber = pageInfo.offset;
    this.getListForSIMUpdate();
  }

  getList() {
    this.loadingIndicator = true;
    let obj:any;
    obj = {
      limit: this.page.size,
      page: this.page.pageNumber + 1
    };

    // if(this.isPhoneSIM){
    //   obj.is_phone_sim = 1;
    // }else{
    //   obj.is_phone_sim = 0;
    // }


    obj.sim_type = this.selectedSimType.id;


    //stock/get-updatable-sim-list
    this._service.get('stock/get-updatable-sim-list-by-supplierid/'+this.selectedSupplier.id, obj).subscribe(res => {

      if (!res) {
        this.toastr.error(res.Message, 'Error!', { closeButton: true, disableTimeOut: true });
        return;
      }
      this.rows = res.results;
      this.page.totalElements = res.count;
      this.page.totalPages = Math.ceil(this.page.totalElements / this.page.size);
      setTimeout(() => {
        this.loadingIndicator = false;
      }, 1000);
    }, err => {
      this.toastr.error(err.Msg || err, 'Error!', { closeButton: true, disableTimeOut: true });
      setTimeout(() => {
        this.loadingIndicator = false;
      }, 1000);
    }
    );
  }

  getListForSIMUpdate() {
    this.loadingIndicator = true;
    let obj:any;
    obj = {
      limit: this.pageSIMUpdate.size,
      page: this.pageSIMUpdate.pageNumber + 1
    };

    // if(this.isPhoneSIM){
    //   obj.is_phone_sim = 1;
    // }else{
    //   obj.is_phone_sim = 0;
    // }
    obj.sim_type = this.selectedSimType.id;

    //stock/get-updatable-sim-list
    this._service.get('stock/get-updatable-sim-list-by-supplierid/'+this.selectedSupplier.id, obj).subscribe(res => {

      if (!res) {
        this.toastr.error(res.Message, 'Error!', { closeButton: true, disableTimeOut: true });
        return;
      }

      // res.results.forEach(element => {
      //   this.SIMItemList.push({
      //     "id": element.id,
      //     "CID_no": element.CID_no,
      //     "ICCID_no": "",
      //     "phone_number": "",
      //   });
      // });

      this.SIMItemList = res.results;
      this.pageSIMUpdate.totalElements = res.count;
      this.pageSIMUpdate.totalPages = Math.ceil(this.pageSIMUpdate.totalElements / this.pageSIMUpdate.size);
      setTimeout(() => {
        this.loadingIndicator = false;
      }, 1000);
    }, err => {
      this.toastr.error(err.Msg || err, 'Error!', { closeButton: true, disableTimeOut: true });
      setTimeout(() => {
        this.loadingIndicator = false;
      }, 1000);
    }
    );
  }



  onFormSubmitSIM() {

    let sim_details = [];

   let checkCID = [];
   let checkICCID = [];
   let checkICCIDPhone = [];
   let checkPhoneNumber = [];
   let checkPhone = [];
  //  checkCID =  this.SIMItemList.filter(x => !x.CID_no && x.ICCID_no);
  //  if(checkCID.length > 0){
  //   this.toastr.warning('Some SIM CID No Not Added', 'Warning!', { timeOut: 4000 });
  //   return;
  //  }

  //  checkICCID =  this.SIMItemList.filter(x => x.CID_no && !x.ICCID_no);
  //  if(checkICCID.length > 0){
  //   this.toastr.warning('Some SIM ICCID No Not Added', 'Warning!', { timeOut: 4000 });
  //   return;
  //  }

  //  checkPhoneNumber =  this.SIMItemList.filter(x => (!x.CID_no && !x.ICCID_no') && x.phone_number);
  //  if(checkPhoneNumber.length > 0){
  //   this.toastr.warning('With Phone Number You Must Add SIM CID No And ICCID No', 'Warning!', { timeOut: 4000 });
  //   return;
  //  }





  checkCID =  this.SIMItemList.filter(x => !x.CID_no && (x.ICCID_no && x.phone_number ));
   if(checkCID.length > 0){
    this.toastr.warning('Some SIM CID Not Added', 'Warning!', { timeOut: 4000 });
    return;
   }

   checkICCID =  this.SIMItemList.filter(x => !x.ICCID_no && x.phone_number);
   if(checkICCID.length > 0){
    this.toastr.warning('Some SIM ICCID Not Added', 'Warning!', { timeOut: 4000 });
    return;
   }

   checkPhone =  this.SIMItemList.filter(x => x.ICCID_no && !x.phone_number);
   if(checkPhone.length > 0){
    this.toastr.warning('Some Phone Number Not Added', 'Warning!', { timeOut: 4000 });
    return;
   }

  //  checkPhoneNumber =  this.SIMItemList.filter(x => (x.CID_no == null && x.ICCID_no == null) && x.phone_number != '');
  //  if(checkPhoneNumber.length > 0){
  //   this.toastr.warning('With Phone Number You Must Add SIM CID No And ICCID No', 'Warning!', { timeOut: 4000 });
  //   return;
  //  }

    this.SIMItemList.filter(x => x.CID_no && x.ICCID_no && x.phone_number).forEach(element => {
      sim_details.push({
        id: element.id,
        CID_no: element.CID_no,
        sn: element.sn,
        ICCID_no: element.ICCID_no,
        phone_number: element.phone_number,
        IMEI_pair: element.IMEI_pair,
        model_name: element.model_name,
        ssid: element.ssid,
        wifi_password: element.wifi_password
      });
    });

    if(sim_details.length == 0){
      this.toastr.warning('No details added', 'Warning!', { timeOut: 4000 });
      return;
    }
    this.blockUI.start('Updating...');

    const obj = {
      sim_details: sim_details
    };
    this._service.put('stock/update-bulk-sim-detail', obj).subscribe(
      data => {
        this.blockUI.stop();
        if (data.IsReport == "Success") {
          this.toastr.success(data.Msg, 'Success!', { timeOut: 2000 });
          this.modalHideSIM();
          this.getList();

        } else if (data.IsReport == "Warning") {
          this.toastr.warning(data.Msg, 'Warning!', { closeButton: true, disableTimeOut: true });
        } else {
          this.toastr.error(data.Msg, 'Error!', { timeOut: 2000 });
        }
      },
      err => {
        this.blockUI.stop();
        this.toastr.error(err.Msg || err, 'Error!', { timeOut: 2000 });
      }
    );

  }


  modalHideSIM() {

    this.modalRef.hide();
    this.submitted = false;
    this.modalTitleSIM = 'Add SIM Details';
    this.btnSaveText = 'Save';
    this.SIMItemList = [];
  }


  openModalSIM(template: TemplateRef<any>) {
    this.getListForSIMUpdate();
    this.modalRef = this.modalService.show(template, this.modalConfigXL);
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
    this.updateSIMForm.controls["sn"].setValue(item.sn);
    this.updateSIMForm.controls["service_start_date"].setValue(item.service_start_date ? new Date(item.service_start_date) : null);
    this.updateSIMForm.controls["inventory_reg_date"].setValue(item.inventory_reg_date ? new Date(item.inventory_reg_date) : null);
    this.updateSIMForm.controls["delivery_received_at"].setValue(item.delivery_received_at ? new Date(item.delivery_received_at) : null);
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
