import {
    AfterViewInit,
    Attribute,
    ChangeDetectorRef,
    Component,
    ElementRef,
    EventEmitter,
    forwardRef,
    HostBinding,
    HostListener,
    Inject,
    Input, OnChanges,
    OnDestroy,
    OnInit,
    Output,
    Renderer2,
    SecurityContext, SimpleChanges,
    ViewChild
} from '@angular/core';
import {ControlValueAccessor, NG_VALUE_ACCESSOR} from '@angular/forms';
import {AngularEditorConfig, angularEditorConfig} from './config';
import {AngularEditorToolbarComponent} from './angular-editor-toolbar.component';
import {AngularEditorService} from './angular-editor.service';
import {DOCUMENT} from '@angular/common';
import {DomSanitizer} from '@angular/platform-browser';
import {isDefined} from './utils';
import {LangService} from './services/lang.service';
import {Subject} from 'rxjs';
import {takeUntil} from 'rxjs/operators';
import {DirectoryChild} from './common/common-interfaces';
import {MatDialog} from '@angular/material';
import {MessageDialogComponent} from './message-dialog.component';

@Component({
    selector: 'angular-editor',
    templateUrl: './angular-editor.component.html',
    styleUrls: ['./angular-editor.component.scss'],
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => AngularEditorComponent),
            multi: true
        }
    ]
})
export class AngularEditorComponent implements OnInit, ControlValueAccessor, AfterViewInit, OnChanges, OnDestroy {

    private onChange: (value: string) => void;
    private onTouched: () => void;

    modeVisual = true;
    showPlaceholder = false;
    disabled = false;
    focused = false;
    touched = false;
    changed = false;

    focusInstance: any;
    blurInstance: any;
    sen: { [p: string]: string };
    private ngUnsubscribe: Subject<any> = new Subject<any>();

    @Input() id = '';
    @Input() config: AngularEditorConfig = angularEditorConfig;
    @Input() placeholder = '';
    @Input() tabIndex: number | null;
    @Input() ftpLink: DirectoryChild | null;

    @Output() html;

    @ViewChild('editor', {static: true}) textArea: ElementRef;
    @ViewChild('editorWrapper', {static: true}) editorWrapper: ElementRef;
    @ViewChild('editorToolbar', {static: false}) editorToolbar: AngularEditorToolbarComponent;

    @Output() viewMode = new EventEmitter<boolean>();

    /** emits `blur` event when focused out from the textarea */
        // tslint:disable-next-line:no-output-native no-output-rename
    @Output('blur') blurEvent: EventEmitter<FocusEvent> = new EventEmitter<FocusEvent>();

    /** emits `focus` event when focused in to the textarea */
        // tslint:disable-next-line:no-output-rename no-output-native
    @Output('focus') focusEvent: EventEmitter<FocusEvent> = new EventEmitter<FocusEvent>();

    /*
    emits to trigger Image browser dialog
    emits the editorId of the editor which needs it
     */
    @Output() ftpNeeded = new EventEmitter<string>();

    @HostBinding('attr.tabindex') tabindex = -1;

    @HostListener('focus')
    onFocus() {
        this.focus();
    }

    constructor(
        private r: Renderer2,
        private editorService: AngularEditorService,
        @Inject(DOCUMENT) private doc: any,
        private sanitizer: DomSanitizer,
        private cdRef: ChangeDetectorRef,
        @Attribute('tabindex') defaultTabIndex: string,
        @Attribute('autofocus') private autoFocus: any,
        private langService: LangService,
        private dialog: MatDialog
    ) {
        const parsedTabIndex = Number(defaultTabIndex);
        this.tabIndex = (parsedTabIndex || parsedTabIndex === 0) ? parsedTabIndex : null;
        this.langService.languageChanged
            .pipe(takeUntil(this.ngUnsubscribe))
            .subscribe(res => {
                this.sen = res;
            });
    }

    ngOnInit() {
        this.config.toolbarPosition = this.config.toolbarPosition ? this.config.toolbarPosition : angularEditorConfig.toolbarPosition;
    }

    ngAfterViewInit() {
        if (isDefined(this.autoFocus)) {
            this.focus();
        }
    }

    ngOnChanges(changes: SimpleChanges) {
        if (changes['config'] && changes['config'].currentValue) {
            this.langService.lang = changes['config'].currentValue['language'];
        }
        if (changes['ftpLink'] && changes['ftpLink'].currentValue) {
            const ftpLink = <DirectoryChild> changes['ftpLink'].currentValue;
            if (ftpLink.editorId === this.id) {
                if (/\/files\//.test(ftpLink.fullWebPath)) {
                    const linkHtml = `<a href="${ftpLink.fullWebPath}">${ftpLink.name}</a>`;
                    this.editorService.restoreSelection();
                    this.editorService.insertHtml(linkHtml);
                } else {
                    const alt = ftpLink.alt || ftpLink.name;
                    const title = ftpLink.title ? `title="${ftpLink.title}"` : '';
                    const width = ftpLink.width ? ftpLink.width : this.config.presetWidth;
                    const height = ftpLink.height ? ftpLink.height : this.config.presetHeight;
                    const imageType = ftpLink.crop ? `${this.config.imageType}_crop` : this.config.imageType;
                    const src = `${this.config.imageServerUrl}/${imageType}/${width}/${height}/${ftpLink.partialWebPath}`;
                    const imageHtml = `<img src="${src}" alt="${alt}" ${title}>`;
                    this.editorService.restoreSelection();
                    this.editorService.insertHtml(imageHtml);
                }
            }
        }
    }

    /**
     * Executed command from editor header buttons
     * @param command string from triggerCommand
     */
    executeCommand(command: string) {
        this.focus();
        if (command === 'toggleEditorMode') {
            this.toggleEditorMode(this.modeVisual);
        } else if (command !== '') {
            if (command === 'clear') {
                this.editorService.removeSelectedElements(this.getCustomTags());
                this.onContentChange(this.textArea.nativeElement);
            } else if (command === 'default') {
                this.editorService.removeSelectedElements('h1,h2,h3,h4,h5,h6,p,pre');
                this.onContentChange(this.textArea.nativeElement);
            } else if (command === 'insertFtp') {
                this.ftpNeeded.emit(this.id);
            } else if (command === 'insertTable') {
                this.editorService.insertTable(this.config);
            } else {
                this.editorService.executeCommand(command);
            }
            this.exec();
        }
    }

    /**
     * focus event
     */
    onTextAreaFocus(event: FocusEvent): void {
        if (this.focused) {
            event.stopPropagation();
            return;
        }
        this.focused = true;
        this.focusEvent.emit(event);
        if (!this.touched || !this.changed) {
            this.editorService.executeInNextQueueIteration(() => {
                this.configure();
                this.touched = true;
            });
        }
    }

    /**
     * @description fires when cursor leaves textarea
     */
    public onTextAreaMouseOut(event: MouseEvent): void {
        this.editorService.saveSelection();
    }

    /**
     * blur event
     */
    onTextAreaBlur(event: FocusEvent) {
        /**
         * save selection if focussed out
         */
        this.editorService.executeInNextQueueIteration(this.editorService.saveSelection);

        if (typeof this.onTouched === 'function') {
            this.onTouched();
        }

        if (event.relatedTarget !== null) {
            const parent = (event.relatedTarget as HTMLElement).parentElement;
            if (!parent.classList.contains('angular-editor-toolbar-set') && !parent.classList.contains('ae-picker')) {
                this.blurEvent.emit(event);
                this.focused = false;
            }
        }
    }

    /**
     *  focus the text area when the editor is focused
     */
    focus() {
        if (this.modeVisual) {
            this.textArea.nativeElement.focus();
        } else {
            const sourceText = this.doc.getElementById('sourceText' + this.id);
            sourceText.focus();
            this.focused = true;
        }
    }

    /**
     * Executed from the contenteditable section while the input property changes
     * @param element html element from contenteditable
     */
    onContentChange(element: any): void {
        let html = '';
        if (this.modeVisual) {
            html = element.innerHTML;
        } else {
            html = element.innerText;
        }
        if ((!html || html === '<br>')) {
            html = '';
        }
        if (typeof this.onChange === 'function') {
            this.onChange(this.config.sanitize || this.config.sanitize === undefined ?
                this.sanitizer.sanitize(SecurityContext.HTML, html) : html);
            if ((!html) !== this.showPlaceholder) {
                this.togglePlaceholder(this.showPlaceholder);
            }
        }
        this.changed = true;
    }

    /**
     * Set the function to be called
     * when the control receives a change event.
     *
     * @param fn a function
     */
    registerOnChange(fn: any): void {
        this.onChange = e => (e === '<br>' ? fn('') : fn(e));
    }

    /**
     * Set the function to be called
     * when the control receives a touch event.
     *
     * @param fn a function
     */
    registerOnTouched(fn: any): void {
        this.onTouched = fn;
    }

    /**
     * Write a new value to the element.
     *
     * @param value value to be executed when there is a change in contenteditable
     */
    writeValue(value: any): void {

        if ((!value || value === '<br>' || value === '') !== this.showPlaceholder) {
            this.togglePlaceholder(this.showPlaceholder);
        }

        if (value === undefined || value === '' || value === '<br>') {
            value = null;
        }

        this.refreshView(value);
    }

    /**
     * refresh view/HTML of the editor
     *
     * @param value html string from the editor
     */
    refreshView(value: string): void {
        const normalizedValue = value === null ? '' : value;
        this.r.setProperty(this.textArea.nativeElement, 'innerHTML', normalizedValue);

        return;
    }

    /**
     * toggles placeholder based on input string
     *
     * @param value A HTML string from the editor
     */
    togglePlaceholder(value: boolean): void {
        if (!value) {
            this.r.addClass(this.editorWrapper.nativeElement, 'show-placeholder');
            this.showPlaceholder = true;

        } else {
            this.r.removeClass(this.editorWrapper.nativeElement, 'show-placeholder');
            this.showPlaceholder = false;
        }
    }

    /**
     * Implements disabled state for this element
     *
     * @param isDisabled Disabled flag
     */
    setDisabledState(isDisabled: boolean): void {
        const div = this.textArea.nativeElement;
        const action = isDisabled ? 'addClass' : 'removeClass';
        this.r[action](div, 'disabled');
        this.disabled = isDisabled;
    }

    /**
     * toggles editor mode based on bToSource bool
     *
     * @param bToSource A boolean value from the editor
     */
    toggleEditorMode(bToSource: boolean) {
        let oContent: any;
        const editableElement = this.textArea.nativeElement;

        if (bToSource) {
            oContent = this.r.createText(editableElement.innerHTML);
            this.r.setProperty(editableElement, 'innerHTML', '');
            this.r.setProperty(editableElement, 'contentEditable', false);

            const oPre = this.r.createElement('pre');
            this.r.setStyle(oPre, 'margin', '0');
            this.r.setStyle(oPre, 'outline', 'none');

            const oCode = this.r.createElement('code');
            this.r.setProperty(oCode, 'id', 'sourceText' + this.id);
            this.r.setStyle(oCode, 'display', 'block');
            this.r.setStyle(oCode, 'white-space', 'pre-wrap');
            this.r.setStyle(oCode, 'word-break', 'keep-all');
            this.r.setStyle(oCode, 'outline', 'none');
            this.r.setStyle(oCode, 'margin', '0');
            this.r.setStyle(oCode, 'background-color', '#fff5b9');
            this.r.setProperty(oCode, 'contentEditable', true);
            this.r.appendChild(oCode, oContent);
            this.focusInstance = this.r.listen(oCode, 'focus', (event) => this.onTextAreaFocus(event));
            this.blurInstance = this.r.listen(oCode, 'blur', (event) => this.onTextAreaBlur(event));
            this.r.appendChild(oPre, oCode);
            this.r.appendChild(editableElement, oPre);

            // ToDo move to service
            this.doc.execCommand('defaultParagraphSeparator', false, 'div');

            this.modeVisual = false;
            this.viewMode.emit(false);
            oCode.focus();
        } else {
            if (this.doc.querySelectorAll) {
                this.r.setProperty(editableElement, 'innerHTML', editableElement.innerText);
            } else {
                oContent = this.doc.createRange();
                oContent.selectNodeContents(editableElement.firstChild);
                this.r.setProperty(editableElement, 'innerHTML', oContent.toString());
            }
            this.r.setProperty(editableElement, 'contentEditable', true);
            this.modeVisual = true;
            this.viewMode.emit(true);
            this.onContentChange(editableElement);
            editableElement.focus();
        }
        this.editorToolbar.setEditorMode(!this.modeVisual);
    }

    /**
     * toggles editor buttons when cursor moved or positioning
     *
     * Send a node array from the contentEditable of the editor
     */
    exec() {
        this.editorToolbar.triggerButtons();

        let userSelection;
        if (this.doc.getSelection) {
            userSelection = this.doc.getSelection();
            // console.log(userSelection); // TODO selection
            // TODO:
            /**
             * here you can try to experiment with focusNode, parents, children etc - e.g. set image attributes, table stroke etc...
             */
            this.editorService.executeInNextQueueIteration(this.editorService.saveSelection);
        }

        let a = userSelection.focusNode;
        const els = [];
        while (a && a.id !== 'editor') {
            els.unshift(a);
            a = a.parentNode;
        }
        this.editorToolbar.triggerBlocks(els);
    }

    private configure() {
        this.editorService.uploadUrl = this.config.uploadUrl;
        this.editorService.uploadWithCredentials = this.config.uploadWithCredentials;
        if (this.config.defaultParagraphSeparator) {
            this.editorService.setDefaultParagraphSeparator(this.config.defaultParagraphSeparator);
        }
        if (this.config.defaultFontName) {
            this.editorService.setFontName(this.config.defaultFontName);
        }
        if (this.config.defaultFontSize) {
            this.editorService.setFontSize(this.config.defaultFontSize);
        }
    }

    getFonts() {
        const fonts = this.config.fonts ? this.config.fonts : angularEditorConfig.fonts;
        return fonts.map(x => {
            return {label: x.name, value: x.name};
        });
    }

    getCustomTags() {
        const tags = ['span'];
        this.config.customClasses.forEach(x => {
            if (x.tag !== undefined) {
                if (!tags.includes(x.tag)) {
                    tags.push(x.tag);
                }
            }
        });
        return tags.join(',');
    }

    ngOnDestroy() {
        if (this.blurInstance) {
            this.blurInstance();
        }
        if (this.focusInstance) {
            this.focusInstance();
        }
    }

    filterStyles(html: string): string {
        html = html.replace('position: fixed;', '');
        return html;
    }

    editorPaste(): boolean {
        if (!this.config.pasteEnabled) {
            const dialogRef = this.dialog.open(MessageDialogComponent, {
                width: '275px',
                height: 'auto',
                data: {
                    title: this.sen['notice'],
                    text: this.sen['pasteDisabled']
                }
            });
            dialogRef.afterClosed()
                .pipe(takeUntil(this.ngUnsubscribe))
                .subscribe(() => {
                    return false;
                })
        }

        return this.config.pasteEnabled;
    }

    // todo: insert link
    // rework to material dialog
    // if not comply with https, do not allow
}
