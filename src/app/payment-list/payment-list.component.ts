import { Component, TemplateRef, ViewChild, ElementRef, ViewEncapsulation, OnInit } from '@angular/core';
import { ColumnMode,DatatableComponent } from '@swimlane/ngx-datatable';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { CommonService } from '../_services/common.service';
import { ToastrService } from 'ngx-toastr';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { Page } from '../_models/page';
import { PaymentType } from '../_models/enums';


@Component({
  selector: 'app-payment-list',
  templateUrl: './payment-list.component.html',
  encapsulation: ViewEncapsulation.None
})

export class PaymentListComponent implements OnInit {

  entryForm: FormGroup;
  submitted = false;
  @BlockUI() blockUI: NgBlockUI;

  page = new Page();
  emptyGuid = '00000000-0000-0000-0000-000000000000';
  columnsWithSearch : string[] = [];
  PaymentType = PaymentType;
  modalTitle = 'Payment';
  btnSaveText = 'Save';
  modalConfig: any = { class: 'gray modal-md', backdrop: 'static' };
  modalRef: BsModalRef;
  @ViewChild(DatatableComponent, { static: false }) table: DatatableComponent;
  rows = [];
  tempRows = [];
  paymentList = [];
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
    private modalService: BsModalService,
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

   this.getPaymentList();
  }



  // getCustomerList() {
  //   this._service.get("user-list?is_customer=true").subscribe(
  //     (res) => {
  //       this.customerList = res;
  //     },
  //     (err) => {}
  //   );
  // }

  // onCustomerChange(e){
  //   if(e){
  //     this.getBillListByCustomer(e.id);
  //   }
  // }

  getPaymentList() {
    this.loadingIndicator = true;
    this._service.get("payment/get-payment-list").subscribe(
      (res) => {
        this.tempRows = res;
        this.paymentList = res;
        if(this.paymentList.length > 0) this.columnsWithSearch = Object.keys(this.paymentList[0]);
       
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
    this.paymentList = temp;
    // Whenever the filter changes, always go back to the first page
    this.table.offset = 0;
  }


}
