import {
  Component,
  TemplateRef,
  ViewChild,
  ElementRef,
  ViewEncapsulation,
  OnInit
} from "@angular/core";
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MustMatch } from '../_helpers/must-match.validator';
import { Router } from "@angular/router";
import { CommonService } from "../_services/common.service";
import { ToastrService } from "ngx-toastr";
import { BlockUI, NgBlockUI } from "ng-block-ui";

@Component({
  selector: "app-change-password",
  templateUrl: "./change-password.component.html"
})
export class ChangePasswordComponent implements OnInit {
  changePasswordForm: FormGroup;
  @BlockUI() blockUI: NgBlockUI;
  submitted = false;

  constructor(
    public formBuilder: FormBuilder,
    private _service: CommonService,
    private toastr: ToastrService
  ) {

  }

  ngOnInit() {

    this.changePasswordForm = this.formBuilder.group({
      oldPassword: ['', [Validators.required, Validators.minLength(6)]],
      newPassword: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required],
    }, {
      validator: MustMatch('newPassword', 'confirmPassword')
    });

  }
  get f() {
    return this.changePasswordForm.controls;
  }

  onSubmit() {
    this.submitted = true;
    if (this.changePasswordForm.invalid) {
      return;
    }

    this.blockUI.start('Saving data...');

    const obj = {
      OldPassword: this.changePasswordForm.value.oldPassword.trim(),
      NewPassword: this.changePasswordForm.value.newPassword.trim(),
      ConfirmPassword: this.changePasswordForm.value.confirmPassword.trim()
    };

    this._service.post('Account/ChangePassword', obj).subscribe(
      res => {
        this.blockUI.stop();
        this.toastr.success('Password Changed Successfully', 'Success!', { timeOut: 2000 });
        this.submitted = false;
        this.changePasswordForm.reset();
      },
      error => {
        this.toastr.error(error.message || error, 'Error!', { timeOut: 2000 });
        this.blockUI.stop();
      }
    );

  }



}
