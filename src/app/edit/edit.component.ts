import {
  Component,
  ViewEncapsulation,
  ViewChild,
  AfterViewInit,
  OnInit,
  inject,
} from "@angular/core";
import { formatUnit, createElement, closest, Ajax } from "@syncfusion/ej2-base";
import { UploaderComponent } from "@syncfusion/ej2-angular-inputs";

import Map from 'ol/Map';
import View from 'ol/View';
import TileLayer from 'ol/layer/Tile';
import OSM from 'ol/source/OSM';
import Feature from 'ol/Feature';
import Point from 'ol/geom/Point';
import { fromLonLat } from 'ol/proj';
import VectorSource from 'ol/source/Vector';
import VectorLayer from 'ol/layer/Vector';
import Style from 'ol/style/Style';
import Icon from 'ol/style/Icon';

import {
  ItemModel as ToolbarItemModel,
  OpenCloseMenuEventArgs,
  MenuEventArgs as ContextMenuEventArgs,
  ClickEventArgs,
  ToolbarComponent,
  MenuAnimationSettingsModel,
} from "@syncfusion/ej2-angular-navigations";
import {
  BeforeOpenCloseMenuEventArgs,
  MenuEventArgs,
  DropDownButtonComponent,
} from "@syncfusion/ej2-angular-splitbuttons";
import {
  DialogComponent,
  PositionDataModel,
  TooltipEventArgs,
  Position,
} from "@syncfusion/ej2-angular-popups";
import {
  AnimationSettingsModel,
  TooltipComponent,
} from "@syncfusion/ej2-angular-popups";
import {
  FieldSettingsModel,
  DropDownListComponent,
} from "@syncfusion/ej2-angular-dropdowns";
import { Button, ButtonComponent, CheckBoxComponent } from "@syncfusion/ej2-angular-buttons";
import {
  DiagramComponent,
  Diagram,
  NodeModel,
  ConnectorModel,
  Node,
  Connector,
  NodeConstraints,
  ShapeAnnotationModel,
  ConnectorConstraints,
  DiagramTools,
  SnapConstraints,
  AlignmentOptions,
  UndoRedo,
  DiagramContextMenu,
  Snapping,
  BpmnDiagrams,
  HierarchicalTree,
  PrintAndExport,
  MindMap as MindMapTree,
  ZoomOptions,
  DataBinding,
  Overview,
  DiagramRegions,
  ConnectorBridging,
  LayoutAnimation,
  UserHandleModel,
  FileFormats,
  SymbolPalette,
  CommandManagerModel,
  Keys,
  KeyModifiers,
  SelectorConstraints,
  ICollectionChangeEventArgs,
  DiagramAction,
  SnapSettingsModel,
  PageSettingsModel,
  ScrollSettingsModel,
  SelectorModel,
  ContextMenuSettingsModel,
  IDropEventArgs,
  SymbolPaletteComponent,
} from "@syncfusion/ej2-angular-diagrams";
import { PageCreation } from "../scripts/pages";
import { SelectorViewModel } from "../scripts/selector";
import { CustomTool } from "../scripts/userhandles";
import { OrgChartUtilityMethods, OrgChartData } from "../scripts/orgchart";
import { CustomProperties } from "../scripts/customproperties";
import { DiagramBuilderLayer } from "../scripts/layers";
import { DropDownDataSources } from "../scripts/dropdowndatasource";
import { DownloadExampleFiles } from "../scripts/downloaddata";
import { DiagramTheme } from "../scripts/themes";
import { PaperSize } from "../scripts/utilitymethods";
import { CommonKeyboardCommands } from "../scripts/commoncommands";
import {
  DiagramClientSideEvents,
  DiagramPropertyBinding,
  MindMapPropertyBinding,
  OrgChartPropertyBinding,
} from "../scripts/events";
import { Palettes } from "../scripts/palettes";
import { MindMap, MindMapUtilityMethods } from "../scripts/mindmap";
import {
  ListViewComponent,
  FieldsMapping,
  SelectedCollection,
  SelectEventArgs,
  cssClass,
} from "@syncfusion/ej2-angular-lists";
import { HttpClient } from "@angular/common/http";
import { PopupService } from "../service/popup.service";
import { DataShareService } from "../service/data-share.service";
import { bootstrapApplication } from "@angular/platform-browser";
import { ApiService } from "../service/api.service";

Diagram.Inject(UndoRedo, DiagramContextMenu, Snapping, DataBinding);
Diagram.Inject(
  PrintAndExport,
  BpmnDiagrams,
  HierarchicalTree,
  MindMapTree,
  ConnectorBridging,
  LayoutAnimation
);
SymbolPalette.Inject(BpmnDiagrams);

@Component({
  selector: "app-edit",
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.css'],
  encapsulation: ViewEncapsulation.None,
})
export class EditComponent implements AfterViewInit, OnInit {
  @ViewChild("diagram")
  public diagram: DiagramComponent;

  @ViewChild("symbolpalette")
  public symbolpalette: SymbolPaletteComponent;

  @ViewChild("printDialog")
  public printDialog: DialogComponent;

  @ViewChild("exportDialog")
  public exportDialog: DialogComponent;

  @ViewChild("fileUploadDialog")
  public fileUploadDialog: DialogComponent;

  @ViewChild("openTemplateDialog")
  public openTemplateDialog: DialogComponent;

  @ViewChild("saveDialog")
  public saveDialog: DialogComponent;

  @ViewChild("customPropertyDialog")
  public customPropertyDialog!: DialogComponent;

  @ViewChild("layerDialog")
  public layerDialog!: DialogComponent;

  @ViewChild("tooltipDialog")
  public tooltipDialog: DialogComponent;

  @ViewChild("hyperlinkDialog")
  public hyperlinkDialog: DialogComponent;

  @ViewChild("themeDialog")
  public themeDialog: DialogComponent;

  @ViewChild("deleteConfirmationDialog")
  public deleteConfirmationDialog: DialogComponent;

  @ViewChild("moreShapesDialog")
  public moreShapesDialog: DialogComponent;

  @ViewChild("btnHelpMenu")
  public btnHelpMenu: DropDownButtonComponent;

  @ViewChild("toolbarEditor")
  public toolbarEditor: ToolbarComponent;

  @ViewChild("btnDrawShape")
  public btnDrawShape: DropDownButtonComponent;

  @ViewChild("btnDrawConnector")
  public btnDrawConnector: DropDownButtonComponent;

  @ViewChild("defaultupload")
  public defaultupload: UploaderComponent;

  @ViewChild("tooltip")
  public tooltip: TooltipComponent;

  @ViewChild("btnDownloadFile")
  public btnDownloadFile: ButtonComponent;

  @ViewChild("ddlTextPosition")
  public ddlTextPosition: DropDownListComponent;

  @ViewChild("moreShapesList")
  public moreShapesList: ListViewComponent;

  /* ContextMenu Animation Settings */
  public animationSettings: MenuAnimationSettingsModel = { effect: "None" };

  /* DropDown Members */
  public dropdownListFields: FieldSettingsModel = {
    text: "text",
    value: "value",
  };

  /* Dialog Members Start */
  public dialogAnimationSettings: AnimationSettingsModel = { effect: "None" };
  public dlgTarget: HTMLElement = document.body;

  public exportingButtons: Object[] = this.getDialogButtons("export");
  public printingButtons: Object[] = this.getDialogButtons("print");
  public saveButtons: Object[] = this.getDialogButtons("save");
  public tooltipButtons: Object[] = this.getDialogButtons("tooltip");
  public moreShapesButtons: Object[] = this.getDialogButtons("moreshapes");
  public hyperlinkButtons: Object[] = this.getDialogButtons("hyperlink");
  public deleteConfirmationButtons: Object[] =
    this.getDialogButtons("deleteconfirmation");
  public uploadButtons: Object[] = this.getUploadButtons();
  public dialogPosition: PositionDataModel = { X: 100, Y: 112 };
  public dialogVisibility: boolean = false;
  public isModalDialog: boolean = false;
  public themesdialogPosition: PositionDataModel = { X: "right", Y: 112 };

  public listViewFields: FieldsMapping = { isChecked: "checked" };

  /* Dialog Members End */

  /* Tooltip Members */
  public tooltipPosition: Position = "RightCenter";

  /* Upload Members */
  public path: Object = {
    saveUrl: "https://aspnetmvc.syncfusion.com/services/api/uploadbox/Save",
    removeUrl: "https://aspnetmvc.syncfusion.com/services/api/uploadbox/Remove",
  };

  /* Global Member Variables */
  public dropDownDataSources: DropDownDataSources = new DropDownDataSources();
  public selectedItem: SelectorViewModel = new SelectorViewModel();
  public page: PageCreation = new PageCreation(this.selectedItem);
  public customProperty: CustomProperties = new CustomProperties(
    this.selectedItem,
    this.customPropertyDialog as unknown as DialogComponent
  );
  public diagramLayer: DiagramBuilderLayer = new DiagramBuilderLayer(
    this.selectedItem,
    this.layerDialog as unknown as DialogComponent
  );
  public diagramEvents: DiagramClientSideEvents = new DiagramClientSideEvents(
    this.selectedItem,
    this.page
  );
  public diagramPropertyBinding: DiagramPropertyBinding =
    new DiagramPropertyBinding(this.selectedItem, this.page);
  public mindmapPropertyBinding: MindMapPropertyBinding =
    new MindMapPropertyBinding(this.selectedItem);
  public orgChartPropertyBinding: OrgChartPropertyBinding =
    new OrgChartPropertyBinding(this.selectedItem);
  public palettes: Palettes = new Palettes();
  public downloadFile: DownloadExampleFiles;
  public diagramThemes: DiagramTheme = new DiagramTheme(this.selectedItem);

  public layerFooterTemplate: string = this.diagramLayer.getLayerBottomPanel();
  private initLayerPanel: boolean = false;
  public pasteData: boolean = false;
  public overview: Overview;

  public ngAfterViewInit(): void {
    this.generateDiagram();
    this.page.addNewPage();

    this.diagramEvents.ddlTextPosition = this.ddlTextPosition;
    this.customProperty.customPropertyDialog = this.customPropertyDialog;
    this.diagramLayer.layerDialog = this.layerDialog;

    this.downloadFile = new DownloadExampleFiles(this.selectedItem);
    this.selectedItem.utilityMethods.page = this.page;
    this.selectedItem.utilityMethods.tempDialog = this.openTemplateDialog;
    this.selectedItem.utilityMethods.toolbarEditor = this.toolbarEditor;

    OrgChartUtilityMethods.uploadDialog = this.fileUploadDialog;
    OrgChartUtilityMethods.customPropertyDialog = this.customPropertyDialog;

    CommonKeyboardCommands.selectedItem = this.selectedItem;
    CommonKeyboardCommands.page = this.page;

    document.getElementById("btnHideToolbar").onclick =
      this.hideMenuBar.bind(this);
    document.getElementById("diagramContainerDiv").onmouseleave =
      this.diagramThemes.setNodeOldStyles.bind(this.diagramThemes);
    document.onmouseover = this.menumouseover.bind(this);

    let context: any = this;
    setTimeout(() => {
      context.loadPage();
    }, 2000);
    setInterval(() => {
      context.savePage();
    }, 2000);

    window.onbeforeunload = this.closeWindow.bind(this);
  }

  private closeWindow(evt: BeforeUnloadEvent): BeforeUnloadEvent {
    let message: string = "Are you sure you want to close?";
    if (evt && this.selectedItem.isModified) {
      evt.returnValue = message;
      return evt;
    }
    return null;
  }

  public collectionChange(args: ICollectionChangeEventArgs): void {
    if (this.selectedItem.diagramType === "GeneralDiagram") {
      if (
        args.state === "Changed" &&
        args.type === "Addition" &&
        args.cause === (DiagramAction.Render | DiagramAction.ToolAction)
      ) {
        if (
          this.selectedItem.themeStyle !== undefined &&
          this.selectedItem.themeStyle !== null
        ) {
          this.diagramThemes.applyThemeStyleforElement(args.element, null);
        }
        this.selectedItem.isModified = true;
      }
    } else {
      if (args.state === "Changed" && this.selectedItem.isCopyLayoutElement) {
        if (args.element instanceof Node) {
          if (args.element.addInfo) {
            if (
              (args.element.addInfo as { [key: string]: Object }).isFirstNode
            ) {
              this.selectedItem.pastedFirstItem = args.element;
            }
          }
        }
        this.selectedItem.isModified = true;
      }
    }
  }

  public drop(args: IDropEventArgs): void {

    if (this.selectedItem.diagramType === "OrgChart") {
      let diagram: Diagram = this.selectedItem.selectedDiagram;
      let source: object = args.source;
      let sourceNode: Node;
      if (source instanceof Diagram) {
        if (diagram.selectedItems.nodes.length === 1) {
          sourceNode = diagram.selectedItems.nodes[0] as Node;
        }
      } else if (source instanceof Node) {
        sourceNode = source;
      }
      if (
        sourceNode !== null &&
        sourceNode.id !== "rootNode" &&
        args.target instanceof Node
      ) {
        let targetNode: Node = args.target;
        let connector: Connector = diagram.getObject(
          sourceNode.inEdges[0]
        ) as Connector;
        connector.sourceID = targetNode.id;
        diagram.dataBind();
      }
      diagram.doLayout();
    }
  }


  public themeDialogCreated(args: Object): void {
    let themeDialogContent: HTMLElement =
      document.getElementById("themeDialogContent");
    themeDialogContent.onmouseover = this.diagramThemes.themeMouseOver.bind(
      this.diagramThemes
    );
    themeDialogContent.onclick = this.diagramThemes.themeClick.bind(
      this.diagramThemes
    );
    themeDialogContent.onmouseleave = this.diagramThemes.applyOldStyle.bind(
      this.diagramThemes
    );
  }

  public tooltipCreated(args: Object): void {
    this.tooltip.target = ".db-info-style";
  }

  // Rename Implementation - Start
  public renameDiagram(args: MouseEvent): void {
    document
      .getElementsByClassName("db-diagram-name-container")[0]
      .classList.add("db-edit-name");
    let element: HTMLInputElement = document.getElementById(
      "diagramEditable"
    ) as HTMLInputElement;
    element.value = document.getElementById("diagramName").innerHTML;
    element.focus();
    element.select();
  }

  public moreShapesClick(args: MouseEvent): void {
    this.moreShapesDialog.show();
  }

  public diagramNameChange(args: MouseEvent): void {
    document.getElementById("diagramName").innerHTML = (
      document.getElementById("diagramEditable") as HTMLInputElement
    ).value;
    document
      .getElementsByClassName("db-diagram-name-container")[0]
      .classList.remove("db-edit-name");
    this.selectedItem.exportSettings.fileName =
      document.getElementById("diagramName").innerHTML;
  }

  public diagramNameKeyDown(args: KeyboardEvent): void {
    if (args.which === 13) {
      document.getElementById("diagramName").innerHTML = (
        document.getElementById("diagramEditable") as HTMLInputElement
      ).value;
      document
        .getElementsByClassName("db-diagram-name-container")[0]
        .classList.remove("db-edit-name");
    }
  }
  // Rename Implementation - End

  public loadPage(): void {
    (
      document.getElementsByClassName(
        "diagrambuilder-container"
      )[0] as HTMLDivElement
    ).style.display = "";
    this.selectedItem.selectedDiagram.updateViewPort();
    this.overview = new Overview({
      width: "255px",
      height: "200px",
      sourceID: "diagram",
    });
    this.overview.appendTo("#overview");
    document.getElementById("overviewspan").onclick =
      this.overviewSpanClick.bind(this);
    document.getElementsByClassName("sidebar")[0].className = "sidebar";
    if (window.location.search.length === 0) {
      this.selectedItem.uniqueId = this.selectedItem.randomIdGenerator();
      (
        document.getElementsByClassName(
          "sb-content-overlay"
        )[0] as HTMLDivElement
      ).style.display = "none";

      this.openTemplateDialog.content =
        this.selectedItem.utilityMethods.getDefaultDiagramTemplates1(
          this.selectedItem
        );
      this.diagram.layers[0].addInfo = { name: "Layer0" };
    } else {
      // let dataValue: string = window.location.search.split('?id=')[1];
      // let ajax: Ajax = new Ajax('https://ej2services.syncfusion.com/development/web-services/api/Diagram/LoadJson', 'POST', true, 'application/json');
      // let datastring: string = JSON.stringify({
      //     DiagramName: dataValue,
      // });
      // ajax.send(datastring).then();
      // ajax.onSuccess = (data: string): void => {
      //     this.selectedItem.preventSelectionChange = true;
      //     this.page.loadPage(data);
      //     this.selectedItem.isTemplateLoad = true;
      //     if (this.selectedItem.diagramType === 'MindMap') {
      //         MindMapUtilityMethods.selectedItem = this.selectedItem;
      //         let mindMapObject: MindMap = new MindMap(this.selectedItem);
      //         mindMapObject.createMindMap(false);
      //     } else if (this.selectedItem.diagramType === 'OrgChart') {
      //         OrgChartUtilityMethods.selectedItem = this.selectedItem;
      //         let orgChartObject: OrgChartData = new OrgChartData(this.selectedItem);
      //         orgChartObject.createOrgChart(false);
      //     }
      //     this.page.loadDiagramSettings();
      //     this.selectedItem.isTemplateLoad = false;
      //     this.selectedItem.preventSelectionChange = false;
      //     (document.getElementsByClassName('sb-content-overlay')[0] as HTMLDivElement).style.display = 'none';
      // };
      // ajax.onFailure = (args: string): void => {
      //     (document.getElementsByClassName('sb-content-overlay')[0] as HTMLDivElement).style.display = 'none';
      // };
      // ajax.onError = (args: Event): Object => {
      //     (document.getElementsByClassName('sb-content-overlay')[0] as HTMLDivElement).style.display = 'none';
      //     return null;
      // };
    }
    this.selectedItem.exportSettings.fileName =
      document.getElementById("diagramName").innerHTML;
  }

  public savePage(): void {
    // this.page.loadJson();
  }

  public overviewSpanClick(args: MouseEvent): void {
    let target: HTMLElement = args.target as HTMLElement;
    let element: Element = document.getElementsByClassName("sidebar")[0];
    if (element.classList.contains("show-overview")) {
      element.classList.remove("show-overview");
      target.className = "db-overview";
    } else {
      element.classList.add("show-overview");
      target.className = "db-overview active";
      this.overview.refresh();
    }
  }

  // Menu Type Implementation for DropDown Button - Start
  private buttonInstance: any;
  public menumouseover(args: MouseEvent): void {
    let target: any = args.target as HTMLButtonElement;
    if (
      target &&
      (target.className ===
        "e-control e-dropdown-btn e-lib e-btn db-dropdown-menu" ||
        target.className ===
        "e-control e-dropdown-btn e-lib e-btn db-dropdown-menu e-ddb-active")
    ) {
      if (this.buttonInstance && this.buttonInstance.id !== target.id) {
        if (
          this.buttonInstance
            .getPopUpElement()
            .classList.contains("e-popup-open")
        ) {
          this.buttonInstance.toggle();
          let buttonElement: any = document.getElementById(
            this.buttonInstance.element.id
          );
          buttonElement.classList.remove("e-btn-hover");
        }
      }
      let button1: any = target.ej2_instances[0];
      this.buttonInstance = button1;
      if (button1.getPopUpElement().classList.contains("e-popup-close")) {
        button1.toggle();
        if (button1.element.id === "btnArrangeMenu") {
          this.selectedItem.utilityMethods.enableArrangeMenuItems(
            this.selectedItem
          );
        }
        let buttonElement: any = document.getElementById(
          this.buttonInstance.element.id
        );
        buttonElement.classList.add("e-btn-hover");
      }
    } else {
      if (
        closest(target, ".e-dropdown-popup") === null &&
        closest(target, ".e-dropdown-btn") === null
      ) {
        if (
          this.buttonInstance &&
          this.buttonInstance
            .getPopUpElement()
            .classList.contains("e-popup-open")
        ) {
          this.buttonInstance.toggle();
          let buttonElement: any = document.getElementById(
            this.buttonInstance.element.id
          );
          buttonElement.classList.remove("e-btn-hover");
        }
      }
    }
  }

  // Menu Type Implementation for DropDown Button - End

  public hideMenuBar(): void {
    let expandcollapseicon: any = document.getElementById(
      "btnHideToolbar"
    ) as HTMLElement;
    let button1: Button = expandcollapseicon.ej2_instances[0];
    if (button1.iconCss.indexOf("sf-icon-Collapse tb-icons") > -1) {
      button1.iconCss = "sf-icon-DownArrow2 tb-icons";
    } else {
      button1.iconCss = "sf-icon-Collapse tb-icons";
    }
    this.selectedItem.utilityMethods.hideElements(
      "hide-menubar",
      this.selectedItem.selectedDiagram
    );
    this.selectedItem.selectedDiagram.refresh();
  }

  public arrangeContextMenuBeforeOpen(
    args: BeforeOpenCloseMenuEventArgs
  ): void {
    this.selectedItem.utilityMethods.enableArrangeMenuItems(this.selectedItem);
  }

  public arrangeMenuBeforeOpen(args: BeforeOpenCloseMenuEventArgs): void {
    this.updateMenuStyle(args);
    if (
      args.event &&
      closest(args.event.target as Element, ".e-dropdown-btn") !== null
    ) {
      args.cancel = true;
    }
  }
  private updateMenuStyle(args: BeforeOpenCloseMenuEventArgs): void {
    for (let i: number = 0; i < args.element.children.length; i++) {
      (args.element.children[i] as HTMLElement).style.display = "block";
    }
  }

  public arrangeMenuBeforeClose(args: BeforeOpenCloseMenuEventArgs): void {
    if (
      args.event &&
      closest(args.event.target as Element, ".e-dropdown-btn") !== null
    ) {
      args.cancel = true;
    }
    if (!args.element) {
      args.cancel = true;
    }
  }

  public arrangeContextMenuOpen(args: OpenCloseMenuEventArgs): void {
    if (args.element.classList.contains("e-menu-parent")) {
      let popup: HTMLElement = document.querySelector(
        "#btnArrangeMenu-popup"
      ) as HTMLElement;
      args.element.style.left = formatUnit(
        parseInt(args.element.style.left, 10) - parseInt(popup.style.left, 10)
      );
      args.element.style.top = formatUnit(
        parseInt(args.element.style.top, 10) - parseInt(popup.style.top, 10)
      );
    }
  }

  public getUploadButtons(): Object[] {
    let buttons: Object[] = [];
    buttons.push({
      click: this.btnCancelClick.bind(this),
      buttonModel: { content: "Cancel", cssClass: "e-flat", isPrimary: true },
    });
    buttons.push({
      click: this.btnUploadNext.bind(this),
      buttonModel: {
        content: "Next",
        cssClass: "e-flat e-db-primary",
        isPrimary: true,
      },
    });
    return buttons;
  }

  public getDialogButtons(dialogType: string): Object[] {
    let buttons: Object[] = [];
    switch (dialogType) {
      case "export":
        buttons.push({
          click: this.btnExportClick.bind(this),
          buttonModel: {
            content: "Export",
            cssClass: "e-flat e-db-primary",
            isPrimary: true,
          },
        });
        break;
      case "print":
        buttons.push({
          click: this.btnPrintClick.bind(this),
          buttonModel: {
            content: "Print",
            cssClass: "e-flat e-db-primary",
            isPrimary: true,
          },
        });
        break;
      case "save":
        buttons.push({
          click: this.btnSave.bind(this),
          buttonModel: {
            content: "Save",
            cssClass: "e-flat e-db-primary",
            isPrimary: true,
          },
        });
        break;
      case "tooltip":
        buttons.push({
          click: this.btnTooltip.bind(this),
          buttonModel: {
            content: "Apply",
            cssClass: "e-flat e-db-primary",
            isPrimary: true,
          },
        });
        break;
      case "hyperlink":
        buttons.push({
          click: this.btnHyperLink.bind(this),
          buttonModel: {
            content: "Apply",
            cssClass: "e-flat e-db-primary",
            isPrimary: true,
          },
        });
        break;
      case "deleteconfirmation":
        buttons.push({
          click: this.btnDeleteConfirmation.bind(this),
          buttonModel: {
            content: "Ok",
            cssClass: "e-flat e-db-primary",
            isPrimary: true,
          },
        });
        break;
      case "moreshapes":
        buttons.push({
          click: this.btnMoreShapes.bind(this),
          buttonModel: {
            content: "Apply",
            cssClass: "e-flat e-db-primary",
            isPrimary: true,
          },
        });
        break;
    }
    buttons.push({
      click: this.btnCancelClick.bind(this),
      buttonModel: { content: "Cancel", cssClass: "e-flat", isPrimary: true },
    });
    return buttons;
  }

  private btnMoreShapes(args: MouseEvent): void {
    let listSelectedItem: SelectedCollection =
      this.moreShapesList.getSelectedItems() as SelectedCollection;
    if (listSelectedItem.text.length > 0) {
      this.symbolpalette.palettes = this.palettes.getPalettes(
        listSelectedItem.text as string[]
      );
      this.moreShapesDialog.hide();
    }
  }

  private listViewSelectionChange(args: SelectEventArgs): void {
    (document.getElementById("shapePreviewImage") as HTMLImageElement).src =
      "./assets/dbstyle/shapes_images/" + args.text.toLowerCase() + ".png";
  }

  private btnDeleteConfirmation(args: MouseEvent): void {
    this.customProperty.removeProperty(args);
  }

  private btnUploadNext(args: MouseEvent): void {
    let target: any = args.target;
    let buttonInstance: any = target.ej2_instances[0];
    let uploadDialogContent: any = document.getElementById(
      "uploadDialogContent"
    );
    if (OrgChartUtilityMethods.isUploadSuccess) {
      if (uploadDialogContent.className === "db-upload-content firstPage") {
        if (OrgChartUtilityMethods.fileType === "xml") {
          this.fileUploadDialog.header = " Define Employee Information";
          uploadDialogContent.className = "db-upload-content thirdPage";
          buttonInstance.content = "Finish";
        } else {
          this.fileUploadDialog.header =
            " Define Employee - Supervisor Relationship";
          uploadDialogContent.className = "db-upload-content secondPage";
        }
      } else if (
        uploadDialogContent.className === "db-upload-content secondPage"
      ) {
        let id: string = this.selectedItem.orgDataSettings.id;
        let parent: string = this.selectedItem.orgDataSettings.parent;
        if (id && parent) {
          if (!OrgChartUtilityMethods.validateParentChildRelation()) {
            alert(
              'We haven"t found the parent child relationship between the chosen fields'
            );
          } else {
            this.fileUploadDialog.header = " Define Employee Information";
            uploadDialogContent.className = "db-upload-content thirdPage";
            buttonInstance.content = "Finish";
          }
        } else {
          alert('EmployeeId and SupervisorId can"t be empty');
        }
      } else {
        let nameField: string = this.selectedItem.orgDataSettings.nameField;
        if (nameField) {
          uploadDialogContent.className = "db-upload-content firstPage";
          buttonInstance.content = "Next";
          OrgChartUtilityMethods.applyDataSource();
          this.defaultupload.clearAll();
        } else {
          alert('Name field can"t be empty');
        }
      }
    }
  }

  private btnCancelClick(args: MouseEvent): void {
    let ss: HTMLElement = args.target as HTMLElement;
    let key: string = ss.offsetParent.id;
    switch (key) {
      case "exportDialog":
        this.exportDialog.hide();
        break;
      case "printDialog":
        this.printDialog.hide();
        break;
      case "saveDialog":
        this.saveDialog.hide();
        break;
      case "customPropertyDialog":
        this.customPropertyDialog.hide();
        break;
      case "tooltipDialog":
        this.tooltipDialog.hide();
        break;
      case "hyperlinkDialog":
        this.hyperlinkDialog.hide();
        break;
      case "deleteConfirmationDialog":
        this.deleteConfirmationDialog.hide();
        break;
      case "fileUploadDialog":
        this.fileUploadDialog.hide();
        OrgChartUtilityMethods.isUploadSuccess = false;
        break;
      case "moreShapesDialog":
        this.moreShapesDialog.hide();
        break;
    }
  }

  private btnHyperLink(): void {
    let node: Node = this.selectedItem.selectedDiagram.selectedItems
      .nodes[0] as Node;
    if (node.annotations.length > 0) {
      node.annotations[0].hyperlink.link = (
        document.getElementById("hyperlink") as HTMLInputElement
      ).value;
      node.annotations[0].hyperlink.content = (
        document.getElementById("hyperlinkText") as HTMLInputElement
      ).value;
      this.applyToolTipforHyperlink(node);
      this.selectedItem.selectedDiagram.dataBind();
    } else {
      let annotation: ShapeAnnotationModel = {
        hyperlink: {
          content: (
            document.getElementById("hyperlinkText") as HTMLInputElement
          ).value,
          link: (document.getElementById("hyperlink") as HTMLInputElement)
            .value,
        },
      };
      this.selectedItem.selectedDiagram.addLabels(node, [annotation]);
      this.applyToolTipforHyperlink(node);
      this.selectedItem.selectedDiagram.dataBind();
    }
    this.hyperlinkDialog.hide();
  }

  private applyToolTipforHyperlink(node: Node): void {
    node.constraints =
      (NodeConstraints.Default & ~NodeConstraints.InheritTooltip) |
      NodeConstraints.Tooltip;
    node.tooltip = {
      content: node.annotations[0].hyperlink.link,
      relativeMode: "Object",
      position: "TopCenter",
      showTipPointer: true,
    };
  }

  private btnTooltip(): void {
    let diagram: Diagram = this.selectedItem.selectedDiagram;
    if (this.selectedItem.selectedDiagram.selectedItems.nodes.length > 0) {
      let node: NodeModel =
        this.selectedItem.selectedDiagram.selectedItems.nodes[0];
      this.customProperty.setTooltip(
        node,
        (document.getElementById("objectTooltip") as HTMLTextAreaElement).value
      );
      this.selectedItem.nodeProperties.tooltip = node.tooltip.content as string;
      diagram.dataBind();
    }
    this.tooltipDialog.hide();
  }

  private btnSave(): void {
    CommonKeyboardCommands.download(
      this.page.savePage(),
      (document.getElementById("saveFileName") as HTMLInputElement).value
    );
    this.saveDialog.hide();
  }

  private registerBrowseEvent: boolean = false;
  public btnImportClick(args: MouseEvent): void {
    if (!this.registerBrowseEvent) {
      this.defaultupload.dropArea = document.getElementById("dropRegion");
      document.getElementById("browseFile").onclick = () => {
        document
          .getElementsByClassName("e-file-select-wrap")[0]
          .querySelector("button")
          .click();
        return false;
      };
      this.registerBrowseEvent = true;
    }
    this.selectedItem.orgDataSettings.extensionType = ".csv";
    CommonKeyboardCommands.isOpen = false;
    this.defaultupload.clearAll();
    let uploadDialogContent: any = document.getElementById(
      "uploadDialogContent"
    );
    uploadDialogContent.className = "db-upload-content firstPage";
    OrgChartUtilityMethods.showUploadDialog();
  }

  private btnExportClick(): void {
    let diagram: Diagram = this.selectedItem.selectedDiagram;
    diagram.exportDiagram({
      fileName: this.selectedItem.exportSettings.fileName,
      format: this.selectedItem.exportSettings.format as FileFormats,
      region: this.selectedItem.exportSettings.region as DiagramRegions,
    });
    this.exportDialog.hide();
  }

  private btnPrintClick(): void {
    let pageWidth: number = this.selectedItem.printSettings.pageWidth;
    let pageHeight: number = this.selectedItem.printSettings.pageHeight;
    let paperSize: PaperSize = this.selectedItem.utilityMethods.getPaperSize(
      this.selectedItem.printSettings.paperSize
    );
    if (paperSize.pageHeight && paperSize.pageWidth) {
      pageWidth = paperSize.pageWidth;
      pageHeight = paperSize.pageHeight;
    }
    if (this.selectedItem.pageSettings.isPortrait) {
      if (pageWidth > pageHeight) {
        let temp: number = pageWidth;
        pageWidth = pageHeight;
        pageHeight = temp;
      }
    } else {
      if (pageHeight > pageWidth) {
        let temp: number = pageHeight;
        pageHeight = pageWidth;
        pageWidth = temp;
      }
    }
    let diagram: Diagram = this.selectedItem.selectedDiagram;
    diagram.print({
      region: this.selectedItem.printSettings.region as DiagramRegions,
      pageHeight: pageHeight,
      pageWidth: pageWidth,
      multiplePage: !this.selectedItem.printSettings.multiplePage,
      pageOrientation: this.selectedItem.printSettings.isPortrait
        ? "Portrait"
        : "Landscape",
    });
    this.printDialog.hide();
  }

  public drawShapeChange(args: MenuEventArgs): void {
    let diagram: Diagram = this.selectedItem.selectedDiagram;
    if (args.item.text === "Rectangle") {
      diagram.drawingObject = {
        shape: { type: "Basic", shape: "Rectangle" },
        style: { strokeWidth: 2 },
      };
    } else if (args.item.text === "Ellipse") {
      diagram.drawingObject = {
        shape: { type: "Basic", shape: "Ellipse" },
        style: { strokeWidth: 2 },
      };
    } else if (args.item.text === "Polygon") {
      diagram.drawingObject = {
        shape: { type: "Basic", shape: "Polygon" },
        style: { strokeWidth: 2 },
      };
    }
    diagram.tool = DiagramTools.ContinuousDraw;
    this.removeSelectedToolbarItem();
    document.getElementById("btnDrawShape").classList.add("tb-item-selected");
  }

  public drawConnectorChange(args: MenuEventArgs): void {
    let diagram: Diagram = this.selectedItem.selectedDiagram;
    if (args.item.text === "Straight Line") {
      diagram.drawingObject = { type: "Straight", style: { strokeWidth: 2 } };
    } else if (args.item.text === "Orthogonal Line") {
      diagram.drawingObject = { type: "Orthogonal", style: { strokeWidth: 2 } };
    } else if (args.item.text === "Bezier") {
      diagram.drawingObject = { type: "Bezier", style: { strokeWidth: 2 } };
    }
    diagram.tool = DiagramTools.ContinuousDraw;
    diagram.clearSelection();
    this.removeSelectedToolbarItem();
    document
      .getElementById("btnDrawConnector")
      .classList.add("tb-item-selected");
  }

  public orderCommandsChange(args: MenuEventArgs): void {
    let diagram: Diagram = this.selectedItem.selectedDiagram;
    if (args.item.text === "Send To Back") {
      this.sendToBack();
    } else if (args.item.text === "Bring To Front") {
      this.bringToFront();
    } else if (args.item.text === "Bring Forward") {
      this.selectedItem.isModified = true;
      diagram.moveForward();
    } else if (args.item.text === "Send Backward") {
      this.selectedItem.isModified = true;
      diagram.sendBackward();
    }
  }

  public zoomChange(args: MenuEventArgs): void {
    let diagram: Diagram = this.selectedItem.selectedDiagram;
    if (args.item.text === "Custom") {
      let ss: string = "";
    } else if (args.item.text === "Fit To Screen") {
      this.selectedItem.scrollSettings.currentZoom = "Fit ...";
      diagram.fitToPage({
        mode: "Page",
        region: "Content",
        margin: { left: 0, top: 0, right: 0, bottom: 0 },
      });
    } else {
      let currentZoom: number = diagram.scrollSettings.currentZoom;
      let zoom: ZoomOptions = {};
      switch (args.item.text) {
        case "400%":
          zoom.zoomFactor = 4 / currentZoom - 1;
          break;
        case "300%":
          zoom.zoomFactor = 3 / currentZoom - 1;
          break;
        case "200%":
          zoom.zoomFactor = 2 / currentZoom - 1;
          break;
        case "150%":
          zoom.zoomFactor = 1.5 / currentZoom - 1;
          break;
        case "100%":
          zoom.zoomFactor = 1 / currentZoom - 1;
          break;
        case "75%":
          zoom.zoomFactor = 0.75 / currentZoom - 1;
          break;
        case "50%":
          zoom.zoomFactor = 0.5 / currentZoom - 1;
          break;
        case "25%":
          zoom.zoomFactor = 0.25 / currentZoom - 1;
          break;
      }
      this.selectedItem.scrollSettings.currentZoom = args.item.text;
      diagram.zoomTo(zoom);
    }
  }

  public beforeItemRender(args: MenuEventArgs): void {
    let shortCutText: string = this.getShortCutKey(args.item.text);
    if (shortCutText) {
      let shortCutSpan: HTMLElement = createElement("span");
      let text: string = args.item.text;
      shortCutSpan.textContent = shortCutText;
      shortCutSpan.style.pointerEvents = "none";
      args.element.appendChild(shortCutSpan);
      shortCutSpan.setAttribute("class", "db-shortcut");
    }
    let status: boolean = this.selectedItem.utilityMethods.enableMenuItems(
      args.item.text,
      this.selectedItem
    );
    if (status) {
      args.element.classList.add("e-disabled");
    } else {
      if (args.element.classList.contains("e-disabled")) {
        args.element.classList.remove("e-disabled");
      }
    }
  }

  public getShortCutKey(menuItem: string): string {
    let shortCutKey: string =
      navigator.platform.indexOf("Mac") > -1 ? "Cmd" : "Ctrl";
    switch (menuItem) {
      case "New":
        shortCutKey = "Shift" + "+N";
        break;
      case "Open":
        shortCutKey = shortCutKey + "+O";
        break;
      case "Save":
        shortCutKey = shortCutKey + "+S";
        break;
      case "Undo":
        shortCutKey = shortCutKey + "+Z";
        break;
      case "Redo":
        shortCutKey = shortCutKey + "+Y";
        break;
      case "Cut":
        shortCutKey = shortCutKey + "+X";
        break;
      case "Copy":
        shortCutKey = shortCutKey + "+C";
        break;
      case "Paste":
        shortCutKey = shortCutKey + "+V";
        break;
      case "Delete":
        shortCutKey = "Delete";
        break;
      case "Duplicate":
        shortCutKey = shortCutKey + "+D";
        break;
      case "Select All":
        shortCutKey = shortCutKey + "+A";
        break;
      case "Zoom In":
        shortCutKey = shortCutKey + "++";
        break;
      case "Zoom Out":
        shortCutKey = shortCutKey + "+-";
        break;
      case "Group":
        shortCutKey = shortCutKey + "+G";
        break;
      case "Ungroup":
        shortCutKey = shortCutKey + "+U";
        break;
      case "Send To Back":
        shortCutKey = shortCutKey + "+Shift+B";
        break;
      case "Bring To Front":
        shortCutKey = shortCutKey + "+Shift+F";
        break;
      default:
        shortCutKey = "";
        break;
    }
    return shortCutKey;
  }

  public contextMenuClick(args: ContextMenuEventArgs): void {
    let buttonElement: any = document.getElementsByClassName("e-btn-hover")[0];
    if (buttonElement) {
      buttonElement.classList.remove("e-btn-hover");
    }
    let diagram: Diagram = this.selectedItem.selectedDiagram;
    let commandType: string = "";
    if (args.element.innerText.indexOf("Ctrl") !== -1) {
      commandType = args.element.innerText
        .substring(0, args.element.innerText.indexOf("Ctrl"))
        .trim();
    } else {
      commandType = args.element.innerText.trim();
    }
    commandType = commandType.replace(/[' ']/g, "");
    switch (commandType.toLowerCase()) {
      case "left":
      case "right":
      case "top":
      case "bottom":
      case "middle":
      case "center":
        this.selectedItem.isModified = true;
        diagram.align(args.item.text as AlignmentOptions);
        break;
      case "horizontally":
        this.distribute("RightToLeft");
        break;
      case "vertically":
        this.distribute("BottomToTop");
        break;
      case "width":
        this.selectedItem.isModified = true;
        diagram.sameSize("Width");
        break;
      case "height":
        this.selectedItem.isModified = true;
        diagram.sameSize("Height");
        break;
      case "bothwidthandheight":
        this.selectedItem.isModified = true;
        diagram.sameSize("Size");
        break;
      case "sendtoback":
        this.sendToBack();
        break;
      case "bringtofront":
        this.bringToFront();
        break;
      case "bringforward":
        this.selectedItem.isModified = true;
        diagram.moveForward();
        break;
      case "sendbackward":
        this.selectedItem.isModified = true;
        diagram.sendBackward();
        break;
      case "lock":
      case "unlock":
        this.lockObject();
        break;
      case "group":
        this.group();
        break;
      case "ungroup":
        this.ungroup();
        break;
    }
  }

  public menuClick(args: MenuEventArgs): void {
    let buttonElement: any = document.getElementsByClassName("e-btn-hover")[0];
    if (buttonElement) {
      buttonElement.classList.remove("e-btn-hover");
    }
    let diagram: Diagram = this.selectedItem.selectedDiagram;
    let commandType: string = args.item.text.replace(/[' ']/g, "");
    switch (commandType.toLowerCase()) {
      case "new":
        CommonKeyboardCommands.newDiagram();
        break;
      case "open":
        CommonKeyboardCommands.openUploadBox(true, ".json");
        break;
      case "save":
        CommonKeyboardCommands.download(
          this.page.savePage(),
          document.getElementById("diagramName").innerHTML
        );
        break;
      case "saveas":
        (document.getElementById("saveFileName") as HTMLInputElement).value =
          document.getElementById("diagramName").innerHTML;
        this.saveDialog.show();
        break;
      case "print":
        this.selectedItem.printSettings.pageHeight =
          this.selectedItem.pageSettings.pageHeight;
        this.selectedItem.printSettings.pageWidth =
          this.selectedItem.pageSettings.pageWidth;
        this.selectedItem.printSettings.paperSize =
          this.selectedItem.pageSettings.paperSize;
        this.selectedItem.printSettings.isPortrait =
          this.selectedItem.pageSettings.isPortrait;
        this.selectedItem.printSettings.isLandscape =
          !this.selectedItem.pageSettings.isPortrait;
        this.printDialog.show();
        break;
      case "export":
        this.exportDialog.show();
        break;
      case "showguides":
        diagram.snapSettings.constraints =
          diagram.snapSettings.constraints ^ SnapConstraints.SnapToObject;
        args.item.iconCss = args.item.iconCss ? "" : "sf-icon-Selection";
        break;
      case "showgrid":
        diagram.snapSettings.constraints =
          diagram.snapSettings.constraints ^ SnapConstraints.ShowLines;
        args.item.iconCss = args.item.iconCss ? "" : "sf-icon-Selection";
        let container: HTMLDivElement = document.getElementsByClassName(
          "db-current-diagram-container"
        )[0] as HTMLDivElement;
        if (!args.item.iconCss) {
          container.classList.add("db-hide-grid");
        } else {
          container.classList.remove("db-hide-grid");
        }
        break;
      case "snaptogrid":
        diagram.snapSettings.constraints =
          diagram.snapSettings.constraints ^ SnapConstraints.SnapToLines;
        args.item.iconCss = args.item.iconCss ? "" : "sf-icon-Selection";
        break;
      case "fittoscreen":
        diagram.fitToPage({
          mode: "Page",
          region: "Content",
          margin: { left: 0, top: 0, right: 0, bottom: 0 },
        });
        break;
      case "showrulers":
        this.selectedItem.selectedDiagram.rulerSettings.showRulers =
          !this.selectedItem.selectedDiagram.rulerSettings.showRulers;
        if (this.selectedItem.selectedDiagram.rulerSettings.showRulers) {
          this.selectedItem.selectedDiagram.rulerSettings.dynamicGrid = false;
        }
        args.item.iconCss = args.item.iconCss ? "" : "sf-icon-Selection";
        container = document.getElementsByClassName(
          "db-current-diagram-container"
        )[0] as HTMLDivElement;
        if (!args.item.iconCss) {
          container.classList.remove("db-show-ruler");
        } else {
          container.classList.add("db-show-ruler");
        }
        break;
      case "zoomin":
        diagram.zoomTo({ type: "ZoomIn", zoomFactor: 0.2 });
        this.selectedItem.scrollSettings.currentZoom =
          (diagram.scrollSettings.currentZoom * 100).toFixed() + "%";
        break;
      case "zoomout":
        diagram.zoomTo({ type: "ZoomOut", zoomFactor: 0.2 });
        this.selectedItem.scrollSettings.currentZoom =
          (diagram.scrollSettings.currentZoom * 100).toFixed() + "%";
        break;
      case "showtoolbar":
        this.selectedItem.utilityMethods.hideElements(
          "hide-toolbar",
          this.selectedItem.selectedDiagram
        );
        args.item.iconCss = args.item.iconCss ? "" : "sf-icon-Selection";
        break;
      case "showstencil":
        this.selectedItem.utilityMethods.hideElements(
          "hide-palette",
          this.selectedItem.selectedDiagram
        );
        args.item.iconCss = args.item.iconCss ? "" : "sf-icon-Selection";
        break;
      case "showproperties":
        this.selectedItem.utilityMethods.hideElements(
          "hide-properties",
          this.selectedItem.selectedDiagram
        );
        args.item.iconCss = args.item.iconCss ? "" : "sf-icon-Selection";
        break;
      case "showlayers":
        this.showHideLayers();
        break;
      case "themes":
        this.showHideThemes();
        break;
      case "showpager":
        this.selectedItem.utilityMethods.hideElements(
          "hide-pager",
          this.selectedItem.selectedDiagram
        );
        args.item.iconCss = args.item.iconCss ? "" : "sf-icon-Selection";
        break;
      default:
        this.executeEditMenu(diagram, commandType);
        break;
    }
    diagram.dataBind();
  }

  public executeEditMenu(diagram: Diagram, commandType: string): void {
    let key: string = "";
    switch (commandType.toLowerCase()) {
      case "undo":
        this.undo();
        if (
          this.selectedItem.diagramType === "MindMap" ||
          this.selectedItem.diagramType === "OrgChart"
        ) {
          diagram.doLayout();
        }
        break;
      case "redo":
        this.redo();
        break;
      case "cut":
        this.cutObjects();
        break;
      case "copy":
        this.copyObjects();
        break;
      case "paste":
        this.pasteObjects();
        break;
      case "delete":
        this.delete();
        break;
      case "duplicate":
        CommonKeyboardCommands.duplicateSelectedItems();
        break;
      case "selectall":
        this.selectAll();
        break;
      case "edittooltip":
        this.selectedItem.isModified = true;
        if (diagram.selectedItems.nodes.length > 0) {
          this.tooltipDialog.show();
        }
        break;
    }
  }

  public snapSettings: SnapSettingsModel = {
    horizontalGridlines: {
      lineIntervals: [
        1, 9, 0.25, 9.75, 0.25, 9.75, 0.25, 9.75, 0.25, 9.75, 0.25, 9.75, 0.25,
        9.75, 0.25, 9.75, 0.25, 9.75, 0.25, 9.75,
      ],
      lineColor: "#EEEEEE",
    },
    verticalGridlines: {
      lineIntervals: [
        1, 9, 0.25, 9.75, 0.25, 9.75, 0.25, 9.75, 0.25, 9.75, 0.25, 9.75, 0.25,
        9.75, 0.25, 9.75, 0.25, 9.75, 0.25, 9.75,
      ],
      lineColor: "#EEEEEE",
    },
    constraints: SnapConstraints.All & ~SnapConstraints.SnapToLines,
  };

  public pageSettings: PageSettingsModel = {
    background: {},
    width: 1350,
    height: 856,
    multiplePage: true,
    margin: { left: 5, top: 5 },
    orientation: "Landscape",
  };

  public scrollSettings: ScrollSettingsModel = {
    canAutoScroll: true,
    scrollLimit: "Infinity",
    minZoom: 0.25,
    maxZoom: 30,
  };
  public selectedItems: SelectorModel = {
    constraints: SelectorConstraints.All & ~SelectorConstraints.ToolTip,
  };
  public commandManager: CommandManagerModel = this.getCommandSettings();
  public contextMenuSettings: ContextMenuSettingsModel = {
    show: true,
    items: this.selectedItem.customContextMenu.items,
  };

  public customTool: CustomTool = new CustomTool(this.selectedItem);
  public getCustomTool: Function = this.customTool.getTool.bind(this);

  private generateDiagram(): void {
    this.selectedItem.selectedDiagram = this.diagram;
    this.selectedItem.diagramType = "GeneralDiagram";
    //this.diagram.layers[0].addInfo = { 'name': 'Layer0' };
  }

  public setNodeDefaults(node: Node, diagram: Diagram): NodeModel {
    if (node.style) {
      if (node.style.fill === "transparent" && !node.children) {
        node.style.fill = "white";
      }
    }
    let node1: NodeModel = {
      style: { strokeWidth: 2 },
    };
    return node1;
  }

  public setConnectorDefaults(
    connector: Connector,
    diagram: Diagram
  ): ConnectorModel {
    let connector1: ConnectorModel = {
      annotations: [{ content: "", style: { fill: "#ffffff" } }],
      style: { strokeWidth: 2 },
    };
    return connector1;
  }

  public handle: UserHandleModel[] = [
    {
      name: "cloneHandle",
      pathColor: "white",
      backgroundColor: "black",
      pathData:
        "M 41.44 44.46 L 41.44 85.14 L 85.37 85.14 L 85.37 44.46 z M 26.82 25.63 L 100 25.63 L 100 100 L 26.82 100 z" +
        "M 0 0 L 65.85 0 L 65.85 12.75 L 12.54 12.75 L 12.54 73.33 L 0 73.33 L 0 12.75 L 0 6.39 z",
      side: "Left",
      offset: 1,
      horizontalAlignment: "Center",
      verticalAlignment: "Center",
    },
    {
      name: "linkHandle",
      pathColor: "white",
      backgroundColor: "black",
      pathData:
        "M 61.24 100 L 61.24 61.92 L 0 61.92 L 0 32.92 L 61.24 32.92 L 61.24 0 L 100 49.99 z",
      visible: true,
      offset: 1,
      side: "Right",
      horizontalAlignment: "Center",
      verticalAlignment: "Center",
    },
  ];

  public toolbarInsertClick(args: ClickEventArgs): void {
    let diagram: Diagram = this.selectedItem.selectedDiagram;
    let commandType: string = args.item.tooltipText.replace(/[' ']/g, "");

    if (diagram.selectedItems.nodes.length > 0) {
      switch (commandType.toLowerCase()) {
        case "insertlink":
          (document.getElementById("hyperlink") as HTMLInputElement).value = "";
          (document.getElementById("hyperlinkText") as HTMLInputElement).value = "";
          if (diagram.selectedItems.nodes[0].annotations.length > 0) {
            let annotation: ShapeAnnotationModel = diagram.selectedItems.nodes[0].annotations[0];
            if (annotation.hyperlink.link || annotation.content) {
              (document.getElementById("hyperlink") as HTMLInputElement).value = annotation.hyperlink.link;
              (document.getElementById("hyperlinkText") as HTMLInputElement).value = annotation.hyperlink.content || annotation.content;
            }
          }
          this.hyperlinkDialog.show();
          break;

        case "insertimage":
          this.openImageUploadBox((imageUrl: string) => {
            let selectedNode = diagram.selectedItems.nodes[0];
            selectedNode.shape = { type: 'Image', source: imageUrl };
            diagram.dataBind();
          });
          break;
      }
    }
  }

  private openImageUploadBox(callback: (imageUrl: string) => void): void {
    let input = document.createElement('input');
    input.type = 'file';
    input.accept = '.jpg,.png,.bmp';

    input.onchange = (event: any) => {
      let file = event.target.files[0];
      let reader = new FileReader();
      reader.onload = (e: any) => {
        let imageUrl = e.target.result;
        callback(imageUrl);
      };
      reader.readAsDataURL(file);
    };

    input.click();
  }

  public toolbarEditorClick(args: ClickEventArgs): void {
    let diagram: Diagram = this.selectedItem.selectedDiagram;
    let commandType: string = args.item.tooltipText
      .replace(/[' ']/g, "")
      .toLowerCase();
    switch (commandType) {
      case "undo":
        this.undo();
        break;
      case "redo":
        this.redo();
        break;
      case "zoomin(ctrl++)":
        diagram.zoomTo({ type: "ZoomIn", zoomFactor: 0.2 });
        this.selectedItem.scrollSettings.currentZoom =
          (diagram.scrollSettings.currentZoom * 100).toFixed() + "%";
        break;
      case "zoomout(ctrl+-)":
        diagram.zoomTo({ type: "ZoomOut", zoomFactor: 0.2 });
        this.selectedItem.scrollSettings.currentZoom =
          (diagram.scrollSettings.currentZoom * 100).toFixed() + "%";
        break;
      case "pantool":
        diagram.tool = DiagramTools.ZoomPan;
        diagram.clearSelection();
        this.selectedItem.utilityMethods.objectTypeChange("diagram");
        break;
      case "pointer":
        diagram.drawingObject = {};
        diagram.tool = DiagramTools.SingleSelect | DiagramTools.MultipleSelect;
        break;
      case "texttool":
        diagram.drawingObject = {
          shape: { type: "Text" },
          style: { strokeColor: "none", fill: "none" },
        };
        diagram.tool = DiagramTools.ContinuousDraw;
        break;
      case "delete":
        this.delete();
        break;
      case "lock":
        this.lockObject();
        break;
      case "fillcolor":
        this.showColorPicker("nodeFillColor", "tb-item-fill");
        break;
      case "bordercolor":
        if (this.selectedItem.selectedDiagram.selectedItems.nodes.length > 0) {
          this.showColorPicker("nodeStrokeColor", "tb-item-stroke");
        } else {
          this.showColorPicker("lineColor", "tb-item-stroke");
        }
        break;
      case "group":
        this.group();
        break;
      case "ungroup":
        this.ungroup();
        break;
      case "alignleft":
      case "alignright":
      case "aligntop":
      case "alignbottom":
      case "alignmiddle":
      case "aligncenter":
        this.selectedItem.isModified = true;
        let alignType: string = commandType.replace("align", "");
        let alignType1: AlignmentOptions = (alignType.charAt(0).toUpperCase() +
          alignType.slice(1)) as AlignmentOptions;
        diagram.align(alignType1);
        break;
      case "distributeobjectshorizontally":
        this.distribute("RightToLeft");
        break;
      case "distributeobjectsvertically":
        this.distribute("BottomToTop");
        break;
      case "showlayers":
        this.showHideLayers();
        break;
      case "themes":
        this.showHideThemes();
        break;
    }
    if (
      commandType === "pantool" ||
      commandType === "pointer" ||
      commandType === "texttool"
    ) {
      if (args.item.cssClass.indexOf("tb-item-selected") === -1) {
        this.removeSelectedToolbarItem();
        args.item.cssClass += " tb-item-selected";
      }
    }
  }

  public showColorPicker(propertyName: string, toolbarName: string): void {
    let fillElement: HTMLButtonElement = document
      .getElementById(propertyName)
      .parentElement.getElementsByClassName(
        "e-dropdown-btn"
      )[0] as HTMLButtonElement;
    fillElement.click();
    let popupElement: HTMLElement = document.getElementById(
      fillElement.id + "-popup"
    );
    let bounds: ClientRect = document
      .getElementsByClassName(toolbarName)[0]
      .getBoundingClientRect();
    popupElement.style.left = bounds.left + "px";
    popupElement.style.top = bounds.top + 40 + "px";
  }

  public showHideLayers(): void {
    let btnWindow: any = document.getElementById("btnWindowMenu");
    let iconCss: string = btnWindow.ej2_instances[0].items[3].iconCss;
    if (!this.initLayerPanel) {
      this.diagramLayer.initLayerBottomPanel();
      this.initLayerPanel = true;
    }
    if (iconCss) {
      this.layerDialog.hide();
    } else {
      this.diagramLayer.getLayerDialogContent();
      this.layerDialog.show();
    }
    btnWindow.ej2_instances[0].items[3].iconCss = iconCss
      ? ""
      : "sf-icon-Selection";
  }

  public showHideThemes(): void {
    let btnWindow: any = document.getElementById("btnWindowMenu");
    let iconCss: string = btnWindow.ej2_instances[0].items[5].iconCss;
    if (iconCss) {
      this.themeDialog.hide();
    } else {
      this.themeDialog.show();
    }
    btnWindow.ej2_instances[0].items[5].iconCss = iconCss
      ? ""
      : "sf-icon-Selection";
  }

  public closeThemeDialog(args: Object): void {
    let btnWindow: any = document.getElementById("btnWindowMenu");
    btnWindow.ej2_instances[0].items[5].iconCss = "";
  }

  public removeSelectedToolbarItem(): void {
    for (let i: number = 0; i < this.toolbarEditor.items.length; i++) {
      let item: ToolbarItemModel = this.toolbarEditor.items[i];
      if (item.cssClass.indexOf("tb-item-selected") !== -1) {
        item.cssClass = item.cssClass.replace(" tb-item-selected", "");
      }
    }
    this.toolbarEditor.dataBind();
    document
      .getElementById("btnDrawShape")
      .classList.remove("tb-item-selected");
    document
      .getElementById("btnDrawConnector")
      .classList.remove("tb-item-selected");
  }

  private lockObject(): void {
    this.selectedItem.isModified = true;
    let diagram: Diagram = this.selectedItem.selectedDiagram;
    for (let i: number = 0; i < diagram.selectedItems.nodes.length; i++) {
      let node: NodeModel = diagram.selectedItems.nodes[i];
      if (node.constraints & NodeConstraints.Drag) {
        node.constraints =
          NodeConstraints.PointerEvents | NodeConstraints.Select;
      } else {
        node.constraints = NodeConstraints.Default;
      }
    }
    for (let i: number = 0; i < diagram.selectedItems.connectors.length; i++) {
      let connector: ConnectorModel = diagram.selectedItems.connectors[i];
      if (connector.constraints & ConnectorConstraints.Drag) {
        connector.constraints =
          ConnectorConstraints.PointerEvents | ConnectorConstraints.Select;
      } else {
        connector.constraints = ConnectorConstraints.Default;
      }
    }
    diagram.dataBind();
  }

  public onUploadSuccess(args: { [key: string]: Object }): void {
    (
      document.getElementsByClassName("sb-content-overlay")[0] as HTMLDivElement
    ).style.display = "none";
    if (args.operation !== "remove") {
      let file1: { [key: string]: Object } = args.file as {
        [key: string]: Object;
      };
      let file: Blob = file1.rawFile as Blob;
      OrgChartUtilityMethods.fileType = file1.type.toString();
      let reader: FileReader = new FileReader();
      if (
        OrgChartUtilityMethods.fileType.toLowerCase() === "jpg" ||
        OrgChartUtilityMethods.fileType.toLowerCase() === "png"
      ) {
        reader.readAsDataURL(file);
        reader.onloadend = this.setImage.bind(this);
      } else {
        reader.readAsText(file);
        if (
          OrgChartUtilityMethods.fileType === "json" &&
          CommonKeyboardCommands.isOpen
        ) {
          reader.onloadend = this.loadDiagram.bind(this);
        } else {
          OrgChartUtilityMethods.isUploadSuccess = true;
          reader.onloadend = OrgChartUtilityMethods.readFile.bind(
            OrgChartUtilityMethods
          );
        }
      }
      CommonKeyboardCommands.isOpen = false;
    }
  }

  public onUploadFailure(args: { [key: string]: Object }): void {
    (
      document.getElementsByClassName("sb-content-overlay")[0] as HTMLDivElement
    ).style.display = "none";
  }

  public onUploadFileSelected(args: { [key: string]: Object }): void {
    (
      document.getElementsByClassName("sb-content-overlay")[0] as HTMLDivElement
    ).style.display = "";
  }

  public setImage(event: ProgressEvent): void {
    //(document.getElementsByClassName('sb-content-overlay')[0] as HTMLDivElement).style.display = 'none';
    let node: NodeModel =
      this.selectedItem.selectedDiagram.selectedItems.nodes[0];
    node.shape = {
      type: "Image",
      source: (event.target as FileReader).result as string,
      align: "None",
    };
  }

  public loadDiagram(event: ProgressEvent): void {
    this.page.loadPage((event.target as FileReader).result.toString());
    this.page.loadDiagramSettings();
    this.fileUploadDialog.hide();
  }

  public onTooltipBeforeRender(args: TooltipEventArgs): void {
    if (args.target) {
      this.tooltip.content =
        this.orgChartPropertyBinding.getTooltipContent(args);
    }
  }

  public getCommandSettings(): CommandManagerModel {
    let commandManager: CommandManagerModel = {
      commands: [
        {
          gesture: { key: Keys.D, keyModifiers: KeyModifiers.Control },
          canExecute: this.canExecute,
          execute: CommonKeyboardCommands.duplicateSelectedItems.bind(
            CommonKeyboardCommands
          ),
          name: "Duplicate",
        },
        {
          gesture: {
            key: Keys.B,
            keyModifiers: KeyModifiers.Control | KeyModifiers.Shift,
          },
          canExecute: this.canExecute,
          execute: this.sendToBack.bind(this),
          name: "SendToBack",
        },
        {
          gesture: {
            key: Keys.F,
            keyModifiers: KeyModifiers.Control | KeyModifiers.Shift,
          },
          canExecute: this.canExecute,
          execute: this.bringToFront.bind(this),
          name: "BringToFront",
        },
        {
          gesture: { key: Keys.G, keyModifiers: KeyModifiers.Control },
          canExecute: this.canExecute,
          execute: this.group.bind(this),
          name: "Group",
        },
        {
          gesture: { key: Keys.U, keyModifiers: KeyModifiers.Control },
          canExecute: this.canExecute,
          execute: this.ungroup.bind(this),
          name: "Ungroup",
        },
        {
          gesture: { key: Keys.X, keyModifiers: KeyModifiers.Control },
          canExecute: this.canExecute,
          execute: this.cutObjects.bind(this),
          name: "cutObjects",
        },
        {
          gesture: { key: Keys.C, keyModifiers: KeyModifiers.Control },
          canExecute: this.canExecute,
          execute: this.copyObjects.bind(this),
          name: "copyObjects",
        },
        {
          gesture: { key: Keys.V, keyModifiers: KeyModifiers.Control },
          canExecute: this.canExecute,
          execute: this.pasteObjects.bind(this),
          name: "pasteObjects",
        },
        {
          gesture: { key: Keys.Z, keyModifiers: KeyModifiers.Control },
          canExecute: this.canExecute,
          execute: this.undo.bind(this),
          name: "undo",
        },
        {
          gesture: { key: Keys.Y, keyModifiers: KeyModifiers.Control },
          canExecute: this.canExecute,
          execute: this.redo.bind(this),
          name: "redo",
        },
        {
          gesture: { key: Keys.Delete, keyModifiers: KeyModifiers.None },
          canExecute: this.canExecute,
          execute: this.delete.bind(this),
          name: "delete",
        },
        {
          gesture: { key: Keys.A, keyModifiers: KeyModifiers.Control },
          canExecute: this.canExecute,
          execute: this.selectAll.bind(this),
          name: "selectAll",
        },
      ],
    };
    commandManager.commands = CommonKeyboardCommands.addCommonCommands(
      commandManager.commands
    );
    return commandManager;
  }

  private cutObjects(): void {
    this.selectedItem.pasteData = CommonKeyboardCommands.cloneSelectedItems();
    this.selectedItem.selectedDiagram.cut();
  }

  private copyObjects(): void {
    this.selectedItem.pasteData = CommonKeyboardCommands.cloneSelectedItems();
  }

  private pasteObjects(): void {
    let diagram: Diagram = this.selectedItem.selectedDiagram;
    if (this.selectedItem.pasteData.length > 0) {
      diagram.paste(this.selectedItem.pasteData);
    }
  }

  private sendToBack(): void {
    this.selectedItem.isModified = true;
    this.selectedItem.selectedDiagram.sendToBack();
  }

  private bringToFront(): void {
    this.selectedItem.isModified = true;
    this.selectedItem.selectedDiagram.bringToFront();
  }

  private group(): void {
    this.selectedItem.isModified = true;
    this.selectedItem.selectedDiagram.group();
  }

  private ungroup(): void {
    this.selectedItem.isModified = true;
    this.selectedItem.selectedDiagram.unGroup();
  }
  private undo(): void {
    this.selectedItem.isModified = true;
    this.selectedItem.selectedDiagram.undo();
  }
  private redo(): void {
    this.selectedItem.isModified = true;
    this.selectedItem.selectedDiagram.redo();
  }
  private delete(): void {
    this.selectedItem.isModified = true;
    this.selectedItem.selectedDiagram.remove();
  }
  private selectAll(): void {
    this.selectedItem.isModified = true;
    this.selectedItem.selectedDiagram.selectAll();
  }
  private distribute(value: any): void {
    this.selectedItem.isModified = true;
    this.selectedItem.selectedDiagram.distribute(value);
  }
  private canExecute(): boolean {
    return true;
  }

  dropdownData: any;
  constructor(
    private http: HttpClient,
    private dataService: DataShareService,
    private apiService: ApiService
  ) { }

  mode: string;
  tagName: any;
  analogData: any[] = [];
  analogChName: any[] = [];
  stationData: any[] = [];
  digitalData: any[] = [];
  digitalChName: any[] = [];
  analogName: any;
  digitalName: any;
  public Oprationdata: string[] = ['=', '<=', '>=', '!=', '<', '>'];
  unitText: string[] = ['Volts', 'Amps', 'Deg-C', 'Deg-F', 'Hz', 'KHz', 'MHz',];
  popupService = inject(PopupService);
  textShape: any = [
    { text: 'Ractangle', value: '■' },
    { text: 'Circle', value: '●' }
  ]

  ngOnInit(): void {

    setTimeout(() => {
      this.dataService.canvasData$.subscribe(data => {
        console.log('data', data);

        CommonKeyboardCommands.loadDiagram(data);
      });
    }, 1000);

    this.getData()
    setInterval(() => {
      this.getData();
      this.setAnalog();
      this.setDigital();
    }, 3000);
    this.mode = "CheckBox";

  }

  getData() {
    this.apiService.getData()
      .subscribe((res) => {
        this.dropdownData = res;
        this.dataService.sendDiagramData(this.dropdownData);
        this.dropdownData.forEach((element) => {
          this.stationData.push(element.TagName);
        });
      });

  }

  tagTextName: any;
  analogTextChName: any[] = [];
  digitalTextChName: any[] = [];

  tagChangeTextName(event: any) {
    this.analogTextChName = [];
    this.digitalTextChName = [];
    this.tagTextName = event.value;

    this.dropdownData.forEach((element) => {
      if (element.TagName == this.tagTextName) {
        element.Analog.forEach((el) => {
          this.analogTextChName.push(el.chName);
        });
        element.digital.forEach((el) => {
          this.digitalTextChName.push(el.chName);
        });
      }
    });
  }


  tagChangeName(event) {
    this.analogChName = [];
    this.tagName = event.value;

    this.dropdownData.forEach((element) => {
      if (element.TagName == this.tagName) {
        element.Analog.forEach((el) => {
          this.analogChName.push(el.chName);
        });
      }
    });
  }

  tagChangeBitTextName(event: any) {
    this.digitalTextChName = [];
    this.tagTextName = event.value;

    this.dropdownData.forEach((element) => {
      if (element.TagName == this.tagTextName) {

        element.digital.forEach((el) => {
          this.digitalTextChName.push(el.chName);
        });
      }
    });
  }

  analogChange(event) {
    this.analogName = event.value;
    this.setAnalog();
  }

  digitalChange(event) {
    this.digitalName = event.value;
    this.setDigital();
  }

  setAnalog() {
    this.analogData = [];
    this.dropdownData.forEach((element) => {
      if (element.TagName == this.tagName) {
        element.Analog.forEach((el) => {
          this.analogName.forEach((e) => {
            if (el.chName == e) {
              this.analogData.push(el);
            }
          });
        });
      }
    });

    this.dataService.sendAnalogData(this.analogData);
  }

  setDigital() {
    this.digitalData = [];
    this.dropdownData.forEach((element) => {
      if (element.TagName == this.tagName) {
        element.digital.forEach((el) => {
          this.digitalName.forEach((e) => {
            if (el.chName == e) {
              this.digitalData.push(el);
            }
          });
        });
      }
    });
    this.dataService.sendDigitalData(this.digitalData);
  }

  public diagramEvent: any = {
    selectionChange: this.tsSelectionChange.bind(this),
  };

  tsSelectionChange(args: any) {
    const popup = document.getElementById("popup");
    if (args.state === "Changing" && args.newValue.length > 0) {
      popup.style.display = "block";
    } else {
      popup.style.display = "none";
    }
  }





  mapValue: any;
  @ViewChild('mapCheckbox') mapCheckbox: CheckBoxComponent;
  mapChange(event) {
    this.mapValue = this.mapCheckbox.checked;
    if (this.mapValue) {
      this.imgCheckbox.checked = false;
      this.imgValue = false;
      this.initMap();
    } else {
      this.map.setTarget(null);
    }
  }

  imgValue: any;
  @ViewChild('imageCheckbox') imgCheckbox: CheckBoxComponent;
  imageChange(event) {
    this.imgValue = this.imgCheckbox.checked;
    if (this.imgValue) {
      this.mapCheckbox.checked = false;
      this.map.setTarget(null);
    }
  }



  // ************************ map ************************

  map!: Map;

  longitud = -74.9108989;
  latitud = 10.6480512;

  initMap() {

    const view = new View({
      center: fromLonLat([this.longitud, this.latitud]),
      zoom: 10,
    });

    this.map = new Map({
      target: 'diagram',
      layers: [
        new TileLayer({
          source: new OSM(),
        }),
      ],
      view: view,
    });

  }


}
