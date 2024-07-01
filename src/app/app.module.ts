import { Injector, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { ButtonModule, RadioButtonModule, CheckBoxModule } from '@syncfusion/ej2-angular-buttons';
import { DiagramAllModule, SymbolPaletteAllModule } from '@syncfusion/ej2-angular-diagrams';
import { DropDownListModule, MultiSelectAllModule, DropDownListAllModule, MultiSelectModule, CheckBoxSelectionService } from '@syncfusion/ej2-angular-dropdowns';
import { NumericTextBoxModule, SliderModule, UploaderModule, ColorPickerModule, TextBoxModule } from '@syncfusion/ej2-angular-inputs';
import { ListViewModule } from '@syncfusion/ej2-angular-lists';
import { ContextMenuModule, ToolbarModule } from '@syncfusion/ej2-angular-navigations';
import { DialogModule, TooltipModule } from '@syncfusion/ej2-angular-popups';
import { DropDownButtonModule } from '@syncfusion/ej2-angular-splitbuttons';
import { HomeComponent } from './home/home.component';
import { EditComponent } from './edit/edit.component';
import { CanvasComponent } from './canvas/canvas.component';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    EditComponent,
    CanvasComponent,

  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
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
  bootstrap: [AppComponent]
})
export class AppModule {

  static injector: Injector;

  constructor(injector: Injector) {
    AppModule.injector = injector;
  }
}
