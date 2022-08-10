import { Component, TemplateRef, ViewChild, ElementRef, ViewEncapsulation, OnInit } from '@angular/core';
import { ColumnMode } from '@swimlane/ngx-datatable';
import { FormBuilder, FormGroup, Validators, FormArray, FormControl } from '@angular/forms';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { Router } from '@angular/router';
import { CommonService } from '../_services/common.service';
import { ToastrService } from 'ngx-toastr';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { Page } from '../_models/page';
import * as XLSX from 'xlsx';
import { getMaxListeners } from 'process';


@Component({
  selector: 'app-bulk-entry',
  templateUrl: './bulk-entry.component.html',
  encapsulation: ViewEncapsulation.None
})

export class BulkEntryComponent implements OnInit {

  entryForm: FormGroup;
  planHistoryList: FormArray;
  planFormArray: any;

  submitted = false;
  @BlockUI() blockUI: NgBlockUI;
  modalTitle = 'Add Data Plan';
  btnSaveText = 'Save';
  modalConfig: any = { class: 'gray modal-md', backdrop: 'static' };
  modalRef: BsModalRef;

  page = new Page();
  emptyGuid = '00000000-0000-0000-0000-000000000000';
  rows = [];
  loadingIndicator = false;
  ColumnMode = ColumnMode;

  scrollBarHorizontal = (window.innerWidth < 1200);

  @ViewChild('retailerInputFile',{static:false}) retailerInputFile: ElementRef;
  @ViewChild('wholesalerInputFile',{static:false}) wholesalerInputFile: ElementRef;
  @ViewChild('simInputFile',{static:false}) simInputFile: ElementRef;
  @ViewChild('deviceInputFile',{static:false}) deviceInputFile: ElementRef;
  @ViewChild('subscriptionInputFile',{static:false}) subscriptionInputFile: ElementRef;
  arrayBuffer:any;
  retrailerFile:File;
  wholesalerFile:File;
  simFile:File;
  deviceFile:File;
  subscriptionFile:File;

  retrailerList:Array<any> = [];
  wholesalerList:Array<any> = [];
  simList:Array<any> = [];
  deviceList:Array<any> = [];
  subscriptionList:Array<any> = [];

  constructor(
    private modalService: BsModalService,
    public formBuilder: FormBuilder,
    private _service: CommonService,
    private toastr: ToastrService,
    private router: Router
  ) {
    this.page.pageNumber = 0;
    this.page.size = 10;
    window.onresize = () => {
      this.scrollBarHorizontal = (window.innerWidth < 1200);
    };
  }


  ngOnInit() {
    this.entryForm = this.formBuilder.group({
      id: [null]
    });

  }

  clearRetailerUpload(){
    this.retailerInputFile.nativeElement.value = null;
    this.arrayBuffer = [];
    this.retrailerList = [];
  }

  clearWholesalerUpload(){
    this.wholesalerInputFile.nativeElement.value = null;
    this.arrayBuffer = [];
    this.wholesalerList = [];
  }

  clearSIMUpload(){
    this.simInputFile.nativeElement.value = null;
    this.arrayBuffer = [];
    this.simList = [];
  }

  clearDeviceUpload(){
    this.deviceInputFile.nativeElement.value = null;
    this.arrayBuffer = [];
    this.deviceList = [];
  }

  clearSubscriptionUpload(){
    this.subscriptionInputFile.nativeElement.value = null;
    this.arrayBuffer = [];
    this.subscriptionList = [];
  }


  uploadRetailerFile(event)
  {
  this.retrailerFile= event.target.files[0];
  let fileReader = new FileReader();
  fileReader.readAsArrayBuffer(this.retrailerFile);
  fileReader.onload = (e) => {
      this.arrayBuffer = fileReader.result;
      var data = new Uint8Array(this.arrayBuffer);
      var arr = new Array();
      for(var i = 0; i != data.length; ++i) arr[i] = String.fromCharCode(data[i]);
      var bstr = arr.join("");
      var workbook = XLSX.read(bstr, {type:"binary"});
      var first_sheet_name = workbook.SheetNames[0];
      var worksheet = workbook.Sheets[first_sheet_name];
      const list = XLSX.utils.sheet_to_json(worksheet);
      this.retrailerList = [];
      list.forEach((element,i) => {
          this.retrailerList.push({
            password: 'Customer!@#$%^',
            email: element['email'] != undefined ? element['email'].trim() : "customer"+(i+66)+"@gmail.com",
            first_name: element['first_name'].trim(),
            last_name: element['last_name'] != undefined ? element['last_name'].trim() : "(R)",
            mobile: element['mobile'] != undefined ? element['mobile'].trim() : null,
            // alternative_mobile:null,
            // occupation:null,
            // nid:null,
            // address_one:null,
            // address_two:null,
            // fax:null,
            // gender:1,
            // acc_number:null,
            // preferred_payment_method:null,
            // telephone:null,
            gender:1,
            is_customer: 1,
            is_wholesaler: 0 ,
            is_retailer:1,
            is_staff: 0,
            is_superuser:0
          })
        });
  }
}

  uploadWholesalerFile(event)
  {
  this.wholesalerFile= event.target.files[0];
  let fileReader = new FileReader();
  fileReader.readAsArrayBuffer(this.wholesalerFile);
  fileReader.onload = (e) => {
      this.arrayBuffer = fileReader.result;
      var data = new Uint8Array(this.arrayBuffer);
      var arr = new Array();
      for(var i = 0; i != data.length; ++i) arr[i] = String.fromCharCode(data[i]);
      var bstr = arr.join("");
      var workbook = XLSX.read(bstr, {type:"binary"});
      var first_sheet_name = workbook.SheetNames[0];
      var worksheet = workbook.Sheets[first_sheet_name];
      const list = XLSX.utils.sheet_to_json(worksheet);
      this.wholesalerList = [];
      list.forEach((element,i) => {
          this.wholesalerList.push({
            password: 'Customer!@#$%^',
            email: element['email'] != undefined ? element['email'].trim() :  "customer"+(i+1)+"@gmail.com",
            first_name: element['first_name'].trim(),
            last_name: element['last_name'] != undefined ? element['last_name'].trim() : "(W)",
            mobile: element['mobile'] != undefined ? element['mobile'].trim() : null,
            // alternative_mobile:null,
            // occupation:null,
            // nid:null,
            // address_one:element['address_one'] != undefined ? element['address_one'].trim() :  null,
            // address_two:null,
            // fax:null,
            // gender:1,
            // acc_number:null,
            // preferred_payment_method:null,
            // telephone:null,
            gender:1,
            is_customer: 1,
            is_wholesaler: 1,
            is_retailer:0,
            is_staff: 0,
            is_superuser:0
          })
        });

  }
}

  uploadSIMFile(event)
    {
    this.simFile= event.target.files[0];
    let fileReader = new FileReader();
    fileReader.readAsArrayBuffer(this.simFile);
    fileReader.onload = (e) => {
        this.arrayBuffer = fileReader.result;
        var data = new Uint8Array(this.arrayBuffer);
        var arr = new Array();
        for(var i = 0; i != data.length; ++i) arr[i] = String.fromCharCode(data[i]);
        var bstr = arr.join("");
        var workbook = XLSX.read(bstr, {type:"binary"});
        var first_sheet_name = workbook.SheetNames[0];
        var worksheet = workbook.Sheets[first_sheet_name];
        const list = XLSX.utils.sheet_to_json(worksheet);
        this.simList = [];
        list.forEach((element,i) => {
            this.simList.push({
              id: Number(element['id']),
              ICCID_no: element['ICCID_no'],
              phone_number:element['phone_number'],
              CID_no:element['CID_no']
            })
          });
          console.log(this.simList);
    }
  }

  uploadDeviceFile(event)
    {
    this.deviceFile= event.target.files[0];
    let fileReader = new FileReader();
    fileReader.readAsArrayBuffer(this.deviceFile);
    fileReader.onload = (e) => {
        this.arrayBuffer = fileReader.result;
        var data = new Uint8Array(this.arrayBuffer);
        var arr = new Array();
        for(var i = 0; i != data.length; ++i) arr[i] = String.fromCharCode(data[i]);
        var bstr = arr.join("");
        var workbook = XLSX.read(bstr, {type:"binary"});
        var first_sheet_name = workbook.SheetNames[0];
        var worksheet = workbook.Sheets[first_sheet_name];
        const list = XLSX.utils.sheet_to_json(worksheet);
        this.deviceList = [];
        list.forEach((element,i) => {
            this.deviceList.push({
              id:Number(element['id']),
              IMEI: element['IMEI'],
            })
          });
          console.log(this.deviceList);
    }
  }

  uploadSubscriptionFile(event)
    {
    this.subscriptionFile= event.target.files[0];
    let fileReader = new FileReader();
    fileReader.readAsArrayBuffer(this.subscriptionFile);
    fileReader.onload = (e) => {
        this.arrayBuffer = fileReader.result;
        var data = new Uint8Array(this.arrayBuffer);
        var arr = new Array();
        for(var i = 0; i != data.length; ++i) arr[i] = String.fromCharCode(data[i]);
        var bstr = arr.join("");
        var workbook = XLSX.read(bstr, {type:"binary"});
        var first_sheet_name = workbook.SheetNames[0];
        var worksheet = workbook.Sheets[first_sheet_name];
        const list = XLSX.utils.sheet_to_json(worksheet);
        this.subscriptionList = [];
        list.forEach((element,i) => {

          let simArray = [],iccidArray = [],planArray = [],amountArray = [];

         simArray = element['sim'].toString().split(',');
         iccidArray =  element['ICCID_no'].toString().split(',');
         planArray =  element['plan'].toString().split(',');
         amountArray =  element['amount'].toString().split(',');

        let subscribed_items_array = [];
        let subscribed_relocation_items_array = [];

        simArray.forEach((sim,i) => {
          subscribed_items_array.push({
            "session":"Jun-2021",
            "sim": Number(sim.trim()),
            "ICCID_no": iccidArray[i].trim(),
            "plan": Number(planArray[i].trim()),
            "amount": Number(amountArray[i].trim()),
            "customer":Number(element['customer'])
          });
          subscribed_relocation_items_array.push({
            "sim": Number(sim.trim()),
            "plan": Number(planArray[i].trim()),
            "actual_price": Number(amountArray[i].trim()),
            "discount":0,
            "payable_amount":Number(amountArray[i].trim()),
            "changes_price":0,
            "refund_amount":0,
            "customer":Number(element['customer'])
          });
        });

        let totalAmount = 0;
        amountArray.forEach((element,i) => {
          totalAmount += Number(element);
        });


          const billObj = {
            "total_amount":totalAmount,
            "discount":0,
            "payable_amount": totalAmount,
            "session": "Jun-2021",
            "customer":Number(element['customer']),
            "so_far_paid":0,
            "parent_refund_amount":0
         };


            this.subscriptionList.push({
              "customer":Number(element['customer']),
              "bill":billObj,
              "subscribed_items":subscribed_items_array,
              "subscribed_relocation_items":subscribed_relocation_items_array
          })

          });
          console.log(this.subscriptionList);
    }
  }


  onSubmitRetailer() {

    if (this.retrailerList.length == 0) {
      this.toastr.warning("No Retailer Found", 'Warning!', { closeButton: true, disableTimeOut: true });
      return;
    }
    this.blockUI.start('Uploading...');
    const request = this._service.post('register-bulk-user', {users:this.retrailerList});
    request.subscribe(
      data => {
        this.blockUI.stop();
        if (data.IsReport == "Success") {
          this.clearRetailerUpload();
          this.toastr.success(data.Msg, 'Success!', { timeOut: 2000 });
        } else if (data.IsReport == "Warning") {
          this.toastr.warning(data.Msg, 'Warning!', { closeButton: true, disableTimeOut: true });
        } else {
          this.toastr.error(data.Msg, 'Error!', { closeButton: true, disableTimeOut: true });
        }
      },
      err => {
        this.blockUI.stop();
        this.toastr.error(err.Msg || err, 'Error!', { closeButton: true, disableTimeOut: true });
      }
    );

  }

  onSubmitWholesaler() {

    if (this.wholesalerList.length == 0) {
      this.toastr.warning("No Wholesaler Found", 'Warning!', { closeButton: true, disableTimeOut: true });
      return;
    }
    this.blockUI.start('Uploading...');
    const request = this._service.post('register-bulk-user', {users:this.wholesalerList});
    request.subscribe(
      data => {
        this.blockUI.stop();
        if (data.IsReport == "Success") {
          this.clearWholesalerUpload();
          this.toastr.success(data.Msg, 'Success!', { timeOut: 2000 });
        } else if (data.IsReport == "Warning") {
          this.toastr.warning(data.Msg, 'Warning!', { closeButton: true, disableTimeOut: true });
        } else {
          this.toastr.error(data.Msg, 'Error!', { closeButton: true, disableTimeOut: true });
        }
      },
      err => {
        this.blockUI.stop();
        this.toastr.error(err.Msg || err, 'Error!', { closeButton: true, disableTimeOut: true });
      }
    );

  }

  onSubmitSIM() {

    if (this.simList.length == 0) {
      this.toastr.warning("No SIM Found", 'Warning!', { closeButton: true, disableTimeOut: true });
      return;
    }
    this.blockUI.start('Uploading...');
    const request = this._service.put('stock/update-bulk-sim-detail', {sim_details:this.simList});
    request.subscribe(
      data => {
        this.blockUI.stop();
        if (data.IsReport == "Success") {
          this.clearSIMUpload();
          this.toastr.success(data.Msg, 'Success!', { timeOut: 2000 });
        } else if (data.IsReport == "Warning") {
          this.toastr.warning(data.Msg, 'Warning!', { closeButton: true, disableTimeOut: true });
        } else {
          this.toastr.error(data.Msg, 'Error!', { closeButton: true, disableTimeOut: true });
        }
      },
      err => {
        this.blockUI.stop();
        this.toastr.error(err.Msg || err, 'Error!', { closeButton: true, disableTimeOut: true });
      }
    );

  }

  onSubmitDevice() {

    if (this.deviceList.length == 0) {
      this.toastr.warning("No Device Found", 'Warning!', { closeButton: true, disableTimeOut: true });
      return;
    }
    this.blockUI.start('Uploading...');
    const request = this._service.put('stock/update-bulk-device-detail', {device_details:this.deviceList});
    request.subscribe(
      data => {
        this.blockUI.stop();
        if (data.IsReport == "Success") {
          this.clearDeviceUpload();
          this.toastr.success(data.Msg, 'Success!', { timeOut: 2000 });
        } else if (data.IsReport == "Warning") {
          this.toastr.warning(data.Msg, 'Warning!', { closeButton: true, disableTimeOut: true });
        } else {
          this.toastr.error(data.Msg, 'Error!', { closeButton: true, disableTimeOut: true });
        }
      },
      err => {
        this.blockUI.stop();
        this.toastr.error(err.Msg || err, 'Error!', { closeButton: true, disableTimeOut: true });
      }
    );

  }


  onSubmitSubscription() {

    if (this.subscriptionList.length == 0) {
      this.toastr.warning("No Subscription Found", 'Warning!', { closeButton: true, disableTimeOut: true });
      return;
    }
    this.blockUI.start('Uploading...');
    const request = this._service.post('subscription/create-bulk-subscription', {subscriptions:this.subscriptionList});
    request.subscribe(
      data => {
        this.blockUI.stop();
        if (data.IsReport == "Success") {
          this.clearSubscriptionUpload();
          this.toastr.success(data.Msg, 'Success!', { timeOut: 2000 });
        } else if (data.IsReport == "Warning") {
          this.toastr.warning(data.Msg, 'Warning!', { closeButton: true, disableTimeOut: true });
        } else {
          this.toastr.error(data.Msg, 'Error!', { closeButton: true, disableTimeOut: true });
        }
      },
      err => {
        this.blockUI.stop();
        this.toastr.error(err.Msg || err, 'Error!', { closeButton: true, disableTimeOut: true });
      }
    );

  }

}
