import {NgModule} from '@angular/core';
import {AngularEditorComponent} from './angular-editor.component';
import {AngularEditorToolbarComponent} from './angular-editor-toolbar.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {CommonModule} from '@angular/common';
import {AeSelectComponent} from './ae-select/ae-select.component';
import {InsertTableDialogComponent} from './insert-table-dialog.component';
import { MatLegacyButtonModule as MatButtonModule } from '@angular/material/legacy-button';
import { MatLegacyCheckboxModule as MatCheckboxModule } from '@angular/material/legacy-checkbox';
import { MatLegacyDialogModule as MatDialogModule } from '@angular/material/legacy-dialog';
import { MatLegacyFormFieldModule as MatFormFieldModule } from '@angular/material/legacy-form-field';
import { MatLegacyInputModule as MatInputModule } from '@angular/material/legacy-input';
import { MatLegacyProgressSpinnerModule as MatProgressSpinnerModule } from '@angular/material/legacy-progress-spinner';
import { MatLegacyRadioModule as MatRadioModule } from '@angular/material/legacy-radio';
import { MatLegacySelectModule as MatSelectModule } from '@angular/material/legacy-select';
import { MatLegacySlideToggleModule as MatSlideToggleModule } from '@angular/material/legacy-slide-toggle';
import {MessageDialogComponent} from './message-dialog.component';
import {InsertLinkDialogComponent} from './insert-link-dialog.component';
import {EditImageDialogComponent} from './edit-image-dialog.component';
import {EditTableDialogComponent} from './edit-table-dialog.component';
import {InsertColorDialogComponent} from './insert-color-dialog.component';
import {InsertVideoDialogComponent} from './insert-video-dialog.component';
import {ColorPickerModule} from 'ngx-color-picker';
import {MatIconModule} from '@angular/material/icon';
import {SetColumnWidthsDialogComponent} from './set-column-widths-dialog.component';

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
        MatSelectModule,
        MatIconModule
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
        EditTableDialogComponent,
        SetColumnWidthsDialogComponent
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
        EditTableDialogComponent,
        SetColumnWidthsDialogComponent
    ]
})
export class AngularEditorModule {
}
