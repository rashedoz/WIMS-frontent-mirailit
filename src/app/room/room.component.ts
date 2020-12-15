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

@Component({
  selector: 'app-room',
  templateUrl: './room.component.html',
  encapsulation: ViewEncapsulation.None
})

export class RoomComponent implements OnInit {

  entryForm: FormGroup;
  submitted = false;
  @BlockUI() blockUI: NgBlockUI;
  modalTitle = 'Add Room';
  btnSaveText = 'Save';

  modalConfig: any = { class: 'gray modal-xl', backdrop: 'static' };
  modalRef: BsModalRef;

  page = new Page();
  emptyGuid = '00000000-0000-0000-0000-000000000000';

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
    {id:"Couple",name:"Couple"},
    {id:"Family",name:"Family"},
    {id:"Both",name:"Both"}
  ]

  scrollBarHorizontal = (window.innerWidth < 1200);

  constructor(
    private modalService: BsModalService,
    private el: ElementRef,
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
      Id: [null],
      Name: [null, [Validators.required, Validators.maxLength(250)]],
      DormitoryId: [null, [Validators.required]],
      BuildingId: [null, [Validators.required]],
      FloorId: [null, [Validators.required]],
      RoomType: [null, [Validators.required]],
      RoomGenderType: [null, [Validators.required]],
      Facilities: [null, [Validators.required]],
      Price: [null, [Validators.required]],
      IsCivil: [false],
      IsEmployee: [false],
      Description: [null],
      IsActive: [true]

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
    this._service.get('facility/dropdown-list').subscribe(res => {
      this.facilitiesDropDownList = res.Records;
    }, err => { }
    );
  }

  getDormitoryDropdownList() {   
    const obj = {
      size: this.page.size,
      pageNumber: this.page.pageNumber
    };
    this._service.get('dormitory/list', obj).subscribe(res => {
      this.dormitoryDropDownList = res.Records;
    }, err => { }
    );
  }

  onDormitoryChange(e){   
    this.entryForm.controls['BuildingId'].setValue(null);
    this.entryForm.controls['FloorId'].setValue(null);
    if(e){
      this.getBuildingDropdownListByDormitoryId(e.Id);
    }
  }

  getBuildingDropdownListByDormitoryId(id) {  
    this.buildingDropDownList = []; 
    this._service.get('building/dropdown-list/'+id).subscribe(res => {
      this.buildingDropDownList = res.Records;
    }, err => { }
    );
  }


  onBuildingChange(e){  
    this.entryForm.controls['FloorId'].setValue(null);
    if(e){
      this.getFloorDropdownListByBuildingId(e.Id);
    }
  }

  
  getFloorDropdownListByBuildingId(id) { 
    this.floorDropDownList = []; 
    this._service.get('floor/dropdown-list/'+id).subscribe(res => {
      this.floorDropDownList = res.Records;
    }, err => { }
    );
  }

  getFacilitiesByRoomId(id) {    
    this._service.get('room-facilities/get-list-by-roomid/'+id).subscribe(res => {
      let facilityArray = [];
      res.forEach(element => {  
        facilityArray.push(parseInt(element.id));
       });      
      this.entryForm.controls['facilities'].setValue(facilityArray);
    }, err => { }
    );
  }
  getImagesByRoomId(id) {  
    this.roomImageList  = [];  
    this._service.get('room-images/get-list-by-roomid/'+id).subscribe(res => {
      this.roomImageList  = res;
    }, err => { }
    );
  }

  getList() {
    this.loadingIndicator = true;
    const obj = {
      size: this.page.size,
      pageNumber: this.page.pageNumber
    };
    this._service.get('room/list', obj).subscribe(res => {
      if (!res.Success) {
        this.toastr.error(res.Message, 'Error!', { closeButton: true, disableTimeOut: true });
        return;
      }
      this.rows = res.Records;
      console.log(this.rows);
      setTimeout(() => {
        this.loadingIndicator = false;
      }, 1000);
    }, err => {
      this.toastr.error(err.Message || err, 'Error!', { closeButton: true, disableTimeOut: true });
      setTimeout(() => {
        this.loadingIndicator = false;
      }, 1000);
    }
    );
  }



  getItem(id, template: TemplateRef<any>) {
  //  this.blockUI.start('Getting data...');

    this._service.get('room/get/' + id).subscribe(res => {
      
   //   this.blockUI.stop();
      if (!res) {
        this.toastr.error(res.Message, 'Error!', { timeOut: 2000 });
        return;
      }





      // Id: [null],
      // Name: [null, [Validators.required, Validators.maxLength(250)]],
      // DormitoryId: [null, [Validators.required]],
      // BuildingId: [null, [Validators.required]],
      // FloorId: [null, [Validators.required]],
      // RoomType: [null, [Validators.required]],
      // RoomGenderType: [null, [Validators.required]],
      // Facilities: [null, [Validators.required]],
      // Price: [null, [Validators.required]],
      // IsCivil: [false],
      // IsEmployee: [false],
      // Description: [null],
      // IsActive: [true]






      this.modalTitle = 'Update Room';
      this.btnSaveText = 'Update';
      this.entryForm.controls['Id'].setValue(res.Record.Id);
      this.entryForm.controls['Name'].setValue(res.Record.Name);
      this.entryForm.controls['DormitoryId'].setValue(res.Record.DormitoryId);
      this.getBuildingDropdownListByDormitoryId(res.Record.DormitoryId);
      this.entryForm.controls['BuildingId'].setValue(res.Record.BuildingId);
      this.getFloorDropdownListByBuildingId(res.Record.BuildingId);
      this.entryForm.controls['FloorId'].setValue(res.Record.FloorId);
      this.entryForm.controls['Facilities'].setValue(res.Record.Facilities);
      this.entryForm.controls['RoomType'].setValue(res.Record.RoomType);
      this.entryForm.controls['RoomGenderType'].setValue(res.Record.RoomGenderType);
      this.entryForm.controls['Price'].setValue(res.Record.Price);
      this.entryForm.controls['IsCivil'].setValue(res.Record.IsCivil);
      // this.getFacilitiesByRoomId(res.Record.Id);
      // this.getImagesByRoomId(res.Record.Id);
      this.roomImageList = res.Record.ImagePaths;
      this.entryForm.controls['IsEmployee'].setValue(res.Record.IsEmployee);
      this.entryForm.controls['Description'].setValue(res.Record.Description);
      this.entryForm.controls['IsActive'].setValue(res.Record.IsActive);
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

    const formData = new FormData();

    for (let i = 0; i < this.files.length; i++) {
      formData.append('file' + i, this.files[i], this.files[i].name);
    }

    const obj = {
      Id: this.entryForm.value.Id ? this.entryForm.value.Id : this.emptyGuid,
      Name: this.entryForm.value.Name.trim(),
      DormitoryId: this.entryForm.value.DormitoryId,
      BuildingId: this.entryForm.value.BuildingId,
      FloorId: this.entryForm.value.FloorId,
      RoomType: this.entryForm.value.RoomType,
      RoomGenderType: this.entryForm.value.RoomGenderType,
      Price: this.entryForm.value.Price,
      IsCivil: this.entryForm.value.IsCivil,
      IsEmployee: this.entryForm.value.IsEmployee,
      Description: this.entryForm.value.Description,
      IsActive: this.entryForm.value.IsActive,
      Facilities: this.entryForm.value.Facilities
    };

    formData.append('obj', JSON.stringify(obj));

    // console.log(formData);
    // return;

    const request = this._service.post('room/create-or-update', formData);

    request.subscribe(
      data => {
        this.blockUI.stop(); 
        if (data.Success) {
          this.toastr.success(data.Message, 'Success!', { timeOut: 2000 });
          this.getList();
          this.modalHide();
        } else {
          this.toastr.error(data.Message, 'Error!', { closeButton: true, disableTimeOut: true });
        }
      },
      err => {
        this.blockUI.stop();
        this.toastr.error(err.Message || err, 'Error!', { closeButton: true, disableTimeOut: true });
      }
    );

  }

  modalHide() {
    this.entryForm.reset();
    this.modalRef.hide();
    this.submitted = false;
    this.modalTitle = 'Add Room';
    this.btnSaveText = 'Save';
    this.urls = [];
    this.files = [];
    this.roomImageList = [];
  }

  openModal(template: TemplateRef<any>) {
    this.entryForm.controls['IsActive'].setValue(true);
    this.modalRef = this.modalService.show(template, this.modalConfig);
  }
}
