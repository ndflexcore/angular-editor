import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import {Component, Inject, OnDestroy, OnInit} from '@angular/core';
import {EditImageDialogData} from './common/common-interfaces';
import {UntypedFormBuilder, UntypedFormGroup, Validators} from '@angular/forms';
import {Subject} from 'rxjs';
import {takeUntil} from 'rxjs/operators';

@Component({
    selector: 'dialog-edit-image',
    templateUrl: 'edit-image-dialog.component.html',
    styleUrls: ['edit-image-dialog.component.scss']
})
export class EditImageDialogComponent implements OnInit, OnDestroy {

    imageForm: UntypedFormGroup;
    // aspect ratio of original image
    private ratio: number;
    // aspect ratio of current image
    private currenRatio: number;
    private ngUnsubscribe: Subject<any> = new Subject<any>();

    constructor(public dialogRef: MatDialogRef<EditImageDialogComponent>,
                @Inject(MAT_DIALOG_DATA) public data: any, private fb: UntypedFormBuilder) {
        this.createForm();
    }

    ngOnInit(): void {
        this.measureCurrent(this.data.width, this.data.height);

        if (!this.data.oldImageBrowser) {
            this.measureOriginal(this.data.orig);
        } else {
            this.ratio = this.data.width.replace('px', '') / this.data.height.replace('px', '');
        }
    }

    ngOnDestroy(): void {
        this.ngUnsubscribe.next();
        this.ngUnsubscribe.complete();
    }

    onCancelClick(): void {
        this.dialogRef.close(null);
    }

    ok(): void {
        const result: EditImageDialogData = {
            alt: this.imageForm.get('alt').value,
            crop: this.imageForm.get('crop').value,
            height: this.imageForm.get('height').value,
            width: this.imageForm.get('width').value,
            title: this.imageForm.get('title').value
        };
        this.dialogRef.close(result);
    }

    widthKeyPres(): void {
        this.recountHeight()
    }

    heightKeyPress(): void {
        this.recountWidth()
    }

    private recountHeight(): void {
        if (!this.imageForm.dirty || !this.imageForm.get('keepRatio').value || !this.imageForm.get('width').dirty || !this.imageForm.get('width').valid) return;
        const newVal = Math.round(this.imageForm.get('width').value / this.ratio);
        this.imageForm.get('height').patchValue(newVal);
    }

    private forceRecountHeight(): void {
        if (!this.imageForm.get('keepRatio').value || !this.imageForm.get('width').valid) return;
        const newVal = Math.round(this.imageForm.get('width').value / this.ratio);
        this.imageForm.get('height').patchValue(newVal);
    }

    private recountWidth(): void {
        if (!this.imageForm.dirty || !this.imageForm.get('keepRatio').value || !this.imageForm.get('height').dirty || !this.imageForm.get('height').valid) return;
        const newVal = Math.round(this.imageForm.get('height').value * this.ratio);
        this.imageForm.get('width').patchValue(newVal);
    }

    private createForm(): void {
        const width = this.data.oldImageBrowser
            ? this.data.width.replace('px', '')
            : this.data.width;
        const height = this.data.oldImageBrowser
            ? this.data.height.replace('px', '')
            : this.data.height;

        this.imageForm = this.fb.group({
            width: [width, [Validators.required]],
            height: [height, [Validators.required]],
            alt: [this.data.alt, [Validators.required]],
            title: [this.data.title],
            crop: [this.data.crop],
            keepRatio: false
        });

        this.imageForm.get('keepRatio').valueChanges
            .pipe(takeUntil(this.ngUnsubscribe))
            .subscribe(res => {
                this.forceRecountHeight()
            })
    }

    private measureOriginal(imageSrc: string): void {
        const img: HTMLImageElement = new Image();
        img.onload = () => {
            this.ratio = img.width / img.height;
            const keepRatioChecked = this.isRatioRoughlyOrig();
            if (keepRatioChecked) {
                this.imageForm.get('keepRatio').patchValue({
                    keepRatio: keepRatioChecked
                });
            }
        }
        img.src = imageSrc;
    }

    private measureCurrent(w: number, h: number): void {
        this.currenRatio = w / h;
    }

    private isRatioRoughlyOrig(): boolean {
        const roundedRatio = Math.round((this.ratio + Number.EPSILON) * 100) / 100;
        const roundedCurrentRatio = Math.round((this.currenRatio + Number.EPSILON) * 100) / 100;
        return roundedRatio === roundedCurrentRatio;
    }
}
