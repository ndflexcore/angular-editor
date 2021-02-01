import {NgModule} from '@angular/core';
import {AngularEditorComponent} from './angular-editor.component';
import {AngularEditorToolbarComponent} from './angular-editor-toolbar.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {CommonModule} from '@angular/common';
import {AeSelectComponent} from './ae-select/ae-select.component';
import {InsertTableDialogComponent} from './insert-table-dialog.component';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import {MessageDialogComponent} from './message-dialog.component';
import {InsertLinkDialogComponent} from './insert-link-dialog.component';
import {EditImageDialogComponent} from './edit-image-dialog.component';
import {EditTableDialogComponent} from './edit-table-dialog.component';
import {InsertColorDialogComponent} from './insert-color-dialog.component';
import {InsertVideoDialogComponent} from './insert-video-dialog.component';
import {ColorPickerModule} from 'ngx-color-picker';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        MatFormFieldModule,
        MatDialogModule,
        MatInputModule,
        MatButtonModule,
        MatSlideToggleModule,
        MatCheckboxModule,
        MatProgressSpinnerModule,
        MatRadioModule,
        ColorPickerModule,
        MatSelectModule
    ],
    declarations: [
        AngularEditorComponent,
        AngularEditorToolbarComponent,
        AeSelectComponent,
        InsertTableDialogComponent,
        InsertLinkDialogComponent,
        InsertColorDialogComponent,
        InsertVideoDialogComponent,
        MessageDialogComponent,
        EditImageDialogComponent,
        EditTableDialogComponent
    ],
    entryComponents: [
        InsertTableDialogComponent,
        InsertLinkDialogComponent,
        InsertColorDialogComponent,
        InsertVideoDialogComponent,
        MessageDialogComponent,
        EditImageDialogComponent,
        EditTableDialogComponent
    ],
    exports: [
        AngularEditorComponent,
        AngularEditorToolbarComponent,
        InsertTableDialogComponent,
        InsertColorDialogComponent,
        InsertVideoDialogComponent,
        InsertLinkDialogComponent,
        MessageDialogComponent,
        EditImageDialogComponent,
        EditTableDialogComponent
    ]
})
export class AngularEditorModule {
}
