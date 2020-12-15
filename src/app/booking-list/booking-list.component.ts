import { Component, TemplateRef, ViewChild, ElementRef, ViewEncapsulation, OnInit } from '@angular/core';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { ColumnMode } from '@swimlane/ngx-datatable';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonService } from './../_services/common.service';
import { ToastrService } from 'ngx-toastr';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { Page } from './../_models/page';
import { ConfirmService } from '../_helpers/confirm-dialog/confirm.service';

@Component({
    selector: 'app-booking-list',
    templateUrl: './booking-list.component.html',
    encapsulation: ViewEncapsulation.None
})

export class BookingListComponent implements OnInit {

    entryForm: FormGroup;
    submitted = false;
    @BlockUI() blockUI: NgBlockUI;
    modalTitle = '';
    btnSaveText = 'Save';

    modalConfig: any = { class: 'gray modal-lg', backdrop: 'static' };
    modalRef: BsModalRef;

    page = new Page();

    rows = [];
    loadingIndicator = false;
    ColumnMode = ColumnMode;

    scrollBarHorizontal = (window.innerWidth < 1200);

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
    }

    setPage(pageInfo) {
        this.page.pageNumber = pageInfo.offset;
        this.getList();
    }

    getList() {
        const obj = {
            size: this.page.size,
            pageNumber: this.page.pageNumber
        };
        this.loadingIndicator = true;
        this._service.get('booking/list', obj).subscribe(res => {
            if (!res.Success) {
                this.toastr.error(res.Message, 'Error!', { closeButton: true, disableTimeOut: true });
                return;
            }
            this.rows = res.Records;
            this.page.totalElements = res.Total;
            this.page.totalPages = Math.ceil(this.page.totalElements / this.page.size);
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

    rejectReq(item) {

        this.confirmService.confirm('Are you sure?', 'You are reject this booking.')
            .subscribe(
                result => {
                    if (result) {
                        this.blockUI.start('Rejecting...');
                        const obj = {
                            id: item.id,
                            status: 'Rejected'
                        }
                        this._service.post('bookings/update-status', obj).subscribe(res => {
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




}
