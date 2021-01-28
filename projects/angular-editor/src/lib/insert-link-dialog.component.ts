import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';
import {Component, Inject} from '@angular/core';
import {LinkDialogResult} from './common/common-interfaces';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';

@Component({
    selector: 'dialog-insert-link',
    templateUrl: 'insert-link-dialog.component.html',
    styleUrls: ['insert-table-dialog.component.scss']
})
export class InsertLinkDialogComponent {

    linkForm: FormGroup;

    constructor(public dialogRef: MatDialogRef<InsertLinkDialogComponent>,
                @Inject(MAT_DIALOG_DATA) public data: any, private fb: FormBuilder) {
        this.createForm();
    }

    getErrorMessage() {
        const urlField = this.linkForm.get('url');

        if (urlField.hasError('required')) {
            return this.data['insertLinkValidatorRequired'];
        }

        return urlField.hasError('pattern') ? this.data['insertLinkValidatorPattern'] : '';
    }

    onCancelClick(): void {
        this.dialogRef.close(null);
    }

    ok(): void {
        const result: LinkDialogResult = {
            url: this.linkForm.get('url').value,
            target: this.linkForm.get('openInNew').value
                ? '_blank'
                : '_self'
        };
        this.dialogRef.close(result);
    }

    private createForm(): void {
        const newWindow = this.data.target === '_blank';
        this.linkForm = this.fb.group({
            url: [this.data.url, [Validators.required, Validators.pattern(/^(https:\/\/([\w\d\-]+\.)+\w{2,})?(\/.+)?\/?$/)]],
            openInNew: [newWindow]
        });
    }

}
