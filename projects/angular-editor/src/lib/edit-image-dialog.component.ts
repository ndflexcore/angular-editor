import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import {Component, Inject, OnInit} from '@angular/core';
import {EditImageDialogData, TableDialogResult} from './common/common-interfaces';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';

@Component({
    selector: 'dialog-edit-image',
    templateUrl: 'edit-image-dialog.component.html',
    styleUrls: ['edit-image-dialog.component.scss']
})
export class EditImageDialogComponent implements OnInit {

    imageForm: FormGroup;
    private ratio: number;

    constructor(public dialogRef: MatDialogRef<EditImageDialogComponent>,
                @Inject(MAT_DIALOG_DATA) public data: any, private fb: FormBuilder) {
        this.createForm();
    }

    ngOnInit(): void {
        if (!this.data.oldImageBrowser) {
            this.measureOriginal(this.data.orig);
        } else {
            this.ratio = this.data.width.replace('px', '') / this.data.height.replace('px', '');
        }
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

    heightKeyPress(evt: KeyboardEvent): void {
        this.recountWidth()
    }

    private recountHeight(): void {
        if (!this.imageForm.dirty || !this.imageForm.get('keepRatio').value || !this.imageForm.get('width').dirty || !this.imageForm.get('width').valid) return;
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
            keepRatio: [true]
        });
    }

    private measureOriginal(imageSrc: string): void {
        const img: HTMLImageElement = new Image();
        img.onload = () => {
            this.ratio = img.width / img.height;
        }
        img.src = imageSrc;
    }

}
