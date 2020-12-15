import { Component, TemplateRef, ViewChild, ElementRef, ViewEncapsulation, OnInit } from '@angular/core';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { ColumnMode } from '@swimlane/ngx-datatable';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonService } from './../_services/common.service';
import { ToastrService } from 'ngx-toastr';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { Page } from './../_models/page';
import { environment } from '../../environments/environment'
import { ConfirmService } from '../_helpers/confirm-dialog/confirm.service';

@Component({
  selector: 'app-requisition',
  templateUrl: './requisition.component.html',
  encapsulation: ViewEncapsulation.None
})

export class RequisitionComponent implements OnInit {

  entryForm: FormGroup;
  submitted = false;
  @BlockUI() blockUI: NgBlockUI;
  modalTitle = 'Create Requisition';
  btnSaveText = 'Save';

  modalConfig: any = { class: 'gray modal-xl', backdrop: 'static' };
  modalRef: BsModalRef;

  page = new Page();

  rows = [];
  loadingIndicator = false;
  ColumnMode = ColumnMode;

  dormitoryDropDownList = [];
  buildingDropDownList = [];
  floorDropDownList = [];
  facilitiesDropDownList = [];
  roomImageList = [];
  urls = [];
  files = [];

  baseUrl = environment.baseUrl;

  roomTypeList = [
    {id:"Single",name:"Single"},
    {id:"Double",name:"Double"},
    {id:"Shared",name:"Shared"},
    {id:"Apartment",name:"Apartment"}
  ]

  genderTypeList = [
    {id:"Male",name:"Male"},
    {id:"Female",name:"Female"},
    {id:"Both",name:"Both"}
  ]

  scrollBarHorizontal = (window.innerWidth < 1200);

  constructor(
    private modalService: BsModalService,
    private el: ElementRef,
    public formBuilder: FormBuilder,
    private _service: CommonService,
    private toastr: ToastrService,
    private confirmService: ConfirmService,
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
      name: [null, [Validators.required, Validators.maxLength(250)]],
      dormitory_id: [null, [Validators.required]],
      building_id: [null, [Validators.required]],
      floor_id: [null, [Validators.required]],
      room_type: [null, [Validators.required]],
      gender_type: [null, [Validators.required]],
      facilities: [null, [Validators.required]],
      price: [null, [Validators.required]],
      is_civil: [false],
      is_employee: [false],
      description: [null],
      is_active: [true]

    });
    this.getList();
    this.getDormitoryDropdownList();
    this.getFacilitiesDropdownList();
  }

  get f() {
    return this.entryForm.controls;
  }

  setPage(pageInfo) {
    this.page.pageNumber = pageInfo.offset;
    this.getList();
  }


  onSelectFile(event) {
    this.urls = [];
    this.files = [];
    if (event.target.files && event.target.files[0]) {
      this.files = event.target.files;
      for (let i = 0; i < event.target.files.length; i++) {
        var reader = new FileReader();

        reader.onload = (event: any) => {
          this.urls.push(event.target.result);
        }
        console.log(this.files);
        reader.readAsDataURL(event.target.files[i]);
      }
    } else
      this.files = [];
  }

  getFacilitiesDropdownList() {   
    this._service.get('facilities/dropdown-list').subscribe(res => {
      this.facilitiesDropDownList = res;
    }, err => { }
    );
  }
  getDormitoryDropdownList() {   
    this._service.get('dormitories/dropdown-list').subscribe(res => {
      this.dormitoryDropDownList = res;
    }, err => { }
    );
  }

  onDormitoryChange(e){   
    this.entryForm.controls['building_id'].setValue(null);
    this.entryForm.controls['floor_id'].setValue(null);
    if(e){
      this.getBuildingDropdownListByDormitoryId(e.id);
    }
  }

  getBuildingDropdownListByDormitoryId(id) {  
    this.buildingDropDownList = []; 
    this._service.get('buildings/dropdown-list-by-dormitory/'+id).subscribe(res => {
      this.buildingDropDownList = res;
    }, err => { }
    );
  }

  onBuildingChange(e){  

    this.entryForm.controls['floor_id'].setValue(null);
    if(e){
      this.getFloorDropdownListByBuildingId(e.id);
    }
  }

  
  getFloorDropdownListByBuildingId(id) { 
    this.floorDropDownList = []; 
    this._service.get('floors/dropdown-list-by-building/'+id).subscribe(res => {
      this.floorDropDownList = res;
    }, err => { }
    );
  }

  getFacilitiesByRequisitionId(id) {    
    this._service.get('room-facilities/get-list-by-roomid/'+id).subscribe(res => {
      let facilityArray = [];
      res.forEach(element => {  
        facilityArray.push(parseInt(element.id));
       });      
      this.entryForm.controls['facilities'].setValue(facilityArray);
    }, err => { }
    );
  }
  getImagesByRequisitionId(id) {  
    this.roomImageList  = [];  
    this._service.get('room-images/get-list-by-roomid/'+id).subscribe(res => {
      this.roomImageList  = res;
    }, err => { }
    );
  }

  getList() {
    this.loadingIndicator = true;
    this._service.get('requisitions').subscribe(res => {
      if (!res) {
        this.toastr.error(res.message, 'Error!', { closeButton: true, disableTimeOut: true });
        return;
      }
      this.rows = res;
      console.log(this.rows);
      // this.page.totalElements = res.Total;
      // this.page.totalPages = Math.ceil(this.page.totalElements / this.page.size);
      setTimeout(() => {
        this.loadingIndicator = false;
      }, 1000);
    }, err => {
      this.toastr.error(err.message || err, 'Error!', { closeButton: true, disableTimeOut: true });
      setTimeout(() => {
        this.loadingIndicator = false;
      }, 1000);
    }
    );
  }



  getItem(id, template: TemplateRef<any>) {
  //  this.blockUI.start('Getting data...');
    this._service.get('requisitions/' + id).subscribe(res => {
   //   this.blockUI.stop();
      if (!res) {
        this.toastr.error(res.message, 'Error!', { timeOut: 2000 });
        return;
      }
      this.modalTitle = 'Update Requisition';
      this.btnSaveText = 'Update';
      this.entryForm.controls['id'].setValue(res.id);
      this.entryForm.controls['name'].setValue(res.name);
      this.entryForm.controls['dormitory_id'].setValue(res.dormitory_id.id);
      this.getBuildingDropdownListByDormitoryId(res.dormitory_id.id);
      this.entryForm.controls['building_id'].setValue(res.building_id.id);
      this.getFloorDropdownListByBuildingId(res.building_id.id);
      this.entryForm.controls['floor_id'].setValue(res.floor_id.id);
      this.entryForm.controls['room_type'].setValue(res.room_type);
      this.entryForm.controls['gender_type'].setValue(res.gender_type);
      this.entryForm.controls['price'].setValue(res.price);
      this.entryForm.controls['is_civil'].setValue(res.Is_civil);
      this.getFacilitiesByRequisitionId(res.id);
      this.getImagesByRequisitionId(res.id);
      this.entryForm.controls['is_employee'].setValue(res.is_employee);
      this.entryForm.controls['description'].setValue(res.description);
      this.entryForm.controls['is_active'].setValue(res.is_active);
      this.modalRef = this.modalService.show(template, this.modalConfig);
    }, err => {
   //   this.blockUI.stop();
      this.toastr.error(err.message || err, 'Error!', { timeOut: 2000 });
    });
  }



  onFormSubmit() {
    this.submitted = true;
    if (this.entryForm.invalid) {
      return;
    }

    this.blockUI.start('Saving...');

    let formData = new FormData();
    for (let i = 0; i < this.files.length; i++) {
      formData.append('files', this.files[i], this.files[i].name);
    }

    const obj = {
      id: this.entryForm.value.id ? this.entryForm.value.id : 0,
      name: this.entryForm.value.name.trim(),
      dormitory_id: this.entryForm.value.dormitory_id,
      building_id: this.entryForm.value.building_id,
      floor_id: this.entryForm.value.floor_id,
      room_type: this.entryForm.value.room_type,
      gender_type: this.entryForm.value.gender_type,
      price: this.entryForm.value.price,
      Is_civil: this.entryForm.value.is_civil,
      is_employee: this.entryForm.value.is_employee,
      description: this.entryForm.value.description,
      is_active: this.entryForm.value.is_active
    };

    const main_obj ={
      room : obj,
      facilities: this.entryForm.value.facilities
    }

    const request = this._service.post('requisitions/create-or-update', main_obj);



    request.subscribe(
      data => {
     
        if (data) {
      
          this.blockUI.stop();

          if(this.urls.length){
          const request_upload = this._service.post('upload', formData);
          request_upload.subscribe(
            data_upload => {
              if (data_upload.length > 0) { 
                
                let images = [];
                data_upload.forEach(element => {
                  images.push(element.url);
                });

                const obj = {
                  room_id: data.record.id,                
                  images:images
                };

                const request_room_images = this._service.post('room-images/create-custom', obj);      
      
                request_room_images.subscribe(
                  room_image_data => {
                    this.blockUI.stop(); 
                    if (room_image_data) {
                      this.toastr.success(room_image_data.message, 'Success!', { timeOut: 2000 });
                      this.modalHide();
                      this.getList();
            
                    } else {
                      this.toastr.error(room_image_data, 'Error!', { closeButton: true, disableTimeOut: true });
                    }
                  },
                  err => {
                    this.blockUI.stop();
                    this.toastr.error(err.message || err, 'Error!', { closeButton: true, disableTimeOut: true });
                  }
                );            
                     
      
              } else {
                this.blockUI.stop();
                this.toastr.error(data_upload, 'Error!', { closeButton: true, disableTimeOut: true });
              }
            },
            err => {
              this.blockUI.stop();
              this.toastr.error(err.message || err, 'Error!', { closeButton: true, disableTimeOut: true });
            }
          );

          }else{
            this.toastr.success("Successfully Updated!", 'Success!', { timeOut: 2000 });
            this.modalHide();
            this.getList();
          }
         

        } else {
          this.toastr.error(data, 'Error!', { closeButton: true, disableTimeOut: true });
        }
      },
      err => {
        this.blockUI.stop();
        this.toastr.error(err.message || err, 'Error!', { closeButton: true, disableTimeOut: true });
      }
    );


  }


  rejectReq(item){

    this.confirmService.confirm('Are you sure?', 'You are reject this requisition.')
    .subscribe(
      result => {
        if (result) {
          this.blockUI.start('Rejecting...');
          const obj ={
            id:item.id,
            status:'Rejected'
          }
          this._service.post('requisitions/update-status', obj).subscribe(res => {
            this.blockUI.stop();
            if (!res.success) {
              this.toastr.error(res.message, 'Error!', { timeOut: 2000 });
              return;
            }
            this.getList();
            this.toastr.success(res.message, 'Success!', { timeOut: 2000 });

          }, err => {
            this.blockUI.stop();
            this.toastr.error(err.message || err, 'Error!', { timeOut: 2000 });
          });


        }
      },

    );

  }

  modalHide() {
    this.entryForm.reset();
    this.modalRef.hide();
    this.submitted = false;
    this.modalTitle = 'Create Requisition';
    this.btnSaveText = 'Save';
    this.urls = [];
    this.files = [];
    this.roomImageList = [];
  }

  openModal(template: TemplateRef<any>) {
    this.entryForm.controls['is_active'].setValue(true);
    this.modalRef = this.modalService.show(template, this.modalConfig);
  }
}
