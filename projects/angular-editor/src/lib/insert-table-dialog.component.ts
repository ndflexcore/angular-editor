import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import {Component, Inject} from '@angular/core';
import {TableDialogResult} from './common/common-interfaces';
import {UntypedFormBuilder, UntypedFormGroup, Validators} from '@angular/forms';

@Component({
    selector: 'dialog-insert-table',
    templateUrl: 'insert-table-dialog.component.html',
    styleUrls: ['insert-table-dialog.component.scss']
})
export class InsertTableDialogComponent {

    tableForm: UntypedFormGroup;
    vAlignOptions = [
        { name: this.data.senVAlignTop, value: 'top' },
        { name: this.data.senVAlignMiddle, value: 'middle' },
        { name: this.data.senVAlignBottom, value: 'bottom' }
    ];

    constructor(public dialogRef: MatDialogRef<InsertTableDialogComponent>,
                @Inject(MAT_DIALOG_DATA) public data: any, private fb: UntypedFormBuilder) {
        this.createForm();
    }

    onCancelClick(): void {
        this.dialogRef.close(null);
    }

    ok(): void {
        const result: TableDialogResult = {
            rows: this.tableForm.get('rows').value,
            cols: this.tableForm.get('cols').value,
            stroke: this.tableForm.get('stroke').value,
            fullWidth: this.tableForm.get('fullWidth').value,
            vAlign: this.tableForm.get('vAlign').value
        };
        this.dialogRef.close(result);
    }

    private createForm(): void {
        this.tableForm = this.fb.group({
            rows: [2, [Validators.required]],
            cols: [2, [Validators.required]],
            stroke: true,
            fullWidth: true,
            vAlign: ['top']
        });
    }

}
