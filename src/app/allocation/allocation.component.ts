import { Component, TemplateRef, OnInit, ViewEncapsulation } from '@angular/core';
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
    selector: 'app-allocation',
    templateUrl: './allocation.component.html',
    styleUrls: ['./allocation.component.css'],
    encapsulation: ViewEncapsulation.None
})

export class AllocationComponent implements OnInit {

    isBookingDisabled = false;
    submitted = false;
    searchForm: FormGroup;
    pendingBookingList = [];
    userList = [];
    roomList = [];
    bookingId = null;
    totalDays = 0;
    selectedBooking_id = null;
    selectedBookingObj = null;
    public currentUser: any;
    @BlockUI() blockUI: NgBlockUI;
    modalTitle = 'Create Course Title';
    btnSaveText = 'Save';
    bsConfig: Partial<BsDatepickerConfig>;
    roomTypeList = [
        { id: "Single", name: "Single" },
        { id: "Double", name: "Double" },
        { id: "Shared", name: "Shared" },
        { id: "Apartment", name: "Apartment" }
    ]

    roomType = [];

    modalConfig: any = { class: 'gray modal-lg', backdrop: 'static' };
    modalRef: BsModalRef;

    subTotal: number = 0;
    discount: number = 0;
    paidAmount: number = 0;

    bookingRooms = [];
    paybleAmount = 0;
    submitRooms = [];

    day_count = 0;
    room;

    page = new Page();

    constructor(
        private authService: AuthenticationService,
        private toastr: ToastrService,
        private router: Router,
        private modalService: BsModalService,
        private route: ActivatedRoute,
        public formBuilder: FormBuilder,
        private _service: CommonService
    ) {
        this.currentUser = this.authService.currentUserDetails.value;
        this.page.pageNumber = 0;
        this.page.size = 10;
        this.bookingId = this.route.snapshot.paramMap.get("booking_id");
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

        this.getUserList();
        // this.getRoomList();
        this.getRoomTypeList();
        this.getPendingBookingList();
    }

    get s() {
        return this.searchForm.controls;
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
    getPendingBookingList() {
        const obj = {
            size: this.page.size,
            pageNumber: this.page.pageNumber
        };
        this.pendingBookingList = [];
        this._service.get('booking/list', obj).subscribe(res => {
            this.pendingBookingList = res.Records;
            if (this.bookingId) {
                //this.selectedBooking_id = parseInt(this.bookingId);
                this.selectedBooking_id = this.bookingId;
                let reqObj = this.pendingBookingList.find((x) => x.Id == this.selectedBooking_id);
                this.onChangeBooking(reqObj);
                this.isBookingDisabled = true;
            }
        }, err => { }
        );
    }

    onChangeBooking(e) {
        this.searchForm.controls['room_type'].enable();
        this.searchForm.controls['user'].enable();
        this.bsConfig.minDate = null;
        this.bsConfig.maxDate = null;
        this.roomList = [];
        this.searchForm.reset();
        if (e) {
            this.selectedBookingObj = e;
            // this.bsConfig.minDate = new Date(this.selectedBookingObj.from_date);
            // this.bsConfig.maxDate = new Date(this.selectedBookingObj.to_date);
            let dateRangePickerValue = [new Date(this.selectedBookingObj.FromDate), new Date(this.selectedBookingObj.ToDate)];
            this.searchForm.controls['dateRange'].setValue(dateRangePickerValue);
            // this.searchForm.controls['room_type'].setValue(e.room_type);
            // this.searchForm.controls['room_type'].disable();
            this.searchForm.controls['user'].setValue(e.VisitorId);
            this.searchForm.controls['user'].disable();

            let Difference_In_Time = this.searchForm.value.dateRange[1].getTime() - this.searchForm.value.dateRange[0].getTime();
            let Difference_In_Days = Difference_In_Time / (1000 * 3600 * 24);
            console.log(Difference_In_Days)
            this.selectedBookingObj.day_count = Difference_In_Days;
            //this.calculation();
            this.getBookingRooms(this.selectedBookingObj.Id);
        }
    }

    getBookingRooms(Id){
        this._service.get('booking/get/' + Id).subscribe(res => {
            this.bookingRooms = res.Record.Rooms;
            this.calculeteTotal();
        }, err => { }
        );
    }

    calculeteTotal() {
        this.paybleAmount = 0;
        this.bookingRooms.forEach((value, key) => {
            this.paybleAmount = this.paybleAmount + (value.Price * this.selectedBookingObj.day_count);
        });
    }

    searchRoom() {
        this.submitted = true;
        if (this.searchForm.invalid) {
            return;
        }

        this.getRoomList();
    }


    onAllocationSubmit() {
        this.blockUI.start('Saving...');
        this.bookingRooms.forEach((value, key) => {
            this.submitRooms.push(value.Id)
        });

        const obj = {
            Id: null,
            VisitorId: this.selectedBookingObj.VisitorId,
            BookingId: this.selectedBookingObj.Id,
            FromDate: new Date(this.selectedBookingObj.FromDate),
            ToDate: new Date(this.selectedBookingObj.ToDate),
            SubTotal: this.paybleAmount,
            NoOfDays: this.selectedBookingObj.day_count,
            Discount: this.discount,
            NetTotal: this.paybleAmount - this.discount,
            Paid: this.paidAmount,
            Due: this.paybleAmount - this.discount - this.paidAmount,
            Rooms: this.submitRooms
        };

        const request = this._service.post('allocation/create-or-update', obj);

        request.subscribe(
            data => {
                this.blockUI.stop();
                if (data.Success) {
                    this.toastr.success('Successfully Saved', 'Success!', { timeOut: 2000 });
                    this.router.navigate(['/allocation-list']);
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


    allocate(item) {
        let Difference_In_Time = this.searchForm.value.dateRange[1].getTime() - this.searchForm.value.dateRange[0].getTime();
        let Difference_In_Days = Difference_In_Time / (1000 * 3600 * 24);
        if (this.bookingId) {
            this.selectedBookingObj.day_count = Difference_In_Days;
            this.selectedBookingObj.room_id = item;
        } else {
            this.selectedBookingObj = {};
            this.selectedBookingObj.day_count = Difference_In_Days;
            this.selectedBookingObj.room_id = item;
        }
        this.calculation();
    }

    calculation() {
        this.subTotal = this.selectedBookingObj.room_id.price * this.selectedBookingObj.day_count;
    }


    modalHide() {

        this.modalRef.hide();
        this.submitted = false;
        this.modalTitle = 'Create Course Title';
        this.btnSaveText = 'Save';
    }

    openModal(template: TemplateRef<any>) {
        // this.entryForm.controls['isActive'].setValue(true);
        this.modalRef = this.modalService.show(template, this.modalConfig);
    }


    onChangeDiscount(value) {
        if (parseFloat(value) > this.paybleAmount) {
            this.discount = this.paybleAmount;
        }
    }

    onChangePaid(value) {
        if (parseFloat(value) > this.paybleAmount - this.discount) {
            this.paidAmount = this.paybleAmount - this.discount;
        }
    }

}




