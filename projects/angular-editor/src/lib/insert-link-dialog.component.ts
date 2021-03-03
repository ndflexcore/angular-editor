import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import {Component, Inject, OnDestroy, OnInit} from '@angular/core';
import {LinkDialogResult} from './common/common-interfaces';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {AngularEditorService} from './angular-editor.service';
import {Subject} from 'rxjs';
import {takeUntil} from 'rxjs/operators';

@Component({
    selector: 'dialog-insert-link',
    templateUrl: 'insert-link-dialog.component.html',
    styleUrls: ['insert-table-dialog.component.scss']
})
export class InsertLinkDialogComponent implements OnInit, OnDestroy {

    linkForm: FormGroup;
    private ngUnsubscribe: Subject<any> = new Subject<any>();

    constructor(public dialogRef: MatDialogRef<InsertLinkDialogComponent>,
                @Inject(MAT_DIALOG_DATA) public data: any, private fb: FormBuilder, private editorService: AngularEditorService) {
        this.createForm();
        this.editorService.ftpLinkGiven
            .pipe(takeUntil(this.ngUnsubscribe))
            .subscribe(res => {
                this.setLinkForm(res);
            })
    }

    ngOnInit(): void {
        this.editorService.linkDialogOpen = true;
    }

    ngOnDestroy(): void {
        this.editorService.linkDialogOpen = false;
        this.ngUnsubscribe.next();
        this.ngUnsubscribe.complete();
    }

    requireFtpDialog(): void {
        this.editorService.ftpLinkRequired.emit(this.data.editorId);
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

    private setLinkForm(value: string): void {
        this.linkForm.patchValue({
            url: value
        });
        this.linkForm.markAsDirty();
    }

    private createForm(): void {
        const newWindow = this.data.target === '_blank';
        this.linkForm = this.fb.group({
            url: [this.data.url, [Validators.required, Validators.pattern(/^(https:\/\/([\w\d\-]+\.)+\w{2,})?(\/.+)?\/?$/)]],
            openInNew: [newWindow]
        });
    }

}
