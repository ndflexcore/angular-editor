import {Component, OnInit} from '@angular/core';
import {UntypedFormBuilder, UntypedFormGroup, Validators} from '@angular/forms';
import {
    AngularEditorConfig, AngularEditorService,
    CustomButtonClicked,
    CustomCommandName, LinkTargetType
} from '../../../angular-editor/src/public-api';
import {
    DirectoryChild,
    FtpRequest
} from '../../../angular-editor/src/lib/common/common-interfaces';
import {takeUntil} from 'rxjs/operators';
import {Subject} from 'rxjs';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
    title = 'app';

    form: UntypedFormGroup;
    sensForm: UntypedFormGroup;

    htmlContent1 = ''; // `<img id="editor1_46934" src="https://img.flexsrv.scdev.cz/preview_crop/320/240/800px-Tides_of_Vengeance_logo.png" alt="My inserted image ALT" title="My inserted image TITLE">`;
    cultureId: number = 34;
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
        defaultFontName: 'Roboto, sans-serif',
        defaultFontSize: '3',
        showToolbar: true,
        defaultParagraphSeparator: 'p',
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
        customButtons: [[{icon: null, buttonText: 'Hello!', commandName: CustomCommandName.insertAnchor}]]
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
        customButtons: [[{icon: 'fa-list-ul', buttonText: 'Hello there!', commandName: CustomCommandName.insertAnchor}]]
    };

    private ngUnsubscribe: Subject<any> = new Subject<any>();

    private static insertAnchor(href: string, target: LinkTargetType, editorService: AngularEditorService): void {

        const selection = editorService.savedSelection;
        console.log(selection);

        if (selection.startOffset === selection.endOffset) {
            console.log('nn');
            editorService.restoreSelection();
            return;
        }

        if (selection && selection.commonAncestorContainer.parentElement.nodeName === 'A') {
            const parent = selection.commonAncestorContainer.parentElement as HTMLAnchorElement;
            if (parent.href !== '') {
                href = parent.href;
                target = parent.target as LinkTargetType;
            }
        }

        editorService.restoreSelection();
        editorService.createLink(href, target);
    }

    constructor(private formBuilder: UntypedFormBuilder) {
        this.createForms();
    }

    ngOnInit() {
        // console.log(this.htmlContent1);
    }

    onChange(/* event */) {
        // console.log(`(ngModelChange): ${event}`);
    }

    onBlur(/* event */) {
        // console.log('blur ' + event);
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
            });
    }

    onCustomButtonClicked(event: CustomButtonClicked) {
        if (!event || !event.commandName || !event.editorService) {
            return;
        }
        if (event.commandName === CustomCommandName.insertAnchor) {
            const href = '%URL_UNREGISTER%';
            const target: LinkTargetType = '_blank';
            AppComponent.insertAnchor(href, target, event.editorService);
        }
    }

    changeCulture(cid: number): void {
        this.cultureId = cid;
    }

}
