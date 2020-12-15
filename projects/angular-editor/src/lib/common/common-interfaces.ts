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

export interface TableDialogResult {
    rows: number;
    cols: number;
    stroke: boolean;
    fullWidth: boolean;
}

export interface EditTableDialogResult {
    stroke: boolean;
    fullWidth: boolean;
}

export interface LinkDialogResult {
    url: string;
}

export interface ImageEditRequest {
    id: string;
    src: string;
    alt: string;
    title: string;
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

