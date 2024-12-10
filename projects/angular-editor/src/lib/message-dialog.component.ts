import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import {Component, Inject} from '@angular/core';

@Component({
    selector: 'dialog-message',
    templateUrl: 'message-dialog.component.html',
    styleUrls: ['insert-table-dialog.component.scss']
})
export class MessageDialogComponent {

    constructor(public dialogRef: MatDialogRef<MessageDialogComponent>,
                @Inject(MAT_DIALOG_DATA) public data: any) {

    }

    ok(): void {
        this.dialogRef.close();
    }

}
