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
import { BsDatepickerConfig } from 'ngx-bootstrap/datepicker';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-member-list',
  templateUrl: './member-list.component.html',
  encapsulation: ViewEncapsulation.None
})

export class MemberListComponent implements OnInit {

  RegistrerForm: FormGroup;
  RegistrerFormChangePassword: FormGroup;
  submitted = false;
  @BlockUI() blockUI: NgBlockUI;
  isEdit = false;
  modalTitle = 'Add Member';
  btnSaveText = 'Save';

  modalConfig: any = { class: 'gray modal-xl', backdrop: 'static' };
  modalConfigmd: any = { class: 'gray modal-md', backdrop: 'static' };
  modalRef: BsModalRef;

  page = new Page();
  rows = [];
  tempRows = [];
  memberList = [];
  loadingIndicator = false;
  bsConfig: Partial<BsDatepickerConfig>;
  ColumnMode = ColumnMode;
  @ViewChild(DatatableComponent, { static: false }) table: DatatableComponent;
  scrollBarHorizontal = (window.innerWidth < 1200);
  details;
  user;
  searchParam = '';
  public currentUser: any = null;

  constructor(
    private modalService: BsModalService,
    public formBuilder: FormBuilder,
    private _service: CommonService,
    private toastr: ToastrService,
    private authService: AuthenticationService,
    private router: Router,
    private datePipe: DatePipe
  ) {
    this.bsConfig = Object.assign({}, {
      dateInputFormat: 'DD-MMM-YYYY',
      adaptivePosition: true
    });
    this.page.pageNumber = 0;
    this.page.size = 10;
    window.onresize = () => {
      this.scrollBarHorizontal = (window.innerWidth < 1200);
    };

    this.currentUser = this.authService.currentUserDetails.value;
  }


  ngOnInit() {
    this.RegistrerForm = this.formBuilder.group({
      id:[null,],
      member_code: [{value: null, disabled: true}],
      nid: [null],
      occupation: [null],
      fax: [null],
      telephone: [null],
      acc_number: [null],
      email: [null, [Validators.required, Validators.email, Validators.maxLength(50)]],
      mobile: [null, [Validators.required]],
      alternative_mobile: [null],
      address_one: [null],
      address_two: [null],
      dob: [null],
      gender: [2],
      is_superuser: [false],
      is_staff: [true],
      is_active: [true],
      firstName: [null, [Validators.required]],
      lastName: [null, [Validators.required]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required]
    }, {
      validator: MustMatch('password', 'confirmPassword')
  });


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

setPage(pageInfo) {
  this.page.pageNumber = pageInfo.offset;
  this.getList();
}

getList() {
  this.loadingIndicator = true;
  const obj = {
    limit: this.page.size,
    page: this.page.pageNumber + 1,
    search_param:this.searchParam
  };
  this._service.get('get-member-list',obj).subscribe(res => {
    if (!res) {
      this.toastr.error(res.Message, 'Error!', { timeOut: 2000 });
      return;
    }

    this.memberList =res.results;
    this.page.totalElements = res.count;
    this.page.totalPages = Math.ceil(this.page.totalElements / this.page.size);
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

getItem(row, template: TemplateRef<any>) {
    this.isEdit = true;
    this.RegistrerForm.controls["password"].setValidators(null);
    this.RegistrerForm.controls["password"].updateValueAndValidity();
    this.RegistrerForm.controls["confirmPassword"].setValidators(null);
    this.RegistrerForm.controls["confirmPassword"].updateValueAndValidity();

    this.modalTitle = 'Update Member';
    this.btnSaveText = 'Update';
    this.RegistrerForm.controls['id'].setValue(row.id);
    this.RegistrerForm.controls['member_code'].setValue(row.member_code);
    this.RegistrerForm.controls['nid'].setValue(row.nid);
    this.RegistrerForm.controls['fax'].setValue(row.fax);
    this.RegistrerForm.controls['telephone'].setValue(row.telephone);
    this.RegistrerForm.controls['acc_number'].setValue(row.acc_number);
    this.RegistrerForm.controls['email'].setValue(row.email);
    this.RegistrerForm.controls['email'].disable();
    this.RegistrerForm.controls['mobile'].setValue(row.mobile);
    this.RegistrerForm.controls['alternative_mobile'].setValue(row.alternative_mobile);
    this.RegistrerForm.controls['dob'].setValue(row.dob ? new Date(row.dob) : null);
    this.RegistrerForm.controls['gender'].setValue(row.gender);
    this.RegistrerForm.controls['address_one'].setValue(row.address_one);
    this.RegistrerForm.controls['address_two'].setValue(row.address_two);
    this.RegistrerForm.controls['occupation'].setValue(row.occupation);
    this.RegistrerForm.controls['firstName'].setValue(row.first_name);
    this.RegistrerForm.controls['lastName'].setValue(row.last_name);
    this.RegistrerForm.controls['is_superuser'].setValue(row.is_superuser);
    this.RegistrerForm.controls['is_staff'].setValue(row.is_staff);
    this.RegistrerForm.controls['is_active'].setValue(row.is_active);
    this.RegistrerForm.controls['confirmPassword'].setValue(null);
    this.RegistrerForm.controls['password'].setValue(null);


    if(this.currentUser.is_superuser){
      this.RegistrerForm.controls['is_superuser'].enable();
      this.RegistrerForm.controls['is_staff'].enable();

      if(this.currentUser.id == row.id){
        this.RegistrerForm.controls['is_active'].disable();
      }else{
        this.RegistrerForm.controls['is_active'].enable();
      }

    }else{
      this.RegistrerForm.controls['is_superuser'].disable();
      this.RegistrerForm.controls['is_staff'].disable();
      this.RegistrerForm.controls['is_active'].disable();
    }




    this.modalRef = this.modalService.show(template, this.modalConfig);

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

changePassword(row, template: TemplateRef<any>) {

    this.modalTitle = 'Change Password';
    this.btnSaveText = 'Change';
    this.user = row;
    this.RegistrerFormChangePassword.controls['id'].setValue(row.id);
    this.modalRef = this.modalService.show(template, this.modalConfigmd);

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
      dob: this.RegistrerForm.value.dob ? this.datePipe.transform(this.RegistrerForm.value.dob, "yyyy-MM-dd") : null,
      gender:this.RegistrerForm.value.gender,
      fax:this.RegistrerForm.value.fax,
      acc_number:this.RegistrerForm.value.acc_number,
      is_superuser:this.RegistrerForm.value.is_superuser,
      is_staff:this.RegistrerForm.value.is_staff,
      is_active:this.RegistrerForm.value.is_active,
      telephone:this.RegistrerForm.value.telephone,
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
      password: this.RegistrerForm.value.password.trim(),
      email: this.RegistrerForm.value.email.trim(),
      first_name: this.RegistrerForm.value.firstName.trim(),
      last_name: this.RegistrerForm.value.lastName.trim(),
      mobile: this.RegistrerForm.value.mobile.trim(),
      alternative_mobile:this.RegistrerForm.value.alternative_mobile,
      occupation:this.RegistrerForm.value.occupation,
      nid:this.RegistrerForm.value.nid,
      address_one:this.RegistrerForm.value.address_one,
      address_two:this.RegistrerForm.value.address_two,
      dob: this.RegistrerForm.value.dob ? this.datePipe.transform(this.RegistrerForm.value.dob, "yyyy-MM-dd") : null,
      gender:this.RegistrerForm.value.gender,
      fax:this.RegistrerForm.value.fax,
      acc_number:this.RegistrerForm.value.acc_number,
      telephone:this.RegistrerForm.value.telephone,
      is_customer: 0,
      is_wholesaler: 0 ,
      is_retailer: 0,
      is_staff: this.RegistrerForm.value.is_staff,
      is_superuser:this.RegistrerForm.value.is_superuser,
      is_active:this.RegistrerForm.value.is_active
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
         } else {
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

modalHide() {
  this.RegistrerForm.reset();
  this.modalRef.hide();
  this.submitted = false;
  this.isEdit = false;
  this.modalTitle = 'Add Member';
  this.btnSaveText = 'Save';

  this.RegistrerForm.controls["password"].setValidators(Validators.required);
  this.RegistrerForm.controls["password"].updateValueAndValidity();
  this.RegistrerForm.controls["confirmPassword"].setValidators(Validators.required);
  this.RegistrerForm.controls["confirmPassword"].updateValueAndValidity();
  this.RegistrerForm.controls['email'].enable();
}

openModal(template: TemplateRef<any>) {

  this.RegistrerForm.controls['gender'].setValue(2);

  if(this.currentUser.is_superuser){
    this.RegistrerForm.controls['is_superuser'].enable();
    this.RegistrerForm.controls['is_staff'].enable();
    this.RegistrerForm.controls['is_active'].enable();
  }else{
    this.RegistrerForm.controls['is_superuser'].disable();
    this.RegistrerForm.controls['is_staff'].disable();
    this.RegistrerForm.controls['is_active'].disable();
  }

  this.modalRef = this.modalService.show(template, this.modalConfig);
}

modalHideChangePassword() {
  this.RegistrerFormChangePassword.reset();
  this.modalRef.hide();
  this.submitted = false;
  this.modalTitle = 'Add Member';
  this.user = null;
  this.btnSaveText = 'Save';
}

filterSearch(e){
  if(e){
    this.page.pageNumber = 0;
    this.page.size = 10;
    this.searchParam = e.target.value;
    this.getList();
  }
}

updateFilter(event) {
  const val = event.target.value.toLowerCase();

  // filter our data
  const temp = this.tempRows.filter(function (d) {
    return d.first_name.toLowerCase().indexOf(val) !== -1 ||
           d.last_name.toLowerCase().indexOf(val) !== -1 ||
           d.email.toLowerCase().indexOf(val) !== -1  ||
           d.member_code.toLowerCase().indexOf(val) !== -1  ||
           d.mobile.indexOf(val) !== -1  ||
          !val;
  });

  // update the rows
  this.memberList = temp;
  // Whenever the filter changes, always go back to the first page
  this.table.offset = 0;
}

fixDate(d: Date): Date {
  d.setHours(d.getHours() - d.getTimezoneOffset() / 60);
  return d;
}

}
