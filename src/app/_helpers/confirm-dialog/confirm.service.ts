import { Observable } from 'rxjs';
import { MatDialogRef, MatDialog, MatDialogState } from '@angular/material/dialog';
import { Injectable } from '@angular/core';

import { ConfirmComponent } from './confirm.component';

@Injectable()
export class ConfirmService {

  private dialogRef: MatDialogRef<ConfirmComponent>;

  constructor(private dialog: MatDialog) { }

  public confirm(title: string, message: string, confirmButtonText?: string, disableClose?: boolean, modalWidth?: string): Observable<any> {

    this.dialogRef = this.dialog.open(ConfirmComponent, { disableClose: true , width: modalWidth });
    this.dialogRef.componentInstance.title = title;
    this.dialogRef.componentInstance.message = message;
    if (confirmButtonText) this.dialogRef.componentInstance.confirmButtonText = confirmButtonText;
    if (disableClose) this.dialogRef.componentInstance.disableCloseButton = disableClose;

    return this.dialogRef.afterClosed();

  }

  public close() {
    if (this.dialogRef.getState() == MatDialogState.OPEN) this.dialogRef.close();
  }
}
