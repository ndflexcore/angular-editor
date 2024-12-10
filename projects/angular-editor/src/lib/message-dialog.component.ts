import { MAT_LEGACY_DIALOG_DATA as MAT_DIALOG_DATA, MatLegacyDialogRef as MatDialogRef } from '@angular/material/legacy-dialog';
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
