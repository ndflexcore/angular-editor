import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import {Component, Inject} from '@angular/core';
import {ColorDialogResult} from './common/common-interfaces';

@Component({
    selector: 'dialog-insert-color',
    templateUrl: 'insert-color-dialog.component.html',
    styleUrls: ['insert-table-dialog.component.scss']
})
export class InsertColorDialogComponent {

    color: string = '#000000';

    constructor(public dialogRef: MatDialogRef<InsertColorDialogComponent>,
                @Inject(MAT_DIALOG_DATA) public data: any) {
    }

    onCancelClick(): void {
        this.dialogRef.close(null);
    }

    ok(): void {
        const result: ColorDialogResult = {
            color: this.color,
        };
        this.dialogRef.close(result);
    }

}
