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


import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Subject, Observable, of, concat } from 'rxjs';
import { distinctUntilChanged, debounceTime, switchMap, tap, catchError, filter, map } from 'rxjs/operators';

@Component({
  selector: 'app-updatable-sim-list',
  templateUrl: './updatable-sim-list.component.html',
  encapsulation: ViewEncapsulation.None
})

export class UpdatableSIMListComponent implements OnInit {

  entryForm: FormGroup;
  submitted = false;
  @BlockUI() blockUI: NgBlockUI;
  modalTitleSIM = 'Add SIM Details';
  btnSaveText = 'Save';
  modalConfig: any = { class: 'modal-dialog-scrollable gray modal-lg', backdrop: 'static' };
  modalRef: BsModalRef;
  StockStatus = StockStatus;
  page = new Page();
  pageSupplier = new Page();
  emptyGuid = '00000000-0000-0000-0000-000000000000';
  rows = [];
  loadingIndicator = false;
  ColumnMode = ColumnMode;
  scrollBarHorizontal = (window.innerWidth < 1200);

  SIMItemList: Array<any> = [];


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


  constructor(
    private modalService: BsModalService,
    public formBuilder: FormBuilder,
    private _service: CommonService,
    private toastr: ToastrService,
    private http: HttpClient,
    private router: Router
  ) {
    this.page.pageNumber = 0;
    this.page.size = 10;

    this.pageSupplier.pageNumber = 1;
    this.pageSupplier.size = 50;

    window.onresize = () => {
      this.scrollBarHorizontal = (window.innerWidth < 1200);
    };
  }


  ngOnInit() {
    this.getSupplier();
    this.onSearch();
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
        return res;
      })
    );
  }






  // setPage(pageInfo) {
  //   this.page.pageNumber = pageInfo.offset;
  //   this.getList();
  // }

  getList() {
    this.loadingIndicator = true;
    // const obj = {
    //   size: this.page.size,
    //   pageNumber: this.page.pageNumber
    // };

    //stock/get-updatable-sim-list
    this._service.get('stock/get-updatable-sim-list-by-supplierid/'+this.selectedSupplier.id).subscribe(res => {

      if (!res) {
        this.toastr.error(res.Message, 'Error!', { closeButton: true, disableTimeOut: true });
        return;
      }
      this.rows = res;
      // this.page.totalElements = res.Total;
      // this.page.totalPages = Math.ceil(this.page.totalElements / this.page.size);
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



  onFormSubmitSIM() {

    let sim_details = [];
   // this.blockUI.start('Updating...');
   let checkCID = [];
   let checkICCID = [];
   let checkPhoneNumber = [];
   checkCID =  this.SIMItemList.filter(x => x.CID_no == '' && x.iccid != '');
   if(checkCID.length > 0){
    this.toastr.warning('Some SIM CID No Not Added', 'Warning!', { timeOut: 4000 });
    return;
   }

   checkICCID =  this.SIMItemList.filter(x => x.CID_no != '' && x.iccid == '');
   if(checkICCID.length > 0){
    this.toastr.warning('Some SIM ICCID No Not Added', 'Warning!', { timeOut: 4000 });
    return;
   }

   checkPhoneNumber =  this.SIMItemList.filter(x => (x.CID_no == '' && x.iccid == '') && x.phone_number != '');
   if(checkPhoneNumber.length > 0){
    this.toastr.warning('With Phone Number You Must Add SIM CID No And ICCID No', 'Warning!', { timeOut: 4000 });
    return;
   }

    this.SIMItemList.filter(x => x.iccid != '' && x.CID_no != '').forEach(element => {
      sim_details.push({
        id: element.id,
        CID_no: element.CID_no,
        ICCID_no: element.iccid,
        phone_number: element.phone_number,
      });
    });

    if(sim_details.length == 0){
      this.toastr.warning('No details added', 'Warning!', { timeOut: 4000 });
      return;
    }


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
        this.toastr.error(err.Message || err, 'Error!', { timeOut: 2000 });
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
    this.rows.forEach(element => {
      this.SIMItemList.push({
        "id": element.id,
        "CID_no": "",
        "iccid": "",
        "phone_number": "",
      });
    });
    this.modalRef = this.modalService.show(template, this.modalConfig);
  }

}
