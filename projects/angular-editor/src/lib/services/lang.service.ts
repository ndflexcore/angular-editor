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
    pasteDisabled: 'Pasting from clipboard is disallowed.',
    cancel: 'Cancel',
    numRows: 'Number of rows',
    numCols: 'Number of columns',
    stroke: 'Stroke',
    insertLinkPlaceholder: '"https://www.boo.com" or "/c/fashion"',
    insertLinkUrlTitle: 'Link URL',
    insertLinkValidatorRequired: 'You must enter a value.',
    insertLinkValidatorPattern: 'Invalid URL format.',
    width: 'Width',
    height: 'Height',
    keepRatio: 'Keep Ratio',
    crop: 'Crop',
    alt: 'Alt',
    title: 'Title',
    editImageDialogTitle: 'Image Properties',
    editTableDialogTitle: 'Edit Table',
    fullWidth: '100% width',
    tableActions: 'Table actions',
    addRows: 'Add Row bellow',
    addColumns: 'Add Column to the Right',
    deleteTable: 'Delete Table',
    h1: 'Heading 1',
    h2: 'Heading 2',
    h3: 'Heading 3',
    h4: 'Heading 4',
    h5: 'Heading 5',
    h6: 'Heading 6',
    p: 'Paragraph',
    clear: 'Default',
    imageActions: 'Image Actions',
    deleteImage: 'Delete Image'
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
    pasteDisabled: 'Funkce vkládání ze schránky je zakázána.',
    cancel: 'Storno',
    numRows: 'Počet řádků',
    numCols: 'Počet sloupců',
    stroke: 'Ohraničení',
    insertLinkPlaceholder: '"https://www.neco.cz" nebo "/c/moda"',
    insertLinkUrlTitle: 'URL odkazu',
    insertLinkValidatorRequired: 'Musíte zadat hodnotu.',
    insertLinkValidatorPattern: 'Neplatný formát URL.',
    width: 'Šířka',
    height: 'Výška',
    keepRatio: 'Zachovat poměr stran',
    crop: 'Ořezat',
    alt: 'Alt',
    title: 'Titulek',
    editImageDialogTitle: 'Vlastnosti obrázku',
    editTableDialogTitle: 'Upravit tabulku',
    fullWidth: '100% šířka',
    tableActions: 'Akce tabulky',
    addRows: 'Přidat řádek pod',
    addColumns: 'Přidat sloupec napravo',
    deleteTable: 'Smazat tabulku',
    h1: 'Nadpis 1',
    h2: 'Nadpis 2',
    h3: 'Nadpis 3',
    h4: 'Nadpis 4',
    h5: 'Nadpis 5',
    h6: 'Nadpis 6',
    p: 'Odstavec',
    clear: 'Výchozí',
    imageActions: 'Akce obrázku',
    deleteImage: 'Smazat obrázek'
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
