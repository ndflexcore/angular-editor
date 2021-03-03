export type FtpLinkType = 'file' | 'image';

export interface DirectoryChild {
    name: string;
    fullPath: string;
    expandable: boolean;
    fullWebPath: string;
    size: string;
    partialWebPath: string;
    editorId?: string;
    width?: number;
    height?: number;
    alt?: string;
    title?: string;
    crop?: boolean;
}

export interface DirectoryChildOldImageServer {
    editorId: string;
    alt: string;
    title: string;
    height: number;
    width: number;
    fullPath: string;
    type: FtpLinkType
}

export type VerticalCellAlignment = 'top' | 'middle' | 'bottom';

export interface TableDialogResult {
    rows: number;
    cols: number;
    stroke: boolean;
    fullWidth: boolean;
    vAlign: VerticalCellAlignment;
}

export interface EditTableDialogResult {
    stroke: boolean;
    fullWidth: boolean;
    vAlign: VerticalCellAlignment;
}

export type LinkTargetType = '_blank' | '_self';

export interface LinkDialogResult {
    url: string;
    target: LinkTargetType
}

export interface ColorDialogResult {
    color: string;
}

export interface VideoDialogResult {
    videoHtml: string;
}

/*
    used for both in/out
 */
export interface EditImageDialogData {
    width: number;
    height: number;
    alt: string;
    title: string;
    crop: boolean;
}

export interface SelectedObject {
    id: string;
    nodeName: string;
    buttonTitle: string;
    rowIndex?: any;
    cellIndex?: any;
}

export interface FtpRequest {
    editorId: string;
    presetFiles: boolean;
}

