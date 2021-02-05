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

  // modalConfig: any = { class: 'gray modal-md', backdrop: 'static' };
  // modalRef: BsModalRef;
  // modalRefRetailer: BsModalRef;


  @ViewChild(DatatableComponent, { static: false }) table: DatatableComponent;
  @ViewChild(DatatableComponent, { static: false }) tableWholesaler: DatatableComponent;
  @ViewChild(DatatableComponent, { static: false }) tableRetailer: DatatableComponent;
  @ViewChild(DatatableComponent, { static: false }) tableHistory: DatatableComponent;


  page = new Page();
  isbuttonActive = true;
  activeTable = 0;
  tempRows = [];
  customerList = [];
  wholesalerList = [];
  retailerList = [];
  historyList = [];
  loadingIndicator = false;
  ColumnMode = ColumnMode;

  scrollBarHorizontal = (window.innerWidth < 1200);
  details;
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

  setPage(pageInfo) {
   // this.page.pageNumber = pageInfo.offset;
    this.getList();
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
      this.toastr.error(err.Message || err, 'Error!', { timeOut: 2000 });
    });
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


  showHistory(row,template: TemplateRef<any>) {
    this.loadingIndicator = true;
    this._service.get('subscription/get-subscription-list-by-customer-id/'+row.id).subscribe(res => {
      if (!res) {
        this.toastr.error(res.Message, 'Error!', { timeOut: 2000 });
        return;
      }
    
      this.historyList = res;
      this.modalRef = this.modalService.show(template, this.modalConfig);
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

  //                  this.toastr.error(err.Message || err, 'Error!', { closeButton: true, disableTimeOut: true });
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
  this.RegistrerFormChangePassword.controls['id'].setValue(row.id);    
  this.modalRef = this.modalService.show(template, this.modalConfigmd);

}


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
          this.toastr.error(err.Message || err, 'Error!', { timeOut: 2000 });
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
          if (data.IsReport == "Ok") {
            this.toastr.success(data.Msg, 'Success!', { timeOut: 2000 });
            this.modalHide();
            this.getList();
          }
          else if (data.IsReport == "NotOk") {
            this.toastr.warning(data.Msg, 'Warning!', { closeButton: true, disableTimeOut: true });
          }else {
            this.toastr.error(data.Msg, 'Error!',  { closeButton: true, disableTimeOut: true });
          }
        },
        err => {
          this.blockUI.stop();
          this.toastr.error(err.Message || err, 'Error!', { timeOut: 2000 });
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
        password: this.RegistrerFormChangePassword.value.password.trim(),     
      };
    
      this._service.post('update-user-password', obj).subscribe(
        data => {
          this.blockUI.stop();
          if (data.IsReport == "Success") {
            this.toastr.success(data.Msg, 'Success!', { timeOut: 2000 });
            this.modalHideChangePassword();
            this.getList();
          }
          else if (data.IsReport == "Warning") {
            this.toastr.warning(data.Msg, 'Warning!', { closeButton: true, disableTimeOut: true });
            this.modalHideChangePassword();
            this.getList();
          }else {
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
             d.email.toLowerCase().indexOf(val) !== -1 ||
             d.customer_code.toLowerCase().indexOf(val) !== -1 ||
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
             d.email.toLowerCase().indexOf(val) !== -1 ||
             d.customer_code.toLowerCase().indexOf(val) !== -1 ||
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
             d.email.toLowerCase().indexOf(val) !== -1 ||
             d.customer_code.toLowerCase().indexOf(val) !== -1 ||
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
    this.submitted = false;
    this.btnSaveText = 'Save';
  }

  modalHideHistory() {  
    this.modalRef.hide();
  }
  


}
