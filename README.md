# ND Flex Core AngularEditor
Fork of @kolkov/angular-editor modified for specific needs of our company. Please use the original repo at https://github.com/kolkov/angular-editor.

### Important versions

**Latest**  
This version introduces several breaking changes:
* uses Ivy compiler
* does not support projects with older CkFinder component for inserting images / files
* requires at least Angular 14
* this version is intended for projects based on Flex Core from 2023

**1.0.81**  
From this version on, all inserted images are  automatically inserted to ```<picture>``` element,
thus webp images will be used, if possible on the target project.  
If you do not plan using webp, use 1.0.80.

## Getting Started

### Installation

Install via [npm][npm] package manager 

```bash
npm install @ndflexcore/angular-editor --save
```

### Usage

Import `angular-editor` module

```js
import { HttpClientModule} from '@angular/common/http';
import { AngularEditorModule } from '@kolkov/angular-editor';

@NgModule({
  imports: [ HttpClientModule, AngularEditorModule ]
})
```

Then in HTML

```html
<angular-editor [placeholder]="'Enter text here...'" [(ngModel)]="htmlContent" (ftpNeeded)="onFtpNeeded($event)" [ftpLink]="selectedFtpLink"></angular-editor>
```

or for usage with reactive forms

```html
<angular-editor formControlName="htmlContent" [config]="editorConfig" (ftpNeeded)="onFtpNeeded($event)" [ftpLink]="selectedFtpLink"></angular-editor>
```

if you using more than one editor on same page set `id` property

```html
<angular-editor id="editor1" formControlName="htmlContent1" [config]="editorConfig" (ftpNeeded)="onFtpNeeded($event)" [ftpLink]="selectedFtpLink"></angular-editor>
<angular-editor id="editor2" formControlName="htmlContent2" [config]="editorConfig" (ftpNeeded)="onFtpNeeded($event)" [ftpLink]="selectedFtpLink"></angular-editor>
```

where

```js
import { AngularEditorConfig } from '@ndflexcore/angular-editor';


editorConfig: AngularEditorConfig = {
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
      placeholder: 'Enter text here...',
      defaultParagraphSeparator: '',
      defaultFontName: '',
      defaultFontSize: '',
      fonts: [
        {class: 'arial', name: 'Arial'},
        {class: 'times-new-roman', name: 'Times New Roman'},
        {class: 'calibri', name: 'Calibri'},
        {class: 'comic-sans-ms', name: 'Comic Sans MS'}
      ],
      customClasses: [
      {
        name: 'quote',
        class: 'quote',
      },
      {
        name: 'redText',
        class: 'redText'
      },
      {
        name: 'titleText',
        class: 'titleText',
        tag: 'h1',
      },
    ],
    uploadUrl: 'v1/image',
    uploadWithCredentials: false,
    sanitize: true,
    toolbarPosition: 'top',
    language: 'cs',
    imageServerUrl: '',
    imageType: 'preview',
    presetWidth: 98,
    presetHeight: 98,
    toolbarHiddenButtons: [
      ['bold', 'italic'],
      ['fontSize']
    ]
};
```
For `ngModel` to work, you must import `FormsModule` from `@angular/forms`, or for `formControlName`, you must import `ReactiveFormsModule` from `@angular/forms`

## API
### Inputs
| Input  | Type | Default | Required | Description |
| ------------- | ------------- | ------------- | ------------- | ------------- |
| id | `string` | `-` | no | Id property when multiple editor used on same page |
| [config] | `AngularEditorConfig` | `default config` | no | config for the editor |
| placeholder | `string` | `-` | no | Set custom placeholder for input area |
| tabIndex | `number` | `-` | no | Set Set tabindex on angular-editor |
| ftpLink | `DirectoryChild` | `-` | no | The ftpLink (either Image or Generic File) from external browser component |

### Outputs

| Output  | Description |
| ------------- | ------------- |
| (html)  | Output html |
| (viewMode)  | Fired when switched visual and html source mode |
| (blur)  | Fired when editor blur |
| (focus)  | Fired when editor focus |
| (ftpNeeded) | Fired when 'Insert Image/File from FTP' toolbar button is clicked

### Methods
 Name  | Description |
| ------------- | ------------- |
| focus  | Focuses the editor element |

### Other
 Name  | Type | Description |
| ------------- | ------------- | ------------- |
| AngularEditorConfig | configuration | Configuration for the AngularEditor component.|

### Configuration

| Input  | Type | Default | Required | Description |
| ------------- | ------------- | ------------- | ------------- | ------------- |
| editable  | `bolean` | `true` | no | Set editing enabled or not |
| spellcheck  | `bolean` | `true` | no | Set spellchecking enabled or not |
| translate  | `sting` | `yes` | no | Set translating enabled or not |
| sanitize  | `bolean` | `true` | no | Set DOM sanitizing enabled or not |
| height  | `string` | `auto` | no | Set height of the editor |
| minHeight  | `string` | `0` | no | Set minimum height of the editor |
| maxHeight  | `string` | `auto` | no | Set maximum height of the editor |
| width  | `string` | `auto` | no | Set width of the editor |
| minWidth  | `string` | `0` | no | Set minimum width of the editor |
| enableToolbar  | `bolean` | `true` | no | Set toolbar enabled or not |
| showToolbar  | `bolean` | `true` | no | Set toolbar visible or not |
| toolbarPosition  | `string` | `top` | no | Set toolbar position top or bottom |
| placeholder  | `string` | `-` | no | Set placeholder text |
| defaultParagraphSeparator  | `string` | `-` | no | Set default paragraph separator such as `p` |
| defaultFontName  | `string` | `-` | no | Set default font such as `Comic Sans MS` |
| defaultFontSize  | `string` | `-` | no | Set default font size such as `1` - `7` |
| uploadUrl  | `string` | `-` | no | Set image upload endpoint `https://api.exapple.com/v1/image/upload` |
| uploadWithCredentials | `bolean` | `false` | no | Set passing or not credentials in the image upload call |
| fonts  | `Font[]` | `-` | no | Set array of available fonts  `[{name, class},...]` |
| customClasses  | `CustomClass[]` | `-` | no | Set array of available fonts  `[{name, class, tag},...]` |
| outline  | `bolean` | `true` | no | Set outline of the editor if in focus |
| toolbarHiddenButtons  | `string[][]` | `-` | no | Set of the array of button names or elements to hide |
| language | 'cs' &#124; 'en'` | `cs` | `yes` | The language of the editor tooltips |
| imageServerUrl | `string` | `-` | `yes` | The URL of the Image Server |
| imageType | `string` | `preview` | `yes` | The Image Type |
| presetWidth| `number` | 98 | `yes` | The preset width of the image, used when user does not enter one |
| presetHeight | `number` | 98 | `yes` | The preset height of the image, used when user does not enter one |

```js
toolbarHiddenButtons: [
  [
    'undo',
    'redo',
    'bold',
    'italic',
    'underline',
    'strikeThrough',
    'subscript',
    'superscript',
    'justifyLeft',
    'justifyCenter',
    'justifyRight',
    'justifyFull',
    'indent',
    'outdent',
    'insertUnorderedList',
    'insertOrderedList',
    'heading',
    'fontName'
  ],
  [
    'fontSize',
    'textColor',
    'backgroundColor',
    'customClasses',
    'link',
    'unlink',
    'insertImage',
    'insertVideo',
    'insertHorizontalRule',
    'removeFormat',
    'toggleEditorMode'
  ]
]
```

## What's included

Within the download you'll find the following directories and files. You'll see something like this:

```
angular-editor/
└── projects/
    ├── angular-editor/
    └── angular-editor-app/
```
`angular-editor/` - library

`angular-editor-app/` - demo application

## Creators

**Andrey Kolkov**

* <https://github.com/kolkov>

The Author of the original repo. Thank you Andrey and Long Life to Russia!

**Petr Humplík on behalf of NetDirect s.r.o.**  

* <https://github.com/ndflexcore>

Author of the specifically modified version (this repo).

## License
MIT
