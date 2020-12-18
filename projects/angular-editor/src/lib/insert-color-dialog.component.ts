import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';
import {Component, Inject} from '@angular/core';
import {ColorDialogResult} from './common/common-interfaces';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';

@Component({
    selector: 'dialog-insert-color',
    templateUrl: 'insert-color-dialog.component.html',
    styleUrls: ['insert-table-dialog.component.scss']
})
export class InsertColorDialogComponent {

    colorForm: FormGroup;

    constructor(public dialogRef: MatDialogRef<InsertColorDialogComponent>,
                @Inject(MAT_DIALOG_DATA) public data: any, private fb: FormBuilder) {
        this.createForm();
    }

    onCancelClick(): void {
        this.dialogRef.close(null);
    }

    ok(): void {
        const result: ColorDialogResult = {
            color: this.colorForm.get('color').value,
        };
        this.dialogRef.close(result);
    }

    private createForm(): void {
        this.colorForm = this.fb.group({
            color: ['', [Validators.required]]
        });
    }

}
