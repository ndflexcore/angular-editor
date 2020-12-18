import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';
import {Component, Inject, OnDestroy} from '@angular/core';
import {VideoDialogResult} from './common/common-interfaces';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Subject} from 'rxjs';

type VideoKind = 'youtube' | 'vimeo';

interface HashResult {
    kind: VideoKind,
    hash: string;
}

@Component({
    selector: 'video-insert-link',
    templateUrl: 'insert-video-dialog.component.html',
    styleUrls: ['insert-table-dialog.component.scss']
})
export class InsertVideoDialogComponent implements OnDestroy {

    videoForm: FormGroup;
    width: number;
    height: number;
    private ngUnsubscribe: Subject<any> = new Subject<any>();

    constructor(public dialogRef: MatDialogRef<InsertVideoDialogComponent>,
                @Inject(MAT_DIALOG_DATA) public data: any, private fb: FormBuilder) {
        this.createForm();
    }

    getErrorMessage(): any {
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
        const hashResult: HashResult = InsertVideoDialogComponent.getVideoHash(url);
        const html = InsertVideoDialogComponent.createVideoHtml(hashResult.kind, hashResult.hash);

        const result: VideoDialogResult = {
            videoHtml: html
        };
        this.dialogRef.close(result);
    }

    ngOnDestroy(): void {
        this.ngUnsubscribe.next();
        this.ngUnsubscribe.complete();
    }

    private createForm(): void {
        this.videoForm = this.fb.group({
            url: [this.data.url, [Validators.required, Validators.pattern(/^https:\/\/([\w\d\-]+\.)+\w{2,}/)]],
            useOrigSize: [false]
        });
        this.videoForm.get('useOrigSize').valueChanges
            .pipe()
    }

    private static createVideoHtml(kind: VideoKind, hash: string): string {
        if (kind === 'youtube') {
            return `
                <iframe src="https://www.youtube.com/embed/${hash}" frameborder="0" allowfullscreen></iframe>
                `;
        }
        if (kind === 'vimeo') {
            return `
                <iframe src="https://player.vimeo.com/video/${hash}" frameborder="0" allowfullscreen></iframe>
                `;
        }
        return null;
    }

    private static getVideoHash(url: string): HashResult {
        let match;
        if (/youtube.com/.test(url)) {
            match = url.match(/https:\/\/www.youtube.com\/watch\?(?<video>v=.*)/);
            const hashMatch = match['groups']['video'].match(/v=(?<hash>[a-zA-Z0-9]*)/);
            const hash = hashMatch['groups']['hash'];
            return {kind: 'youtube', hash: hash};
        }
        if (/vimeo.com/.test(url)) {
            match = url.match(/https:\/\/vimeo.com\/(?<hash>.*)/);
            const hash = match['groups']['hash'];
            return {kind: 'vimeo', hash: hash};
        }
        return null;
    }

}
