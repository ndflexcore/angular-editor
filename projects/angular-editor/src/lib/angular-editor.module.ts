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
    MatInputModule,
    MatSlideToggleModule
} from '@angular/material';
import {MessageDialogComponent} from './message-dialog.component';
import {InsertLinkDialogComponent} from './insert-link-dialog.component';
import {EditImageDialogComponent} from './edit-image-dialog.component';

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
        MatCheckboxModule
    ],
    declarations: [
        AngularEditorComponent,
        AngularEditorToolbarComponent,
        AeSelectComponent,
        InsertTableDialogComponent,
        InsertLinkDialogComponent,
        MessageDialogComponent,
        EditImageDialogComponent
    ],
    entryComponents: [
        InsertTableDialogComponent,
        InsertLinkDialogComponent,
        MessageDialogComponent,
        EditImageDialogComponent
    ],
    exports: [
        AngularEditorComponent,
        AngularEditorToolbarComponent,
        InsertTableDialogComponent,
        InsertLinkDialogComponent,
        MessageDialogComponent,
        EditImageDialogComponent
    ]
})
export class AngularEditorModule {
}
