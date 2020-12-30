import {
  Component,
  TemplateRef,
  ViewChild,
  ElementRef,
  ViewEncapsulation,
  OnInit,
} from "@angular/core";
import { BsModalService, BsModalRef } from "ngx-bootstrap/modal";
import { ColumnMode } from "@swimlane/ngx-datatable";
import {
  FormBuilder,
  FormGroup,
  Validators,
  FormArray,
  FormControl,
} from "@angular/forms";
import { Router } from "@angular/router";
import { CommonService } from "./../_services/common.service";
import { ToastrService } from "ngx-toastr";
import { BlockUI, NgBlockUI } from "ng-block-ui";
import { BsDatepickerConfig } from "ngx-bootstrap/datepicker";
import { Page } from "./../_models/page";
import { ConfirmService } from '../_helpers/confirm-dialog/confirm.service';

@Component({
  selector: "app-sell-sim",
  templateUrl: "./sell-sim.component.html",
  encapsulation: ViewEncapsulation.None,
})
export class SellSIMComponent implements OnInit {
  entryForm: FormGroup;
  itemHistoryList: FormArray;
  itemFormArray: any;

  fromRowData:any;

  oneTimeCharge:number = 0;
  netTotal:number = 0;
  subTotal:number =0;
  discount:number=0;
  paidAmount:number=0;

  submitted = false;
  @BlockUI() blockUI: NgBlockUI;
  modalTitle = "Add ";
  btnSaveText = "Sell SIM";

  modalConfig: any = { class: "gray modal-lg", backdrop: "static" };
  modalRef: BsModalRef;

  page = new Page();
  rows = [];
  loadingIndicator = false;
  ColumnMode = ColumnMode;
  scrollBarHorizontal = window.innerWidth < 1200;
  bsConfig: Partial<BsDatepickerConfig>;

  customerList: Array<any> = [];
  simList: Array<any> = [];
  // planList: Array<any> = [];

  constructor(
    private confirmService: ConfirmService,
    private modalService: BsModalService,
    public formBuilder: FormBuilder,
    private _service: CommonService,
    private toastr: ToastrService,
    private router: Router
  ) {
    // this.page.pageNumber = 0;
    // this.page.size = 10;
    window.onresize = () => {
      this.scrollBarHorizontal = window.innerWidth < 1200;
    };
    this.bsConfig = Object.assign(
      {},
      {
        dateInputFormat: "DD-MMM-YYYY ",
      }
    );
  }

  ngOnInit() {
    this.entryForm = this.formBuilder.group({
      id: [null],
      customer: [null, [Validators.required]],
      itemHistory: this.formBuilder.array([this.initItemHistory()]),
    });
    this.itemHistoryList = this.entryForm.get("itemHistory") as FormArray;
    this.itemFormArray = this.entryForm.get("itemHistory")["controls"];

    this.getCustomerList();
    this.getSIMList();
  }

  get f() {
    return this.entryForm.controls;
  }

  get item_his(): FormArray {
    return this.entryForm.get("itemHistory") as FormArray;
  }

  initItemHistory() {
    return this.formBuilder.group({
      sim: [null, [Validators.required]],
      sim_iccid: [null, [Validators.required]],
      amount: [null, [Validators.required]],
    });
  }

  addItemHistory() {
    this.itemHistoryList.push(this.initItemHistory());
  }

  removeItemHistory(i) {
    if (this.itemHistoryList.length > 1) {
      this.itemHistoryList.removeAt(i);
    }
  }

  getCustomerList() {
    this._service.get("user-list?is_customer=true").subscribe(
      (res) => {
        this.customerList = res;
      },
      (err) => {}
    );
  }

  getSIMList() {
    this._service.get("stock/get-subscriptable-sim-list").subscribe(
      (res) => {
        this.simList = res;
      },
      (err) => {}
    );
  }

  // getPlanList() {
  //   this._service.get("subscription/get-data-plan-list").subscribe(
  //     (res) => {
  //       this.planList = res;
  //     },
  //     (err) => {}
  //   );
  // }

  onSIMChange(e, item) {
    if (e.ICCID_no){
       item.controls["sim_iccid"].setValue(e.ICCID_no);
       item.controls["sim_iccid"].disable();
      }else {
        item.controls["sim_iccid"].setValue(null);
        item.controls["sim_iccid"].enable();
      }
  }


  onChangeDiscount(value) {
    if (parseFloat(value) > this.subTotal) {
      this.discount = this.subTotal;
    }
  }

  // onChangePaid(value) {
  //   if (parseFloat(value) > this.subTotal - this.discount) {
  //     this.paidAmount = this.subTotal - this.discount;
  //   }
  // }

  onFormSubmit() {
    this.submitted = true;
    if (this.entryForm.invalid) {
      return;
    }
    
    if(Number(this.oneTimeCharge) == 0){
     
      this.confirmService.confirm('One Time Charge is empty!', 'Want to procesed with empty value?')
      .subscribe(
          result => {
            if (result) {

              let sim_sales_details = [];
              this.blockUI.start('Saving...');
          
              this.fromRowData.itemHistory.filter(x=> x.sim && x.sim_iccid && x.amount).forEach(element => {
                sim_sales_details.push({
                  sim: element.sim.id,
                  ICCID_no:element.sim_iccid,
                  sim_cost: Number(element.amount)
                });
              });
          
          
          
              const obj = {
                customer:this.entryForm.value.customer,
                one_time_charge : Number(this.oneTimeCharge),
                total_amount: Number(this.subTotal) + Number(this.oneTimeCharge),
                discount:Number(this.discount),
                payable_amount:(Number(this.subTotal) + Number(this.oneTimeCharge)) - Number(this.discount),
                so_far_paid:0,
                sim_sales_details:sim_sales_details
              };
          
              this.confirmService.confirm('Are you sure?', 'You are selling sim.')
              .subscribe(
                  result => {
                      if (result) {
          
          
                          this._service.post('subscription/save-sim-sales', obj).subscribe(
                            data => {
                              this.blockUI.stop();
                              if (data.IsReport == "Success") {
                                this.toastr.success(data.Msg, 'Success!', { closeButton: true, disableTimeOut: true });
                                this.formReset();
          
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
                      else{
                          this.blockUI.stop();
                      }
                  },
          
              );
          

            }           
        });
     }


  }



  itemTotal(){
    this.fromRowData = this.entryForm.getRawValue();
    if(this.fromRowData.itemHistory.length > 0){
      this.subTotal = this.fromRowData.itemHistory.map(x => Number(x.amount)).reduce((a, b) => a + b);
      this.netTotal = Number(this.subTotal) + Number(this.oneTimeCharge) - Number(this.discount);
    }
  }

  formReset(){
    this.submitted = false;
    this.entryForm.reset();
    Object.keys(this.entryForm.controls).forEach(key => {
      this.entryForm.controls[key].setErrors(null)
    });
    let itemHistoryControl = <FormArray>(
      this.entryForm.controls.itemHistory
    );
    while (this.itemHistoryList.length !== 1) {
      itemHistoryControl.removeAt(0);
    }
    this.subTotal=0;
    this.oneTimeCharge=0;
    this.discount=0;
    this.paidAmount=0;

    this.getCustomerList();
    this.getSIMList();
  }


}
