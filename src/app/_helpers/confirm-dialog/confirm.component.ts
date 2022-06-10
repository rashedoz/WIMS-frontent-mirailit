
import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-confirm',
  templateUrl: './confirm.component.html'
})


export class ConfirmComponent {

  public title: string;
  public message: string;
  public closeButtonText: string = 'Cancel';
  public confirmButtonText: string = 'Confirm';
  public modalWidth: string;
  public disableCloseButton: boolean = false;

  constructor(public dialogRef: MatDialogRef<ConfirmComponent>) {}

}
