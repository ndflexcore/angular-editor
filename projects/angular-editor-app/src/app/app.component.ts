import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {AngularEditorConfig} from '../../../angular-editor/src/public-api';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
    title = 'app';

    form: FormGroup;

    htmlContent1 = '';
    htmlContent2 = '';
    langCode: 'cs' | 'en' = 'cs';

    config1: AngularEditorConfig = {
        editable: true,
        spellcheck: true,
        minHeight: '10rem',
        maxHeight: '25rem',
        placeholder: 'Enter text here...',
        translate: 'no',
        sanitize: false,
        toolbarPosition: 'top',
        outline: false,
        defaultFontName: 'Times New Roman',
        defaultFontSize: '3',
        showToolbar: true,
        defaultParagraphSeparator: 'p',
        language: this.langCode,
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
            ['insertTable']
        ]
    };

    config2: AngularEditorConfig = {
        editable: true,
        spellcheck: true,
        minHeight: '5rem',
        maxHeight: '15rem',
        placeholder: 'Enter text here...',
        translate: 'no',
        sanitize: true,
        toolbarPosition: 'bottom',
        defaultFontName: 'Comic Sans MS',
        defaultFontSize: '5',
        defaultParagraphSeparator: 'p',
        language: this.langCode,
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
        ]
    };

    constructor(private formBuilder: FormBuilder) {
    }

    ngOnInit() {
        this.form = this.formBuilder.group({
            signature: ['', Validators.required]
        });
        console.log(this.htmlContent1);
    }

    onChange(event) {
        console.log('changed');
    }

    onBlur(event) {
        console.log('blur ' + event);
    }

    onChange2(event) {
        console.warn(this.form.value);
    }
}
