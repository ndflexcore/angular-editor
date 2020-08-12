import {NgModule} from '@angular/core';
import {AngularEditorComponent} from './angular-editor.component';
import {AngularEditorToolbarComponent} from './angular-editor-toolbar.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {CommonModule} from '@angular/common';
import {AeSelectComponent} from './ae-select/ae-select.component';
import {InsertTableDialogComponent} from './insert-table-dialog.component';
import {MatButtonModule, MatDialogModule, MatFormFieldModule, MatInputModule} from '@angular/material';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        MatFormFieldModule,
        MatDialogModule,
        MatInputModule,
        MatButtonModule
    ],
    declarations: [
        AngularEditorComponent,
        AngularEditorToolbarComponent,
        AeSelectComponent,
        InsertTableDialogComponent
    ],
    entryComponents: [
        InsertTableDialogComponent
    ],
    exports: [AngularEditorComponent, AngularEditorToolbarComponent]
})
export class AngularEditorModule {
}
