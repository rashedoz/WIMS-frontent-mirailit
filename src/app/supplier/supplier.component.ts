import { Component, TemplateRef, ViewChild, ElementRef, ViewEncapsulation, OnInit } from '@angular/core';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { ColumnMode,DatatableComponent } from '@swimlane/ngx-datatable';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonService } from './../_services/common.service';
import { ToastrService } from 'ngx-toastr';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { Page } from './../_models/page';


@Component({
  selector: 'app-supplier',
  templateUrl: './supplier.component.html',
  encapsulation: ViewEncapsulation.None
})

export class SupplierComponent implements OnInit {

  entryForm: FormGroup;
  submitted = false;
  @BlockUI() blockUI: NgBlockUI;
  modalTitle = 'Add Supplier';
  btnSaveText = 'Save';
  @ViewChild(DatatableComponent, { static: false }) table: DatatableComponent;
  modalConfig: any = { class: 'gray modal-xl', backdrop: 'static' };
  modalRef: BsModalRef;
  columnsWithSearch : string[] = [];
  page = new Page();

  rows = [];
  tempRows = [];
  supplierList = [];
  loadingIndicator = false;
  ColumnMode = ColumnMode;
  details;
  scrollBarHorizontal = (window.innerWidth < 1200);
  searchParam = '';
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
      id: [null],
      name: [null, [Validators.required]],
      mobile: [null, [Validators.required]],
      alternative_mobile: [null],
      address_one: [null,[Validators.required]],
      address_two: [null],
      preferred_payment_method: [null],
      acc_number: [null]

    });
    this.getList();
  }

  get f() {
    return this.entryForm.controls;
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
    this._service.get('supplier/get-supplier-list',obj).subscribe(res => {
      if (!res) {
        this.toastr.error(res.Message, 'Error!', { timeOut: 2000 });
        return;
      }
   //   this.tempRows = res;
      this.supplierList = res.results;
      this.page.totalElements = res.count;
      this.page.totalPages = Math.ceil(this.page.totalElements / this.page.size);

      // if(this.supplierList.length > 0)this.columnsWithSearch = Object.keys(this.supplierList[0]);
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

  filterSearch(e){
    if(e){
      this.page.pageNumber = 0;
      this.page.size = 10;
      this.searchParam = e.target.value;
      this.getList();
    }
  }

  getItem(row, template: TemplateRef<any>) {

    this.modalTitle = 'Update Supplier';
    this.btnSaveText = 'Update';

    this.entryForm.controls['id'].setValue(row.id);
    this.entryForm.controls['mobile'].setValue(row.mobile);
    this.entryForm.controls['name'].setValue(row.name);
    this.entryForm.controls['alternative_mobile'].setValue(row.alternative_mobile);
    this.entryForm.controls['address_one'].setValue(row.address_one);
    this.entryForm.controls['address_two'].setValue(row.address_two);
    this.entryForm.controls['preferred_payment_method'].setValue(row.preferred_payment_method);
    this.entryForm.controls['acc_number'].setValue(row.acc_number);
    this.modalRef = this.modalService.show(template, this.modalConfig);
  }

  showDetails(row, template: TemplateRef<any>) {
    this.modalTitle = 'Details';
    this.details = row;
    this.modalRef = this.modalService.show(template, this.modalConfig);
  }

  onFormSubmit() {
    this.submitted = true;
    if (this.entryForm.invalid) {
      return;
    }
    let id = this.entryForm.value.id;

    if(id){

      this.blockUI.start('Updating...');

      const obj = {
        //id: this.entryForm.value.id ? this.entryForm.value.id : 0,
        name: this.entryForm.value.name.trim(),
        mobile: this.entryForm.value.mobile.trim(),
        alternative_mobile: this.entryForm.value.alternative_mobile ? this.entryForm.value.alternative_mobile.trim() : null,
        address_one: this.entryForm.value.address_one ? this.entryForm.value.address_one.trim() : null,
        address_two: this.entryForm.value.address_two ? this.entryForm.value.address_two.trim() : null,
        preferred_payment_method: this.entryForm.value.preferred_payment_method ? this.entryForm.value.preferred_payment_method.trim() : null,
        acc_number: this.entryForm.value.acc_number ? this.entryForm.value.acc_number.trim() : null,
      };

      this._service.put('supplier/edit-supplier/'+id, obj).subscribe(
        data => {
          this.blockUI.stop();
          if (data.IsReport === "Success") {
            this.toastr.success(data.Msg, 'Success!', { timeOut: 2000 });
            this.modalHide();
            this.getList();

          } else if (data.IsReport === "Warning") {
            this.toastr.warning(data.Msg, 'Error!',  { closeButton: true, disableTimeOut: true });

          } else {
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
      //id: this.entryForm.value.id ? this.entryForm.value.id : 0,
      name: this.entryForm.value.name.trim(),
      mobile: this.entryForm.value.mobile.trim(),
      alternative_mobile: this.entryForm.value.alternative_mobile ? this.entryForm.value.alternative_mobile.trim() : null,
      address_one: this.entryForm.value.address_one ? this.entryForm.value.address_one.trim() : null,
      address_two: this.entryForm.value.address_two ? this.entryForm.value.address_two.trim() : null,
      preferred_payment_method: this.entryForm.value.preferred_payment_method ? this.entryForm.value.preferred_payment_method.trim() : null,
      acc_number: this.entryForm.value.acc_number ? this.entryForm.value.acc_number.trim() : null,
    };

    this._service.post('supplier/save-supplier', obj).subscribe(
      data => {
        this.blockUI.stop();
        if (data.IsReport === "Success") {
          this.toastr.success(data.Msg, 'Success!', { timeOut: 2000 });
          this.modalHide();
          this.getList();

        } else if (data.IsReport === "Warning") {
          this.toastr.warning(data.Msg, 'Error!',  { closeButton: true, disableTimeOut: true });

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

  }

  modalHide() {
    this.entryForm.reset();
    this.modalRef.hide();
    this.details = null;
    this.submitted = false;
    this.modalTitle = 'Add Supplier';
    this.btnSaveText = 'Save';
  }

  openModal(template: TemplateRef<any>) {

    this.modalRef = this.modalService.show(template, this.modalConfig);
  }

  // updateFilter(event) {
  //   const val = event.target.value.toLowerCase();

  //     // assign filtered matches to the active datatable
  //     const temp = this.tempRows.filter(item => {
  //       // iterate through each row's column data
  //       for (let i = 0; i < this.columnsWithSearch.length; i++){
  //         var colValue = item[this.columnsWithSearch[i]] ;
  //         // if no filter OR colvalue is NOT null AND contains the given filter
  //         if (!val || (!!colValue && colValue.toString().toLowerCase().indexOf(val) !== -1)) {
  //           // found match, return true to add to result set
  //           return true;
  //         }
  //       }
  //     });

  //   // update the rows
  //   this.supplierList = temp;
  //   // Whenever the filter changes, always go back to the first page
  //   this.table.offset = 0;
  // }

}
