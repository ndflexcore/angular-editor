import {EventEmitter, Injectable} from '@angular/core';

const sen_en: { [p: string]: string } = {
    undo: 'Undo',
    redo: 'Redo',
    bold: 'Bold',
    italic: 'Italic',
    underline: 'Underline',
    strikethrough: 'Strikethrough',
    subscript: 'Subscript',
    superscript: 'Superscript',
    justifyLeft: 'Justify Left',
    justifyCenter: 'Justify Center',
    justifyRight: 'Justify Right',
    justifyFull: 'Justify Full',
    indent: 'Indent',
    outdent: 'Outdent',
    unorderedList: 'Unordered List',
    orderedList: 'Ordered List',
    insertLink: 'Insert Link',
    unlink: 'Unlink',
    insertImage: 'Insert Image',
    insertFtp: 'Insert File/Image from FTP',
    insertVideo: 'Insert Video',
    horizontalLine: 'Horizontal Line',
    insertTable: 'Insert Table',
    clearFormatting: 'Clear Formatting',
    HTMLCode: 'HTML Code',
    textColor: 'Text Color',
    backgroundColor: 'Background Color',
    placeholder: 'Enter text here...',
    notice: 'Notice',
    pasteDisabled: 'Pasting from clipboard is disallowed.'
};

const sen_cs: { [p: string]: string } = {
    undo: 'Zpět',
    redo: 'Znovu',
    bold: 'Tučné',
    italic: 'Kurzíva',
    underline: 'Podtržené',
    strikethrough: 'Přeškrtnuté',
    subscript: 'Dolní index',
    superscript: 'Horní index',
    justifyLeft: 'Zarovnat vlevo',
    justifyCenter: 'Zarovnat doprostřed',
    justifyRight: 'Zarovnat vpravo',
    justifyFull: 'Zarovnat do bloku',
    indent: 'Odsazení',
    outdent: 'Zmenšit odsazení',
    unorderedList: 'Nesetříděný seznam',
    orderedList: 'Setříděný seznam',
    insertLink: 'Vložit odkaz',
    unlink: 'Zrušit odkaz',
    insertImage: 'Vložit obrázek',
    insertFtp: 'Vložit soubor/obrázek z FTP',
    insertVideo: 'Vložit video',
    horizontalLine: 'Vodorovná čára',
    insertTable: 'Vložit tabulku',
    clearFormatting: 'Zrušit formátování',
    HTMLCode: 'HTML kód',
    textColor: 'Barva textu',
    backgroundColor: 'Barva pozadí',
    placeholder: 'Sem zadejte text...',
    notice: 'Upozornění',
    pasteDisabled: 'Funkce vkládání ze schránky je zakázána.'
};

@Injectable({
    providedIn: 'root'
})
export class LangService {
    set lang(value: 'cs' | 'en') {
        this.switchLang(value);
    }

    get sen(): { [p: string]: string } {
        return this._sen;
    }

    set sen(value: { [p: string]: string }) {
        this._sen = value;
    }

    private _sen: { [key: string]: string } = {};

    languageChanged: EventEmitter<{ [key: string]: string }> = new EventEmitter<{ [key: string]: string }>();

    constructor() {
        this.switchLang('cs');
    }

    private switchLang(val: 'cs' | 'en'): void {
        switch (val) {
            case 'cs':
                this.sen = sen_cs;
                break;
            case 'en':
                this.sen = sen_en;
                break;
            default:
                this.sen = sen_cs;
        }
        this.languageChanged.emit(this.sen);
    }
}
