import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {AngularEditorConfig} from '../../../angular-editor/src/public-api';
import {DirectoryChild} from '../../../angular-editor/src/lib/common/common-interfaces';
import {takeUntil} from 'rxjs/operators';
import {Subject} from 'rxjs';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
    title = 'app';

    form: FormGroup;
    sensForm: FormGroup;

    htmlContent1 = '';
    htmlContent2 = '';
    langCode: 'cs' | 'en' = 'cs';
    selectedFtpLink: DirectoryChild;

    config1: AngularEditorConfig = {
        editable: true,
        spellcheck: true,
        minHeight: '10rem',
        maxHeight: '25rem',
        translate: 'no',
        sanitize: false,
        toolbarPosition: 'top',
        outline: false,
        defaultFontName: 'Times New Roman',
        defaultFontSize: '3',
        showToolbar: true,
        defaultParagraphSeparator: 'p',
        language: this.langCode,
        imageServerUrl: '',
        imageType: 'preview',
        presetWidth: 98,
        presetHeight: 98,
        tableClass: 'editor-table',
        tableStrokeClass: 'editor-table-stroke',
        customClasses: [
            {
                name: 'quote',
                class: 'quote',
            },
            {
                name: 'redText',
                class: 'redText'
            },
            {
                name: 'titleText',
                class: 'titleText',
                tag: 'h1',
            },
        ],
        toolbarHiddenButtons: [
            // ['bold', 'italic'],
            // ['insertTable']
        ],
        pasteEnabled: false
    };

    config2: AngularEditorConfig = {
        editable: true,
        spellcheck: true,
        minHeight: '5rem',
        maxHeight: '15rem',
        translate: 'no',
        sanitize: true,
        toolbarPosition: 'bottom',
        defaultFontName: 'Comic Sans MS',
        defaultFontSize: '5',
        defaultParagraphSeparator: 'p',
        language: this.langCode,
        imageServerUrl: '',
        imageType: 'preview',
        presetWidth: 98,
        presetHeight: 98,
        tableClass: 'editor-table',
        tableStrokeClass: 'editor-table-stroke',
        customClasses: [
            {
                name: 'quote',
                class: 'quote',
            },
            {
                name: 'redText',
                class: 'redText'
            },
            {
                name: 'titleText',
                class: 'titleText',
                tag: 'h1',
            },
        ],
        toolbarHiddenButtons: [
            ['bold', 'italic'],
            ['fontSize']
        ],
        pasteEnabled: false
    };

    private ngUnsubscribe: Subject<any> = new Subject<any>();

    constructor(private formBuilder: FormBuilder) {
        this.createForms();
    }

    ngOnInit() {
        console.log(this.htmlContent1);
    }

    onChange(event) {
        console.log(`(ngModelChange): ${event}`);
    }

    onBlur(event) {
        console.log('blur ' + event);
    }

    onChange2(event) {
        console.log(`(ngModelChange): ${event}`);
    }

    onFtpNeeded(editorId: string): void {
        this.selectedFtpLink = {
            expandable: false,
            fullPath: '800px-Tides_of_Vengeance_logo.png',
            fullWebPath: '',
            name: '800px-Tides_of_Vengeance_logo.png',
            partialWebPath: '800px-Tides_of_Vengeance_logo.png',
            size: '231,9 kB',
            editorId: editorId,
            width: 320,
            height: 240,
            alt: 'My inserted image ALT',
            title: 'My inserted image TITLE',
            crop: true
        };
    }

    private createForms(): void {
        this.form = this.formBuilder.group({
            signature: ['', Validators.required]
        });
        this.sensForm = this.formBuilder.group({
            imageServerUrl: ['']
        });
        this.sensForm.get('imageServerUrl').valueChanges
            .pipe(takeUntil(this.ngUnsubscribe))
            .subscribe(res => {
                this.config1.imageServerUrl = res;
                this.config2.imageServerUrl = res;
            })
    }
}
