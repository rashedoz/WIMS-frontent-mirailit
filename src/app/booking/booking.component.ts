import { Component, TemplateRef, ViewChild, ElementRef, ViewEncapsulation, OnInit } from '@angular/core';
import { AuthenticationService } from './../_services/authentication.service';
import { CommonService } from './../_services/common.service';
import { ToastrService } from 'ngx-toastr';
import { Router, ActivatedRoute } from '@angular/router';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BsDatepickerConfig } from 'ngx-bootstrap/datepicker';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { Page } from './../_models/page';

@Component({
    selector: 'app-booking',
    templateUrl: './booking.component.html',
    styleUrls: ['./booking.component.css'],
    encapsulation: ViewEncapsulation.None
})

export class BookingComponent implements OnInit {

    isReqDisabled = false;
    submitted = false;
    searchForm: FormGroup;
    submitBookingForm: FormGroup;
    userFrom: FormGroup;
    pendingReqList = [];
    userList = [];
    roomList = [];
    bookRooms = []
    bookRoomsView = []
    requisitionId = null;
    selectedRequisition_id = null;
    selectedRequisitionObj = null;
    public currentUser: any;
    @BlockUI() blockUI: NgBlockUI;
    bsConfig: Partial<BsDatepickerConfig>;
    roomTypeList = [
        { id: "Single", name: "Single" },
        { id: "Double", name: "Double" },
        { id: "Shared", name: "Shared" },
        { id: "Apartment", name: "Apartment" }
    ]

    roomType = [];
    allowType = [];
    totalDays = 0;

    modalTitle = 'Add User';
    btnSaveText = 'Save';
    paybleAmount = 0;

    modalConfig: any = { class: 'gray modal-md', backdrop: 'static' };
    modalRef: BsModalRef;
    page = new Page();

    constructor(
        private authService: AuthenticationService,
        private toastr: ToastrService,
        private router: Router,
        private route: ActivatedRoute,
        public formBuilder: FormBuilder,
        private _service: CommonService,
        private modalService: BsModalService,
    ) {
        this.currentUser = this.authService.currentUserDetails.value;

        this.page.pageNumber = 0;
        this.page.size = 10;

        this.requisitionId = this.route.snapshot.paramMap.get("requisition_id");
        this.bsConfig = Object.assign({}, {
            dateInputFormat: 'DD-MMM-YYYY ',
            rangeInputFormat: 'DD-MMM-YYYY ',
            isAnimated: true,
            adaptivePosition: true
        });
    }

    ngOnInit() {

        this.searchForm = this.formBuilder.group({
            user: [null],
            dateRange: [null, [Validators.required]],
            room_type: [null, [Validators.required]]
        });

        this.submitBookingForm = this.formBuilder.group({
            Id: [null],
            VisitorId: [null, [Validators.required]],
            RequisitionId: [null],
            FromDate: [null, [Validators.required]],
            ToDate: [null, [Validators.required]],
            Rooms: [null, [Validators.required]]
        });

        this.userFrom = this.formBuilder.group({
            Id: [null],
            FullName: [null, [Validators.required]],
            PhoneNo: [null, [Validators.required]],
            Address: [null, [Validators.required]],
            BPID: [null],
            Email: [null],
            IsActive: true
        });

        this.getUserList();
        this.getRoomTypeList();
        this.getAllowTypeList();
        // this.getRoomList();
        //this.getPendingRequisitionList();

    }

    setPage(pageInfo) {
        this.page.pageNumber = pageInfo.offset;
        //this.getList();
    }

    get s() {
        return this.searchForm.controls;
    }

    get f() {
        return this.userFrom.controls;
    }

    getUserList() {
        this.userList = [];
        this._service.get('visitor/dropdown-list').subscribe(res => {
            this.userList = res.Records;
        }, err => { }
        );
    }

    getRoomTypeList() {
        this._service.get('room/room-type/dropdown-list').subscribe(res => {
            this.roomType = res;
            this.submitted = false;
        }, err => { }
        );
    }

    getAllowTypeList() {
        this._service.get('room/room-gender-type/dropdown-list').subscribe(res => {
            //console.log(res);
            this.allowType = res.Records;
            this.submitted = false;
        }, err => { }
        );
    }

    getRoomList() {
        this.blockUI.start('Searching...');
        this.roomList = [];

        const searchParam = {
            FromDate: this.searchForm.value.dateRange[0],
            ToDate: this.searchForm.value.dateRange[1],
            RoomType: this.searchForm.value.room_type
        }
        
        let Difference_In_Time = this.searchForm.value.dateRange[1].getTime() - this.searchForm.value.dateRange[0].getTime();
        let Difference_In_Days = Difference_In_Time / (1000 * 3600 * 24);
        this.totalDays = Difference_In_Days;

        this._service.post('booking/get-available-room-list', searchParam).subscribe(res => {
            this.roomList = res.Records;
            this.blockUI.stop();
            this.submitted = false;
        }, err => { }
        );
    }

    addRemoveRoom(room) {
        if (this.bookRooms.indexOf(room.Id) == -1) {
            this.bookRooms.push(room.Id);
            this.bookRoomsView.push(room);
        } else {
            this.bookRooms.splice(this.bookRooms.indexOf(room.Id), 1);
            this.bookRoomsView = [];
            this.roomList.forEach((value, key) => {
                console.log(value);
                this.bookRooms.forEach((data, index) => {
                    if (value.Id == data) {
                        this.bookRoomsView.push(value);
                    }
                });
            });
        }
        this.calculeteTotal();
    }

    calculeteTotal() {
        this.paybleAmount = 0;
        this.bookRoomsView.forEach((value, key) => {
            this.paybleAmount = this.paybleAmount + (value.Price * this.totalDays);
        });
    }

    getPendingRequisitionList() {
        this.pendingReqList = [];
        this._service.get('requisitions/pending-dropdownList').subscribe(res => {
            this.pendingReqList = res;
            if (this.requisitionId) {
                this.selectedRequisition_id = parseInt(this.requisitionId);
                let reqObj = this.pendingReqList.find((x) => x.id == this.selectedRequisition_id);
                this.onChangeRequisition(reqObj);
                this.isReqDisabled = true;
            }
        }, err => { }
        );
    }

    onChangeRequisition(e) {

        this.searchForm.controls['room_type'].enable();
        this.searchForm.controls['user'].enable();
        this.bsConfig.minDate = null;
        this.bsConfig.maxDate = null;
        this.roomList = [];
        this.searchForm.reset();
        if (e) {
            this.selectedRequisitionObj = e;
            this.bsConfig.minDate = new Date(this.selectedRequisitionObj.from_date);
            this.bsConfig.maxDate = new Date(this.selectedRequisitionObj.to_date);
            let dateRangePickerValue = [new Date(this.selectedRequisitionObj.from_date), new Date(this.selectedRequisitionObj.to_date)];
            this.searchForm.controls['dateRange'].setValue(dateRangePickerValue);
            this.searchForm.controls['room_type'].setValue(e.room_type);
            this.searchForm.controls['room_type'].disable();
            this.searchForm.controls['user'].setValue(e.web_user_id.id);
            this.searchForm.controls['user'].disable();

        }
    }

    searchRoom() {
        this.submitted = true;
        if (this.searchForm.invalid) {
            return;
        }
        this.getRoomList();
    }

    addUserSubmit() {

        if (this.userFrom.invalid) {
            return;
        }

        this.blockUI.start('Saving...');

        const obj = {
            Id: this.userFrom.value.Id ? this.userFrom.value.Id : 0,
            FullName: this.userFrom.value.FullName.trim(),
            PhoneNo: this.userFrom.value.PhoneNo.trim(),
            Email: this.userFrom.value.Email.trim(),
            Address: this.userFrom.value.Address.trim(),
            BPID: this.userFrom.value.BPID.trim(),
            IsActive: true
        };

        const request = this._service.post('visitor/create-or-update', obj);

        request.subscribe(
            data => {
                this.blockUI.stop();
                if (data.Success) {
                    this.modalHide();
                    this.toastr.success(data.Message, 'Success!', { timeOut: 2000 });
                    this.getUserList();
                    this.searchForm.controls['user'].setValue(data.Id);
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

    onBookingSubmit() {

        const submitObj = {
            Id: 0,
            VisitorId: this.searchForm.value.user,
            RequisitionId: 0,
            FromDate: this.searchForm.value.dateRange[0],
            ToDate: this.searchForm.value.dateRange[1],
            Rooms: this.bookRooms
        }

        if (!submitObj.VisitorId) {
            this.toastr.error("Please select User!", 'Error!', { closeButton: true, disableTimeOut: true });
            return;
        }
        if (!submitObj.Rooms.length) {
            this.toastr.error("Please select Room!", 'Error!', { closeButton: true, disableTimeOut: true });
            return;
        }

        console.log(submitObj);
        const request = this._service.post('booking/create-or-update', submitObj);

        request.subscribe(
            data => {
                this.blockUI.stop();
                if (data.Success) {
                    this.toastr.success('Successfully Saved', 'Success!', { timeOut: 2000 });
                    this.router.navigate(['/booking-list']);
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

    onFormSubmit(room) {
        //    this.blockUI.start('Saving...');

        let formValue = this.searchForm.getRawValue();

        const obj = {
            room_id: room.id,
            bp_user_id: formValue.user,
            requisition_id: this.requisitionId,
            from_date: formValue.dateRange[0],
            to_date: formValue.dateRange[1],
            status: "Pending"
        };

        const request = this._service.post('bookings/create-custom', obj);

        request.subscribe(
            data => {
                this.blockUI.stop();
                if (data.Successs) {
                    this.toastr.success('Successfully Saved', 'Success!', { timeOut: 2000 });
                    this.router.navigate[('/booking-list')];
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
        this.userFrom.reset();
        this.modalRef.hide();
        this.submitted = false;
        this.modalTitle = 'Add User';
        this.btnSaveText = 'Save';
    }

    openModal(template: TemplateRef<any>) {
        this.modalRef = this.modalService.show(template, this.modalConfig);
    }


}




