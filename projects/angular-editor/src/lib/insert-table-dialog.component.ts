import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';
import {Component, Inject} from '@angular/core';
import {TableDialogResult} from './common/common-interfaces';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';

@Component({
    selector: 'dialog-insert-table',
    templateUrl: 'insert-table-dialog.component.html',
})
export class InsertTableDialogComponent {

    tableForm: FormGroup;

    constructor(public dialogRef: MatDialogRef<InsertTableDialogComponent>,
                @Inject(MAT_DIALOG_DATA) public data: any, private fb: FormBuilder) {
        this.createForm();
    }

    onCancelClick(): void {
        this.dialogRef.close();
    }

    ok(): void {
        const result: TableDialogResult = {
            rows: 2,
            cols: 3,
            stroke: true
        };
        this.dialogRef.close(result);
    }

    private createForm(): void {
        this.tableForm = this.fb.group({
            rows: [2, [Validators.required]],
            cols: [2, [Validators.required]],
            stroke: true
        });
    }

}
