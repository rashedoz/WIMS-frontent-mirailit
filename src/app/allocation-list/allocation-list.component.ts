import {
    Component,
    TemplateRef,
    ViewChild,
    ElementRef,
    ViewEncapsulation,
    OnInit
} from '@angular/core';
import {
    BsModalService,
    BsModalRef
} from 'ngx-bootstrap/modal';
import {
    ColumnMode,
    DatatableComponent
} from '@swimlane/ngx-datatable';
import {
    FormBuilder,
    FormGroup,
    Validators
} from '@angular/forms';
import {
    Router
} from '@angular/router';
import {
    CommonService
} from './../_services/common.service';
import {
    ToastrService
} from 'ngx-toastr';
import {
    BlockUI,
    NgBlockUI
} from 'ng-block-ui';
import {
    Page
} from './../_models/page';
import {
    ConfirmService
} from '../_helpers/confirm-dialog/confirm.service';
import * as moment from 'moment';
import {
    ThemePalette
} from '@angular/material/core';


@Component({
    selector: 'app-allocation-list',
    templateUrl: './allocation-list.component.html',
    encapsulation: ViewEncapsulation.None
})

export class AllocationListComponent implements OnInit {

    //@ViewChild(DatatableComponent, { static: false }) table: DatatableComponent;
    entryForm: FormGroup;
    submitted = false;
    @BlockUI() blockUI: NgBlockUI;
    modalTitle = 'Check In/Out';
    btnSaveText = 'Save';

    expanded: any = {};
    @ViewChild('dataTable', { static: false }) table: any;

    modalConfig: any = {
        class: 'gray modal-xl',
        backdrop: 'static'
    };
    modalRef: BsModalRef;

    page = new Page();
    temp = [];
    rows = [];
    loadingIndicator = false;
    ColumnMode = ColumnMode;
    allocationID = null;

    bookingRooms = [];
    checkRooms = []

    scrollBarHorizontal = (window.innerWidth < 1200);

    public date: moment.Moment;
    public checkInDisabled = false;
    public checkOutDisabled = false;
    public showSpinners = true;
    public showSeconds = false;
    public touchUi = true;
    public enableMeridian = true;
    public minDate: moment.Moment;
    public maxDate: moment.Moment;
    public stepHour = 1;
    public stepMinute = 1;
    public stepSecond = 1;
    public color: ThemePalette = 'primary';

    constructor(
        private modalService: BsModalService,
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
        this.getList();

        this.entryForm = this.formBuilder.group({

            id: [null, [Validators.required]],
            name: [null, [Validators.required]],
            room_no: [null, [Validators.required]],
            room_type: [null, [Validators.required]],
            check_in: [null, [Validators.required]],
            check_out: [null, [Validators.required]]

        });

    }

    setPage(pageInfo) {
        this.page.pageNumber = pageInfo.offset;
        this.getList();
    }

    get f() {
        return this.entryForm.controls;
    }

    getList() {
        this.loadingIndicator = true;
        const obj = {
            size: this.page.size,
            pageNumber: this.page.pageNumber
        };
        this._service.get('allocation/list', obj).subscribe(res => {
            if (!res.Success) {
                this.toastr.error(res.Message, 'Error!', {
                    closeButton: true,
                    disableTimeOut: true
                });
                return;
            }
            this.rows = res.Records;
            this.temp = res.Records;
            setTimeout(() => {
                this.loadingIndicator = false;
            }, 1000);
        }, err => {
            this.toastr.error(err.message || err, 'Error!', {
                closeButton: true,
                disableTimeOut: true
            });
            setTimeout(() => {
                this.loadingIndicator = false;
            }, 1000);
        });
    }

    addRemoveRoom(room) {
        if (this.checkRooms.indexOf(room.RoomId) == -1) {
            this.checkRooms.push(room.RoomId);
        } else {
            this.checkRooms.splice(this.checkRooms.indexOf(room.RoomId), 1);
        }

        console.log(this.checkRooms);
    }

    checkInRoom(room){
        this.checkRooms = [];
        this.checkRooms.push(room.RoomId);
        this.submitCheckIn();
    }

    checkOutRoom(room){
        this.checkRooms = [];
        this.checkRooms.push(room.RoomId);
        this.submitCheckOut();
    }

    getUpdatedRooms(Id) {
        this.allocationID = Id;
        this.checkRooms = [];
        this._service.get('allocation/details/' + Id).subscribe(res => {
            this.bookingRooms = res.Record;
            
        }, err => { });
    }

    getBookingRooms(Id, template) {
        this.allocationID = Id;
        this.checkRooms = [];
        this._service.get('allocation/details/' + Id).subscribe(res => {
            this.bookingRooms = res.Record;
            this.bookingRooms.forEach((value, key) => {
                if(!value.CheckIn)
                    this.checkRooms.push(value.RoomId);
            });
            this.modalRef = this.modalService.show(template, this.modalConfig);
        }, err => { });
    }

    getItem(type, item, template: TemplateRef<any>) {

        this._service.get('allocations/' + item.id).subscribe(res => {
            //   this.blockUI.stop();
            if (!res) {
                this.toastr.error(res.message, 'Error!', {
                    timeOut: 2000
                });
                return;
            }
            this.checkInDisabled = false;
            this.checkOutDisabled = false;
            this.entryForm.controls['check_in'].enable();
            this.entryForm.controls['check_out'].enable();

            console.log(res);
            this.entryForm.controls['id'].setValue(res.id);
            this.entryForm.controls['name'].disable();
            this.entryForm.controls['room_no'].disable();
            this.entryForm.controls['room_type'].disable();

            this.entryForm.controls['name'].setValue(res.bp_user_id.full_name);
            this.entryForm.controls['room_no'].setValue(res.room_id.name);
            this.entryForm.controls['room_type'].setValue(res.room_id.room_type);
            this.entryForm.controls['check_in'].setValue(res.check_in_date_time);
            this.entryForm.controls['check_out'].setValue(res.check_out_date_time);

            if (type == 'CheckIn') {

                this.checkOutDisabled = true;

                this.entryForm.controls['check_out'].disable();
                this.entryForm.get('check_out').setValidators(null);
                this.entryForm.get('check_out').updateValueAndValidity();
                this.modalTitle = 'Check In';
                this.btnSaveText = 'Check In';
            } else {
                this.checkInDisabled = true;
                this.entryForm.controls['check_in'].disable();
                this.entryForm.get('check_in').setValidators(null);
                this.entryForm.get('check_in').updateValueAndValidity();
                this.modalTitle = 'Check Out';
                this.btnSaveText = 'Check Out';
            }
            this.modalRef = this.modalService.show(template, this.modalConfig);
        }, err => {
            this.toastr.error(err.message || err, 'Error!', {
                timeOut: 2000
            });
        });

    }


    submitCheckIn(){
        if(this.checkRooms.length){
            const request = this._service.post('allocation/check-in?id=' + this.allocationID, this.checkRooms);

            request.subscribe(
                data => {
                    this.blockUI.stop();
                    if (data) {
                        this.toastr.success('Successfully Checked In', 'Success!', {
                            timeOut: 2000
                        });
                        //this.modalHide();
                        //this.getList();
                        this.getUpdatedRooms(this.allocationID);
                    } else {
                        this.toastr.error(data, 'Error!', {
                            closeButton: true,
                            disableTimeOut: true
                        });
                    }
                },
                err => {
                    this.blockUI.stop();
                    this.toastr.error(err.message || err, 'Error!', {
                        closeButton: true,
                        disableTimeOut: true
                    });
                }
            );

        }else{
            this.toastr.error('Please, select room!', 'Error!', { closeButton: true, disableTimeOut: true });
        }
    }

    submitCheckOut(){
        if(this.checkRooms.length){
            const request = this._service.post('allocation/check-out?id=' + this.allocationID, this.checkRooms);

            request.subscribe(
                data => {
                    this.blockUI.stop();
                    if (data) {
                        this.toastr.warning('Successfully Checked Out', 'Success!', {
                            timeOut: 2000
                        });
                        //this.modalHide();
                        this.getUpdatedRooms(this.allocationID);
                    } else {
                        this.toastr.error(data, 'Error!', {
                            closeButton: true,
                            disableTimeOut: true
                        });
                    }
                },
                err => {
                    this.blockUI.stop();
                    this.toastr.error(err.message || err, 'Error!', {
                        closeButton: true,
                        disableTimeOut: true
                    });
                }
            );

        }else{
            this.toastr.error('Please, select room!', 'Error!', { closeButton: true, disableTimeOut: true });
        }
    }

    onFormSubmitCheckInOut(){

        if(this.checkRooms.length){
            const request = this._service.post('allocation/check-in?id=' + this.allocationID, this.checkRooms);

            request.subscribe(
                data => {
                    this.blockUI.stop();
                    if (data) {
                        this.toastr.success('Successfully Saved', 'Success!', {
                            timeOut: 2000
                        });
                        this.modalHide();
                        this.getList();
                    } else {
                        this.toastr.error(data, 'Error!', {
                            closeButton: true,
                            disableTimeOut: true
                        });
                    }
                },
                err => {
                    this.blockUI.stop();
                    this.toastr.error(err.message || err, 'Error!', {
                        closeButton: true,
                        disableTimeOut: true
                    });
                }
            );

        }else{
            this.toastr.error('Please, select room!', 'Error!', { closeButton: true, disableTimeOut: true });
        }
    }


    onFormSubmit() {
        this.submitted = true;
        if (this.entryForm.invalid) {
            return;
        }

        // this.blockUI.start('Saving...');
        const formValue = this.entryForm.getRawValue();
        const obj = {
            id: this.entryForm.value.id,
            check_in_date_time: formValue.check_in != null ? formValue.check_in._d != undefined ? formValue.check_in._d : formValue.check_in : null,
            check_out_date_time: formValue.check_out != null ? formValue.check_out._d != undefined ? formValue.check_out._d : formValue.check_out : null,
        };

        const request = this._service.post('allocations/check-in-check-out', obj);

        request.subscribe(
            data => {
                this.blockUI.stop();
                if (data) {
                    this.toastr.success('Successfully Saved', 'Success!', {
                        timeOut: 2000
                    });
                    this.modalHide();
                    this.getList();
                } else {
                    this.toastr.error(data, 'Error!', {
                        closeButton: true,
                        disableTimeOut: true
                    });
                }
            },
            err => {
                this.blockUI.stop();
                this.toastr.error(err.message || err, 'Error!', {
                    closeButton: true,
                    disableTimeOut: true
                });
            }
        );

    }


    updateFilter(event) {
        const val = event.target.value.toLowerCase();

        // filter our data
        const temp = this.temp.filter(function (d) {
            return d.bp_user_id.full_name.toLowerCase().indexOf(val) !== -1 ||
                d.room_id.name.toLowerCase().indexOf(val) !== -1 ||
                !val;
        });

        // update the rows
        this.rows = temp;
        // Whenever the filter changes, always go back to the first page
        this.table.offset = 0;
    }

    modalHide() {
        this.entryForm.reset();
        this.modalRef.hide();
        this.submitted = false;
        this.modalTitle = 'Check In/Out';
        this.btnSaveText = 'Save';
    }

    openModal(template: TemplateRef<any>) {
        this.modalTitle = 'Check In/Out';
        this.btnSaveText = 'Save';
        this.modalRef = this.modalService.show(template, this.modalConfig);
    }
    
    toggleExpandRow(row) {
        if (!row.details) {
            this._service.get('allocation/details/' + row.Id).subscribe(res => {
            if (!res.Success) {
                this.toastr.error(res.Message, 'Error!', { closeButton: true, disableTimeOut: true });
                return;
            }
            row.details = res.Record;
            this.table.rowDetail.toggleExpandRow(row);
            });
        } else
            this.table.rowDetail.toggleExpandRow(row);
    }

    getDateTimeFormat(value:Date){
        return moment(value).format('DD-MMM-YYYY hh:mm A');
    }

}
