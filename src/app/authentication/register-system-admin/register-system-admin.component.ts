import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import {AuthenticationService} from '../../_services/authentication.service';
import { MustMatch } from '../../_helpers/must-match.validator';
import { ToastrService } from 'ngx-toastr';
import { BlockUI, NgBlockUI } from 'ng-block-ui';

@Component({
  selector: 'app-register-system-admin',
  templateUrl: './register-system-admin.component.html'
})
export class RegisterSystemAdminComponent implements OnInit {
  RegistrerForm: FormGroup;
  submitted = false;
  @BlockUI() blockUI: NgBlockUI;
   userTypeList = [{id:"Customer",name:"Customer"},{id:"Staff",name:"Staff"}]
  constructor(
    public formBuilder: FormBuilder,
     private authService : AuthenticationService,
     private toastr: ToastrService,
     private router: Router
     ) { }

  ngOnInit() {
    this.RegistrerForm = this.formBuilder.group({
      email: [null, [Validators.required, Validators.email, Validators.maxLength(50)]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required],
      firstName: [null, [Validators.required]],
      lastName: [null, [Validators.required]]
    }, {
      validator: MustMatch('password', 'confirmPassword')
  });
  }

  get f() {
    return this.RegistrerForm.controls;
  }

  onRegisterSubmit() {
    this.submitted = true;
    if (this.RegistrerForm.invalid  ) {
      return;
    }

    this.blockUI.start('Registering...');

    const obj = {
      email: this.RegistrerForm.value.email.trim(),
      password: this.RegistrerForm.value.password.trim(),
      first_name: this.RegistrerForm.value.firstName.trim(),
      last_name: this.RegistrerForm.value.lastName.trim(),
      is_customer:0,
      is_staff: 1,
      is_superuser:1
    };

    this.authService.registerSystemAdmin('auth/users/', obj).subscribe(
      data => {
        this.blockUI.stop();
        if (data) {
          this.toastr.success(data.Message, 'Success!', { timeOut: 2000 });
          this.router.navigate(['/admin/login']);
        }else {
         this.toastr.error(data.Message, 'Error!', { timeOut: 2000 });
        }
      },
      error => {
        this.blockUI.stop();
      }
    );

  }




}
