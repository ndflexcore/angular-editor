import {Component, ElementRef, EventEmitter, Inject, Input, Output, Renderer2, ViewChild} from '@angular/core';
import {AngularEditorService} from './angular-editor.service';
import {HttpResponse} from '@angular/common/http';
import {DOCUMENT} from '@angular/common';
import {CustomClass} from './config';
import {SelectOption} from './ae-select/ae-select.component';
import {MatDialog} from '@angular/material';
import {take, takeUntil} from 'rxjs/operators';
import {ColorDialogResult, LinkDialogResult, LinkTargetType, SelectedObject} from './common/common-interfaces';
import {InsertLinkDialogComponent} from './insert-link-dialog.component';
import {LangService} from './services/lang.service';
import {Subject} from 'rxjs';
import {InsertColorDialogComponent} from './insert-color-dialog.component';

@Component({
    selector: 'angular-editor-toolbar',
    templateUrl: './angular-editor-toolbar.component.html',
    styleUrls: ['./angular-editor-toolbar.component.scss']
})

export class AngularEditorToolbarComponent {
    sen: { [p: string]: string } = this.langService.sen;
    htmlMode = false;
    linkSelected = false;
    block = 'default';
    fontName = 'Roboto, sans-serif';
    fontSize = '3';
    foreColour;
    backColor;

    headings: SelectOption[] = [
        {
            label: this.sen['h1'],
            value: 'h1',
        },
        {
            label: this.sen['h2'],
            value: 'h2',
        },
        {
            label: this.sen['h3'],
            value: 'h3',
        },
        {
            label: this.sen['h4'],
            value: 'h4',
        },
        {
            label: this.sen['h5'],
            value: 'h5',
        },
        {
            label: this.sen['h6'],
            value: 'h6',
        },
        {
            label: this.sen['p'],
            value: 'p',
        },
        {
            label: this.sen['clear'],
            value: 'default'
        }
    ];

    fontSizes: SelectOption[] = [
        {
            label: '1',
            value: '1',
        },
        {
            label: '2',
            value: '2',
        },
        {
            label: '3',
            value: '3',
        },
        {
            label: '4',
            value: '4',
        },
        {
            label: '5',
            value: '5',
        },
        {
            label: '6',
            value: '6',
        },
        {
            label: '7',
            value: '7',
        }
    ];

    tableActions: SelectOption[] = [
        {
            label: this.sen['tableActions'],
            value: null
        },
        {
            label: this.sen['addRowBellow'],
            value: 'addRowBellow'
        },
        {
            label: this.sen['addRowUp'],
            value: 'addRowUp'
        },
        {
            label: this.sen['addColumnRight'],
            value: 'addColumnRight'
        },
        {
            label: this.sen['addColumnLeft'],
            value: 'addColumnLeft'
        },
        {
            label: this.sen['deleteColumn'],
            value: 'deleteColumn'
        },
        {
            label: this.sen['deleteRow'],
            value: 'deleteRow'
        },
        {
            label: this.sen['deleteTable'],
            value: 'deleteTable'
        }
    ];

    imageActions: SelectOption[] = [
        {
            label: this.sen['imageActions'],
            value: null
        },
        {
            label: this.sen['deleteImage'],
            value: 'deleteImage'
        }
    ];

    tableAction: string = null;
    imageAction: string = null;

    customClassId = '-1';
    // tslint:disable-next-line:variable-name
    _customClasses: CustomClass[];
    customClassList: SelectOption[] = [{label: '', value: ''}];
    // uploadUrl: string;

    tagMap = {
        BLOCKQUOTE: 'indent',
        A: 'link'
    };

    select = ['H1', 'H2', 'H3', 'H4', 'H5', 'H6', 'P', 'PRE', 'DIV'];

    buttons = ['bold', 'italic', 'underline', 'strikeThrough', 'subscript', 'superscript', 'justifyLeft', 'justifyCenter',
        'justifyRight', 'justifyFull', 'indent', 'outdent', 'insertUnorderedList', 'insertOrderedList', 'link'];

    @Input() id: string;
    @Input() uploadUrl: string;
    @Input() showToolbar: boolean;
    @Input() fonts: SelectOption[] = [{label: '', value: ''}];
    @Input() selObject: SelectedObject = null;
    @Input() customColorPalette: string[] = [];

    @Input()
    set customClasses(classes: CustomClass[]) {
        if (classes) {
            this._customClasses = classes;
            this.customClassList = this._customClasses.map((x, i) => ({label: x.name, value: i.toString()}));
            this.customClassList.unshift({label: 'Clear Class', value: '-1'});
        }
    }

    @Input()
    set defaultFontName(value: string) {
        if (value) {
            this.fontName = value;
        }
    }

    @Input()
    set defaultFontSize(value: string) {
        if (value) {
            this.fontSize = value;
        }
    }

    @Input() hiddenButtons: string[][];

    @Output() execute: EventEmitter<string> = new EventEmitter<string>();

    @ViewChild('fileInput', {static: true}) myInputFile: ElementRef;

    public get isLinkButtonDisabled(): boolean {
        return this.htmlMode || !Boolean(this.editorService.selectedText);
    }

    private ngUnsubscribe: Subject<any> = new Subject<any>();

    constructor(
        private r: Renderer2,
        private editorService: AngularEditorService,
        private langService: LangService,
        @Inject(DOCUMENT) private doc: any,
        private dialog: MatDialog
    ) {
        this.langService.languageChanged
            .pipe(takeUntil(this.ngUnsubscribe))
            .subscribe(res => {
                this.sen = res;
            });
    }

    ngOnDestroy() {
        this.ngUnsubscribe.next();
        this.ngUnsubscribe.complete();
    }

    /**
     * Trigger command from editor header buttons
     * @param command string from toolbar buttons
     */
    triggerCommand(command: string) {
        this.execute.emit(command);
    }

    /**
     * highlight editor buttons when cursor moved or positioning
     */
    triggerButtons() {
        if (!this.showToolbar) {
            return;
        }
        this.buttons.forEach(e => {
            const result = this.doc.queryCommandState(e);
            const elementById = this.doc.getElementById(e + '-' + this.id);
            if (result) {
                this.r.addClass(elementById, 'active');
            } else {
                this.r.removeClass(elementById, 'active');
            }
        });
    }

    /**
     * trigger highlight editor buttons when cursor moved or positioning in block
     */
    triggerBlocks(nodes: Node[]) {
        if (!this.showToolbar) {
            return;
        }
        this.linkSelected = nodes.findIndex(x => x.nodeName === 'A') > -1;
        let found = false;
        this.select.forEach(y => {
            const node = nodes.find(x => x.nodeName === y);
            if (node !== undefined && y === node.nodeName) {
                if (found === false) {
                    this.block = node.nodeName.toLowerCase();
                    found = true;
                }
            } else if (found === false) {
                this.block = 'default';
            }
        });

        found = false;
        if (this._customClasses) {
            this._customClasses.forEach((y, index) => {
                const node = nodes.find(x => {
                    if (x instanceof Element) {
                        return x.className === y.class;
                    }
                });
                if (node !== undefined) {
                    if (found === false) {
                        this.customClassId = index.toString();
                        found = true;
                    }
                } else if (found === false) {
                    this.customClassId = '-1';
                }
            });
        }

        Object.keys(this.tagMap).map(e => {
            const elementById = this.doc.getElementById(this.tagMap[e] + '-' + this.id);
            const node = nodes.find(x => x.nodeName === e);
            if (node !== undefined && e === node.nodeName) {
                this.r.addClass(elementById, 'active');
            } else {
                this.r.removeClass(elementById, 'active');
            }
        });

        this.foreColour = this.doc.queryCommandValue('ForeColor');
        this.fontSize = this.doc.queryCommandValue('FontSize');
        this.fontName = this.doc.queryCommandValue('FontName').replace(/"/g, '');
        this.backColor = this.doc.queryCommandValue('backColor');
    }

    /**
     * insert URL link
     */
    insertUrl() {
        let url: string;
        let target: LinkTargetType;
        const selection = this.editorService.savedSelection;
        if (selection && selection.commonAncestorContainer.parentElement.nodeName === 'A') {
            const parent = selection.commonAncestorContainer.parentElement as HTMLAnchorElement;
            if (parent.href !== '') {
                url = parent.href;
                target = <LinkTargetType>parent.target
            }
        }
        const dialogRef = this.dialog.open(InsertLinkDialogComponent, {
            width: '405px',
            height: 'auto',
            data: {
                url: url,
                target: target,
                cancel: this.sen['cancel'],
                title: this.sen['insertLink'],
                placeholder: this.sen['insertLinkPlaceholder'],
                urlTitle: this.sen['insertLinkUrlTitle'],
                openInNewWindow: this.sen['openInNewWindow'],
                insertLinkValidatorRequired: this.sen['insertLinkValidatorRequired'],
                insertLinkValidatorPattern: this.sen['insertLinkValidatorPattern']
            }
        });
        dialogRef.afterClosed()
            .pipe(take(1))
            .subscribe((res: LinkDialogResult) => {
                if (res) {
                    this.editorService.restoreSelection();
                    this.editorService.createLink(res.url, res.target);
                }
            });
    }

    /**
     * set font Name/family
     * @param foreColor string
     */
    setFontName(foreColor: string): void {
        this.editorService.setFontName(foreColor);
        this.execute.emit('');
    }

    /**
     * set font Size
     * @param fontSize string
     */
    setFontSize(fontSize: string): void {
        this.editorService.setFontSize(fontSize);
        this.execute.emit('');
    }

    /**
     * toggle editor mode (WYSIWYG or SOURCE)
     * @param m boolean
     */
    setEditorMode(m: boolean) {
        const toggleEditorModeButton = this.doc.getElementById('toggleEditorMode' + '-' + this.id);
        if (m) {
            this.r.addClass(toggleEditorModeButton, 'active');
        } else {
            this.r.removeClass(toggleEditorModeButton, 'active');
        }
        this.htmlMode = m;
    }

    /**
     * Upload image when file is selected
     */
    onFileChanged(event) {
        const file = event.target.files[0];
        if (file.type.includes('image/')) {
            if (this.uploadUrl) {
                this.editorService.uploadImage(file).subscribe(e => {
                    if (e instanceof HttpResponse) {
                        this.editorService.insertImage(e.body.imageUrl);
                        event.srcElement.value = null;
                    }
                });
            } else {
                const reader = new FileReader();
                reader.onload = (e: ProgressEvent) => {
                    const fr = e.currentTarget as FileReader;
                    this.editorService.insertImage(fr.result.toString());
                };
                reader.readAsDataURL(file);
            }
        }
    }

    /**
     * Set custom class
     */
    setCustomClass(classId: string) {
        if (classId === '-1') {
            this.execute.emit('clear');
        } else {
            this.editorService.createCustomClass(this._customClasses[+classId]);
        }
    }

    isButtonHidden(name: string): boolean {
        if (!name) {
            return false;
        }
        if (!(this.hiddenButtons instanceof Array)) {
            return false;
        }
        let result: any;
        for (const arr of this.hiddenButtons) {
            if (arr instanceof Array) {
                result = arr.find(item => item === name);
            }
            if (result) {
                break;
            }
        }
        return result !== undefined;
    }

    insertColorDialog(where: string): void {
        const dialogRef = this.dialog.open(InsertColorDialogComponent, {
            width: '275px',
            height: 'auto',
            data: {
                senDialogTitle: this.sen['insertColorDialogTitle'],
                senPresetColors: this.sen['presetColors'],
                senCancel: this.sen['cancel'],
                customColorPalette: this.customColorPalette
            }
        });

        dialogRef.afterClosed()
            .pipe(takeUntil(this.ngUnsubscribe))
            .subscribe((res: ColorDialogResult) => {
                if (res) {
                    this.insertColor(res.color, where);
                }
            })
    }

    /** insert color */
    private insertColor(color: string, where: string) {
        this.editorService.insertColor(color, where);
        this.execute.emit('');
    }

}
