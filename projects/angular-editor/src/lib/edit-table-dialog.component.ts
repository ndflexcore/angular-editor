import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import {Component, Inject} from '@angular/core';
import {EditTableDialogResult} from './common/common-interfaces';
import {FormBuilder, FormGroup} from '@angular/forms';

@Component({
    selector: 'dialog-insert-table',
    templateUrl: 'edit-table-dialog.component.html',
    styleUrls: ['insert-table-dialog.component.scss']
})
export class EditTableDialogComponent {

    tableForm: FormGroup;
    vAlignOptions = [
        { name: this.data.senVAlignTop, value: 'top' },
        { name: this.data.senVAlignMiddle, value: 'middle' },
        { name: this.data.senVAlignBottom, value: 'bottom' }
    ];

    constructor(public dialogRef: MatDialogRef<EditTableDialogComponent>,
                @Inject(MAT_DIALOG_DATA) public data: any, private fb: FormBuilder) {
        this.createForm();
    }

    onCancelClick(): void {
        this.dialogRef.close(null);
    }

    ok(): void {
        const result: EditTableDialogResult = {
            stroke: this.tableForm.get('stroke').value,
            fullWidth: this.tableForm.get('fullWidth').value,
            vAlign: this.tableForm.get('vAlign').value
        };
        this.dialogRef.close(result);
    }

    private createForm(): void {
        this.tableForm = this.fb.group({
            stroke: this.data.stroke,
            fullWidth: this.data.fullWidth,
            vAlign: [this.data.vAlign]
        });
    }

}
