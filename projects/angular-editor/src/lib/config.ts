import {ICustomButtonConfig} from './common/common-interfaces';

export interface CustomClass {
    name: string;
    class: string;
    tag?: string;
}

export interface Font {
    name: string;
    class: string;
}

export interface AngularEditorConfig {
    editable?: boolean;
    spellcheck?: boolean;
    height?: 'auto' | string;
    minHeight?: '0' | string;
    maxHeight?: 'auto' | string;
    width?: 'auto' | string;
    minWidth?: '0' | string;
    translate?: 'yes' | 'now' | string;
    enableToolbar?: boolean;
    showToolbar?: boolean;
    defaultParagraphSeparator?: string;
    defaultFontName?: string;
    defaultFontSize?: '1' | '2' | '3' | '4' | '5' | '6' | '7' | string;
    uploadUrl?: string;
    uploadWithCredentials?: boolean;
    fonts?: Font[];
    customClasses?: CustomClass[];
    sanitize?: boolean;
    toolbarPosition?: 'top' | 'bottom';
    outline?: boolean;
    toolbarHiddenButtons?: string[][];
    imageServerUrl: string;
    extensionsApiUrl: string;
    imageType: string;
    presetWidth: number;
    presetHeight: number;
    tableClass: string;
    tableStrokeClass: string;
    pasteEnabled: boolean;
    customColorPalette: string[];
    customButtons: Array<Array<ICustomButtonConfig>>;
}

export const angularEditorConfig: AngularEditorConfig = {
    editable: true,
    spellcheck: true,
    height: 'auto',
    minHeight: '0',
    maxHeight: 'auto',
    width: 'auto',
    minWidth: '0',
    translate: 'yes',
    enableToolbar: true,
    showToolbar: true,
    defaultParagraphSeparator: '',
    defaultFontName: '',
    defaultFontSize: '',
    fonts: [],
    uploadUrl: 'v1/image',
    uploadWithCredentials: false,
    sanitize: true,
    toolbarPosition: 'top',
    outline: true,
    imageServerUrl: '',
    extensionsApiUrl: '',
    imageType: 'preview',
    presetWidth: 98,
    presetHeight: 98,
    tableClass: '',
    tableStrokeClass: 'table-bordered',
    pasteEnabled: true,
    customColorPalette: [],
    /*toolbarHiddenButtons: [
      ['bold', 'italic', 'underline', 'strikeThrough', 'superscript', 'subscript'],
      ['heading', 'fontName', 'fontSize', 'color'],
      ['justifyLeft', 'justifyCenter', 'justifyRight', 'justifyFull', 'indent', 'outdent'],
      ['cut', 'copy', 'delete', 'removeFormat', 'undo', 'redo'],
      ['paragraph', 'blockquote', 'removeBlockquote', 'horizontalLine', 'orderedList', 'unorderedList'],
      ['link', 'unlink', 'image', 'video']
    ]*/
    customButtons: null
};
