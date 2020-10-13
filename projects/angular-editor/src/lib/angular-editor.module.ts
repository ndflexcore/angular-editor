import {NgModule} from '@angular/core';
import {AngularEditorComponent} from './angular-editor.component';
import {AngularEditorToolbarComponent} from './angular-editor-toolbar.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {CommonModule} from '@angular/common';
import {AeSelectComponent} from './ae-select/ae-select.component';
import {InsertTableDialogComponent} from './insert-table-dialog.component';
import {MatButtonModule, MatDialogModule, MatFormFieldModule, MatInputModule, MatSlideToggleModule} from '@angular/material';
import {MessageDialogComponent} from './message-dialog.component';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        MatFormFieldModule,
        MatDialogModule,
        MatInputModule,
        MatButtonModule,
        MatSlideToggleModule
    ],
    declarations: [
        AngularEditorComponent,
        AngularEditorToolbarComponent,
        AeSelectComponent,
        InsertTableDialogComponent,
        MessageDialogComponent
    ],
    entryComponents: [
        InsertTableDialogComponent,
        MessageDialogComponent
    ],
    exports: [
        AngularEditorComponent,
        AngularEditorToolbarComponent,
        InsertTableDialogComponent,
        MessageDialogComponent
    ]
})
export class AngularEditorModule {
}
