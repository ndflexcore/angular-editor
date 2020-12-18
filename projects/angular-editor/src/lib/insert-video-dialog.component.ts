import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';
import {Component, Inject} from '@angular/core';
import {VideoDialogResult} from './common/common-interfaces';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';

@Component({
    selector: 'video-insert-link',
    templateUrl: 'insert-video-dialog.component.html',
    styleUrls: ['insert-table-dialog.component.scss']
})
export class InsertVideoDialogComponent {

    videoForm: FormGroup;
    width: number;
    height: number;

    constructor(public dialogRef: MatDialogRef<InsertVideoDialogComponent>,
                @Inject(MAT_DIALOG_DATA) public data: any, private fb: FormBuilder) {
        this.createForm();
    }

    getErrorMessage() {
        const urlField = this.videoForm.get('url');

        if (urlField.hasError('required')) {
            return this.data['insertVideoValidatorRequired'];
        }

        return urlField.hasError('pattern') ? this.data['insertVideoValidatorPattern'] : '';
    }

    onCancelClick(): void {
        this.dialogRef.close(null);
    }

    ok(): void {
        let url = this.videoForm.get('url').value;
        const html = this.createVideoHtml(url);

        const result: VideoDialogResult = {
            videoHtml: html
        };
        this.dialogRef.close(result);
    }

    private createForm(): void {
        this.videoForm = this.fb.group({
            url: [this.data.url, [Validators.required, Validators.pattern(/^https:\/\/([\w\d\-]+\.)+\w{2,}/)]],
            useOrigSize: [true]
        });
    }

    private createVideoHtml(url: string): string {
        let match;
        if (/youtube.com/.test(url)) {
            match = url.match(/https:\/\/www.youtube.com\/watch\?(?<video>v=.*)/);
            const hashMatch = match['groups']['video'].match(/v=(?<hash>[a-zA-Z0-9]*)/);
            const hash = hashMatch['groups']['hash'];
            return `
                <iframe src="https://www.youtube.com/embed/${hash}" frameborder="0" allowfullscreen></iframe>
                `;
        }
        if (/vimeo.com/.test(url)) {
            match = url.match(/https:\/\/vimeo.com\/(?<hash>.*)/);
            const hash = match['groups']['hash'];
            return `
                <iframe src="https://player.vimeo.com/video/${hash}" frameborder="0" allowfullscreen></iframe>
                `;
        }
        return null;
    }

}
