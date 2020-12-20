import { Component, TemplateRef, ViewChild, ElementRef, ViewEncapsulation, OnInit } from '@angular/core';
import { ColumnMode,DatatableComponent } from '@swimlane/ngx-datatable';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { CommonService } from '../_services/common.service';
import { ToastrService } from 'ngx-toastr';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { Page } from '../_models/page';



@Component({
  selector: 'app-member-list',
  templateUrl: './member-list.component.html',
  encapsulation: ViewEncapsulation.None
})

export class MemberListComponent implements OnInit {

  entryForm: FormGroup;
  submitted = false;
  @BlockUI() blockUI: NgBlockUI;

  page = new Page();
  emptyGuid = '00000000-0000-0000-0000-000000000000';

  // modalTitle = 'Member';
  // btnSaveText = 'Save';
  // modalConfig: any = { class: 'gray modal-md', backdrop: 'static' };
  // modalRef: BsModalRef;


  @ViewChild(DatatableComponent, { static: false }) table: DatatableComponent;
  rows = [];
  tempRows = [];
  memberList = [];
  loadingIndicator = false;
  ColumnMode = ColumnMode;
  scrollBarHorizontal = (window.innerWidth < 1200);

  customer;
  customerList: Array<any> = [];
  itemList: Array<any> = [];

  subTotal:number =0;
  discount:number=0;
  paidAmount:number=0;
  billItem;

  constructor(
    // private modalService: BsModalService,
    public formBuilder: FormBuilder,
    private _service: CommonService,
    private toastr: ToastrService,
    private router: Router
  ) {
    // this.page.pageNumber = 0;
    // this.page.size = 10;
    window.onresize = () => {
      this.scrollBarHorizontal = (window.innerWidth < 1200);
    };


  }


  ngOnInit() {
   this.getList();
  }



  getList() {
    this._service.get("user-list?is_staff=true").subscribe(
      (res) => {
       // this.rows = res;
        this.tempRows = res;
        this.memberList = res;
        // this.page.totalElements = res.Total;
        // this.page.totalPages = Math.ceil(this.page.totalElements / this.page.size);
        setTimeout(() => {
          this.loadingIndicator = false;
        }, 1000);
        // const key = 'subscription';
        // this.subscriptionList = [...new Map(this.itemList.map(item =>
        //   [item[key], item])).values()];
      },
      (err) => {
        this.toastr.error(err.message || err, 'Error!', { closeButton: true, disableTimeOut: true });
      setTimeout(() => {
        this.loadingIndicator = false;
      }, 1000);
      }
    );
  }


  updateFilter(event) {
    const val = event.target.value.toLowerCase();

    // filter our data
    const temp = this.tempRows.filter(function (d) {
      return d.first_name.toLowerCase().indexOf(val) !== -1 ||
        !val;
    });

    // update the rows
    this.memberList = temp;
    // Whenever the filter changes, always go back to the first page
    this.table.offset = 0;
  }

}
