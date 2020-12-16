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

@Component({
  selector: "app-create-subscription",
  templateUrl: "./create-subscription.component.html",
  encapsulation: ViewEncapsulation.None,
})
export class CreateSubscriptionComponent implements OnInit {
  entryForm: FormGroup;
  itemHistoryList: FormArray;
  itemFormArray: any;

  submitted = false;
  @BlockUI() blockUI: NgBlockUI;
  modalTitle = "Add ";
  btnSaveText = "Save";

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
  planList: Array<any> = [];

  constructor(
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
      customer: [null],
      session: [null],
      itemHistory: this.formBuilder.array([this.initItemHistory()]),
    });
    this.itemHistoryList = this.entryForm.get("itemHistory") as FormArray;
    this.itemFormArray = this.entryForm.get("itemHistory")["controls"];

    this.getCustomerList();
    this.getSIMList();
    this.getPlanList();
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
      plan: [null, [Validators.required]],
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

  getPlanList() {
    this._service.get("subscription/get-data-plan-list").subscribe(
      (res) => {
        this.planList = res;
      },
      (err) => {}
    );
  }

  onSIMChange(e, item) {
    if (e.ICCID_no){
       item.controls["sim_iccid"].setValue(e.ICCID_no);
       item.controls["sim_iccid"].disable();
      }else {
        item.controls["sim_iccid"].setValue(null);
        item.controls["sim_iccid"].enable();
      }
  }

  // onFormSubmit() {
  //   this.submitted = true;
  //   if (this.entryForm.invalid) {
  //     return;
  //   }
  //   let purchase_details = [];
  //   this.blockUI.start('Saving...');

  //   this.purchaseItemList.forEach(element => {
  //     purchase_details.push({
  //       product_type:element.product_type_id,
  //       qty: Number(element.qty),
  //       total_amount: Number(element.amount)
  //     });
  //   });

  //   const obj = {
  //     supplier:this.entryForm.value.supplier,
  //     total_amount:this.totalAmount,
  //     purchase_details:purchase_details
  //   };

  //   this._service.post('purchase/entry-sim-purchase', obj).subscribe(
  //     data => {
  //       this.blockUI.stop();
  //       if (data.IsReport == "Success") {
  //         this.toastr.success(data.Msg, 'Success!', { timeOut: 2000 });
  //         this.modalHide();
  //         this.getList();

  //       } else {
  //         this.toastr.error(data.Msg, 'Error!', { timeOut: 2000 });
  //       }
  //     },
  //     err => {
  //       this.blockUI.stop();
  //       this.toastr.error(err.Message || err, 'Error!', { timeOut: 2000 });
  //     }
  //   );

  // }

  modalHide() {
    this.entryForm.reset();
    this.modalRef.hide();
    this.submitted = false;
    this.modalTitle = "Add ";
    this.btnSaveText = "Save";
  }

  // itemTotal(){

  //   if(this.purchaseItemList.length > 0){
  //     this.totalAmount = this.purchaseItemList.map(x => Number(x.amount)).reduce((a, b) => a + b);
  //     return this.totalAmount;
  //   }

  // }

  openModal(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(template, this.modalConfig);
  }
}
