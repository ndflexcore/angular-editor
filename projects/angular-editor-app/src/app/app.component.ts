import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {AngularEditorConfig} from '../../../angular-editor/src/public-api';
import {DirectoryChild, DirectoryChildOldImageServer, FtpRequest} from '../../../angular-editor/src/lib/common/common-interfaces';
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

    htmlContent1 = ''; //`<img id="editor1_46934" src="https://img.flexsrv.scdev.cz/preview_crop/320/240/800px-Tides_of_Vengeance_logo.png" alt="My inserted image ALT" title="My inserted image TITLE">`;
    htmlContent2 = ''; //`<img id="editor2_69576" style="width: 200px;height:200px" src="https://img.marocz002.scostry.cz/fotocache/mid/images/produkty/313472/zehnder-aura-radiator-trubkovy-rovny-se-stredovym-pripojenim-1500-x-500-mm-407-w-chrom.jpg" alt="some alt old style" title="some title old style">`;
    langCode: 'cs' | 'en' = 'cs';
    selectedFtpLink: DirectoryChild;
    selectedFtpLinkOldStyle: DirectoryChildOldImageServer;

    config1: AngularEditorConfig = {
        editable: true,
        spellcheck: true,
        minHeight: '10rem',
        maxHeight: '25rem',
        translate: 'no',
        sanitize: false,
        toolbarPosition: 'top',
        outline: false,
        defaultFontName: 'Roboto, sans-serif',
        defaultFontSize: '3',
        showToolbar: true,
        defaultParagraphSeparator: 'p',
        language: this.langCode,
        imageServerUrl: '',
        extensionsApiUrl: '',
        imageType: 'preview',
        presetWidth: 98,
        presetHeight: 98,
        tableClass: '',
        tableStrokeClass: 'table-bordered',
        fonts: [
            {class: 'Roboto, sans-serif', name: 'Roboto, sans-serif'},
            {class: 'arial', name: 'Arial'},
            {class: 'times-new-roman', name: 'Times New Roman'},
            {class: 'calibri', name: 'Calibri'},
            {class: 'comic-sans-ms', name: 'Comic Sans MS'}
        ],
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
            ['insertImage'],
            ['customClasses']
        ],
        pasteEnabled: true,
        customColorPalette: ['#fff', '#000', '#2889e9', '#e920e9', '#fff500', 'rgb(236,64,64)'],
        useOldImageBrowser: false
    };

    config2: AngularEditorConfig = {
        editable: true,
        spellcheck: true,
        minHeight: '5rem',
        maxHeight: '15rem',
        translate: 'no',
        sanitize: true,
        toolbarPosition: 'top',
        outline: false,
        defaultFontName: 'Roboto, sans-serif',
        defaultFontSize: '5',
        defaultParagraphSeparator: 'p',
        language: this.langCode,
        imageServerUrl: '',
        extensionsApiUrl: '',
        imageType: 'preview',
        presetWidth: 98,
        presetHeight: 98,
        tableClass: '',
        tableStrokeClass: 'table-bordered',
        fonts: [
            {class: 'Roboto, sans-serif', name: 'Roboto, sans-serif'},
            {class: 'arial', name: 'Arial'},
            {class: 'times-new-roman', name: 'Times New Roman'},
            {class: 'calibri', name: 'Calibri'},
            {class: 'comic-sans-ms', name: 'Comic Sans MS'}
        ],
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
            ['insertImage'],
            ['customClasses']
        ],
        pasteEnabled: false,
        customColorPalette: ['#fff', '#000', '#2889e9', '#e920e9', '#fff500', 'rgb(236,64,64)'],
        useOldImageBrowser: true
    };

    private ngUnsubscribe: Subject<any> = new Subject<any>();

    constructor(private formBuilder: FormBuilder) {
        this.createForms();
    }

    ngOnInit() {
        // console.log(this.htmlContent1);
    }

    onChange(event) {
        // console.log(`(ngModelChange): ${event}`);
    }

    onBlur(event) {
        // console.log('blur ' + event);
    }

    onChange2(event) {
        // console.log(`(ngModelChange): ${event}`);
    }

    onFtpNeeded(ftpRequest: FtpRequest): void {
        // simulates file
        // this.selectedFtpLink = {
        //     editorId: ftpRequest.editorId,
        //     expandable: false,
        //     fullPath: '',
        //     fullWebPath: 'https://img.flexsrv.scdev.cz/files/manualy/manual.pdf',
        //     name: '',
        //     partialWebPath: '',
        //     size: ''
        // }
        // simulates image
        this.selectedFtpLink = {
            expandable: false,
            fullPath: '800px-Tides_of_Vengeance_logo.png',
            fullWebPath: '',
            name: '800px-Tides_of_Vengeance_logo.png',
            partialWebPath: '800px-Tides_of_Vengeance_logo.png',
            size: '231,9 kB',
            editorId: ftpRequest.editorId,
            width: 320,
            height: 240,
            alt: 'My inserted image ALT',
            title: 'My inserted image TITLE',
            crop: true
        };
    }

    onFtpNeeded2(ftpRequest: FtpRequest): void {
        // simulates file
        // this.selectedFtpLinkOldStyle = {
        //     editorId: ftpRequest.editorId,
        //     type: 'file',
        //     fullPath: 'https://img.marocz002.scostry.cz/files/dokumenty/OP2021.pdf',
        //     title: 'some title old style',
        //     alt: null,
        //     width: null,
        //     height: null
        // }
        // simulates image
        this.selectedFtpLinkOldStyle = {
            editorId: ftpRequest.editorId,
            type: 'image',
            fullPath: 'https://img.marocz002.scostry.cz/fotocache/mid/images/produkty/313472/zehnder-aura-radiator-trubkovy-rovny-se-stredovym-pripojenim-1500-x-500-mm-407-w-chrom.jpg',
            title: 'some title old style',
            alt: 'some alt old style',
            width: 200,
            height: 200
        }
    }

    private createForms(): void {
        this.form = this.formBuilder.group({
            html: [this.htmlContent1, Validators.required]
        });
        this.sensForm = this.formBuilder.group({
            imageServerUrl: [''],
            extensionsApiUrl: ['']
        });
        this.sensForm.get('imageServerUrl').valueChanges
            .pipe(takeUntil(this.ngUnsubscribe))
            .subscribe(res => {
                this.config1.imageServerUrl = res;
                this.config2.imageServerUrl = res;
            });
        this.sensForm.get('extensionsApiUrl').valueChanges
            .pipe(takeUntil(this.ngUnsubscribe))
            .subscribe(res => {
                this.config1.extensionsApiUrl = res;
                this.config2.extensionsApiUrl = res;
            })
    }
}
