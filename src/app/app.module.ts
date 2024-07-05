import { Injector, NgModule } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { BrowserModule } from "@angular/platform-browser";

import {
  DiagramAllModule,
  SymbolPaletteAllModule,
} from "@syncfusion/ej2-angular-diagrams";
import {
  ContextMenuModule,
  ToolbarModule,
} from "@syncfusion/ej2-angular-navigations";
import { DialogModule, TooltipModule } from "@syncfusion/ej2-angular-popups";
import { DropDownButtonModule } from "@syncfusion/ej2-angular-splitbuttons";
import {
  DropDownListAllModule,
  DropDownListModule,
  MultiSelectAllModule,
} from "@syncfusion/ej2-angular-dropdowns";
import {
  ButtonModule,
  RadioButtonModule,
  CheckBoxModule,
} from "@syncfusion/ej2-angular-buttons";
import {
  NumericTextBoxModule,
  SliderModule,
  UploaderModule,
  ColorPickerModule,
} from "@syncfusion/ej2-angular-inputs";
import { ListViewModule } from "@syncfusion/ej2-angular-lists";

import { AppComponent } from "./app.component";
import { HomeComponent } from "./home/home.component";
import { HttpClientModule } from "@angular/common/http";
import {
  CheckBoxSelectionService,
  MultiSelectModule,
} from "@syncfusion/ej2-angular-dropdowns";
import { CanvasComponent } from './canvas/canvas.component';
import { AppRoutingModule } from "./app-routing.module";
import { PopupComponent } from './popup/popup.component';

import { TextBoxModule } from '@syncfusion/ej2-angular-inputs';
import { EditComponent } from './edit/edit.component';

@NgModule({
  imports: [
    FormsModule,
    AppRoutingModule,
    DiagramAllModule,
    SymbolPaletteAllModule,
    ListViewModule,
    NumericTextBoxModule,
    DropDownButtonModule,
    ContextMenuModule,
    SliderModule,
    ToolbarModule,
    DropDownListModule,
    ButtonModule,
    RadioButtonModule,
    UploaderModule,
    DialogModule,
    CheckBoxModule,
    MultiSelectAllModule,
    TooltipModule,
    ColorPickerModule,
    BrowserModule,
    DropDownListAllModule,
    HttpClientModule,
    MultiSelectModule,
    TextBoxModule
  ],
  providers: [CheckBoxSelectionService],
  declarations: [AppComponent, HomeComponent, CanvasComponent, PopupComponent, EditComponent],
  bootstrap: [AppComponent],
})
export class AppModule {

  static injector: Injector;

  constructor(injector: Injector) {
    AppModule.injector = injector;
  }
}
