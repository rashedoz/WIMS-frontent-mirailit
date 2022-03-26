import { Component, TemplateRef, ViewChild, ElementRef, ViewEncapsulation, OnInit } from '@angular/core';
import { ColumnMode,SelectionType,DatatableComponent } from '@swimlane/ngx-datatable';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { Router } from '@angular/router';
import { CommonService } from '../_services/common.service';
import { ToastrService } from 'ngx-toastr';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { Page } from '../_models/page';
import { StockStatus,ReissuanceStatus } from '../_models/enums';
import { ConfirmService } from '../_helpers/confirm-dialog/confirm.service';

@Component({
  selector: 'app-all-sim-list-for-receive',
  templateUrl: './all-sim-list-for-receive.component.html',
  encapsulation: ViewEncapsulation.None
})

export class AllSIMListForReceiveComponent implements OnInit {

  entryForm: FormGroup;
  submitted = false;
  @BlockUI() blockUI: NgBlockUI;

  StockStatus = StockStatus;
  ReissuanceStatus = ReissuanceStatus;
  page = new Page();
  emptyGuid = '00000000-0000-0000-0000-000000000000';
  rows = [];
  tempRows = [];
  loadingIndicator = false;
  ColumnMode = ColumnMode;
  SelectionType = SelectionType;
  scrollBarHorizontal = (window.innerWidth < 1200);
  @ViewChild(DatatableComponent, { static: false }) table: DatatableComponent;
  modalConfig: any = { class: 'gray modal-lg', backdrop: 'static' };
  modalRef: BsModalRef;
  simObj;
  simDetails : Array<any> = [];
  searchParam = '';
  url = 'stock/get-reissued-and-subscribed-sim-list';
  selectedSIMType = {id:'Subscribed',name:'Subscribed'};
  SIMTypeList = [{id:'Subscribed',name:'Subscribed'},{id:'Available',name:'In-Stock(Available)'},{id:'Cancelled',name:'Cancelled'},{id:'Permanently Cancelled',name:'Permanently Cancelled'}]

  constructor(
    private modalService: BsModalService,
    private confirmService: ConfirmService,
    public formBuilder: FormBuilder,
    private _service: CommonService,
    private toastr: ToastrService,
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


  onSIMTypeChange(e){
    if(e){
      switch (e.id) {
        case 'Subscribed':
          this.url = 'stock/get-reissued-and-subscribed-sim-list';
          this.getList();
          break;
        case 'Available':
          this.url = 'stock/get-reissued-and-available-sim-list';
          this.getList();
          break;
        case 'Cancelled':
          this.url = 'stock/get-reissued-and-cancelled-sim-list';
          this.getList();
          break;
        case 'Permanently Cancelled':
          this.url = 'stock/get-reissued-and-permanently-cancelled-sim-list';
          this.getList();
          break;

        default:
          break;
      }
    }
  }

  setPage(pageInfo) {
    this.page.pageNumber = pageInfo.offset;
    this.getList();
}

  getList() {
    this.loadingIndicator = true;
    const obj = {
      limit: this.page.size,
      page: this.page.pageNumber + 1,
     // search_param:this.searchParam
    };

    //stock/get-reissued-sim-list
    this._service.get(this.url,obj).subscribe(res => {

      if (!res) {
        this.toastr.error(res.Message, 'Error!', { closeButton: true, disableTimeOut: true });
        return;
      }
      // this.rows = res;
      // this.tempRows = res;
      this.rows = res.results;
      this.page.totalElements = res.count;
      this.page.totalPages = Math.ceil(this.page.totalElements / this.page.size);
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

  filterSearch(e){
    if(e){
      this.page.pageNumber = 0;
      this.page.size = 10;
      this.searchParam = e.target.value;
      this.getList();
    }
  }

  onFormSubmit() {
    this.submitted = true;

    let received_sims = [];

    this.rows.filter(x=> x.secondary_status === 2 && x.isReceiveChecked && x.ICCID).forEach(element => {
      received_sims.push({
        sim: element.id,
        ICCID_no: element.ICCID
      });

    });

    if(received_sims.length === 0){
      this.toastr.warning('No item selected for receive', 'Warning!', { closeButton: true, disableTimeOut: true });
      return;
    }

    this.blockUI.start('Saving...');
    const obj = {
      received_sims:received_sims
  };

    this.confirmService.confirm('Are you sure?', 'You are receiving those sims.')
    .subscribe(
        result => {
            if (result) {
              this._service.post('stock/receive-reissued-sims-from-mother-company', obj).subscribe(
                data => {
                  this.blockUI.stop();
                  if (data.IsReport == "Success") {
                    this.toastr.success(data.Msg, 'Success!', { closeButton: true, disableTimeOut: true });
                    this.getList();
                  } else if (data.IsReport == "Warning") {
                    this.toastr.warning(data.Msg, 'Warning!', { closeButton: true, disableTimeOut: true });
                  } else {
                    this.toastr.error(data.Msg, 'Error!',  { closeButton: true, disableTimeOut: true });
                  }
                },
                err => {
                  this.blockUI.stop();
                  this.toastr.error(err.Message || err, 'Error!', { timeOut: 2000 });
                }
              );
            }
            else{
                this.blockUI.stop();
            }
        },

    );
  }

  // updateFilter(event) {
  //   const val = event.target.value.toLowerCase();

  //   // filter our data
  //   const temp = this.tempRows.filter(function (d) {
  //     return d.ICCID_no != null ? d.ICCID_no.toLowerCase().indexOf(val) !== -1 : '' ||
  //            d.CID_no.toLowerCase().indexOf(val) !== -1 ||
  //       !val;
  //   });

  //   // update the rows
  //   this.rows = temp;
  //   // Whenever the filter changes, always go back to the first page
  //   this.table.offset = 0;
  // }

  onSelect({selected}, template: TemplateRef<any>) {
    if(selected[0]){
      this.simObj = selected[0];
      this.showDetails(template);
    }

}


  modalHide() {
    this.modalRef.hide();
    this.simObj = null;
    this.simDetails = [];
  }

  openModal(item, template: TemplateRef<any>) {
    this.simObj = item;
    this.showDetails(template);
  }

  showDetails(template){
    this._service.get('stock/get-sim-entire-reissue-history/'+this.simObj.id).subscribe(res => {
      if(res.length){
        this.simDetails = res;
        this.modalRef = this.modalService.show(template, this.modalConfig);
      } else {
        this.toastr.warning('No Details Found.', 'Warning!', { closeButton: true, disableTimeOut: false });
      }
    }, err => { }
    );
  }



}
