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

