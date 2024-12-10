import {Component, Inject} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {UntypedFormArray, UntypedFormBuilder, UntypedFormGroup} from '@angular/forms';

@Component({
    selector: 'set-column-widths',
    templateUrl: './set-column-widths-dialog.component.html',
    styleUrls: ['set-column-widths-dialog.component.scss']
})

export class SetColumnWidthsDialogComponent {

    columnForm: UntypedFormGroup;
    get widths() {
        return this.columnForm.get('widths') as UntypedFormArray;
    }

    constructor(public dialogRef: MatDialogRef<SetColumnWidthsDialogComponent>,
                @Inject(MAT_DIALOG_DATA) public data: any, private fb: UntypedFormBuilder) {
        this.createForm();
    }

    onCancelClick(): void {
        this.dialogRef.close(null);
    }

    ok(): void {
        const result = this.widths.value;
        this.dialogRef.close(result);
    }

    private createForm(): void {
        this.columnForm = this.fb.group({
            widths: this.fb.array([])
        });
        for (let i = 0; i < this.data.columnWidths.length; i++) {
            this.widths.push(this.fb.control(this.data.columnWidths[i]));
        }
    }

}
