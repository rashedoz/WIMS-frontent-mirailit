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
import { MustMatch } from './../_helpers/must-match.validator';
import { SubscriptionStatus,SubsItemsStaus } from '../_models/enums';
import { NgxSmartModalService } from 'ngx-smart-modal';

@Component({
  selector: 'app-customer',
  templateUrl: './customer.component.html',
  styleUrls:['./customer.component.css'],
  encapsulation: ViewEncapsulation.None
})

export class CustomerComponent implements OnInit {

  RegistrerForm: FormGroup;
  RegistrerFormChangePassword: FormGroup;
  submitted = false;
  @BlockUI() blockUI: NgBlockUI;
  isEdit = false;
  customerTypeList = [{id:1,name:"Wholesaler"},{id:2,name:"Retailer"}]
  type;
  modalTitle = 'Add Customer';
  btnSaveText = 'Save';
  SubscriptionStatus = SubscriptionStatus;
  SubsItemsStaus = SubsItemsStaus;
  modalConfig: any = { class: 'gray modal-xl', backdrop: 'static' };
  modalConfigmd: any = { class: 'gray modal-md', backdrop: 'static' };
  modalRef: BsModalRef;
  user;
  // modalConfig: any = { class: 'gray modal-md', backdrop: 'static' };
  // modalRef: BsModalRef;
  // modalRefRetailer: BsModalRef;

  @ViewChild(TemplateRef, { static: false }) tpl: TemplateRef<any>;
  @ViewChild(DatatableComponent, { static: false }) table: DatatableComponent;
  @ViewChild(DatatableComponent, { static: false }) tableWholesaler: DatatableComponent;
  @ViewChild(DatatableComponent, { static: false }) tableRetailer: DatatableComponent;
  @ViewChild(DatatableComponent, { static: false }) tableCustomerDue: DatatableComponent;
  // @ViewChild(DatatableComponent, { static: false }) tableHistory: DatatableComponent;
  @ViewChild('dataTable', { static: false }) tableHistory: any;

  page = new Page();
  isbuttonActive = true;
  activeTable = 0;
  tempRows = [];
  customerList = [];
  dueCustomerList = [];
  wholesalerList = [];
  retailerList = [];
  historyList = [];
  loadingIndicator = false;
  ColumnMode = ColumnMode;

  scrollBarHorizontal = (window.innerWidth < 1200);
  details;

  searchParamAll = '';
  searchParamWholesaler = '';
  searchParamRetailer = '';
  searchParamDue = '';

  constructor(
    private modalService: BsModalService,
    public formBuilder: FormBuilder,
    private _service: CommonService,
    private toastr: ToastrService,
    public ngxSmartModalService: NgxSmartModalService,
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

    this.RegistrerForm = this.formBuilder.group({
      id:[null,],
      customer_code: [{value: null, disabled: true}],
      nid: [null],
      fax: [null],
      telephone: [null],
      acc_number: [null],
      email: [null, [Validators.required, Validators.email, Validators.maxLength(50)]],
      mobile: [null, [Validators.required]],
      alternative_mobile: [null],
      address_one: [null],
      address_two: [null],
      preferred_payment_method: [null],
      firstName: [null, [Validators.required]],
      lastName: [null, [Validators.required]]
      // password: ['', [Validators.required, Validators.minLength(6)]],
      // confirmPassword: ['', Validators.required]
    });


    // this.RegistrerForm = this.formBuilder.group({
    //   email: [null, [Validators.required, Validators.email, Validators.maxLength(50)]],
    //   mobile: [null, [Validators.required]],
    //   firstName: [null, [Validators.required]],
    //   lastName: [null, [Validators.required]],
    //   // customerType: [null, [Validators.required]]
    // });
    // this.RegistrerFormRetailer = this.formBuilder.group({
    //   email: [null, [Validators.required, Validators.email, Validators.maxLength(50)]],
    //   mobile: [null, [Validators.required]],
    //   firstName: [null, [Validators.required]],
    //   lastName: [null, [Validators.required]],
    //   // customerType: [null, [Validators.required]]
    // });
    this.RegistrerFormChangePassword = this.formBuilder.group({
      id:[null],
      // old_password: ['', [Validators.required, Validators.minLength(6)]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required]
    }, {
      validator: MustMatch('password', 'confirmPassword')
  });

    this.getList();
  }


get f() {
  return this.RegistrerForm.controls;
}
get p() {
  return this.RegistrerFormChangePassword.controls;
}

onTabSelect(tab,e){
  this.activeTable = tab;
  this.showCustomerTable(tab);
}

setPageAll(pageInfo) {
  this.page.pageNumber = pageInfo.offset;
  this.getList();
}
setPageWholesaler(pageInfo) {
  this.page.pageNumber = pageInfo.offset;
  this.getWholesalerList();
}
setPageRetailer(pageInfo) {
  this.page.pageNumber = pageInfo.offset;
  this.getRetailerList();
}
setPageDue(pageInfo) {
  this.page.pageNumber = pageInfo.offset;
  this.getCustomerDueList();
}

  showDetails(row, template: TemplateRef<any>) {
    this.blockUI.start('Getting data...');
    this._service.get('get-user-detail/' + row.id).subscribe(res => {
      this.blockUI.stop();
      if (!res) {
        this.toastr.error(res.Msg, 'Error!', { timeOut: 2000 });
        return;
      }
      this.modalTitle = 'Profile Details';
      this.details = res;
      console.log(this.details);
      this.modalRef = this.modalService.show(template, this.modalConfig);
    }, err => {
      this.blockUI.stop();
      this.toastr.error(err.Msg || err, 'Error!', { timeOut: 2000 });
    });
  }

  showCustomerTable(id){
    this.isbuttonActive = false;
    switch (id) {
      case 0:
        this.searchParamAll = '';
        this.page.pageNumber = 0;
        this.page.size = 10;
        this.getList();
        break;
      case 1:
        this.searchParamWholesaler = '';
        this.page.pageNumber = 0;
        this.page.size = 10;
        this.getWholesalerList();
        break;
      case 2:

        this.searchParamRetailer = '';
        this.page.pageNumber = 0;
        this.page.size = 10;
        this.getRetailerList();
        break;
      // case 3:
      //   this.searchParamDue = '';
      //   this.page.pageNumber = 0;
      //   this.page.size = 10;
      //   this.getCustomerDueList();
      //   break;

    }
  }

  getList() {
    this.loadingIndicator = true;
    const obj = {
      limit: this.page.size,
      page: this.page.pageNumber + 1,
      search_param:this.searchParamAll
    };
    this._service.get('get-customer-list',obj).subscribe(res => {
      if (!res) {
        this.toastr.error(res.Message, 'Error!', { timeOut: 2000 });
        return;
      }
      this.activeTable = 0;
   //   this.tempRows = res;
      this.customerList = res.results;
      this.page.totalElements = res.count;
      this.page.totalPages = Math.ceil(this.page.totalElements / this.page.size);
      setTimeout(() => {
        this.loadingIndicator = false;
      }, 1000);
    }, err => {
      this.toastr.error(err.Msg || err, 'Error!', { timeOut: 2000 });
      setTimeout(() => {
        this.loadingIndicator = false;
      }, 1000);
    }
    );
  }


  getCustomerDueList() {
    this.loadingIndicator = true;
    const obj = {
      limit: this.page.size,
      page: this.page.pageNumber + 1,
      search_param:this.searchParamDue
    };
    this._service.get('get-customer-list-with-due',obj).subscribe(res => {
      if (!res) {
        this.toastr.error(res.Message, 'Error!', { timeOut: 2000 });
        return;
      }
      this.activeTable = 3;
    //  this.tempRows = res;
      this.dueCustomerList = res.results;
      this.page.totalElements = res.count;
      this.page.totalPages = Math.ceil(this.page.totalElements / this.page.size);
      setTimeout(() => {
        this.loadingIndicator = false;
      }, 1000);
    }, err => {
      this.toastr.error(err.Msg || err, 'Error!', { timeOut: 2000 });
      setTimeout(() => {
        this.loadingIndicator = false;
      }, 1000);
    }
    );
  }

  showHistory(row) {
    this.loadingIndicator = true;
    this._service.get('subscription/get-subscription-list-by-customer-id/'+row.id).subscribe(res => {
      if (!res) {
        this.toastr.error(res.Message, 'Error!', { timeOut: 2000 });
        return;
      }

      this.historyList = res;
      this.ngxSmartModalService.create('historyModal', this.tpl).open();

      // this.page.totalElements = res.Total;
      // this.page.totalPages = Math.ceil(this.page.totalElements / this.page.size);
      setTimeout(() => {
        this.loadingIndicator = false;
      }, 1000);
    }, err => {
      this.toastr.error(err.Msg || err, 'Error!', { timeOut: 2000 });
      setTimeout(() => {
        this.loadingIndicator = false;
      }, 1000);
    }
    );
  }

  // undoSubscription(row){
  //   const obj = {
  //     customer:row.customer_id,
  //     subscription:row.id
  //    };
  //    this.confirmService.confirm('Are you sure?', 'You are undo the subscription for held state.')
  //    .subscribe(
  //        result => {
  //            if (result) {
  //              const request = this._service.post('subscription/undo-future-held-subscription', obj);
  //              request.subscribe(
  //                data => {

  //                  if (data.IsReport == "Success") {
  //                    this.toastr.success(data.Msg, 'Success!', { timeOut: 2000 });
  //                    this.getList();
  //                  } else if (data.IsReport == "Warning") {
  //                    this.toastr.warning(data.Msg, 'Warning!', { closeButton: true, disableTimeOut: true });
  //                  } else {
  //                    this.toastr.error(data.Msg, 'Error!',  { closeButton: true, disableTimeOut: true });
  //                  }
  //                },
  //                err => {

  //                  this.toastr.error(err.Msg || err, 'Error!', { closeButton: true, disableTimeOut: true });
  //                }
  //              );
  //            }
  //        },

  //    );
  // }

  toggleExpandRow(row) {

  // console.log(row);
    this._service.get('subscription/get-subscription-detail/'+row.id).subscribe(res => {
      row.details = res;
    }, err => { });

  this.tableHistory.rowDetail.toggleExpandRow(row);

  }


  getItem(row, template: TemplateRef<any>) {
    this.isEdit = true;
    // this.RegistrerForm.controls["password"].setValidators(null);
    // this.RegistrerForm.controls["password"].updateValueAndValidity();
    // this.RegistrerForm.controls["confirmPassword"].setValidators(null);
    // this.RegistrerForm.controls["confirmPassword"].updateValueAndValidity();
    this.modalTitle = 'Update Customer';
    this.btnSaveText = 'Update';
    this.RegistrerForm.controls['id'].setValue(row.id);
    this.RegistrerForm.controls['customer_code'].setValue(row.customer_code);
    this.RegistrerForm.controls['nid'].setValue(row.nid);
    this.RegistrerForm.controls['fax'].setValue(row.fax);
    this.RegistrerForm.controls['telephone'].setValue(row.telephone);
    this.RegistrerForm.controls['acc_number'].setValue(row.acc_number);
    this.RegistrerForm.controls['email'].setValue(row.email);
    this.RegistrerForm.controls['email'].disable();
    this.RegistrerForm.controls['mobile'].setValue(row.mobile);
    this.RegistrerForm.controls['alternative_mobile'].setValue(row.alternative_mobile);
    this.RegistrerForm.controls['address_one'].setValue(row.address_one);
    this.RegistrerForm.controls['address_two'].setValue(row.address_two);
    this.RegistrerForm.controls['firstName'].setValue(row.first_name);
    this.RegistrerForm.controls['lastName'].setValue(row.last_name);
    this.RegistrerForm.controls['preferred_payment_method'].setValue(row.preferred_payment_method);
    // this.RegistrerForm.controls['confirmPassword'].setValue(null);
    // this.RegistrerForm.controls['password'].setValue(null);
    this.modalRef = this.modalService.show(template, this.modalConfig);

}
changePassword(row, template: TemplateRef<any>) {

  this.modalTitle = 'Change Password';
  this.btnSaveText = 'Change';
  this.user = row;
  this.RegistrerFormChangePassword.controls['id'].setValue(row.id);
  this.modalRef = this.modalService.show(template, this.modalConfigmd);

}


  getWholesalerList() {
    this.loadingIndicator = true;
    const obj = {
      limit: this.page.size,
      page: this.page.pageNumber + 1,
      search_param:this.searchParamWholesaler
    };
    this._service.get('get-wholesaler-list',obj).subscribe(res => {
      if (!res) {
        this.toastr.error(res.Message, 'Error!', { timeOut: 2000 });
        return;
      }
      this.activeTable = 1;
    //  this.tempRows = res;
      this.wholesalerList = res.results;
      this.page.totalElements = res.count;
      this.page.totalPages = Math.ceil(this.page.totalElements / this.page.size);
      setTimeout(() => {
        this.loadingIndicator = false;
      }, 1000);
    }, err => {
      this.toastr.error(err.Msg || err, 'Error!', { timeOut: 2000 });
      setTimeout(() => {
        this.loadingIndicator = false;
      }, 1000);
    }
    );
  }

  getRetailerList() {
    this.loadingIndicator = true;
    const obj = {
      limit: this.page.size,
      page: this.page.pageNumber + 1,
      search_param:this.searchParamRetailer
    };
    this._service.get('get-retailer-list',obj).subscribe(res => {
      if (!res) {
        this.toastr.error(res.Message, 'Error!', { timeOut: 2000 });
        return;
      }
      this.activeTable = 2;
    //  this.tempRows = res;
      this.retailerList = res.results;
      this.page.totalElements = res.count;
      this.page.totalPages = Math.ceil(this.page.totalElements / this.page.size);
      setTimeout(() => {
        this.loadingIndicator = false;
      }, 1000);
    }, err => {
      this.toastr.error(err.Msg || err, 'Error!', { timeOut: 2000 });
      setTimeout(() => {
        this.loadingIndicator = false;
      }, 1000);
    }
    );
  }




  onFormSubmit() {
    this.submitted = true;
    if (this.RegistrerForm.invalid) {
      return;
    }
    let id = this.RegistrerForm.value.id;

    if(id){
      this.blockUI.start('Updating...');

      const obj = {
        // email: this.RegistrerForm.value.email.trim(),
        first_name: this.RegistrerForm.value.firstName.trim(),
        last_name: this.RegistrerForm.value.lastName.trim(),
        mobile: this.RegistrerForm.value.mobile.trim(),
        alternative_mobile:this.RegistrerForm.value.alternative_mobile,
        occupation:this.RegistrerForm.value.occupation,
        nid:this.RegistrerForm.value.nid,
        address_one:this.RegistrerForm.value.address_one,
        address_two:this.RegistrerForm.value.address_two,
        fax:this.RegistrerForm.value.fax,
        acc_number:this.RegistrerForm.value.acc_number,
        telephone:this.RegistrerForm.value.telephone,
        preferred_payment_method:this.RegistrerForm.value.preferred_payment_method,
      };

      this._service.put('update-user-profile/'+id, obj).subscribe(
        data => {
          this.blockUI.stop();
          if (data.IsReport == "Success") {
            this.toastr.success(data.Msg, 'Success!', { timeOut: 4000 });
            this.modalHide();
            this.getList();
          }

          else {
            this.toastr.error(data.Msg, 'Error!',  { closeButton: true, disableTimeOut: true });
          }
        },
        err => {
          this.blockUI.stop();
          this.toastr.error(err.Msg || err, 'Error!', { timeOut: 2000 });
        }
      );

    }else{
      this.blockUI.start('Saving...');

      const obj = {
        password: 123456,
        email: this.RegistrerForm.value.email.trim(),
        first_name: this.RegistrerForm.value.firstName.trim(),
        last_name: this.RegistrerForm.value.lastName.trim(),
        mobile: this.RegistrerForm.value.mobile.trim(),
        alternative_mobile:this.RegistrerForm.value.alternative_mobile,
        occupation:this.RegistrerForm.value.occupation,
        nid:this.RegistrerForm.value.nid,
        address_one:this.RegistrerForm.value.address_one,
        address_two:this.RegistrerForm.value.address_two,
        fax:this.RegistrerForm.value.fax,
        acc_number:this.RegistrerForm.value.acc_number,
        preferred_payment_method:this.RegistrerForm.value.preferred_payment_method,
        telephone:this.RegistrerForm.value.telephone,
        is_customer: 1,
        is_wholesaler: this.type == 'Wholesaler' ? 1 : 0 ,
        is_retailer: this.type != 'Wholesaler' ? 1 : 0,
        is_staff: 0,
        is_superuser:0
      };

      this._service.post('register-user', obj).subscribe(
        data => {
          this.blockUI.stop();
          if (data.IsReport == "Success") {
            this.toastr.success(data.Msg, 'Success!', { timeOut: 2000 });
            this.modalHide();
            this.getList();
          }
          else if (data.IsReport == "Warning") {
            this.toastr.warning(data.Msg, 'Warning!', { closeButton: true, disableTimeOut: true });
          }else {
            this.toastr.error(data.Msg, 'Error!',  { closeButton: true, disableTimeOut: true });
          }
        },
        err => {
          this.blockUI.stop();
          this.toastr.error(err.Msg || err, 'Error!', { timeOut: 2000 });
        }
      );
    }



  }



  onFormSubmitChangePassword() {
    this.submitted = true;
    if (this.RegistrerFormChangePassword.invalid) {
      return;
    }

      this.blockUI.start('Changing...');

      const obj = {
        user_id: this.RegistrerFormChangePassword.value.id,
        // old_password: this.RegistrerFormChangePassword.value.old_password.trim(),
        new_password: this.RegistrerFormChangePassword.value.password.trim()
      };

      this._service.post('update-user-password-without-old-password', obj).subscribe(
        data => {
          this.blockUI.stop();
          if (data.IsReport == "Success") {
            this.toastr.success(data.Msg, 'Success!', { timeOut: 2000 });
            this.modalHideChangePassword();
            this.getList();
          }
          else if (data.IsReport == "Warning") {
            this.toastr.warning(data.Msg, 'Warning!', { closeButton: true, disableTimeOut: true });
          }else {
            this.toastr.error(data.Msg, 'Error!',  { closeButton: true, disableTimeOut: true });
          }
        },
        err => {
          this.blockUI.stop();
          this.toastr.error(err.Msg || err, 'Error!', { timeOut: 2000 });
        }
      );




  }







  updateFilter(e) {
    if(e){
      this.page.pageNumber = 0;
      this.page.size = 10;
      this.searchParamAll = e.target.value;
      this.getList();
    }
  //   const val = event.target.value.toLowerCase();

  //   // filter our data
  //   const temp = this.tempRows.filter(function (d) {
  //     if(d.mobile){
  //       return d.first_name.toLowerCase().indexOf(val) !== -1 ||
  //       d.last_name.toLowerCase().indexOf(val) !== -1 ||
  //       d.email.toLowerCase().indexOf(val) !== -1 ||
  //       d.customer_code.toLowerCase().indexOf(val) !== -1 ||
  //       d.mobile.indexOf(val) !== -1 ||
  //  !val;
  //     }else{
  //       return d.first_name.toLowerCase().indexOf(val) !== -1 ||
  //       d.last_name.toLowerCase().indexOf(val) !== -1 ||
  //       d.email.toLowerCase().indexOf(val) !== -1 ||
  //       d.customer_code.toLowerCase().indexOf(val) !== -1 ||
  //  !val;
  //     }

  //   });

  //   // update the rows
  //   this.customerList = temp;
  //   // Whenever the filter changes, always go back to the first page
  //   this.table.offset = 0;
  }

  updateFilterWholesaler(e) {

    if(e){
      this.page.pageNumber = 0;
      this.page.size = 10;
      this.searchParamWholesaler = e.target.value;
      this.getWholesalerList();
    }

  //   const val = event.target.value.toLowerCase();

  //   // filter our data
  //   const temp = this.tempRows.filter(function (d) {
  //     if(d.mobile){
  //       return d.first_name.toLowerCase().indexOf(val) !== -1 ||
  //       d.last_name.toLowerCase().indexOf(val) !== -1 ||
  //       d.email.toLowerCase().indexOf(val) !== -1 ||
  //       d.customer_code.toLowerCase().indexOf(val) !== -1 ||
  //       d.mobile.indexOf(val) !== -1 ||
  //  !val;
  //     }else{
  //       return d.first_name.toLowerCase().indexOf(val) !== -1 ||
  //       d.last_name.toLowerCase().indexOf(val) !== -1 ||
  //       d.email.toLowerCase().indexOf(val) !== -1 ||
  //       d.customer_code.toLowerCase().indexOf(val) !== -1 ||
  //  !val;
  //     }
  //   });

  //   // update the rows
  //   this.wholesalerList = temp;
  //   // Whenever the filter changes, always go back to the first page
  //   this.tableWholesaler.offset = 0;
  }
  updateFilterRetailer(e) {
    if(e){
      this.page.pageNumber = 0;
      this.page.size = 10;
      this.searchParamRetailer = e.target.value;
      this.getRetailerList();
    }

  //   const val = event.target.value.toLowerCase();

  //   // filter our data
  //   const temp = this.tempRows.filter(function (d) {
  //     if(d.mobile){
  //       return d.first_name.toLowerCase().indexOf(val) !== -1 ||
  //       d.last_name.toLowerCase().indexOf(val) !== -1 ||
  //       d.email.toLowerCase().indexOf(val) !== -1 ||
  //       d.customer_code.toLowerCase().indexOf(val) !== -1 ||
  //       d.mobile.indexOf(val) !== -1 ||
  //  !val;
  //     }else{
  //       return d.first_name.toLowerCase().indexOf(val) !== -1 ||
  //       d.last_name.toLowerCase().indexOf(val) !== -1 ||
  //       d.email.toLowerCase().indexOf(val) !== -1 ||
  //       d.customer_code.toLowerCase().indexOf(val) !== -1 ||
  //  !val;
  //     }
  //   });

  //   // update the rows
  //   this.retailerList = temp;
  //   // Whenever the filter changes, always go back to the first page
  //   this.tableRetailer.offset = 0;
  }

  updateFilterDue(e) {
    if(e){
      this.page.pageNumber = 0;
      this.page.size = 10;
      this.searchParamDue = e.target.value;
      this.getCustomerDueList();
    }
  }

  modalHide() {
    this.RegistrerForm.reset();
    this.modalRef.hide();
    this.submitted = false;
    this.isEdit = false;
    this.modalTitle = 'Add Customer';
    this.btnSaveText = 'Save';

    // this.RegistrerForm.controls["password"].setValidators(Validators.required);
    // this.RegistrerForm.controls["password"].updateValueAndValidity();
    // this.RegistrerForm.controls["confirmPassword"].setValidators(Validators.required);
    // this.RegistrerForm.controls["confirmPassword"].updateValueAndValidity();
    this.RegistrerForm.controls['email'].enable();
  }

  openModal(template: TemplateRef<any>,type) {
    this.type = type;
    this.modalTitle = 'Add ' +type;
    this.modalRef = this.modalService.show(template, this.modalConfig);
  }

  modalHideChangePassword() {
    this.RegistrerFormChangePassword.reset();
    this.modalRef.hide();
    this.user = null;
    this.submitted = false;
    this.btnSaveText = 'Save';
  }

  modalHideHistory() {
    // this.ngxSmartModalService.closeAll();
    this.ngxSmartModalService.getModal('historyModal').close();
  }


}
