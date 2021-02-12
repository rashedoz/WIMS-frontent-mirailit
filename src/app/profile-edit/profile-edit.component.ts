import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray, FormControl } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { BsDatepickerConfig } from 'ngx-bootstrap/datepicker';
import { Router, ActivatedRoute } from '@angular/router';
import { CommonService } from '../_services/common.service';
import { AuthenticationService } from '../_services/authentication.service';
import { DatePipe } from '@angular/common';
import { MustMatch } from './../_helpers/must-match.validator';
@Component({
  selector: 'app-profile-edit',
  templateUrl: './profile-edit.component.html',
  styleUrls: ['./profile-edit.component.css']
})

export class ProfileEditComponent implements OnInit {
  submitted = false;
  submittedPassword = false;
  RegistrerForm: FormGroup;
  RegistrerFormChangePassword: FormGroup;
  public currentUser: any;
  @BlockUI() blockUI: NgBlockUI;
  bsConfig: Partial<BsDatepickerConfig>;
  id;
  constructor(
    private authService: AuthenticationService,
    private toastr: ToastrService,
    private router: Router,
    public formBuilder: FormBuilder,
    private _service: CommonService,
    private datePipe: DatePipe,
    private route: ActivatedRoute
  ) {
    this.bsConfig = Object.assign({}, {
      dateInputFormat: 'DD-MMM-YYYY',
      adaptivePosition: true
    });
    this.currentUser = this.authService.currentUserDetails.value;
     console.log(this.currentUser);
  }

  ngOnInit() {
  //  this.id = this.route.snapshot.queryParams['id'];
  this.RegistrerForm = this.formBuilder.group({
    id:[null,],
    code: [{value: null, disabled: true}],
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
    gender: [1],
    firstName: [null, [Validators.required]],
    lastName: [null, [Validators.required]]
  });

  this.RegistrerFormChangePassword = this.formBuilder.group({
    id:[null],    
    old_password: ['', [Validators.required, Validators.minLength(6)]],
    password: ['', [Validators.required, Validators.minLength(6)]],
    confirmPassword: ['', Validators.required]
  }, {
    validator: MustMatch('password', 'confirmPassword')
});

  this.getDetails();
  }


  get f() {
    return this.RegistrerForm.controls;
  }
  get p() {
    return this.RegistrerFormChangePassword.controls;
  }
  getDetails() {

    this.blockUI.start('Getting data...');
    this._service.get('get-user-detail/' + this.currentUser.id).subscribe(res => {
      this.blockUI.stop();
      console.log(res);
      this.RegistrerForm.controls['id'].setValue(res.id);
      if(res.is_customer){
       this.RegistrerForm.controls['code'].setValue(res.customer_code);
      }else{
          this.RegistrerForm.controls['code'].setValue(res.member_code);
      }
      // this.RegistrerForm.controls['member_code'].setValue(res.member_code);
      this.RegistrerForm.controls['nid'].setValue(res.nid);
      this.RegistrerForm.controls['fax'].setValue(res.fax);
      this.RegistrerForm.controls['telephone'].setValue(res.telephone);
      this.RegistrerForm.controls['acc_number'].setValue(res.acc_number);
      this.RegistrerForm.controls['email'].setValue(res.email);
      this.RegistrerForm.controls['email'].disable();
      this.RegistrerForm.controls['mobile'].setValue(res.mobile);
      this.RegistrerForm.controls['alternative_mobile'].setValue(res.alternative_mobile);
      this.RegistrerForm.controls['dob'].setValue(res.dob ? new Date(res.dob) : null);
      this.RegistrerForm.controls['gender'].setValue(res.gender);
      this.RegistrerForm.controls['address_one'].setValue(res.address_one);
      this.RegistrerForm.controls['address_two'].setValue(res.address_two);
      this.RegistrerForm.controls['occupation'].setValue(res.occupation);
      this.RegistrerForm.controls['firstName'].setValue(res.first_name);
      this.RegistrerForm.controls['lastName'].setValue(res.last_name);
      this.RegistrerFormChangePassword.controls['id'].setValue(res.id);

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
  let id = this.RegistrerForm.value.id;

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
      telephone:this.RegistrerForm.value.telephone,
    };
  
    this._service.put('update-user-profile/'+id, obj).subscribe(
      data => {
        this.blockUI.stop();
        if (data.IsReport == "Success") {
          this.toastr.success(data.Msg, 'Success!', { timeOut: 4000 });
          this.getDetails();   
        
        } else if (data.IsReport == "Warning") {
          this.toastr.warning(data.Msg, 'Warning!', { closeButton: true, disableTimeOut: true });        
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

}

onFormSubmitChangePassword() {
  this.submittedPassword = true;
  if (this.RegistrerFormChangePassword.invalid) {
    return;
  }

    this.blockUI.start('Changing...');

    const obj = {
      user_id: this.RegistrerFormChangePassword.value.id,
      old_password: this.RegistrerFormChangePassword.value.old_password.trim(),     
      new_password: this.RegistrerFormChangePassword.value.password.trim()     
    };
  
    this._service.post('update-user-password', obj).subscribe(
      data => {
        this.blockUI.stop();
        if (data.IsReport == "Success") {
          this.toastr.success(data.Msg, 'Success!', { timeOut: 2000 });
          this.getDetails(); 
          this.submittedPassword = false;
        }
        else if (data.IsReport == "Warning") {
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
