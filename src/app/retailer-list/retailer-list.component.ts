import { Component, TemplateRef, ViewChild, ElementRef, ViewEncapsulation, OnInit } from '@angular/core';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { ColumnMode } from '@swimlane/ngx-datatable';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonService } from './../_services/common.service';
import { AuthenticationService } from './../_services/authentication.service';
import { ToastrService } from 'ngx-toastr';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { Page } from './../_models/page';


@Component({
  selector: 'app-retailer-list',
  templateUrl: './retailer-list.component.html',
  encapsulation: ViewEncapsulation.None
})

export class RetailerListComponent implements OnInit {

  RegistrerForm: FormGroup;
  submitted = false;
  @BlockUI() blockUI: NgBlockUI;
  customerTypeList = [{id:1,name:"Retailer"},{id:2,name:"Retailer"}]

  modalTitle = 'Add Retailer';
  btnSaveText = 'Save';

  modalConfig: any = { class: 'gray modal-md', backdrop: 'static' };
  modalRef: BsModalRef;

  page = new Page();

  rows = [];
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
    this.RegistrerForm = this.formBuilder.group({
      email: [null, [Validators.required, Validators.email, Validators.maxLength(50)]],
      mobile: [null, [Validators.required]],
      firstName: [null, [Validators.required]],
      lastName: [null, [Validators.required]]
      // customerType: [null, [Validators.required]]
    });
    this.getList();
  }

  get f() {
    return this.RegistrerForm.controls;
  }

  setPage(pageInfo) {
   // this.page.pageNumber = pageInfo.offset;
    this.getList();
  }

  getList() {
    this.loadingIndicator = true;
    this._service.get('user-list?is_customer=true&is_retailer=true').subscribe(res => {
      if (!res) {
        this.toastr.error(res.Message, 'Error!', { timeOut: 2000 });
        return;
      }
      this.rows = res;
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
    this._service.get('Retailer/GetRetailerById/' + id).subscribe(res => {
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
      is_retailer: 1 ,
      is_wholesaler: 0,
      is_staff: 0,
      is_superuser:0
    };

    this.authService.registerSystemAdmin('auth/users/', obj).subscribe(
      data => {
        this.blockUI.stop();
        if (data.IsReport == "Success") {
          this.toastr.success(data.Msg, 'Success!', { timeOut: 2000 });
          this.modalHide();
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

  modalHide() {
    this.RegistrerForm.reset();
    this.modalRef.hide();
    this.submitted = false;
    this.modalTitle = 'Add Retailer';
    this.btnSaveText = 'Save';
  }

  openModal(template: TemplateRef<any>) {

    this.modalRef = this.modalService.show(template, this.modalConfig);
  }
}
