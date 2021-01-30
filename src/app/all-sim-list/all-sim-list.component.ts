import { Component, TemplateRef, ViewChild, ElementRef, ViewEncapsulation, OnInit } from '@angular/core';
import { ColumnMode,DatatableComponent } from '@swimlane/ngx-datatable';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonService } from '../_services/common.service';
import { ToastrService } from 'ngx-toastr';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { Page } from '../_models/page';
import { StockStatus } from '../_models/enums';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-all-sim-list',
  templateUrl: './all-sim-list.component.html',
  encapsulation: ViewEncapsulation.None
})

export class AllSIMListComponent implements OnInit {

  entryForm: FormGroup;
  submitted = false;
  @BlockUI() blockUI: NgBlockUI;

  StockStatus = StockStatus;
  page = new Page();
  emptyGuid = '00000000-0000-0000-0000-000000000000';
  rows = [];
  tempRows = [];
  columnsWithSearch : string[] = [];
  loadingIndicator = false;
  iccidHistory:any = null;
  ColumnMode = ColumnMode;
  scrollBarHorizontal = (window.innerWidth < 1200);
  @ViewChild(DatatableComponent, { static: false }) table: DatatableComponent;
  modalConfig: any = { class: 'gray modal-lg', backdrop: 'static' };
  modalRef: BsModalRef;
  modalRefICCID: BsModalRef;
  simLifecycleDetails : Array<any> = [];

  constructor(
    public formBuilder: FormBuilder,
    private _service: CommonService,
    private toastr: ToastrService,
    private modalService: BsModalService,
    private router: Router
  ) {
    this.page.pageNumber = 0;
    this.page.size = 10;
    window.onresize = () => {
      this.scrollBarHorizontal = (window.innerWidth < 1200);
    };
  }


  ngOnInit() {

    this.getList();
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
    this._service.get('stock/get-sim-list').subscribe(res => {

      if (!res) {
        this.toastr.error(res.Message, 'Error!', { closeButton: true, disableTimeOut: true });
        return;
      }
      this.tempRows = res;
      this.rows = res;
      if(this.rows.length > 0)this.columnsWithSearch = Object.keys(this.rows[0]);
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

  updateFilterBill(event) {

    const val = event.target.value.toString().toLowerCase().trim();

      // assign filtered matches to the active datatable
      const temp = this.tempRows.filter(item => {
        // iterate through each row's column data
        for (let i = 0; i < this.columnsWithSearch.length; i++){
          var colValue = item[this.columnsWithSearch[i]] ;  
          // if no filter OR colvalue is NOT null AND contains the given filter
          if (!val || (!!colValue && colValue.toString().toLowerCase().indexOf(val) !== -1)) {
            // found match, return true to add to result set
            return true;
          }
        }
      });

    // update the rows
    this.rows = temp;
    // // Whenever the filter changes, always go back to the first page
     this.table.offset = 0;
  }


  modalHide() {
    this.modalRef.hide();
    this.simLifecycleDetails = [];
  }

  openModal(item, template: TemplateRef<any>) {

    this._service.get('stock/get-sim-lifecycle/'+item.id).subscribe(res => {
      if(res.length){
        this.simLifecycleDetails = res;
        this.modalRef = this.modalService.show(template, this.modalConfig);
      } else {
        this.toastr.warning('No Details Found.', 'Warning!', { closeButton: true, disableTimeOut: false });
      }
    }, err => { }
    );
  }

  modalHideICCID() {
    this.modalRefICCID.hide();
    this.iccidHistory = null;
  }

  openModalICCID(item, template: TemplateRef<any>) {

    this._service.get('stock/get-sim-iccid-history/'+item.id).subscribe(res => {
      
       this.iccidHistory = res;
       this.modalRefICCID = this.modalService.show(template, this.modalConfig);

    }, err => { }
    );
  }



}
