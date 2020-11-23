import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';
import {Component, Inject} from '@angular/core';
import {EditTableDialogResult, TableDialogResult} from './common/common-interfaces';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';

@Component({
    selector: 'dialog-insert-table',
    templateUrl: 'edit-table-dialog.component.html',
    styleUrls: ['insert-table-dialog.component.scss']
})
export class EditTableDialogComponent {

    tableForm: FormGroup;

    constructor(public dialogRef: MatDialogRef<EditTableDialogComponent>,
                @Inject(MAT_DIALOG_DATA) public data: any, private fb: FormBuilder) {
        this.createForm();
    }

    onCancelClick(): void {
        this.dialogRef.close(null);
    }

    ok(): void {
        const result: EditTableDialogResult = {
            addRows: this.tableForm.get('addRows').value,
            stroke: this.tableForm.get('stroke').value,
            fullWidth: this.tableForm.get('fullWidth').value
        };
        this.dialogRef.close(result);
    }

    private createForm(): void {
        this.tableForm = this.fb.group({
            addRows: [0, [Validators.required]],
            stroke: this.data.stroke,
            fullWidth: this.data.fullWidth
        });
    }

}
