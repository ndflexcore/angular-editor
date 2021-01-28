import {NgModule} from '@angular/core';
import {AngularEditorComponent} from './angular-editor.component';
import {AngularEditorToolbarComponent} from './angular-editor-toolbar.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {CommonModule} from '@angular/common';
import {AeSelectComponent} from './ae-select/ae-select.component';
import {InsertTableDialogComponent} from './insert-table-dialog.component';
import {
    MatButtonModule,
    MatCheckboxModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule, MatProgressSpinnerModule, MatRadioModule,
    MatSlideToggleModule
} from '@angular/material';
import {MessageDialogComponent} from './message-dialog.component';
import {InsertLinkDialogComponent} from './insert-link-dialog.component';
import {EditImageDialogComponent} from './edit-image-dialog.component';
import {EditTableDialogComponent} from './edit-table-dialog.component';
import {InsertColorDialogComponent} from './insert-color-dialog.component';
import {InsertVideoDialogComponent} from './insert-video-dialog.component';

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
        MatRadioModule
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
