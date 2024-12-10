import {EventEmitter, Inject, Injectable} from '@angular/core';
import {HttpClient, HttpEvent} from '@angular/common/http';
import {Observable, Subject} from 'rxjs';
import {DOCUMENT} from '@angular/common';
import {AngularEditorConfig, CustomClass} from './config';
import {MatLegacyDialog as MatDialog} from '@angular/material/legacy-dialog';
import {takeUntil} from 'rxjs/operators';
import {ColorWhere, FtpRequest, LinkTargetType, TableDialogResult} from './common/common-interfaces';
import {LangService} from './services/lang.service';
import {randomId} from './common/helpers';

export interface UploadResponse {
    imageUrl: string;
}

@Injectable({
    providedIn: 'root'
})
export class AngularEditorService {

    savedSelection: Range | null;
    selectedText: string;
    uploadUrl: string;
    uploadWithCredentials: boolean;
    sen: { [p: string]: string };
    intervalEmitter: EventEmitter<any> = new EventEmitter<any>();
    ftpLinkRequired: EventEmitter<FtpRequest> = new EventEmitter<FtpRequest>();
    ftpLinkGiven: EventEmitter<string> = new EventEmitter<string>();
    private _linkDialogOpen = false;
    get linkDialogOpen(): boolean {
        return this._linkDialogOpen;
    }

    set linkDialogOpen(value: boolean) {
        this._linkDialogOpen = value;
    }
    private ngUnsubscribe: Subject<any> = new Subject<any>();


    /**
     * generates HTML table string for insertion
     * @param definition .
     * @param config .
     * @param id .
     */
    static createTableHtml(definition: TableDialogResult, config: AngularEditorConfig, id: string): string[] {
        const cls = definition.stroke ? config.tableStrokeClass : config.tableClass;

        const colPct = Math.round(100 / definition.cols);

        const ids = randomId(id);
        const prefix =
            `
<table id="${ids}" class="${cls}">
    <tbody>
 `;
        const suffix =
            `
    </tbody>
</table>
`;
        let inner = ``;
        for (let i = 0; i < definition.rows; i++) {
            inner += `<tr>\n`;
            for (let j = 0; j < definition.cols; j++) {
                inner += `<td style="width: ${colPct}%"></td>\n`;
            }
            inner += `</tr>\n`;
        }
        return [prefix + inner + suffix, ids];
    }


    constructor(private http: HttpClient, @Inject(DOCUMENT) private doc: any, private dialog: MatDialog,
                private langService: LangService) {
        this.sen = this.langService.sen;
        this.langService.languageChanged
            .pipe(takeUntil(this.ngUnsubscribe))
            .subscribe(res => {
                this.sen = res;
            });
    }

    /**
     * Executed command from editor header buttons exclude toggleEditorMode
     * @param command string from triggerCommand
     */
    executeCommand(command: string) {
        const commands = ['h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'p', 'pre'];
        if (commands.includes(command)) {
            this.doc.execCommand('formatBlock', false, command);
            return;
        }
        this.doc.execCommand(command, false, null);
    }

    /**
     * Create URL link
     * @param url string from UI prompt
     * @param target _blank or _self
     */
    createLink(url: string, target: LinkTargetType) {
        const newUrl = `<a href="${url}" target="${target}" rel="noopener">${this.selectedText}</a>`;
        this.insertHtml(newUrl);
    }

    /**
     * insert color either font or background
     *
     * @param color color to be inserted
     * @param where where the color has to be inserted either text/background
     */
    insertColor(color: string, where: ColorWhere): void {
        const restored = this.restoreSelection();
        if (restored) {
            if (where === ColorWhere.text) {
                this.doc.execCommand('foreColor', false, color);
            } else {
                this.doc.execCommand('hiliteColor', false, color);
            }
        }
    }

    /**
     * Set font name
     * @param fontName string
     */
    setFontName(fontName: string) {
        this.doc.execCommand('fontName', false, fontName);
    }

    /**
     * Set font size
     * @param fontSize string
     */
    setFontSize(fontSize: string) {
        this.doc.execCommand('fontSize', false, fontSize);
    }

    /**
     * Create raw HTML
     * @param html HTML string
     */
    insertHtml(html: string): void {
        try {
            /*const isHTMLInserted = */this.doc.execCommand('insertHTML', false, html);
        } catch {

        }

        // if (!isHTMLInserted) {
        //   throw new Error('Unable to perform the operation');
        // }
    }

    /**
     * save selection when the editor is focussed out
     */
    public saveSelection = (): void => {
        if (this.doc.getSelection) {
            const sel = this.doc.getSelection();
            if (sel.getRangeAt && sel.rangeCount) {
                this.savedSelection = sel.getRangeAt(0);
                this.selectedText = sel.toString();
            }
        } else if (this.doc.getSelection && this.doc.createRange) {
            this.savedSelection = document.createRange();
        } else {
            this.savedSelection = null;
        }
    }

    /**
     * restore selection when the editor is focused in
     *
     * saved selection when the editor is focused out
     */
    restoreSelection(): boolean {
        if (this.savedSelection) {
            if (this.doc.getSelection) {
                const sel = this.doc.getSelection();
                sel.removeAllRanges();
                sel.addRange(this.savedSelection);
                return true;
            } else if (this.doc.getSelection /*&& this.savedSelection.select*/) {
                // this.savedSelection.select();
                return true;
            }
        } else {
            return false;
        }
    }

    /**
     * setTimeout used for execute 'saveSelection' method in next event loop iteration
     */
    public executeInNextQueueIteration(callbackFn: (...args: any[]) => any, timeout = 1e2): void {
        setTimeout(callbackFn, timeout);
    }

    /** check any selection is made or not */

    /* unused method ???
    private checkSelection(): any {

        const selectedText = this.savedSelection.toString();

        if (selectedText.length === 0) {
            throw new Error('No Selection Made');
        }
        return true;
    }*/

    /**
     * Upload file to uploadUrl
     * @param file The file
     */
    uploadImage(file: File): Observable<HttpEvent<UploadResponse>> {

        const uploadData: FormData = new FormData();

        uploadData.append('file', file, file.name);

        return this.http.post<UploadResponse>(this.uploadUrl, uploadData, {
            reportProgress: true,
            observe: 'events',
            withCredentials: this.uploadWithCredentials,
        });
    }

    /**
     * Insert image with Url
     * @param imageUrl The imageUrl.
     */
    insertImage(imageUrl: string) {
        this.doc.execCommand('insertImage', false, imageUrl);
    }

    setDefaultParagraphSeparator(separator: string) {
        this.doc.execCommand('defaultParagraphSeparator', false, separator);
    }

    createCustomClass(customClass: CustomClass) {
        let newTag = this.selectedText;
        if (customClass) {
            const tagName = customClass.tag ? customClass.tag : 'span';
            newTag = '<' + tagName + ' class="' + customClass.class + '">' + this.selectedText + '</' + tagName + '>';
        }
        this.insertHtml(newTag);
    }

    nextNode(node) {
        if (node.hasChildNodes()) {
            return node.firstChild;
        } else {
            while (node && !node.nextSibling) {
                node = node.parentNode;
            }
            if (!node) {
                return null;
            }
            return node.nextSibling;
        }
    }

    getRangeSelectedNodes(range, includePartiallySelectedContainers) {
        let node = range.startContainer;
        const endNode = range.endContainer;
        let rangeNodes = [];

        // Special case for a range that is contained within a single node
        if (node === endNode) {
            rangeNodes = [node];
        } else {
            // Iterate nodes until we hit the end container
            while (node && node !== endNode) {
                rangeNodes.push(node = this.nextNode(node));
            }

            // Add partially selected nodes at the start of the range
            node = range.startContainer;
            while (node && node !== range.commonAncestorContainer) {
                rangeNodes.unshift(node);
                node = node.parentNode;
            }
        }

        // Add ancestors of the range container, if required
        if (includePartiallySelectedContainers) {
            node = range.commonAncestorContainer;
            while (node) {
                rangeNodes.push(node);
                node = node.parentNode;
            }
        }

        return rangeNodes;
    }

    getSelectedNodes() {
        const nodes = [];
        if (this.doc.getSelection) {
            const sel = this.doc.getSelection();
            for (let i = 0, len = sel.rangeCount; i < len; ++i) {
                nodes.push.apply(nodes, this.getRangeSelectedNodes(sel.getRangeAt(i), true));
            }
        }
        return nodes;
    }

    replaceWithOwnChildren(el) {
        const parent = el.parentNode;
        while (el.hasChildNodes()) {
            parent.insertBefore(el.firstChild, el);
        }
        if (parent) { parent.removeChild(el); }
    }

    removeSelectedElements(tagNames) {
        if (!tagNames) { return; }

        const tagNamesArray = tagNames.toLowerCase().split(',');
        this.getSelectedNodes().forEach((node) => {
            if (node.nodeType === 1 &&
                tagNamesArray.indexOf(node.tagName.toLowerCase()) > -1) {
                // Remove the node and replace it with its children
                this.replaceWithOwnChildren(node);
            }
        });
    }


}
