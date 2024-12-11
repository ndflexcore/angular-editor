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
    Input,
    OnChanges,
    OnDestroy,
    OnInit,
    Output,
    Renderer2,
    SecurityContext,
    SimpleChanges,
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
import {take, takeUntil} from 'rxjs/operators';
import {
    CommandName,
    CustomButtonClicked,
    CustomCommandName,
    DirectoryChild,
    EditImageDialogData,
    EditTableDialogResult,
    FtpRequest, LangCode,
    LinkDialogResult,
    LinkTargetType,
    SelectedObject,
    TableDialogResult,
    VideoDialogResult
} from './common/common-interfaces';
import {MatDialog, MatDialogRef} from '@angular/material/dialog';
import {MessageDialogComponent} from './message-dialog.component';
import {randomId} from './common/helpers';
import {EditImageDialogComponent} from './edit-image-dialog.component';
import {EditTableDialogComponent} from './edit-table-dialog.component';
import {InsertTableDialogComponent} from './insert-table-dialog.component';
import {InsertVideoDialogComponent} from './insert-video-dialog.component';
import {SelectOption} from './ae-select/ae-select.component';
import {SetColumnWidthsDialogComponent} from './set-column-widths-dialog.component';
import {InsertLinkDialogComponent} from './insert-link-dialog.component';

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
        this.configure();
        const parsedTabIndex = Number(defaultTabIndex);
        this.tabIndex = (parsedTabIndex || parsedTabIndex === 0) ? parsedTabIndex : null;
        this.langService.languageChanged
            .pipe(takeUntil(this.ngUnsubscribe))
            .subscribe(res => {
                this.sen = res;
            });
        this.editorService.ftpLinkRequired
            .pipe(takeUntil(this.ngUnsubscribe))
            .subscribe((res) => {
                this.ftpNeeded.emit(res);
            });
    }

    onChange: (value: string) => void;
    onTouched: () => void;

    modeVisual = true;
    showPlaceholder = false;
    disabled = false;
    focused = false;
    touched = false;
    changed = false;
    focusInstance: any;
    blurInstance: any;
    sen: { [p: string]: string };
    selObject: SelectedObject;
    editorFonts: SelectOption[] = [{label: '', value: ''}];
    timerHandle: any;
    private ngUnsubscribe: Subject<any> = new Subject<any>();

    @Input() id = '';
    @Input() config: AngularEditorConfig = angularEditorConfig;
    @Input() tabIndex: number | null;
    @Input() cultureId: number = 34;
    @Input() ftpLink: DirectoryChild | null;
    @Input() placeholder = '';

    @Output() html;

    @ViewChild('editor', {static: true}) textArea: ElementRef;
    @ViewChild('editorWrapper', {static: true}) editorWrapper: ElementRef;
    @ViewChild('editorToolbar') editorToolbar: AngularEditorToolbarComponent;

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
    @Output() ftpNeeded: EventEmitter<FtpRequest> = new EventEmitter<FtpRequest>();

    @Output() customButtonClicked = new EventEmitter<CustomButtonClicked>();

    @HostBinding('attr.tabindex') tabindex = -1;

    private static getParentTableId(evt: MouseEvent): string {
        const pathArray = evt.composedPath();
        for (let i = 0; i < pathArray.length; i++) {
            const el = pathArray[i];
            if (el['nodeName'] === 'TABLE') {
                return el['id'];
            }
        }
        return null;
    }

    @HostListener('focus')
    onFocus() {
        this.focus();
    }

    @HostListener('click', ['$event'])
    onClick(evt: MouseEvent) {
        const first: EventTarget = <EventTarget> evt.composedPath()[0];
        if (first['nodeName'] === 'IMG') {
            this.selObject = {
                id: first['id'],
                nodeName: 'IMG',
                buttonTitle: this.sen['editImageDialogTitle']
            };
        } else if (first['nodeName'] === 'TD') {
            const rowIndex = <HTMLTableRowElement> first['parentElement']['rowIndex'];
            const cellIndex = <HTMLTableCellElement> first['cellIndex'];
            const tableId = AngularEditorComponent.getParentTableId(evt);
            this.selObject = {
                id: tableId,
                nodeName: 'TABLE',
                buttonTitle: this.sen['editTableDialogTitle'],
                rowIndex: rowIndex,
                cellIndex: cellIndex
            };
        } else {
            if (evt.composedPath().map(m => m['nodeName']).indexOf('ANGULAR-EDITOR-TOOLBAR') === -1) {
                this.selObject = null;
            }
        }
    }

    ngOnInit() {
        this.timerHandle = setInterval(() => this.editorService.intervalEmitter.emit(), 666);
        this.config.toolbarPosition = this.config.toolbarPosition ? this.config.toolbarPosition : angularEditorConfig.toolbarPosition;
    }

    ngAfterViewInit() {
        if (isDefined(this.autoFocus)) {
            this.focus();
        }
    }

    /*
    * Insert image or file from Image Server
     */
    ngOnChanges(changes: SimpleChanges) {
        if (changes['config'] && changes['config'].currentValue) {
            this.editorFonts = this.getFonts();
        }
        if (changes['cultureId'] && changes['cultureId'].currentValue) {
            this.langService.lang = AngularEditorComponent.getLanCodeFromCultureId(this.cultureId);
        }
        if (changes['ftpLink'] && changes['ftpLink'].currentValue) {
            const ftpLink = <DirectoryChild> changes['ftpLink'].currentValue;
            if (ftpLink.editorId === this.id) {
                if (/\/files\//.test(ftpLink.fullWebPath)) {
                    /*
                    file link
                     */
                    if (!this.editorService.linkDialogOpen) {
                        const linkHtml = `<a href="${ftpLink.fullWebPath}">${ftpLink.name}</a>`;
                        this.editorService.restoreSelection();
                        this.editorService.insertHtml(linkHtml);
                    } else {
                        this.editorService.ftpLinkGiven.emit(ftpLink.fullWebPath);
                    }
                } else {
                    /*
                    image link
                     */
                    const id = randomId(this.id);
                    const qryStr: string = randomId('qry');
                    const alt = ftpLink.alt || ftpLink.name;
                    const title = ftpLink.title ? `title="${ftpLink.title}"` : '';
                    const width = ftpLink.width ? ftpLink.width : this.config.presetWidth;
                    const height = ftpLink.height ? ftpLink.height : this.config.presetHeight;
                    const imageType = ftpLink.crop ? `${this.config.imageType}_crop` : this.config.imageType;

                    const srcOrig = `${this.config.imageServerUrl}/${imageType}/${width}/${height}/${ftpLink.partialWebPath}?q=${qryStr}`;
                    let imageHtml;

                    const webpPath = AngularEditorComponent.renameToWebp(ftpLink.partialWebPath);
                    const srcWebp = `${this.config.imageServerUrl}/${imageType}/${width}/${height}/${webpPath}?q=${qryStr}`;
                    const innerImage =  `<img id="${id}" src="${srcOrig}" alt="${alt}" ${title}>`;
                    imageHtml = `<picture id="PIC_${id}"><source type="image/webp" srcset="${srcWebp}">${innerImage}</picture>`;

                    this.editorService.restoreSelection();
                    this.editorService.insertHtml(imageHtml);
                }
            }
        }
    }

    private static getLanCodeFromCultureId(cultureId: number): LangCode {
        switch (cultureId) {
            case 34:
                return 'cs';
            case 50:
                return 'en';
            case 102:
                return 'sk';
            default:
                return 'cs';
        }
    }

    private static renameToWebp(imageName: string): string {
        const parts = imageName.split('.');
        parts[parts.length - 1] = 'webp';
        return parts.join('.');
    }

    executeCustomButtonCommand(command: CustomCommandName) {
        this.customButtonClicked.emit({commandName: command, editorService: this.editorService});
    }

    /**
     * Executed command from editor header buttons
     * @param command string from triggerCommand
     */
    executeCommand(command: CommandName) {
        this.focus();
        if (command === CommandName.toggleEditorMode) {
            this.toggleEditorMode(this.modeVisual);
        } else if (command !== null) {
            if (command === CommandName.clear) {
                this.editorService.removeSelectedElements(this.getCustomTags());
                this.onContentChange(this.textArea.nativeElement);
            } else if (command === CommandName.default) {
                this.editorService.removeSelectedElements('h1,h2,h3,h4,h5,h6,p,pre');
                this.onContentChange(this.textArea.nativeElement);
            } else if (command === CommandName.insertFtp) {
                const ftpRequest: FtpRequest = {
                    editorId: this.id,
                    presetFiles: false
                };
                this.ftpNeeded.emit(ftpRequest);
            } else if (command === CommandName.insertTable) {
                this.insertTable(this.config, this.id);
            } else if (command === CommandName.insertVideo) {
                this.insertVideoDialog();
            } else if (command === CommandName.editObject) {
                this.editObject();
            } else if (command === CommandName.addRowBellow) {
                this.addRow(false);
            } else if (command === CommandName.addRowUp) {
                this.addRow(true);
            } else if (command === CommandName.addColumnRight) {
                this.addColumn(false);
            } else if (command === CommandName.addColumnLeft) {
                this.addColumn(true);
            } else if (command === CommandName.deleteTable) {
                this.deleteTable();
            } else if (command === CommandName.insertImageUrl) {
                this.insertImageUrl();
            } else if (command === CommandName.deleteImage) {
                this.deleteImage();
            } else if (command === CommandName.deleteColumn) {
                this.deleteColumn();
            } else if (command === CommandName.deleteRow) {
                this.deleteRow();
            } else if (command === CommandName.setColumnWidths) {
                this.setColumnWidths();
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
                this.touched = true;
            });
        }
    }

    /**
     * @description fires when cursor leaves textarea
     */
    public onTextAreaMouseOut(/* event: MouseEvent */): void {
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
        let html: string;
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
        clearInterval(this.timerHandle);

        this.ngUnsubscribe.next();
        this.ngUnsubscribe.complete();

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
                });
        }

        return this.config.pasteEnabled;
    }

    editObject(): void {
        switch (this.selObject.nodeName) {
            case 'IMG':
                this.editImage();
                break;
            case 'TABLE':
                this.editTable();
                break;
        }
    }

    /**
     * opens insert table dialog
     * and inserts table on result
     */
    insertTable(config: AngularEditorConfig, editorId: string): void {
        const dialogRef = this.dialog.open(InsertTableDialogComponent, {
            width: '275px',
            height: 'auto',
            data: {
                cancel: this.sen['cancel'],
                title: this.sen['insertTable'],
                numRows: this.sen['numRows'],
                numCols: this.sen['numCols'],
                stroke: this.sen['stroke'],
                senFullWidth: this.sen['fullWidth'],
                senVerticalCellAlignment: this.sen['verticalCellAlignment'],
                senVAlignTop: this.sen['vAlignTop'],
                senVAlignMiddle: this.sen['vAlignMiddle'],
                senVAlignBottom: this.sen['vAlignBottom']
            }
        });

        dialogRef.afterClosed()
            .pipe(take(1))
            .subscribe((res: TableDialogResult) => {
                if (res) {
                    const createRes = AngularEditorService.createTableHtml(res, config, editorId);
                    const html = createRes[0];
                    const tableId = createRes[1];

                    this.editorService.restoreSelection();
                    this.editorService.insertHtml(html);
                    const tab: HTMLTableElement = <HTMLTableElement> document.getElementById(tableId);
                    if (res.fullWidth) {
                        this.r.setStyle(tab, 'width', '100%');
                    } else {
                        this.r.setStyle(tab, 'width', 'auto');
                    }
                    for (let i = 0; i < tab.rows.length; i++) {
                        const row = tab.rows[i];
                        for (let j = 0; j < row.cells.length; j++) {
                            this.r.setStyle(row.cells[j], 'vertical-align', res.vAlign);
                        }
                    }
                }
            });
    }

    private editImage(): void {

        const imgEl: HTMLImageElement = <HTMLImageElement>document.getElementById(this.selObject.id);
        const picEl: HTMLPictureElement = <HTMLPictureElement>document.getElementById(`PIC_${this.selObject.id}`);

        if (!imgEl) {
            return;
        }

        const oldSrc = imgEl.src;
        const oldAlt = imgEl.alt;
        const oldTitle = imgEl.title;

        const m = oldSrc.match(/\/\d+\/\d+\//);
        if (m && m[0]) {
            const size = m[0].split('/').filter(f => f !== '').map(m1 => parseInt(m1));
            const crop = /_crop\//.test(oldSrc);

            const width = size[0];
            const height = size[1];
            const sourceSplit = oldSrc.split('/');
            const source: HTMLSourceElement = <HTMLSourceElement> picEl.childNodes[0];
            const webpSplit = source.srcset.split('/');
            const imageName = sourceSplit[sourceSplit.length - 1];
            const webpName = webpSplit[webpSplit.length - 1];
            const orig = `${this.config.imageServerUrl}/orig/${imageName}`;

            const dialogRef = this.dialog.open(EditImageDialogComponent, {
                width: '475px',
                height: 'auto',
                data: {
                    oldImageBrowser: false,
                    width: width,
                    height: height,
                    alt: oldAlt,
                    title: oldTitle,
                    crop: crop,
                    orig: orig,
                    senDialogTitle: this.sen['editImageDialogTitle'],
                    senCancel: this.sen['cancel'],
                    senWidth: this.sen['width'],
                    senHeight: this.sen['height'],
                    senKeepRatio: this.sen['keepRatio'],
                    senCrop: this.sen['crop'],
                    senAlt: this.sen['alt'],
                    senTitle: this.sen['title']
                }
            });

            dialogRef.afterClosed()
                .pipe(take(1))
                .subscribe((res: EditImageDialogData) => {
                    if (!res) {
                        return;
                    }

                    const imageType = res.crop
                        ? `${this.config.imageType}_crop`
                        : this.config.imageType;

                    let src = `${this.config.imageServerUrl}/${imageType}/${res.width}/${res.height}/${imageName}`;
                    let webpSrc = `${this.config.imageServerUrl}/${imageType}/${res.width}/${res.height}/${webpName}`;

                    const qryStr = `?q=${randomId('qry')}`;
                    src = src.replace(/\?q=.+$/, qryStr);
                    webpSrc = webpSrc.replace(/\?q=.+$/, qryStr);

                    this.r.setAttribute(imgEl, 'src', src);
                    this.r.setAttribute(imgEl, 'alt', res.alt);
                    this.r.setAttribute(imgEl, 'title', res.title);

                    this.r.setAttribute(source, 'srcset', webpSrc);

                    this.onContentChange(this.textArea.nativeElement);
                });
        }
    }

    private deleteImage(): void {
        try {
            const i: HTMLImageElement = <HTMLImageElement> document.getElementById(this.selObject.id);
            const p = document.getElementById(`PIC_${this.selObject.id}`);
            i.remove();
            if (p) {
                p.remove();
            }
            this.onContentChange(this.textArea.nativeElement);
        } finally {
            this.selObject = null;
        }
    }

    private openLinkDialog(target: LinkTargetType, url: string): MatDialogRef<InsertLinkDialogComponent> {
        return this.dialog.open(InsertLinkDialogComponent, {
            width: '405px',
            height: 'auto',
            data: {
                editorId: this.id,
                url: url,
                target: target,
                cancel: this.sen['cancel'],
                title: this.sen['insertImageUrl'],
                placeholder: this.sen['insertLinkPlaceholder'],
                urlTitle: this.sen['insertLinkUrlTitle'],
                openInNewWindow: this.sen['openInNewWindow'],
                insertLinkValidatorRequired: this.sen['insertLinkValidatorRequired'],
                insertLinkValidatorPattern: this.sen['insertLinkValidatorPattern']
            }
        });
    }

    private insertImageUrl(): void {
        let url: string;
        let target: LinkTargetType;
        let parent: HTMLAnchorElement;
        const i: HTMLPictureElement = <HTMLPictureElement> document.getElementById(`PIC_${this.selObject.id}`);
        const picInner = i.outerHTML;
        const workOnParent: boolean = i.parentElement.nodeName === 'A';
        if (workOnParent) {
            parent = i.parentElement as HTMLAnchorElement;
            url = parent.href;
            target = parent.target as LinkTargetType;
        }
        const dialogRef = this.openLinkDialog(target, url);
        dialogRef.afterClosed()
            .pipe(take(1))
            .subscribe((res: LinkDialogResult) => {
                if (res) {
                    if (workOnParent) {
                        parent.href = res.url;
                        parent.target = res.target;
                    } else {
                        i.outerHTML = `<a href="${res.url}" target="${res.target}" rel="noopener">${picInner}</a>`;
                    }
                    this.onContentChange(this.textArea.nativeElement);
                    this.selObject = null;
                }
            })
    }

    private addRow(up: boolean): void {
        const t: HTMLTableElement = <HTMLTableElement> document.getElementById(this.selObject.id);
        const currentRow = t.rows[this.selObject.rowIndex];
        const numColumns = currentRow.cells.length;
        const newRow = up
            ? t.insertRow(this.selObject.rowIndex)
            : t.insertRow(this.selObject.rowIndex + 1);
        for (let i = 0; i < numColumns; i++) {
            newRow.insertCell();
        }
        this.onContentChange(this.textArea.nativeElement);
    }

    private addColumn(left: boolean): void {
        const t: HTMLTableElement = <HTMLTableElement> document.getElementById(this.selObject.id);
        const numRows = t.rows.length;

        const cellIndex = left
            ? this.selObject.cellIndex
            : this.selObject.cellIndex + 1;

        for (let i = 0; i < numRows; i++) {
            t.rows[i].insertCell(cellIndex);
        }

        for (let i = 0; i < numRows; i++) {
            const numCols = t.rows[i].cells.length;
            const width = Math.round(100 / numCols);

            for (let j = 0; j < numCols; j++) {
                const theCell = t.rows[i].cells[j];
                this.r.setStyle(theCell, 'width', `${width}%`);
            }
        }
        this.onContentChange(this.textArea.nativeElement);
    }

    private deleteColumn(): void {
        const t: HTMLTableElement = <HTMLTableElement> document.getElementById(this.selObject.id);
        for (let i = 0; i < t.rows.length; i++) {
            const row = t.rows[i];
            row.deleteCell(this.selObject.cellIndex);
        }
        this.onContentChange(this.textArea.nativeElement);
    }

    private deleteRow(): void {
        const t: HTMLTableElement = <HTMLTableElement> document.getElementById(this.selObject.id);
        t.deleteRow(this.selObject.rowIndex);
        if (t.rows.length === 0) {
            this.deleteTable();
        }
        this.onContentChange(this.textArea.nativeElement);
    }

    private deleteTable(): void {
        try {
            const t: HTMLTableElement = <HTMLTableElement> document.getElementById(this.selObject.id);
            t.remove();
            this.onContentChange(this.textArea.nativeElement);
        } finally {
            this.selObject = null;
        }
    }

    private editTable(): void {
        const t: HTMLTableElement = <HTMLTableElement> document.getElementById(this.selObject.id);

        const isBordered = /table-bordered/.test(t.className);
        const isFullWidth = /100%/.test(t.style.width);
        const vAlign = t.rows[0].cells[0].style.verticalAlign;

        const dialogRef = this.dialog.open(EditTableDialogComponent, {
            width: '275px',
            height: 'auto',
            data: {
                senDialogTitle: this.sen['editTableDialogTitle'],
                senCancel: this.sen['cancel'],
                senFullWidth: this.sen['fullWidth'],
                senStroke: this.sen['stroke'],
                stroke: isBordered,
                fullWidth: isFullWidth,
                senVerticalCellAlignment: this.sen['verticalCellAlignment'],
                senVAlignTop: this.sen['vAlignTop'],
                senVAlignMiddle: this.sen['vAlignMiddle'],
                senVAlignBottom: this.sen['vAlignBottom'],
                vAlign: vAlign
            }
        });

        dialogRef.afterClosed()
            .pipe(take(1))
            .subscribe((res: EditTableDialogResult) => {
                if (!res) {
                    return;
                }

                if (res.fullWidth) {
                    this.r.setStyle(t, 'width', '100%');
                } else {
                    this.r.setStyle(t, 'width', 'auto');
                }

                if (res.stroke) {
                    this.r.addClass(t, 'table-bordered');
                } else {
                    this.r.removeClass(t, 'table-bordered');
                }

                for (let i = 0; i < t.rows.length; i++) {
                    const row = t.rows[i];
                    for (let j = 0; j < row.cells.length; j++) {
                        this.r.setStyle(row.cells[j], 'vertical-align', res.vAlign);
                    }
                }

                this.onContentChange(this.textArea.nativeElement);
            });
    }

    private setColumnWidths(): void {
        const t: HTMLTableElement = <HTMLTableElement> document.getElementById(this.selObject.id);
        const columns = t.rows[0].cells;
        const widths: string[] = [];

        for (let i = 0; i < columns.length; i++) {
            const col = columns[i];
            const w = col.style.width;
            widths.push(w);
        }

        const dialogRef = this.dialog.open(SetColumnWidthsDialogComponent, {
            width: '575px',
            height: 'auto',
            data: {
                senDialogTitle: this.sen['setColumnWidths'],
                senCancel: this.sen['cancel'],
                columnWidths: widths
            }
        });

        dialogRef.afterClosed()
            .pipe(take(1))
            .subscribe((res: string[]) => {
                if (res) {
                    for (let i = 0; i < t.rows.length; i++) {
                        for (let j = 0; j < t.rows[i].cells.length; j++) {
                            t.rows[i].cells[j].style.width = res[j];
                        }
                    }
                }
                this.onContentChange(this.textArea.nativeElement);
            });
    }

    insertVideoDialog(): void {
        const dialogRef = this.dialog.open(InsertVideoDialogComponent, {
            width: '555px',
            height: 'auto',
            data: {
                senDialogTitle: this.sen['insertVideoDialogTitle'],
                insertVideoValidatorRequired: this.sen['insertVideoValidatorRequired'],
                insertVideoValidatorPattern: this.sen['insertVideoValidatorPattern'],
                urlLabel: this.sen['insertVideoUrlLabel'],
                origSizeLabel: this.sen['insertVideoUseOrigSize'],
                manualSizeLabel: this.sen['insertVideoUseManualSize'],
                senCancel: this.sen['cancel'],
                apiUrlPrefix: this.config.extensionsApiUrl
            }
        });

        dialogRef.afterClosed()
            .pipe(take(1))
            .subscribe((res: VideoDialogResult) => {
                if (res && res.videoHtml) {
                    this.editorService.restoreSelection();
                    this.editorService.insertHtml(res.videoHtml);

                    this.onContentChange(this.textArea.nativeElement);
                }
            });
    }


}
