import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';
import {Component, Inject, OnDestroy} from '@angular/core';
import {VideoDialogResult} from './common/common-interfaces';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Subject} from 'rxjs';
import {finalize, take, takeUntil} from 'rxjs/operators';
import {HttpClient} from '@angular/common/http';

type VideoKind = 'youtube' | 'vimeo';

interface HashResult {
    kind: VideoKind,
    hash: string;
}

interface VideoInfo {
    width: number;
    height: number;
}

@Component({
    selector: 'video-insert-link',
    templateUrl: 'insert-video-dialog.component.html',
    styleUrls: ['insert-table-dialog.component.scss']
})
export class InsertVideoDialogComponent implements OnDestroy {

    videoForm: FormGroup;
    videoInfo: VideoInfo;
    gettingSize: boolean;
    private ngUnsubscribe: Subject<any> = new Subject<any>();

    constructor(public dialogRef: MatDialogRef<InsertVideoDialogComponent>,
                @Inject(MAT_DIALOG_DATA) public data: any, private fb: FormBuilder, private http: HttpClient) {
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
        const html = this.createVideoHtml(hashResult.kind, hashResult.hash);

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
            .pipe(takeUntil(this.ngUnsubscribe))
            .subscribe(res => {
                const url = this.videoForm.get('url').value;
                const hashResult = InsertVideoDialogComponent.getVideoHash(url);
                if (url && res && hashResult) {
                    this.getVideoSize(hashResult);
                }
            })
    }

    private getVideoSize(hashResult: HashResult): void {
        this.gettingSize = true;
        const apiUrlPrefix = this.data.apiUrlPrefix;
        if (hashResult.kind === 'youtube') {
            let apiUrl = `${apiUrlPrefix}/youtube-video-info?hash=${hashResult.hash}`;
            this.http.get<string>(apiUrl)
                .pipe(
                    take(1),
                    finalize(() => this.gettingSize = false)
                )
                .subscribe(res => {
                    const result = JSON.parse(res);
                    console.log(result);
                    if (result['thumbnail_width'] && result['thumbnail_height']) {
                        this.videoInfo = {
                            width: result['thumbnail_width'],
                            height: result['thumbnail_height']
                        }
                    }
                })
        }
        if (hashResult.kind === 'vimeo') {
            let apiUrl = `${apiUrlPrefix}/vimeo-video-info?hash=${hashResult.hash}`;
            this.http.get<string>(apiUrl)
                .pipe(
                    take(1),
                    finalize(() => this.gettingSize = false)
                )
                .subscribe(res => {
                    const result = JSON.parse(res);
                    console.log(result);
                    if (result['height'] && result['width']) {
                        this.videoInfo = {
                            width: result['width'],
                            height: result['height']
                        }
                    }
                })
        }
    }

    private createVideoHtml(kind: VideoKind, hash: string): string {
        const size = this.videoInfo
            ? `width="${this.videoInfo.width}" height="${this.videoInfo.height}"`
            : '';
        if (kind === 'youtube') {
            return `
                <iframe src="https://www.youtube.com/embed/${hash}" ${size} frameborder="0" allowfullscreen></iframe>
                `;
        }
        if (kind === 'vimeo') {
            return `
                <iframe src="https://player.vimeo.com/video/${hash}" ${size} frameborder="0" allowfullscreen></iframe>
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
