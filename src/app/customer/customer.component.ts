import { Component, TemplateRef, ViewChild, ElementRef, ViewEncapsulation, OnInit } from '@angular/core';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { ColumnMode,DatatableComponent } from '@swimlane/ngx-datatable';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonService } from './../_services/common.service';
import { AuthenticationService } from './../_services/authentication.service';
import { ToastrService } from 'ngx-toastr';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { Page } from './../_models/page';


@Component({
  selector: 'app-customer',
  templateUrl: './customer.component.html',
  styleUrls:['./customer.component.css'],
  encapsulation: ViewEncapsulation.None
})

export class CustomerComponent implements OnInit {

  RegistrerForm: FormGroup;
  RegistrerFormRetailer: FormGroup;
  submitted = false;
  @BlockUI() blockUI: NgBlockUI;
  customerTypeList = [{id:1,name:"Wholesaler"},{id:2,name:"Retailer"}]

  modalTitle = 'Add Customer';
  btnSaveText = 'Save';

  modalConfig: any = { class: 'gray modal-md', backdrop: 'static' };
  modalRef: BsModalRef;
  modalRefRetailer: BsModalRef;
  @ViewChild(DatatableComponent, { static: false }) table: DatatableComponent;
  @ViewChild(DatatableComponent, { static: false }) tableWholesaler: DatatableComponent;
  @ViewChild(DatatableComponent, { static: false }) tableRetailer: DatatableComponent;
  page = new Page();
  isbuttonActive = true;
  activeTable = 0;
  tempRows = [];
  customerList = [];
  wholesalerList = [];
  retailerList = [];
  loadingIndicator = false;
  ColumnMode = ColumnMode;

  scrollBarHorizontal = (window.innerWidth < 1200);

  constructor(
    private modalService: BsModalService,
    public formBuilder: FormBuilder,
    private _service: CommonService,
    private toastr: ToastrService,
    private authService: AuthenticationService,
    private router: Router
  ) {
    this.page.pageNumber = 0;
    this.page.size = 10;
    window.onresize = () => {
      this.scrollBarHorizontal = (window.innerWidth < 1200);
    };
  }


  ngOnInit() {

  //   this.RegistrerForm = this.formBuilder.group({
  //     id:[null,],
  //     customer_code: [{value: null, disabled: true}],
  //     nid: [null],     
  //     fax: [null],
  //     telephone: [null],
  //     acc_number: [null],
  //     email: [null, [Validators.required, Validators.email, Validators.maxLength(50)]],
  //     mobile: [null, [Validators.required]],
  //     alternative_mobile: [null],
  //     address_one: [null],
  //     address_two: [null],     
  //     firstName: [null, [Validators.required]],
  //     lastName: [null, [Validators.required]],
  //     password: ['', [Validators.required, Validators.minLength(6)]],
  //     confirmPassword: ['', Validators.required]
  //   }, {
  //     validator: MustMatch('password', 'confirmPassword')
  // });


    this.RegistrerForm = this.formBuilder.group({
      email: [null, [Validators.required, Validators.email, Validators.maxLength(50)]],
      mobile: [null, [Validators.required]],
      firstName: [null, [Validators.required]],
      lastName: [null, [Validators.required]],
      // customerType: [null, [Validators.required]]
    });
    this.RegistrerFormRetailer = this.formBuilder.group({
      email: [null, [Validators.required, Validators.email, Validators.maxLength(50)]],
      mobile: [null, [Validators.required]],
      firstName: [null, [Validators.required]],
      lastName: [null, [Validators.required]],
      // customerType: [null, [Validators.required]]
    });
    this.getList();
  }

  get f() {
    return this.RegistrerForm.controls;
  }
  get r() {
    return this.RegistrerFormRetailer.controls;
  }

  setPage(pageInfo) {
   // this.page.pageNumber = pageInfo.offset;
    this.getList();
  }

  showCustomerTable(id){
    this.isbuttonActive = false;
    switch (id) {
      case 0:
        this.getList();
        break;
      case 1:
        this.getWholesalerList();
        break;
      case 2:
        this.getRetailerList();
        break;

    }
  }

  getList() {
    this.loadingIndicator = true;
    this._service.get('user-list?is_customer=true').subscribe(res => {
      if (!res) {
        this.toastr.error(res.Message, 'Error!', { timeOut: 2000 });
        return;
      }
      this.activeTable = 0;
      this.tempRows = res;
      this.customerList = res;
      // this.page.totalElements = res.Total;
      // this.page.totalPages = Math.ceil(this.page.totalElements / this.page.size);
      setTimeout(() => {
        this.loadingIndicator = false;
      }, 1000);
    }, err => {
      this.toastr.error(err.Message || err, 'Error!', { timeOut: 2000 });
      setTimeout(() => {
        this.loadingIndicator = false;
      }, 1000);
    }
    );
  }


//   getItem(row, template: TemplateRef<any>) {

//     this.modalTitle = 'Update Customer';
//     this.btnSaveText = 'Update';
//     this.RegistrerForm.controls['id'].setValue(row.id);
//     this.RegistrerForm.controls['customer_code'].setValue(row.customer_code);
//     this.RegistrerForm.controls['nid'].setValue(row.nid);
//     this.RegistrerForm.controls['fax'].setValue(row.fax);
//     this.RegistrerForm.controls['telephone'].setValue(row.telephone);
//     this.RegistrerForm.controls['acc_number'].setValue(row.acc_number);
//     this.RegistrerForm.controls['email'].setValue(row.email);
//     this.RegistrerForm.controls['email'].disable();
//     this.RegistrerForm.controls['mobile'].setValue(row.mobile);
//     this.RegistrerForm.controls['alternative_mobile'].setValue(row.alternative_mobile);
//     this.RegistrerForm.controls['address_one'].setValue(row.address_one);
//     this.RegistrerForm.controls['address_two'].setValue(row.address_two);
//     this.RegistrerForm.controls['firstName'].setValue(row.first_name);
//     this.RegistrerForm.controls['lastName'].setValue(row.last_name);
//     this.RegistrerForm.controls['preferred_payment_method'].setValue(row.preferred_payment_method);
//     this.modalRef = this.modalService.show(template, this.modalConfig);
  
// }



  getWholesalerList() {
    this.loadingIndicator = true;
    this._service.get('user-list?is_customer=true&is_wholesaler=true').subscribe(res => {
      if (!res) {
        this.toastr.error(res.Message, 'Error!', { timeOut: 2000 });
        return;
      }
      this.activeTable = 1;
      this.tempRows = res;
      this.wholesalerList = res;
      // this.page.totalElements = res.Total;
      // this.page.totalPages = Math.ceil(this.page.totalElements / this.page.size);
      setTimeout(() => {
        this.loadingIndicator = false;
      }, 1000);
    }, err => {
      this.toastr.error(err.Message || err, 'Error!', { timeOut: 2000 });
      setTimeout(() => {
        this.loadingIndicator = false;
      }, 1000);
    }
    );
  }

  getRetailerList() {
    this.loadingIndicator = true;
    this._service.get('user-list?is_customer=true&is_retailer=true').subscribe(res => {
      if (!res) {
        this.toastr.error(res.Message, 'Error!', { timeOut: 2000 });
        return;
      }
      this.activeTable = 2;
      this.tempRows = res;
      this.retailerList = res;
      // this.page.totalElements = res.Total;
      // this.page.totalPages = Math.ceil(this.page.totalElements / this.page.size);
      setTimeout(() => {
        this.loadingIndicator = false;
      }, 1000);
    }, err => {
      this.toastr.error(err.Message || err, 'Error!', { timeOut: 2000 });
      setTimeout(() => {
        this.loadingIndicator = false;
      }, 1000);
    }
    );
  }

  getItem(id, template: TemplateRef<any>) {
    this.blockUI.start('Getting data...');
    this._service.get('Customer/GetCustomerById/' + id).subscribe(res => {
      this.blockUI.stop();
      if (!res.Success) {
        this.toastr.error(res.Message, 'Error!', { timeOut: 2000 });
        return;
      }
      this.modalTitle = 'Update Set';
      this.btnSaveText = 'Update';
      this.RegistrerForm.controls['id'].setValue(res.Record.Id);
      this.RegistrerForm.controls['name'].setValue(res.Record.Name);
      this.RegistrerForm.controls['isActive'].setValue(res.Record.IsActive);
      this.modalRef = this.modalService.show(template, this.modalConfig);
    }, err => {
      this.blockUI.stop();
      this.toastr.error(err.Message || err, 'Error!', { timeOut: 2000 });
    });
  }

  onFormSubmit() {
    this.submitted = true;
    if (this.RegistrerForm.invalid) {
      return;
    }

    this.blockUI.start('Saving...');

    const obj = {
      email: this.RegistrerForm.value.email.trim(),
      password: "123456",
      first_name: this.RegistrerForm.value.firstName.trim(),
      last_name: this.RegistrerForm.value.lastName.trim(),
      mobile: this.RegistrerForm.value.mobile.trim(),
      is_customer: 1,
      is_wholesaler: 1 ,
      is_retailer: 0,
      is_staff: 0,
      is_superuser:0
    };

    this.authService.registerSystemAdmin('auth/users/', obj).subscribe(
      data => {
        this.blockUI.stop();
        if (data) {
          this.toastr.success(data.Msg, 'Success!', { timeOut: 2000 });
          this.modalHide();
          this.getWholesalerList();
        }
        // else if (data.IsReport == "Warning") {
        //   this.toastr.warning(data.Msg, 'Warning!', { closeButton: true, disableTimeOut: true });
        else {
          this.toastr.error(data.Msg, 'Error!',  { closeButton: true, disableTimeOut: true });
        }
      },
      err => {
        this.blockUI.stop();
        this.toastr.error(err.Message || err, 'Error!', { timeOut: 2000 });
      }
    );

  }

  onFormSubmitRetailer() {
    this.submitted = true;
    if (this.RegistrerFormRetailer.invalid) {
      return;
    }

    this.blockUI.start('Saving...');

    const obj = {
      email: this.RegistrerFormRetailer.value.email.trim(),
      password: "123456",
      first_name: this.RegistrerFormRetailer.value.firstName.trim(),
      last_name: this.RegistrerFormRetailer.value.lastName.trim(),
      mobile: this.RegistrerFormRetailer.value.mobile.trim(),
      is_customer: 1,
      is_retailer: 1 ,
      is_wholesaler: 0,
      is_staff: 0,
      is_superuser:0
    }; 

    this.authService.registerSystemAdmin('auth/users/', obj).subscribe(
      data => {
        this.blockUI.stop();
        if (data) {
          this.toastr.success(data.Msg, 'Success!', { timeOut: 2000 });
          this.modalHideRetailer();
          this.getRetailerList();
        }
        // else if (data.IsReport == "Warning") {
        //   this.toastr.warning(data.Msg, 'Warning!', { closeButton: true, disableTimeOut: true });
        else {
          this.toastr.error(data.Msg, 'Error!',  { closeButton: true, disableTimeOut: true });
        }
      },
      err => {
        this.blockUI.stop();
        this.toastr.error(err.Message || err, 'Error!', { timeOut: 2000 });
      }
    );

  }

  updateFilter(event) {
    const val = event.target.value.toLowerCase();

    // filter our data
    const temp = this.tempRows.filter(function (d) {
      return d.first_name.toLowerCase().indexOf(val) !== -1 ||
             d.last_name.toLowerCase().indexOf(val) !== -1 ||
             d.mobile.indexOf(val) !== -1 ||
        !val;
    });

    // update the rows
    this.customerList = temp;
    // Whenever the filter changes, always go back to the first page
    this.table.offset = 0;
  }

  updateFilterWholesaler(event) {
    const val = event.target.value.toLowerCase();

    // filter our data
    const temp = this.tempRows.filter(function (d) {
      return d.first_name.toLowerCase().indexOf(val) !== -1 ||
             d.last_name.toLowerCase().indexOf(val) !== -1 ||
             d.mobile.indexOf(val) !== -1 ||
        !val;
    });

    // update the rows
    this.wholesalerList = temp;
    // Whenever the filter changes, always go back to the first page
    this.tableWholesaler.offset = 0;
  }
  updateFilterRetailer(event) {
    const val = event.target.value.toLowerCase();

    // filter our data
    const temp = this.tempRows.filter(function (d) {
      return d.first_name.toLowerCase().indexOf(val) !== -1 ||
             d.last_name.toLowerCase().indexOf(val) !== -1 ||
             d.mobile.indexOf(val) !== -1 ||
        !val;
    });

    // update the rows
    this.retailerList = temp;
    // Whenever the filter changes, always go back to the first page
    this.tableRetailer.offset = 0;
  }

  modalHide() {
    this.RegistrerForm.reset();
    this.modalRef.hide();
    this.submitted = false;
    this.modalTitle = 'Add Wholesaler';
    this.btnSaveText = 'Save';
  }

  openModal(template: TemplateRef<any>) {
    this.modalTitle = 'Add Wholesaler';
    this.modalRef = this.modalService.show(template, this.modalConfig);
  }

  modalHideRetailer() {
    this.RegistrerFormRetailer.reset();
    this.modalRefRetailer.hide();
    this.submitted = false;
    this.modalTitle = 'Add Retailer';
    this.btnSaveText = 'Save';
  }

  openModalRetailer(template: TemplateRef<any>) {
    this.modalTitle = 'Add Retailer';
    this.modalRefRetailer = this.modalService.show(template, this.modalConfig);
  }
}
