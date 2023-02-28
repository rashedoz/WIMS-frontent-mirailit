import { Component, TemplateRef, ViewChild, ElementRef, ViewEncapsulation, OnInit } from '@angular/core';
import { ColumnMode,DatatableComponent } from '@swimlane/ngx-datatable';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { CommonService } from '../_services/common.service';
import { ToastrService } from 'ngx-toastr';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { Page } from '../_models/page';
import { InvoiceLogStatus } from '../_models/enums';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { ConfirmService } from "../_helpers/confirm-dialog/confirm.service";
import { DatePipe } from '@angular/common';
import * as moment from 'moment';

@Component({
  selector: 'app-invoice-log-history',
  templateUrl: './invoice-log-history.component.html',
  encapsulation: ViewEncapsulation.None
})

export class InvoiceLogHistoryComponent implements OnInit {

  entryForm: FormGroup;
  submitted = false;
  @BlockUI() blockUI: NgBlockUI;

  InvoiceLogStatus = InvoiceLogStatus;
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
  modalConfig: any = { class: 'gray modal-md', backdrop: 'static' };
  modalRef: BsModalRef;

  searchParam = '';

  pageType = null;
  btnSaveText = "Save";

  invStatusList = [{id:100,name:'All'},{id:0,name:'NOT APPLICABLE'},{id:1,name:'NOT STARTED'},{id:2,name:'IN PROGRESS'},{id:3,name:'COMPLETED'},{id:4,name:'FAILED'}]

  selectedInvStatus = {id:100,name:'All'};
  log_id;
  logObj;


  constructor(
    public formBuilder: FormBuilder,
    private _service: CommonService,
    private toastr: ToastrService,
    private modalService: BsModalService,
    private router: Router,
    private route: ActivatedRoute,
    private confirmService: ConfirmService

  ) {
    this.log_id = this.route.snapshot.params['id'];
    this.page.pageNumber = 0;
    this.page.size = 100;
    window.onresize = () => {
      this.scrollBarHorizontal = (window.innerWidth < 1200);
    };

  }


  ngOnInit() {
    this.getLogDetails();
    this.getList();
  }


  setPage(pageInfo) {
    this.page.pageNumber = pageInfo.offset;
    this.getList();
  }


getLogDetails(){

   this._service.get('bill/invoice-log-detail/'+this.log_id).subscribe(
     (res) => {
       this.logObj = res;
     },
     (err) => {
     }
   );
 }

 reCallList(){
  this.page.pageNumber = 0;
  this.page.size = 100;
  this.searchParam = '';
  this.getList();
}


  onInvStatusChange(e){
    this.page.pageNumber = 0;
    this.page.size = 100;
    if(e){
    this.selectedInvStatus = e;
    this.getList();
    }else{
      this.selectedInvStatus = {id:100,name:'All'};
      this.getList();
    }
  }


  onReGenerateAction(row) {

    this.blockUI.start("Generating...");
    this.confirmService.confirm("Are you sure?", "You are re-generating the bill.").subscribe((result) => {
      if (result) {
        const request = this._service.post('bill/retry-invoice-generation/'+row.id,{});
        request.subscribe(
          (data) => {
            this.blockUI.stop();
            if (data.IsReport == "Success") {
              this.toastr.success(data.Msg, "Success!", { timeOut: 2000 });
              this.getLogDetails();
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


  filterSearch(e){
    if(e){
      this.page.pageNumber = 0;
      this.page.size = 100;
      this.searchParam = e.target.value;
      this.getList();
    }
  }

  getList() {
    this.loadingIndicator = true;
    const obj:any ={
      limit : this.page.size,
      page : this.page.pageNumber + 1,
      invoice_log_id: this.log_id,
      search_param : this.searchParam
      }

      if(this.selectedInvStatus.id != 100){
        obj.invoice_status = this.selectedInvStatus.id;
      }


    this._service.get('bill/invoice-log-history',obj).subscribe(res => {

      if (!res) {
        this.toastr.error(res.Message, 'Error!', { closeButton: true, disableTimeOut: true });
        return;
      }
     // this.tempRows = res;
      this.rows =  res.results;
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













}
