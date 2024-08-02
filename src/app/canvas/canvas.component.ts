import {
  Component,
  ViewEncapsulation,
  ViewChild,
  AfterViewInit,
  OnInit,
  inject,
  OnDestroy,
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
  ThumbsConstraints,
  DiagramTooltipModel,
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
import {
  ListViewComponent,
  FieldsMapping,
  SelectedCollection,
  SelectEventArgs,
} from "@syncfusion/ej2-angular-lists";
import { HttpClient } from "@angular/common/http";
import { PopupService } from "../service/popup.service";
import { DataShareService } from "../service/data-share.service";
import { bootstrapApplication } from "@angular/platform-browser";
import { hideSpinner } from '@syncfusion/ej2-angular-popups';
import { Router } from "@angular/router";
import { ApiService } from "../service/api.service";
import { OGCMapTile } from "ol/source";
import { AudioService } from "../service/audio.service";
import { interval } from "rxjs";
import { JsonPipe } from "@angular/common";

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
  selector: 'app-canvas',
  templateUrl: './canvas.component.html',
  styleUrls: ['./canvas.component.css'],
  encapsulation: ViewEncapsulation.None,
})
export class CanvasComponent implements AfterViewInit, OnInit, OnDestroy {
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
  // public pasteData: boolean = false;
  public overview: Overview;
  blinkInterval: any;
  lowLimitTimeout: any;
  highLimitTimeout: any;

  hideAll() {
    this.selectedItem.utilityMethods.hideAllElements("hide-toolbar", this.selectedItem.selectedDiagram);
    this.selectedItem.utilityMethods.hideAllElements("hide-palette", this.selectedItem.selectedDiagram);
    this.selectedItem.utilityMethods.hideAllElements("hide-properties", this.selectedItem.selectedDiagram);
    // this.selectedItem.utilityMethods.hideAllElements("hide-pager", this.selectedItem.selectedDiagram);

    // this.lockObject();

  }

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
    // this.openDiagram();
    // this.showCanvas();
  }

  openDiagram() {
    CommonKeyboardCommands.openDiagram();
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
      this.openTemplateDialog.show();
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
    let button1: Button = expandcollapseicon.ej2_instances[1];
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
    private route: Router,
    private apiService: ApiService,
    private AudioService: AudioService
  ) {
    this.textChData();
  }

  mode: string;
  tagName: any;
  analogData: any[] = [];
  analogChName: any[] = [];
  stationData: any[] = [];
  digitalData: any[] = [];
  digitalChName: any[] = [];
  analogName: any;
  digitalName: any;

  popupService = inject(PopupService);
  nodeCount: any;
  diagramData: any;
  public tooltipNode?: DiagramTooltipModel;
  public constraints?: NodeConstraints;



  ngOnInit(): void {

    setTimeout(() => {
      this.nodeBlinking();
      this.textDataTimeBlinking();
      this.textDataContinueBlinking();
      this.textDataProperties();
      this.textLimitProperties();
      this.textLimitContinueBlink();
      this.textLimitTimeBlink();
      this.bitTextLableProperties();
      this.bitContinousBlink();
      this.bitTimeBlink();
      this.bitTimeBlink1to0();
      this.bitTimeBlink0to1();
      this.bitTextImageProperties();
      this.dateTimeProperties();
    }, 1000);


    setInterval(() => {
      this.nodeCount = CommonKeyboardCommands.diagramData?.pageOptionList[0]?.diagram.nodes;
    }, 100)


    setTimeout(() => {
      this.dataService.canvasData$.subscribe(data => {
        this.hideAll();

        CommonKeyboardCommands.loadDiagram(data);
      });

    }, 1000);


    this.mode = "CheckBox";

  }

  textChData() {
    let diagram: Diagram = this.selectedItem.selectedDiagram;

    setInterval(() => {


      this.apiService.getData().subscribe(data => {
        this.diagramData = data;
        this.analogData = [];
        this.digitalData = [];
        this.diagramData.forEach(element => {
          element.Analog.forEach(anaEle => {
            this.analogData.push(anaEle)
          });
          element.digital.forEach(digEle => {
            this.digitalData.push(digEle)
          });

        });
      })
    }, 1000);

  }

  // complete --
  textDataBlink: boolean = true;
  textDataTimeout: boolean = true;
  textDataTimeBlinking() {
    let diagram: Diagram = this.selectedItem.selectedDiagram;
    let blinkInterval = setInterval(() => {
      diagram.nodes.forEach(nodeElement => {

        if (nodeElement.id.includes("Limit1")) {


          this.analogData.forEach(element => {

            if (nodeElement.annotations[0].textAnalogChName === element.chName) {
              let content = parseFloat(element.chData);


              switch (true) {
                case (nodeElement.annotations[0].textOperation == '='):

                  if (nodeElement.annotations[0].textSetValue == content) {

                    this.textDataBlink = true;
                    this.textDataTimeout = true;
                    nodeElement.annotations[0].style.opacity = 100;


                  } else {

                    if (nodeElement.annotations[0]?.textIsChecked && this.hideBlink) {

                      if (this.textDataBlink) {
                        if (nodeElement.annotations[0].style.opacity === 0) {
                          nodeElement.annotations[0].style.opacity = 100;
                        } else {
                          nodeElement.annotations[0].style.opacity = 0;
                        }
                      }

                      if (this.textDataTimeout) {
                        if (nodeElement.annotations[0].textBlinkTime) {
                          setTimeout(() => {
                            this.textDataBlink = false;
                            this.textDataTimeout = false;
                            nodeElement.annotations[0].style.opacity = 100;
                          }, (nodeElement.annotations[0].textBlinkTime * 1000));
                        }
                      }
                    }

                  }
                  break;
                case (nodeElement.annotations[0].textOperation == '>'):

                  if (content > nodeElement.annotations[0].textSetValue) {

                    this.textDataBlink = true;
                    this.textDataTimeout = true;
                    nodeElement.annotations[0].style.opacity = 100;

                  } else {

                    if (nodeElement.annotations[0]?.textIsChecked && this.hideBlink) {

                      if (this.textDataBlink) {
                        if (nodeElement.annotations[0].style.opacity === 0) {
                          nodeElement.annotations[0].style.opacity = 100;
                        } else {
                          nodeElement.annotations[0].style.opacity = 0;
                        }
                      }

                      if (this.textDataTimeout) {
                        if (nodeElement.annotations[0].textBlinkTime) {
                          setTimeout(() => {
                            this.textDataBlink = false;
                            this.textDataTimeout = false;
                            nodeElement.annotations[0].style.opacity = 100;
                          }, (nodeElement.annotations[0].textBlinkTime * 1000));
                        }
                      }
                    }

                  }
                  break;
                case (nodeElement.annotations[0].textOperation == '<'):

                  if (content < nodeElement.annotations[0].textSetValue) {

                    this.textDataBlink = true;
                    this.textDataTimeout = true;
                    nodeElement.annotations[0].style.opacity = 100;


                  } else {

                    if (nodeElement.annotations[0]?.textIsChecked && this.hideBlink) {

                      if (this.textDataBlink) {
                        if (nodeElement.annotations[0].style.opacity === 0) {
                          nodeElement.annotations[0].style.opacity = 100;
                        } else {
                          nodeElement.annotations[0].style.opacity = 0;
                        }
                      }

                      if (this.textDataTimeout) {
                        if (nodeElement.annotations[0].textBlinkTime) {
                          setTimeout(() => {
                            this.textDataBlink = false;
                            this.textDataTimeout = false;
                            nodeElement.annotations[0].style.opacity = 100;
                          }, (nodeElement.annotations[0].textBlinkTime * 1000));
                        }
                      }
                    }

                  }
                  break;
                case (nodeElement.annotations[0].textOperation == '>='):

                  if (content >= nodeElement.annotations[0].textSetValue) {

                    this.textDataBlink = true;
                    this.textDataTimeout = true;
                    nodeElement.annotations[0].style.opacity = 100;


                  } else {

                    if (nodeElement.annotations[0]?.textIsChecked && this.hideBlink) {

                      if (this.textDataBlink) {
                        if (nodeElement.annotations[0].style.opacity === 0) {
                          nodeElement.annotations[0].style.opacity = 100;
                        } else {
                          nodeElement.annotations[0].style.opacity = 0;
                        }
                      }

                      if (this.textDataTimeout) {
                        if (nodeElement.annotations[0].textBlinkTime) {
                          setTimeout(() => {
                            this.textDataBlink = false;
                            this.textDataTimeout = false;
                            nodeElement.annotations[0].style.opacity = 100;
                          }, (nodeElement.annotations[0].textBlinkTime * 1000));
                        }
                      }
                    }

                  }
                  break;
                case (nodeElement.annotations[0].textOperation == '<='):

                  if (content <= nodeElement.annotations[0].textSetValue) {

                    this.textDataBlink = true;
                    this.textDataTimeout = true;
                    nodeElement.annotations[0].style.opacity = 100;


                  } else {

                    if (nodeElement.annotations[0]?.textIsChecked && this.hideBlink) {

                      if (this.textDataBlink) {
                        if (nodeElement.annotations[0].style.opacity === 0) {
                          nodeElement.annotations[0].style.opacity = 100;
                        } else {
                          nodeElement.annotations[0].style.opacity = 0;
                        }
                      }

                      if (this.textDataTimeout) {
                        if (nodeElement.annotations[0].textBlinkTime) {
                          setTimeout(() => {
                            this.textDataBlink = false;
                            this.textDataTimeout = false;
                            nodeElement.annotations[0].style.opacity = 100;
                          }, (nodeElement.annotations[0].textBlinkTime * 1000));
                        }
                      }
                    }

                  }
                  break;
                case (nodeElement.annotations[0].textOperation == '!='):

                  if (content != nodeElement.annotations[0].textSetValue) {

                    this.textDataBlink = true;
                    this.textDataTimeout = true;
                    nodeElement.annotations[0].style.opacity = 100;


                  } else {

                    if (nodeElement.annotations[0]?.textIsChecked && this.hideBlink) {

                      if (this.textDataBlink) {
                        if (nodeElement.annotations[0].style.opacity === 0) {
                          nodeElement.annotations[0].style.opacity = 100;
                        } else {
                          nodeElement.annotations[0].style.opacity = 0;
                        }
                      }

                      if (this.textDataTimeout) {
                        if (nodeElement.annotations[0].textBlinkTime) {
                          setTimeout(() => {
                            this.textDataBlink = false;
                            this.textDataTimeout = false;
                            nodeElement.annotations[0].style.opacity = 100;
                          }, (nodeElement.annotations[0].textBlinkTime * 1000));
                        }
                      }
                    }

                  }
                  break;
                default:
                  nodeElement.annotations[0].style.opacity = 100;
                  break;
              }

            }

          });
        }



        diagram.dataBind();
      });
    }, 500);
  }


  // complete --
  textDataContinue: boolean = true;
  textDataContinueBlinking() {
    let diagram: Diagram = this.selectedItem.selectedDiagram;
    let blinkInterval = setInterval(() => {
      diagram.nodes.forEach(nodeElement => {

        this.analogData.forEach(element => {

          if (nodeElement.annotations[0].textAnalogChName === element.chName) {
            let content = parseFloat(element.chData);

            if (nodeElement.id.includes("Limit1")) {

              switch (true) {
                case (nodeElement.annotations[0].textOperation == '='):

                  if (nodeElement.annotations[0].textSetValue == content) {
                    nodeElement.annotations[0].style.opacity = 100;
                  } else {
                    if (nodeElement.annotations[0].textContinueBlink && this.hideBlink) {
                      if (this.textDataContinue) {
                        nodeElement.annotations[0].style.opacity = 0;
                        this.textDataContinue = false;
                      } else {
                        nodeElement.annotations[0].style.opacity = 100;
                        this.textDataContinue = true;
                      }
                    }
                  }

                  break;
                case (nodeElement.annotations[0].textOperation == '>'):

                  if (content > nodeElement.annotations[0].textSetValue) {
                    nodeElement.annotations[0].style.opacity = 100;
                  } else {
                    if (nodeElement.annotations[0].textContinueBlink && this.hideBlink) {
                      if (this.textDataContinue) {
                        nodeElement.annotations[0].style.opacity = 0;
                        this.textDataContinue = false;
                      } else {
                        nodeElement.annotations[0].style.opacity = 100;
                        this.textDataContinue = true;
                      }
                    }
                  }
                  break;
                case (nodeElement.annotations[0].textOperation == '<'):

                  if (content < nodeElement.annotations[0].textSetValue) {
                    nodeElement.annotations[0].style.opacity = 100;
                  } else {
                    if (nodeElement.annotations[0].textContinueBlink && this.hideBlink) {
                      if (this.textDataContinue) {
                        nodeElement.annotations[0].style.opacity = 0;
                        this.textDataContinue = false;
                      } else {
                        nodeElement.annotations[0].style.opacity = 100;
                        this.textDataContinue = true;
                      }
                    }
                  }
                  break;
                case (nodeElement.annotations[0].textOperation == '>='):

                  if (content >= nodeElement.annotations[0].textSetValue) {
                    nodeElement.annotations[0].style.opacity = 100;
                  } else {
                    if (nodeElement.annotations[0].textContinueBlink && this.hideBlink) {
                      if (this.textDataContinue) {
                        nodeElement.annotations[0].style.opacity = 0;
                        this.textDataContinue = false;
                      } else {
                        nodeElement.annotations[0].style.opacity = 100;
                        this.textDataContinue = true;
                      }
                    }
                  }
                  break;
                case (nodeElement.annotations[0].textOperation == '<='):

                  if (content <= nodeElement.annotations[0].textSetValue) {
                    nodeElement.annotations[0].style.opacity = 100;
                  } else {
                    if (nodeElement.annotations[0].textContinueBlink && this.hideBlink) {
                      if (this.textDataContinue) {
                        nodeElement.annotations[0].style.opacity = 0;
                        this.textDataContinue = false;
                      } else {
                        nodeElement.annotations[0].style.opacity = 100;
                        this.textDataContinue = true;
                      }
                    }
                  }
                  break;
                case (nodeElement.annotations[0].textOperation == '!='):

                  if (content != nodeElement.annotations[0].textSetValue) {
                    nodeElement.annotations[0].style.opacity = 100;
                  } else {
                    if (nodeElement.annotations[0].textContinueBlink && this.hideBlink) {
                      if (this.textDataContinue) {
                        nodeElement.annotations[0].style.opacity = 0;
                        this.textDataContinue = false;
                      } else {
                        nodeElement.annotations[0].style.opacity = 100;
                        this.textDataContinue = true;
                      }
                    }
                  }
                  break;
                default:
                  nodeElement.annotations[0].style.opacity = 100;
                  break;
              }
            }

          }

        });


        diagram.dataBind();
      });
    }, 500);
  }

  hideBlink?: boolean = true;
  hideOpacity1?: boolean = true;
  hideOpacity2?: boolean = true;
  textDataProperties() {
    let diagram: Diagram = this.selectedItem.selectedDiagram;

    setInterval(() => {
      diagram.nodes.forEach(nodeElement => {
        if (nodeElement.id.includes("Limit1")) {

          if (nodeElement.annotations[0].textTooltip) {
            nodeElement.tooltip = {
              content: this.getcontent(nodeElement.annotations[0].textTooltip),
              position: 'TopCenter',
              relativeMode: 'Object',
              animation: { open: { effect: 'FadeZoomIn', delay: 0 }, close: { effect: 'FadeZoomOut', delay: 0 } }
            }
            nodeElement.constraints = (NodeConstraints.Default & ~NodeConstraints.InheritTooltip) | NodeConstraints.Tooltip;
          }

          this.analogData.forEach(element => {

            if (nodeElement.annotations[0].textAnalogChName === element.chName) {
              if (nodeElement.annotations[0].textDecimal) {

                const decimal = parseInt(nodeElement.annotations[0].textDecimal)
                const chData = parseFloat(element.chData)
                const fixedDecimalValue = chData.toFixed(decimal);
                nodeElement.annotations[0].content = fixedDecimalValue;
              } else {

                nodeElement.annotations[0].content = (element.chData).toString();
              }
              let content = parseFloat(element.chData);

              if (nodeElement.annotations[0].analogUnit) {
                nodeElement.annotations[0].content = nodeElement.annotations[0].content.concat(" ", nodeElement.annotations[0].analogUnit);
              }

              switch (true) {
                case (nodeElement.annotations[0].textOperation == '='):

                  if (nodeElement.annotations[0].textSetValue == content) {

                    if (nodeElement.annotations[0].normalImage) {
                      nodeElement.shape.source = nodeElement.annotations[0].normalImage;
                    } else {
                      nodeElement.shape.source = "";
                    }

                    if (nodeElement.annotations[0].textCheckColor) {
                      if (nodeElement.annotations[0].normalColor) {
                        nodeElement.annotations[0].style.color = nodeElement.annotations[0].normalColor;
                      }
                    }

                    if (nodeElement.annotations[0].textCheckBackgroundColor) {
                      if (nodeElement.annotations[0].normalBackgroundColor) {
                        nodeElement.style.fill = nodeElement.annotations[0].normalBackgroundColor;
                      }
                    }

                    if (nodeElement.annotations[0].textSetNormal) {
                      nodeElement.annotations[0].content = nodeElement.annotations[0].textSetNormal;
                      if (nodeElement.annotations[0].analogUnit) {
                        nodeElement.annotations[0].content = nodeElement.annotations[0].content.concat(" ", nodeElement.annotations[0].analogUnit);
                      }
                    } else {
                      nodeElement.annotations[0].content = content.toString();
                      if (nodeElement.annotations[0].analogUnit) {
                        nodeElement.annotations[0].content = nodeElement.annotations[0].content.concat(" ", nodeElement.annotations[0].analogUnit);
                      }
                    }

                    if (nodeElement.annotations[0].textCheckAudio && this.AudioService.isStop) {
                      this.AudioService.loadAudio(nodeElement.annotations[0].textAudioFile);
                    }

                    if (nodeElement.annotations[0].hideOnNormal) {
                      nodeElement.annotations[0].style.opacity = 0;
                      if (nodeElement.id.includes("Limit1Image") || nodeElement.id.includes("Limit1Shape")) {
                        nodeElement.style.opacity = 0;
                      }
                      this.hideBlink = false;
                      this.hideOpacity2 = true;
                    } else {
                      if (this.hideOpacity1) {
                        nodeElement.annotations[0].style.opacity = 100;
                        if (nodeElement.id.includes("Limit1Image") || nodeElement.id.includes("Limit1Shape")) {
                          nodeElement.style.opacity = 100;
                        }
                        this.hideOpacity1 = false;
                      }
                      this.hideBlink = true;
                    }

                  } else {

                    if (nodeElement.annotations[0].abNormalImage) {
                      nodeElement.shape.source = nodeElement.annotations[0].abNormalImage;
                    } else {
                      nodeElement.shape.source = "";
                    }

                    if (nodeElement.annotations[0].hideOnAbNormal) {
                      nodeElement.annotations[0].style.opacity = 0;
                      if (nodeElement.id.includes("Limit1Image") || nodeElement.id.includes("Limit1Shape")) {
                        nodeElement.style.opacity = 0;
                      }
                      this.hideBlink = false;
                      this.hideOpacity1 = true;
                    } else {
                      if (this.hideOpacity2) {
                        nodeElement.annotations[0].style.opacity = 100;
                        if (nodeElement.id.includes("Limit1Image") || nodeElement.id.includes("Limit1Shape")) {
                          nodeElement.style.opacity = 100;
                        }
                        this.hideOpacity2 = false;
                      }
                      this.hideBlink = true;
                    }

                    if (nodeElement.annotations[0].abNormalColor) {
                      nodeElement.annotations[0].style.color = nodeElement.annotations[0].abNormalColor;
                    } else {
                      nodeElement.annotations[0].style.color = '#000000';
                    }
                    if (nodeElement.annotations[0].abNormalBackgroundColor) {
                      nodeElement.style.fill = nodeElement.annotations[0].abNormalBackgroundColor;
                    } else {
                      nodeElement.style.fill = '#ffffff';
                    }

                    if (nodeElement.annotations[0].textSetAbnormal) {
                      nodeElement.annotations[0].content = nodeElement.annotations[0].textSetAbnormal;
                      if (nodeElement.annotations[0].analogUnit) {
                        nodeElement.annotations[0].content = nodeElement.annotations[0].content.concat(" ", nodeElement.annotations[0].analogUnit);
                      }
                    } else {
                      nodeElement.annotations[0].content = content.toString();
                      if (nodeElement.annotations[0].analogUnit) {
                        nodeElement.annotations[0].content = nodeElement.annotations[0].content.concat(" ", nodeElement.annotations[0].analogUnit);
                      }
                    }

                    if (nodeElement.annotations[0].textCheckAudio) {
                      this.AudioService.stopAudio()
                    }
                  }

                  break;
                case (nodeElement.annotations[0].textOperation == '>'):


                  if (content > nodeElement.annotations[0].textSetValue) {

                    if (nodeElement.annotations[0].textSetNormal) {
                      nodeElement.annotations[0].content = nodeElement.annotations[0].textSetNormal;
                      if (nodeElement.annotations[0].analogUnit) {
                        nodeElement.annotations[0].content = nodeElement.annotations[0].content.concat(" ", nodeElement.annotations[0].analogUnit);
                      }
                    } else {
                      nodeElement.annotations[0].content = content.toString();
                      if (nodeElement.annotations[0].analogUnit) {
                        nodeElement.annotations[0].content = nodeElement.annotations[0].content.concat(" ", nodeElement.annotations[0].analogUnit);
                      }
                    }

                    if (nodeElement.annotations[0].textCheckColor) {
                      if (nodeElement.annotations[0].normalColor) {
                        nodeElement.annotations[0].style.color = nodeElement.annotations[0].normalColor;
                      }
                    }
                    if (nodeElement.annotations[0].textCheckBackgroundColor) {
                      if (nodeElement.annotations[0].normalBackgroundColor) {
                        nodeElement.style.fill = nodeElement.annotations[0].normalBackgroundColor;
                      }
                    }
                    if (nodeElement.annotations[0].textCheckAudio && this.AudioService.isStop) {
                      this.AudioService.loadAudio(nodeElement.annotations[0].textAudioFile);
                    }

                    if (nodeElement.annotations[0].hideOnNormal) {
                      nodeElement.annotations[0].style.opacity = 0;
                      if (nodeElement.id.includes("Limit1Image") || nodeElement.id.includes("Limit1Shape")) {
                        nodeElement.style.opacity = 0;
                      }
                      this.hideBlink = false;
                      this.hideOpacity2 = true;
                    } else {
                      if (this.hideOpacity1) {
                        nodeElement.annotations[0].style.opacity = 100;
                        if (nodeElement.id.includes("Limit1Image") || nodeElement.id.includes("Limit1Shape")) {
                          nodeElement.style.opacity = 100;
                        }
                        this.hideOpacity1 = false;
                      }
                      this.hideBlink = true;
                    }
                  } else {

                    if (nodeElement.annotations[0].hideOnAbNormal) {
                      nodeElement.annotations[0].style.opacity = 0;
                      if (nodeElement.id.includes("Limit1Image") || nodeElement.id.includes("Limit1Shape")) {
                        nodeElement.style.opacity = 0;
                      }
                      this.hideBlink = false;
                      this.hideOpacity1 = true;
                    } else {
                      if (this.hideOpacity2) {
                        nodeElement.annotations[0].style.opacity = 100;
                        if (nodeElement.id.includes("Limit1Image") || nodeElement.id.includes("Limit1Shape")) {
                          nodeElement.style.opacity = 100;
                        }
                        this.hideOpacity2 = false;
                      }
                      this.hideBlink = true;
                    }

                    if (nodeElement.annotations[0].textSetAbnormal) {
                      nodeElement.annotations[0].content = nodeElement.annotations[0].textSetAbnormal;
                      if (nodeElement.annotations[0].analogUnit) {
                        nodeElement.annotations[0].content = nodeElement.annotations[0].content.concat(" ", nodeElement.annotations[0].analogUnit);
                      }
                    } else {
                      nodeElement.annotations[0].content = content.toString();
                      if (nodeElement.annotations[0].analogUnit) {
                        nodeElement.annotations[0].content = nodeElement.annotations[0].content.concat(" ", nodeElement.annotations[0].analogUnit);
                      }
                    }

                    if (nodeElement.annotations[0].abNormalColor) {
                      nodeElement.annotations[0].style.color = nodeElement.annotations[0].abNormalColor;
                    } else {
                      nodeElement.annotations[0].style.color = '#000000';
                    }
                    if (nodeElement.annotations[0].abNormalBackgroundColor) {
                      nodeElement.style.fill = nodeElement.annotations[0].abNormalBackgroundColor;
                    } else {
                      nodeElement.style.fill = '#ffffff';
                    }
                    if (nodeElement.annotations[0].textCheckAudio) {
                      this.AudioService.stopAudio()
                    }
                  }
                  break;
                case (nodeElement.annotations[0].textOperation == '<'):

                  if (content < nodeElement.annotations[0].textSetValue) {

                    if (nodeElement.annotations[0].textSetNormal) {
                      nodeElement.annotations[0].content = nodeElement.annotations[0].textSetNormal;
                      if (nodeElement.annotations[0].analogUnit) {
                        nodeElement.annotations[0].content = nodeElement.annotations[0].content.concat(" ", nodeElement.annotations[0].analogUnit);
                      }
                    } else {
                      nodeElement.annotations[0].content = content.toString();
                      if (nodeElement.annotations[0].analogUnit) {
                        nodeElement.annotations[0].content = nodeElement.annotations[0].content.concat(" ", nodeElement.annotations[0].analogUnit);
                      }
                    }

                    if (nodeElement.annotations[0].textCheckColor) {
                      if (nodeElement.annotations[0].normalColor) {
                        nodeElement.annotations[0].style.color = nodeElement.annotations[0].normalColor;
                      }
                    }
                    if (nodeElement.annotations[0].textCheckBackgroundColor) {
                      if (nodeElement.annotations[0].normalBackgroundColor) {
                        nodeElement.style.fill = nodeElement.annotations[0].normalBackgroundColor;
                      }
                    }
                    if (nodeElement.annotations[0].textCheckAudio && this.AudioService.isStop) {
                      this.AudioService.loadAudio(nodeElement.annotations[0].textAudioFile);
                    }

                    if (nodeElement.annotations[0].hideOnNormal) {
                      nodeElement.annotations[0].style.opacity = 0;
                      if (nodeElement.id.includes("Limit1Image") || nodeElement.id.includes("Limit1Shape")) {
                        nodeElement.style.opacity = 0;
                      }
                      this.hideBlink = false;
                      this.hideOpacity2 = true;
                    } else {
                      if (this.hideOpacity1) {
                        nodeElement.annotations[0].style.opacity = 100;
                        if (nodeElement.id.includes("Limit1Image") || nodeElement.id.includes("Limit1Shape")) {
                          nodeElement.style.opacity = 100;
                        }
                        this.hideOpacity1 = false;
                      }
                      this.hideBlink = true;
                    }

                  } else {

                    if (nodeElement.annotations[0].hideOnAbNormal) {
                      nodeElement.annotations[0].style.opacity = 0;
                      if (nodeElement.id.includes("Limit1Image") || nodeElement.id.includes("Limit1Shape")) {
                        nodeElement.style.opacity = 0;
                      }
                      this.hideBlink = false;
                      this.hideOpacity1 = true;
                    } else {
                      if (this.hideOpacity2) {
                        nodeElement.annotations[0].style.opacity = 100;
                        if (nodeElement.id.includes("Limit1Image") || nodeElement.id.includes("Limit1Shape")) {
                          nodeElement.style.opacity = 100;
                        }
                        this.hideOpacity2 = false;
                      }
                      this.hideBlink = true;
                    }


                    if (nodeElement.annotations[0].textSetAbnormal) {
                      nodeElement.annotations[0].content = nodeElement.annotations[0].textSetAbnormal;
                      if (nodeElement.annotations[0].analogUnit) {
                        nodeElement.annotations[0].content = nodeElement.annotations[0].content.concat(" ", nodeElement.annotations[0].analogUnit);
                      }
                    } else {
                      nodeElement.annotations[0].content = content.toString();
                      if (nodeElement.annotations[0].analogUnit) {
                        nodeElement.annotations[0].content = nodeElement.annotations[0].content.concat(" ", nodeElement.annotations[0].analogUnit);
                      }
                    }

                    if (nodeElement.annotations[0].abNormalColor) {
                      nodeElement.annotations[0].style.color = nodeElement.annotations[0].abNormalColor;
                    } else {
                      nodeElement.annotations[0].style.color = '#000000';
                    }
                    if (nodeElement.annotations[0].abNormalBackgroundColor) {
                      nodeElement.style.fill = nodeElement.annotations[0].abNormalBackgroundColor;
                    } else {
                      nodeElement.style.fill = '#ffffff';
                    }
                    if (nodeElement.annotations[0].textCheckAudio) {
                      this.AudioService.stopAudio()
                    }
                  }
                  break;
                case (nodeElement.annotations[0].textOperation == '>='):

                  if (content >= nodeElement.annotations[0].textSetValue) {

                    if (nodeElement.annotations[0].textSetNormal) {
                      nodeElement.annotations[0].content = nodeElement.annotations[0].textSetNormal;
                      if (nodeElement.annotations[0].analogUnit) {
                        nodeElement.annotations[0].content = nodeElement.annotations[0].content.concat(" ", nodeElement.annotations[0].analogUnit);
                      }
                    } else {
                      nodeElement.annotations[0].content = content.toString();
                      if (nodeElement.annotations[0].analogUnit) {
                        nodeElement.annotations[0].content = nodeElement.annotations[0].content.concat(" ", nodeElement.annotations[0].analogUnit);
                      }
                    }

                    if (nodeElement.annotations[0].textCheckColor) {
                      if (nodeElement.annotations[0].normalColor) {
                        nodeElement.annotations[0].style.color = nodeElement.annotations[0].normalColor;
                      }
                    }
                    if (nodeElement.annotations[0].textCheckBackgroundColor) {
                      if (nodeElement.annotations[0].normalBackgroundColor) {
                        nodeElement.style.fill = nodeElement.annotations[0].normalBackgroundColor;
                      }
                    }
                    if (nodeElement.annotations[0].textCheckAudio && this.AudioService.isStop) {
                      this.AudioService.loadAudio(nodeElement.annotations[0].textAudioFile);
                    }

                    if (nodeElement.annotations[0].hideOnNormal) {
                      nodeElement.annotations[0].style.opacity = 0;
                      if (nodeElement.id.includes("Limit1Image") || nodeElement.id.includes("Limit1Shape")) {
                        nodeElement.style.opacity = 0;
                      }
                      this.hideBlink = false;
                      this.hideOpacity2 = true;
                    } else {
                      if (this.hideOpacity1) {
                        nodeElement.annotations[0].style.opacity = 100;
                        if (nodeElement.id.includes("Limit1Image") || nodeElement.id.includes("Limit1Shape")) {
                          nodeElement.style.opacity = 100;
                        }
                        this.hideOpacity1 = false;
                      }
                      this.hideBlink = true;
                    }

                  } else {

                    if (nodeElement.annotations[0].hideOnAbNormal) {
                      nodeElement.annotations[0].style.opacity = 0;
                      if (nodeElement.id.includes("Limit1Image") || nodeElement.id.includes("Limit1Shape")) {
                        nodeElement.style.opacity = 0;
                      }
                      this.hideBlink = false;
                      this.hideOpacity1 = true;
                    } else {
                      if (this.hideOpacity2) {
                        nodeElement.annotations[0].style.opacity = 100;
                        if (nodeElement.id.includes("Limit1Image") || nodeElement.id.includes("Limit1Shape")) {
                          nodeElement.style.opacity = 100;
                        }
                        this.hideOpacity2 = false;
                      }
                      this.hideBlink = true;
                    }

                    if (nodeElement.annotations[0].textSetAbnormal) {
                      nodeElement.annotations[0].content = nodeElement.annotations[0].textSetAbnormal;
                      if (nodeElement.annotations[0].analogUnit) {
                        nodeElement.annotations[0].content = nodeElement.annotations[0].content.concat(" ", nodeElement.annotations[0].analogUnit);
                      }
                    } else {
                      nodeElement.annotations[0].content = content.toString();
                      if (nodeElement.annotations[0].analogUnit) {
                        nodeElement.annotations[0].content = nodeElement.annotations[0].content.concat(" ", nodeElement.annotations[0].analogUnit);
                      }
                    }

                    if (nodeElement.annotations[0].abNormalColor) {
                      nodeElement.annotations[0].style.color = nodeElement.annotations[0].abNormalColor;
                    } else {
                      nodeElement.annotations[0].style.color = '#000000';
                    }
                    if (nodeElement.annotations[0].abNormalBackgroundColor) {
                      nodeElement.style.fill = nodeElement.annotations[0].abNormalBackgroundColor;
                    } else {
                      nodeElement.style.fill = '#ffffff';
                    }
                    if (nodeElement.annotations[0].textCheckAudio) {
                      this.AudioService.stopAudio()
                    }
                  }
                  break;
                case (nodeElement.annotations[0].textOperation == '<='):

                  if (content <= nodeElement.annotations[0].textSetValue) {

                    if (nodeElement.annotations[0].textSetNormal) {
                      nodeElement.annotations[0].content = nodeElement.annotations[0].textSetNormal;
                      if (nodeElement.annotations[0].analogUnit) {
                        nodeElement.annotations[0].content = nodeElement.annotations[0].content.concat(" ", nodeElement.annotations[0].analogUnit);
                      }
                    } else {
                      nodeElement.annotations[0].content = content.toString();
                      if (nodeElement.annotations[0].analogUnit) {
                        nodeElement.annotations[0].content = nodeElement.annotations[0].content.concat(" ", nodeElement.annotations[0].analogUnit);
                      }
                    }

                    if (nodeElement.annotations[0].textCheckColor) {
                      if (nodeElement.annotations[0].normalColor) {
                        nodeElement.annotations[0].style.color = nodeElement.annotations[0].normalColor;
                      }
                    }
                    if (nodeElement.annotations[0].textCheckBackgroundColor) {
                      if (nodeElement.annotations[0].normalBackgroundColor) {
                        nodeElement.style.fill = nodeElement.annotations[0].normalBackgroundColor;
                      }
                    }
                    if (nodeElement.annotations[0].textCheckAudio && this.AudioService.isStop) {
                      this.AudioService.loadAudio(nodeElement.annotations[0].textAudioFile);
                    }

                    if (nodeElement.annotations[0].hideOnNormal) {
                      nodeElement.annotations[0].style.opacity = 0;
                      if (nodeElement.id.includes("Limit1Image") || nodeElement.id.includes("Limit1Shape")) {
                        nodeElement.style.opacity = 0;
                      }
                      this.hideBlink = false;
                      this.hideOpacity2 = true;
                    } else {
                      if (this.hideOpacity1) {
                        nodeElement.annotations[0].style.opacity = 100;
                        if (nodeElement.id.includes("Limit1Image") || nodeElement.id.includes("Limit1Shape")) {
                          nodeElement.style.opacity = 100;
                        }
                        this.hideOpacity1 = false;
                      }
                      this.hideBlink = true;
                    }

                  } else {

                    if (nodeElement.annotations[0].hideOnAbNormal) {
                      nodeElement.annotations[0].style.opacity = 0;
                      if (nodeElement.id.includes("Limit1Image") || nodeElement.id.includes("Limit1Shape")) {
                        nodeElement.style.opacity = 0;
                      }
                      this.hideBlink = false;
                      this.hideOpacity1 = true;
                    } else {
                      if (this.hideOpacity2) {
                        nodeElement.annotations[0].style.opacity = 100;
                        if (nodeElement.id.includes("Limit1Image") || nodeElement.id.includes("Limit1Shape")) {
                          nodeElement.style.opacity = 100;
                        }
                        this.hideOpacity2 = false;
                      }
                      this.hideBlink = true;
                    }

                    if (nodeElement.annotations[0].textSetAbnormal) {
                      nodeElement.annotations[0].content = nodeElement.annotations[0].textSetAbnormal;
                      if (nodeElement.annotations[0].analogUnit) {
                        nodeElement.annotations[0].content = nodeElement.annotations[0].content.concat(" ", nodeElement.annotations[0].analogUnit);
                      }
                    } else {
                      nodeElement.annotations[0].content = content.toString();
                      if (nodeElement.annotations[0].analogUnit) {
                        nodeElement.annotations[0].content = nodeElement.annotations[0].content.concat(" ", nodeElement.annotations[0].analogUnit);
                      }
                    }

                    if (nodeElement.annotations[0].abNormalColor) {
                      nodeElement.annotations[0].style.color = nodeElement.annotations[0].abNormalColor;
                    } else {
                      nodeElement.annotations[0].style.color = '#000000';
                    }
                    if (nodeElement.annotations[0].abNormalBackgroundColor) {
                      nodeElement.style.fill = nodeElement.annotations[0].abNormalBackgroundColor;
                    } else {
                      nodeElement.style.fill = '#ffffff';
                    }
                    if (nodeElement.annotations[0].textCheckAudio) {
                      this.AudioService.stopAudio()
                    }
                  }
                  break;
                case (nodeElement.annotations[0].textOperation == '!='):

                  if (nodeElement.annotations[0].content != nodeElement.annotations[0].textSetValue) {

                    if (nodeElement.annotations[0].textSetNormal) {
                      nodeElement.annotations[0].content = nodeElement.annotations[0].textSetNormal;
                      if (nodeElement.annotations[0].analogUnit) {
                        nodeElement.annotations[0].content = nodeElement.annotations[0].content.concat(" ", nodeElement.annotations[0].analogUnit);
                      }
                    } else {
                      nodeElement.annotations[0].content = content.toString();
                      if (nodeElement.annotations[0].analogUnit) {
                        nodeElement.annotations[0].content = nodeElement.annotations[0].content.concat(" ", nodeElement.annotations[0].analogUnit);
                      }
                    }

                    if (nodeElement.annotations[0].textCheckColor) {
                      if (nodeElement.annotations[0].normalColor) {
                        nodeElement.annotations[0].style.color = nodeElement.annotations[0].normalColor;
                      }
                    }
                    if (nodeElement.annotations[0].textCheckBackgroundColor) {
                      if (nodeElement.annotations[0].normalBackgroundColor) {
                        nodeElement.style.fill = nodeElement.annotations[0].normalBackgroundColor;
                      }
                    }
                    if (nodeElement.annotations[0].textCheckAudio && this.AudioService.isStop) {
                      this.AudioService.loadAudio(nodeElement.annotations[0].textAudioFile);
                    }

                    if (nodeElement.annotations[0].hideOnNormal) {
                      nodeElement.annotations[0].style.opacity = 0;
                      if (nodeElement.id.includes("Limit1Image") || nodeElement.id.includes("Limit1Shape")) {
                        nodeElement.style.opacity = 0;
                      }
                      this.hideBlink = false;
                      this.hideOpacity2 = true;
                    } else {
                      if (this.hideOpacity1) {
                        nodeElement.annotations[0].style.opacity = 100;
                        if (nodeElement.id.includes("Limit1Image") || nodeElement.id.includes("Limit1Shape")) {
                          nodeElement.style.opacity = 100;
                        }
                        this.hideOpacity1 = false;
                      }
                      this.hideBlink = true;
                    }

                  } else {

                    if (nodeElement.annotations[0].hideOnAbNormal) {
                      nodeElement.annotations[0].style.opacity = 0;
                      if (nodeElement.id.includes("Limit1Image") || nodeElement.id.includes("Limit1Shape")) {
                        nodeElement.style.opacity = 0;
                      }
                      this.hideBlink = false;
                      this.hideOpacity1 = true;
                    } else {
                      if (this.hideOpacity2) {
                        nodeElement.annotations[0].style.opacity = 100;
                        if (nodeElement.id.includes("Limit1Image") || nodeElement.id.includes("Limit1Shape")) {
                          nodeElement.style.opacity = 100;
                        }
                        this.hideOpacity2 = false;
                      }
                      this.hideBlink = true;
                    }

                    if (nodeElement.annotations[0].textSetAbnormal) {
                      nodeElement.annotations[0].content = nodeElement.annotations[0].textSetAbnormal;
                      if (nodeElement.annotations[0].analogUnit) {
                        nodeElement.annotations[0].content = nodeElement.annotations[0].content.concat(" ", nodeElement.annotations[0].analogUnit);
                      }
                    } else {
                      nodeElement.annotations[0].content = content.toString();
                      if (nodeElement.annotations[0].analogUnit) {
                        nodeElement.annotations[0].content = nodeElement.annotations[0].content.concat(" ", nodeElement.annotations[0].analogUnit);
                      }
                    }

                    if (nodeElement.annotations[0].abNormalColor) {
                      nodeElement.annotations[0].style.color = nodeElement.annotations[0].abNormalColor;
                    } else {
                      nodeElement.annotations[0].style.color = '#000000';
                    }
                    if (nodeElement.annotations[0].abNormalBackgroundColor) {
                      nodeElement.style.fill = nodeElement.annotations[0].abNormalBackgroundColor;
                    } else {
                      nodeElement.style.fill = '#ffffff';
                    }
                    if (nodeElement.annotations[0].textCheckAudio) {
                      this.AudioService.stopAudio()
                    }
                  }
                  break;
                default:
                  nodeElement.annotations[0].content = nodeElement.annotations[0].content;
                  if (nodeElement.annotations[0].analogUnit) {
                    nodeElement.annotations[0].content = nodeElement.annotations[0].content.concat(" ", nodeElement.annotations[0].analogUnit);
                  }
                  nodeElement.annotations[0].style.color = '#000000';
                  break;
              }

            }
          });
        }

      });
      diagram.dataBind();
    }, 100);
  }

  opacityCheckLow = false;
  opacityCheckHigh = false;

  // complete
  textLimitContinueBlink() {
    let diagram: Diagram = this.selectedItem.selectedDiagram;

    setInterval(() => {
      diagram.nodes.forEach(nodeElement => {




        this.analogData.forEach(element => {
          if (nodeElement.annotations[0].textAnalogChName === element.chName) {

            let content = parseFloat(element.chData);

            if (nodeElement.id.includes("numeric2")) {
              if (content < nodeElement.annotations[0].textLowLimitValue) {

                if (nodeElement.annotations[0].textLowLimitBlinkContCheck) {
                  if (this.opacityCheckLow) {
                    nodeElement.annotations[0].style.opacity = 0;
                    this.opacityCheckLow = false;
                  } else {
                    nodeElement.annotations[0].style.opacity = 100;
                    this.opacityCheckLow = true;
                  }
                }

              } else if (content > nodeElement.annotations[0].textHighLimitValue) {

                if (nodeElement.annotations[0].textHighLimitBlinkContCheck) {
                  if (this.opacityCheckHigh) {
                    nodeElement.annotations[0].style.opacity = 0;
                    this.opacityCheckHigh = false;
                  } else {
                    nodeElement.annotations[0].style.opacity = 100;
                    this.opacityCheckHigh = true;
                  }
                }

              } else {
                nodeElement.annotations[0].style.opacity = 100;
              }
            }

          }
        });
      });
    }, 500)
  }

  intervalCheckLowLimit: boolean = true;
  intervalCheckHighLimit: boolean = true;
  textLowLimit: boolean = true;
  textHighLimit: boolean = true;

  // complete
  textLimitTimeBlink() {

    let diagram: Diagram = this.selectedItem.selectedDiagram;
    let blinkInterval = setInterval(() => {
      diagram.nodes.forEach(nodeElement => {

        if (nodeElement.id.includes("numeric2")) {
          this.analogData.forEach(element => {

            if (nodeElement.annotations[0].textAnalogChName === element.chName) {
              let content = parseFloat(element.chData);

              if (content < nodeElement.annotations[0].textLowLimitValue) {
                if (nodeElement.annotations[0].textLowLimitBlinkTimeCheck) {

                  if (this.intervalCheckLowLimit) {
                    if (nodeElement.annotations[0].style.opacity === 0) {
                      nodeElement.annotations[0].style.opacity = 100;
                    } else {
                      nodeElement.annotations[0].style.opacity = 0;
                    }
                  }

                  if (this.textLowLimit) {
                    if (nodeElement.annotations[0].textLowLimitBlinkTime) {
                      setTimeout(() => {
                        this.intervalCheckLowLimit = false;
                        this.textLowLimit = false;
                        nodeElement.annotations[0].style.opacity = 100;
                      }, (nodeElement.annotations[0].textLowLimitBlinkTime * 1000));
                    }
                  }
                }
              } else {
                this.intervalCheckLowLimit = true;
                this.textLowLimit = true;
              }

              if (content > nodeElement.annotations[0].textHighLimitValue) {
                if (nodeElement.annotations[0].textHighLimitBlinkTimeCheck) {

                  if (this.intervalCheckHighLimit) {
                    if (nodeElement.annotations[0].style.opacity === 0) {
                      nodeElement.annotations[0].style.opacity = 100;
                    } else {
                      nodeElement.annotations[0].style.opacity = 0;
                    }
                  }

                  if (this.textHighLimit) {
                    if (nodeElement.annotations[0].textHighLimitBlinkTime) {
                      setTimeout(() => {
                        this.intervalCheckHighLimit = false;
                        this.textHighLimit = false;
                        nodeElement.annotations[0].style.opacity = 100;
                      }, (nodeElement.annotations[0].textHighLimitBlinkTime * 1000));
                    }
                  }
                }
              } else {
                this.intervalCheckHighLimit = true;
                this.textHighLimit = true;
              }



            }

          });
        }

        diagram.dataBind();
      });
    }, 500);

  }



  textLimitProperties() {
    let diagram: Diagram = this.selectedItem.selectedDiagram;

    setInterval(() => {

      diagram.nodes.forEach(nodeElement => {
        if (nodeElement.shape.type === "Text" || nodeElement.shape.type === "Flow") {

          if (nodeElement.id.includes("numeric2")) {
            this.analogData.forEach(element => {
              if (nodeElement.annotations[0].textAnalogChName === element.chName) {

                if (nodeElement.annotations[0].textDecimal) {
                  const decimal = parseInt(nodeElement.annotations[0].textDecimal)
                  const chData = parseFloat(element.chData)
                  const fixedDecimalValue = chData.toFixed(decimal);
                  nodeElement.annotations[0].content = fixedDecimalValue;
                } else {
                  nodeElement.annotations[0].content = (element.chData).toString();
                }

                let content = parseFloat(element.chData);

                if (nodeElement.annotations[0].analogUnit) {
                  nodeElement.annotations[0].content = nodeElement.annotations[0].content.concat(" ", nodeElement.annotations[0].analogUnit);
                }

                if (nodeElement.annotations[0].textLowLimitValue) {
                  if (content < nodeElement.annotations[0].textLowLimitValue) {
                    if (nodeElement.annotations[0].textLowLimitCheckColor) {
                      nodeElement.annotations[0].style.color = nodeElement.annotations[0].textLowLimitColorValue;
                    }
                    if (nodeElement.annotations[0].textLowLimitCheckText) {
                      nodeElement.annotations[0].content = nodeElement.annotations[0].textLowLimitTextValue;
                    }
                    if (nodeElement.annotations[0].textLowLimitCheckShape) {
                      nodeElement.annotations[0].content = nodeElement.annotations[0].textLowLimitShapeValue;
                    }
                    if (nodeElement.annotations[0].textLowLimitCheckText && nodeElement.annotations[0].textLowLimitCheckShape) {
                      nodeElement.annotations[0].content = (nodeElement.annotations[0].textLowLimitTextValue).concat(" ", nodeElement.annotations[0].textLowLimitShapeValue);
                    }
                  }
                }

                if (nodeElement.annotations[0].textHighLimitValue) {
                  if (content > nodeElement.annotations[0].textHighLimitValue) {
                    if (nodeElement.annotations[0].textHighLimitCheckColor) {
                      nodeElement.annotations[0].style.color = nodeElement.annotations[0].textHighLimitColorValue;
                    }
                    if (nodeElement.annotations[0].textHighLimitCheckText) {
                      nodeElement.annotations[0].content = nodeElement.annotations[0].textHighLimitTextValue;
                    }
                    if (nodeElement.annotations[0].textHighLimitCheckShape) {
                      nodeElement.annotations[0].content = nodeElement.annotations[0].textHighLimitShapeValue;
                    }
                    if (nodeElement.annotations[0].textHighLimitCheckText && nodeElement.annotations[0].textHighLimitCheckShape) {
                      nodeElement.annotations[0].content = (nodeElement.annotations[0].textHighLimitTextValue).concat(" ", nodeElement.annotations[0].textHighLimitShapeValue);
                    }
                  }
                }
              }
            });
          }
        }
      });

    }, 500);

  }

  // blinkTime: number;
  intervalCheckNodeBlinking: boolean = true;
  previousContentNodeBlinking: { [key: string]: string } = {};

  nodeBlinking() {

    let diagram: Diagram = this.selectedItem.selectedDiagram;

    let blinkInterval = setInterval(() => {
      diagram.nodes.forEach(nodeElement => {
        if (nodeElement.shape.type == 'Basic' || nodeElement.shape.type == 'Image') {
          if (nodeElement.annotations[0].blinkCheck.isChecked) {

            if (this.intervalCheckNodeBlinking) {
              if (nodeElement.style.opacity === 0) {
                nodeElement.style.opacity = 100;
              } else {
                nodeElement.style.opacity = 0;
              }
            }

            if (nodeElement.annotations[0].blinkCheck.blinkTime) {
              setTimeout(() => {
                this.intervalCheckNodeBlinking = false;
                nodeElement.style.opacity = 100;
              }, (nodeElement.annotations[0].blinkCheck.blinkTime * 1000));
            }
          } else {
            this.intervalCheckNodeBlinking = true;
          }
        }

      });
      diagram.dataBind();
    }, 3000);


  }

  getcontent(data: string): HTMLElement {
    let tooltipContent: HTMLElement = document.createElement('div');
    tooltipContent.innerHTML = `<div style="background-color: #f4f4f4; color: black; border-width:1px;border-style: solid;border-color: #d3d3d3; border-radius: 8px;white-space: nowrap;"> <span style="margin: 15px; font-size: 14px"> ${data} </span> </div>`;
    return tooltipContent;
  }


  visible: boolean = true;
  visible2: boolean = true;
  visible3: boolean = true;
  visible4: boolean = true;
  blink: boolean = true;
  bitTextLableProperties() {

    let diagram: Diagram = this.selectedItem.selectedDiagram;

    setInterval(() => {
      diagram.nodes.forEach(nodeElement => {
        if (nodeElement.shape.type == "Flow" || nodeElement.shape.type == "Basic") {


          if (nodeElement.annotations[0].textTooltip) {
            nodeElement.tooltip = {
              content: this.getcontent(nodeElement.annotations[0].textTooltip),
              position: 'TopCenter',
              relativeMode: 'Object',
              animation: { open: { effect: 'FadeZoomIn', delay: 0 }, close: { effect: 'FadeZoomOut', delay: 0 } }
            }
            nodeElement.constraints = (NodeConstraints.Default & ~NodeConstraints.InheritTooltip) | NodeConstraints.Tooltip;
          }


          if (nodeElement.id.includes("bitLable") || nodeElement.id.includes("Shape")) {
            this.digitalData.forEach(element => {

              if (element.chName == nodeElement.annotations[0].bitTextChName) {
                nodeElement.annotations[0].style.fontSize = 28;
                if (nodeElement.annotations[0].bitSet1asNormal) {
                  if ((element.chData).toLowerCase() == "remote" || (element.chData).toLowerCase() == "normal" || (element.chData).toLowerCase() == "on") {
                    nodeElement.annotations[0].content = "1";

                    if (nodeElement.annotations[0].bitAudio0to1) {
                      this.AudioService.loadAudio(nodeElement.annotations[0].bitAudio0to1);
                    } else {
                      this.AudioService.stopAudio();
                    }

                    if (nodeElement.annotations[0].bitTextFor1) {
                      nodeElement.annotations[0].content = nodeElement.annotations[0].bitTextFor1;
                    }

                    if (nodeElement.annotations[0].bitTextColorFor1) {
                      nodeElement.annotations[0].style.color = nodeElement.annotations[0].bitTextColorFor1;
                    }

                    if (nodeElement.annotations[0].bit1Color) {
                      nodeElement.annotations[0].style.color = nodeElement.annotations[0].bit1Color;
                    }

                    if (nodeElement.annotations[0].hideOnNormal) {
                      nodeElement.annotations[0].style.opacity = 0;
                      this.visible2 = true;
                      this.blink = false;
                    } else {
                      if (this.visible) {
                        nodeElement.annotations[0].style.opacity = 100;
                        this.visible = false;
                        this.blink = true;
                      }
                    }

                    if (nodeElement.annotations[0].bitShapeColor0to1) {
                      nodeElement.style.fill = nodeElement.annotations[0].bitShapeColor0to1;
                    } else {
                      nodeElement.style.fill = '#ffffff';
                    }


                  } else {
                    nodeElement.annotations[0].content = "0";


                    if (nodeElement.annotations[0].bitAudio1to0) {
                      this.AudioService.loadAudio(nodeElement.annotations[0].bitAudio1to0);
                    } else {
                      this.AudioService.stopAudio();
                    }

                    if (nodeElement.annotations[0].bitTextFor0) {
                      nodeElement.annotations[0].content = nodeElement.annotations[0].bitTextFor0;
                    }

                    if (nodeElement.annotations[0].bitTextColorFor0) {
                      nodeElement.annotations[0].style.color = nodeElement.annotations[0].bitTextColorFor0;
                    }

                    if (nodeElement.annotations[0].bit0Color) {
                      nodeElement.annotations[0].style.color = nodeElement.annotations[0].bit0Color;
                    }


                    if (nodeElement.annotations[0].hideOnAbNormal) {
                      nodeElement.annotations[0].style.opacity = 0;
                      this.visible = true;
                      this.blink = false;
                    } else {
                      if (this.visible2) {
                        nodeElement.annotations[0].style.opacity = 100;
                        this.blink = true;
                        this.visible2 = false;
                      }
                    }

                    if (nodeElement.annotations[0].bitShapeColor1to0) {
                      nodeElement.style.fill = nodeElement.annotations[0].bitShapeColor1to0;
                    } else {
                      nodeElement.style.fill = '#ffffff';
                    }

                  }
                } else if (nodeElement.annotations[0].bitSet1asAbnormal) {
                  if ((element.chData).toLowerCase() == "remote" || (element.chData).toLowerCase() == "normal" || (element.chData).toLowerCase() == "on") {
                    nodeElement.annotations[0].content = "0";


                    if (nodeElement.annotations[0].bitAudio1to0) {
                      this.AudioService.loadAudio(nodeElement.annotations[0].bitAudio1to0);
                    } else {
                      this.AudioService.stopAudio();
                    }

                    if (nodeElement.annotations[0].bitTextFor0) {
                      nodeElement.annotations[0].content = nodeElement.annotations[0].bitTextFor0;
                    }

                    if (nodeElement.annotations[0].bitTextColorFor0) {
                      nodeElement.annotations[0].style.color = nodeElement.annotations[0].bitTextColorFor0;
                    }

                    if (nodeElement.annotations[0].bit0Color) {
                      nodeElement.annotations[0].style.color = nodeElement.annotations[0].bit0Color;
                    }

                    if (nodeElement.annotations[0].hideOnNormal) {
                      nodeElement.annotations[0].style.opacity = 0;
                      this.visible2 = true;
                      this.blink = false;
                    } else {
                      if (this.visible) {
                        nodeElement.annotations[0].style.opacity = 100;
                        this.visible = false;
                        this.blink = true;
                      }
                    }

                    if (nodeElement.annotations[0].bitShapeColor1to0) {
                      nodeElement.style.fill = nodeElement.annotations[0].bitShapeColor1to0;
                    } else {
                      nodeElement.style.fill = '#ffffff';
                    }

                  } else {
                    nodeElement.annotations[0].content = "1";

                    if (nodeElement.annotations[0].bitAudio0to1) {
                      this.AudioService.loadAudio(nodeElement.annotations[0].bitAudio0to1);
                    } else {
                      this.AudioService.stopAudio();
                    }

                    if (nodeElement.annotations[0].bitTextFor1) {
                      nodeElement.annotations[0].content = nodeElement.annotations[0].bitTextFor1;
                    }

                    if (nodeElement.annotations[0].bitTextColorFor1) {
                      nodeElement.annotations[0].style.color = nodeElement.annotations[0].bitTextColorFor1;
                    }

                    if (nodeElement.annotations[0].bit1Color) {
                      nodeElement.annotations[0].style.color = nodeElement.annotations[0].bit1Color;
                    }


                    if (nodeElement.annotations[0].hideOnNormal) {
                      nodeElement.annotations[0].style.opacity = 0;
                      this.visible2 = true;
                      this.blink = false;
                    } else {
                      if (this.visible) {
                        nodeElement.annotations[0].style.opacity = 100;
                        this.visible = false;
                        this.blink = true;
                      }
                    }

                    if (nodeElement.annotations[0].bitShapeColor0to1) {
                      nodeElement.style.fill = nodeElement.annotations[0].bitShapeColor0to1;
                    } else {
                      nodeElement.style.fill = '#ffffff';
                    }
                  }
                }
              }



            });
          }
        }
      });
    }, 100);

  }

  bitTextImageProperties() {

    let diagram: Diagram = this.selectedItem.selectedDiagram;

    setInterval(() => {

      diagram.nodes.forEach(nodeElement => {

        if (nodeElement.id.includes("bitImage")) {


          this.digitalData.forEach(element => {

            if (nodeElement.annotations[0].bitTextChName == element.chName) {

              nodeElement.annotations[0].style.fontSize = 28;

              if (nodeElement.annotations[0].bitSet1asNormal) {
                if ((element.chData).toLowerCase() == "remote" || (element.chData).toLowerCase() == "normal" || (element.chData).toLowerCase() == "on") {
                  nodeElement.annotations[0].content = "1";

                  if (nodeElement.annotations[0].bitImageFor0to1) {
                    nodeElement.shape.source = nodeElement.annotations[0].bitImageFor0to1;
                  } else if (nodeElement.annotations[0].bitImagefor1) {
                    nodeElement.shape.source = nodeElement.annotations[0].bitImagefor1;
                  } else {
                    nodeElement.shape.source = nodeElement.annotations[0].bitTempSource;
                  }


                  if (nodeElement.annotations[0].bitAudio0to1) {
                    this.AudioService.loadAudio(nodeElement.annotations[0].bitAudio0to1);
                  } else {
                    this.AudioService.stopAudio();
                  }

                } else {
                  nodeElement.annotations[0].content = "0";

                  if (nodeElement.annotations[0].bitAudio1to0) {
                    this.AudioService.loadAudio(nodeElement.annotations[0].bitAudio1to0);
                  } else {
                    this.AudioService.stopAudio();
                  }


                  if (nodeElement.annotations[0].bitImageFor1to0) {
                    nodeElement.shape.source = nodeElement.annotations[0].bitImageFor1to0;
                  } else if (nodeElement.annotations[0].bitImagefor0) {
                    nodeElement.shape.source = nodeElement.annotations[0].bitImagefor0;
                  } else {
                    nodeElement.shape.source = nodeElement.annotations[0].bitTempSource;
                  }

                }
              } else if (nodeElement.annotations[0].bitSet1asAbnormal) {
                if ((element.chData).toLowerCase() == "remote" || (element.chData).toLowerCase() == "normal" || (element.chData).toLowerCase() == "on") {
                  nodeElement.annotations[0].content = "0";

                  if (nodeElement.annotations[0].bitAudio1to0) {
                    this.AudioService.loadAudio(nodeElement.annotations[0].bitAudio1to0);
                  } else {
                    this.AudioService.stopAudio();
                  }

                  if (nodeElement.annotations[0].bitImageFor1to0) {
                    nodeElement.shape.source = nodeElement.annotations[0].bitImageFor1to0;
                  } else if (nodeElement.annotations[0].bitImagefor0) {
                    nodeElement.shape.source = nodeElement.annotations[0].bitImagefor0;
                  } else {
                    nodeElement.shape.source = nodeElement.annotations[0].bitTempSource;
                  }


                } else {
                  nodeElement.annotations[0].content = "1";

                  if (nodeElement.annotations[0].bitAudio0to1) {
                    this.AudioService.loadAudio(nodeElement.annotations[0].bitAudio0to1);
                  } else {
                    this.AudioService.stopAudio();
                  }

                  if (nodeElement.annotations[0].bitImageFor0to1) {
                    nodeElement.shape.source = nodeElement.annotations[0].bitImageFor0to1;
                  } else if (nodeElement.annotations[0].bitImagefor1) {
                    nodeElement.shape.source = nodeElement.annotations[0].bitImagefor1;
                  } else {
                    nodeElement.shape.source = nodeElement.annotations[0].bitTempSource;
                  }

                }
              }

            }

          });

        }

      });

    }, 100)

  }

  bitContinousBlinkCheck: boolean = true;
  bitContinousBlinkCheck1to0: boolean = true;
  bitContinousBlinkCheck0to1: boolean = true;
  bitContinousBlink() {
    let diagram: Diagram = this.selectedItem.selectedDiagram;

    setInterval(() => {
      diagram.nodes.forEach(nodeElement => {

        if (nodeElement.annotations[0].normalContinueBlink && (this.hideBlink)) {
          if (this.bitContinousBlinkCheck) {
            nodeElement.annotations[0].style.opacity = 0;
            if (nodeElement.id.includes("Limit1Image")) {
              nodeElement.style.opacity = 0;
            }
            this.bitContinousBlinkCheck = false;

          } else {
            nodeElement.annotations[0].style.opacity = 1;
            if (nodeElement.id.includes("Limit1Image")) {
              nodeElement.style.opacity = 100;
            }
            this.bitContinousBlinkCheck = true;
          }
        }


        if (nodeElement.annotations[0].bitCheck1to0) {
          if (nodeElement.annotations[0].bitCondiConBlink1to0) {
            if (nodeElement.annotations[0].content == "0") {
              if (this.bitContinousBlinkCheck1to0) {
                nodeElement.annotations[0].style.opacity = 0;

                this.bitContinousBlinkCheck1to0 = false;
              } else {
                nodeElement.annotations[0].style.opacity = 1;

                this.bitContinousBlinkCheck1to0 = true;
              }
            }
          }
        }

        if (nodeElement.annotations[0].bitCheck0to1) {
          if (nodeElement.annotations[0].bitCondiConBlink0to1) {
            if (nodeElement.annotations[0].content == "1") {
              if (this.bitContinousBlinkCheck0to1) {
                nodeElement.annotations[0].style.opacity = 0;

                this.bitContinousBlinkCheck0to1 = false;
              } else {
                nodeElement.annotations[0].style.opacity = 1;

                this.bitContinousBlinkCheck0to1 = true;
              }
            }
          }
        }

      });

    }, 500);
  }

  bitTimeBlinkCheck?: boolean = true;
  bitTimeBlink() {
    let diagram: Diagram = this.selectedItem.selectedDiagram;

    let blinkInterval = setInterval(() => {
      diagram.nodes.forEach(nodeElement => {
        if (nodeElement.annotations[0].normalTimeBlink && this.hideBlink) {
          if (this.bitTimeBlinkCheck) {
            nodeElement.annotations[0].style.opacity = 0;
            if (nodeElement.id.includes("Limit1Image")) {
              nodeElement.style.opacity = 0;
            }

            this.bitTimeBlinkCheck = false;
          } else {
            nodeElement.annotations[0].style.opacity = 1;
            if (nodeElement.id.includes("Limit1Image")) {
              nodeElement.style.opacity = 1;
            }

            this.bitTimeBlinkCheck = true;
          }
          if (nodeElement.annotations[0].normalTimeBlinkValue) {
            setTimeout(() => {
              clearInterval(blinkInterval);
              nodeElement.annotations[0].style.opacity = 1;
              if (nodeElement.id.includes("Limit1Image")) {
                nodeElement.style.opacity = 1;
              }
              nodeElement.style.opacity = 1;
            }, (nodeElement.annotations[0].normalTimeBlinkValue * 1000));
          }
        }
      });

    }, 500);
  }

  bitTimeBlink1to0Check: boolean = true;
  intervalCheck1to0: boolean = true;
  previousContent1to0: { [key: string]: string } = {};

  bitTimeBlink1to0() {
    let diagram: Diagram = this.selectedItem.selectedDiagram;

    let blinkInterval = setInterval(() => {
      diagram.nodes.forEach(nodeElement => {
        if (nodeElement.id.includes("bit")) {
          if (nodeElement.annotations[0].bitCondiTimeBlink1to0) {
            let currentContent = nodeElement.annotations[0].content;

            if (!this.previousContent1to0[nodeElement.id] || this.previousContent1to0[nodeElement.id] !== currentContent) {
              this.previousContent1to0[nodeElement.id] = currentContent;
            }

            if (currentContent == "0") {
              if (this.intervalCheck1to0) {
                if (this.bitTimeBlink1to0Check) {
                  nodeElement.annotations[0].style.opacity = 0;

                  this.bitTimeBlink1to0Check = false;
                } else {
                  nodeElement.annotations[0].style.opacity = 1;

                  this.bitTimeBlink1to0Check = true;
                }
              }

              if (nodeElement.annotations[0].bitCondiBlinkTimeValue1to0) {
                setTimeout(() => {
                  this.intervalCheck1to0 = false;
                  nodeElement.annotations[0].style.opacity = 1;
                  nodeElement.style.opacity = 1;
                }, (nodeElement.annotations[0].bitCondiBlinkTimeValue1to0 * 1000));
              }
            } else {
              this.intervalCheck1to0 = true;
            }
          }
        }
      });
    }, 500);
  }


  bitTimeBlink0to1Check: boolean = true;
  intervalCheck0to1: boolean = true;
  previousContent0to1: { [key: string]: string } = {};

  bitTimeBlink0to1() {
    let diagram: Diagram = this.selectedItem.selectedDiagram;

    let blinkInterval = setInterval(() => {
      diagram.nodes.forEach(nodeElement => {
        if (nodeElement.id.includes("bit")) {
          if (nodeElement.annotations[0].bitCondiTimeBlink0to1) {
            let currentContent = nodeElement.annotations[0].content;

            if (!this.previousContent0to1[nodeElement.id] || this.previousContent0to1[nodeElement.id] !== currentContent) {
              this.previousContent0to1[nodeElement.id] = currentContent;
            }

            if (currentContent == "1") {
              if (this.intervalCheck0to1) {
                if (this.bitTimeBlink0to1Check) {
                  nodeElement.annotations[0].style.opacity = 0;

                  this.bitTimeBlink0to1Check = false;
                } else {
                  nodeElement.annotations[0].style.opacity = 1;

                  this.bitTimeBlink0to1Check = true;
                }
              }

              if (nodeElement.annotations[0].bitCondiBlinkTimeValue0to1) {
                setTimeout(() => {
                  this.intervalCheck0to1 = false;
                  nodeElement.annotations[0].style.opacity = 1;
                  nodeElement.style.opacity = 1;
                }, (nodeElement.annotations[0].bitCondiBlinkTimeValue0to1 * 1000));
              }
            } else {
              this.intervalCheck0to1 = true;
            }
          }
        }
      });
    }, 500);
  }


  dateTimeProperties() {

    let diagram: Diagram = this.selectedItem.selectedDiagram;

    setInterval(() => {

      diagram.nodes.forEach(nodeElement => {

        if (nodeElement.id.includes("dateTime")) {

          if (nodeElement.annotations[0].textTooltip) {
            nodeElement.tooltip = {
              content: this.getcontent(nodeElement.annotations[0].textTooltip),
              position: 'TopCenter',
              relativeMode: 'Object',
              animation: { open: { effect: 'FadeZoomIn', delay: 0 }, close: { effect: 'FadeZoomOut', delay: 0 } }
            }
            nodeElement.constraints = (NodeConstraints.Default & ~NodeConstraints.InheritTooltip) | NodeConstraints.Tooltip;
          }

          this.analogData.forEach(element => {
            if (nodeElement.annotations[0].dateChannel == element.chName) {
              let dateTime = element.DateTime.replace('H', '  ');
              nodeElement.annotations[0].content = dateTime;
              const userFormat = nodeElement.annotations[0].dateTimeFormat;
              let formattedDateTime = this.formatDate(element.DateTime, userFormat);

              nodeElement.annotations[0].content = formattedDateTime;
            }
          });

        }

      });

    }, 100);

  }

  padStart(str, targetLength, padString) {
    while (str.length < targetLength) {
      str = padString + str;
    }
    return str;
  }

  formatDate(dateString, format) {
    let [datePart, timePart] = dateString.split('H');

    let date = new Date(datePart + 'T' + timePart);

    let day = this.padStart(String(date.getDate()), 2, '0');
    let month = this.padStart(String(date.getMonth() + 1), 2, '0');
    let year = date.getFullYear();
    let hours = this.padStart(String(date.getHours()), 2, '0');
    let minutes = this.padStart(String(date.getMinutes()), 2, '0');
    let seconds = this.padStart(String(date.getSeconds()), 2, '0');

    let formattedDate;
    if (format === 'DD/MM/YYYY  HH:MM:SS') {
      formattedDate = `${day}-${month}-${year}`;
    } else if (format === 'MM/DD/YYYY  HH:MM:SS') {
      formattedDate = `${month}-${day}-${year}`;
    } else if (format === 'YYYY/MM/DD  HH:MM:SS') {
      formattedDate = `${year}-${month}-${day}`;
    } else {
      formattedDate = dateString;
    }

    return `${formattedDate} ${hours}:${minutes}:${seconds}`;

  }


  disableNodeDragging(nodeId: string, nodeType: string): void {
    const node = this.diagram.getObject(nodeId) as NodeModel;
    const connector = this.diagram.getObject(nodeId) as ConnectorModel;

    if (node.id.includes("station") || node.id.includes("image")) {

      node.constraints = node.constraints &
        ~NodeConstraints.ReadOnly &
        ~NodeConstraints.Drag &
        ~NodeConstraints.Resize &
        ~NodeConstraints.Delete &
        ~NodeConstraints.Expandable &
        ~NodeConstraints.Rotate;

      this.diagram.dataBind();

    }
    if (node.id.includes("bitLable") || node.id.includes("Shape") || node.id.includes("bitImage") || node.id.includes("numeric") || node.id.includes("dateTime")) {

      node.constraints = node.constraints &
        ~NodeConstraints.Drag &
        ~NodeConstraints.Select &
        ~NodeConstraints.Resize &
        ~NodeConstraints.Delete &
        ~NodeConstraints.Rotate &
        ~NodeConstraints.ReadOnly;

      this.diagram.dataBind();
    }

    if (connector) {
      connector.constraints = connector.constraints &
        ~ConnectorConstraints.Drag &
        ~ConnectorConstraints.Delete;

      this.diagram.dataBind();
    }



  }

  disableThumb(nodeId: string): void {
    const node = this.diagram.getObject(nodeId) as ConnectorModel;
    if (node) {
      node.constraints = node.constraints & ~ConnectorConstraints
      this.diagram.dataBind();
    }
  }

  public onNodeSelected(args: any): void {
    if (args.newValue && args.newValue.length > 0) {
      const nodeId = args.newValue[0].id;
      const nodeType = args.newValue[0].shape.type;

      this.disableNodeDragging(nodeId, nodeType);

      const node = this.diagram.getObject(nodeId) as NodeModel;
    }
  }


  backToHome() {
    this.route.navigate(['/']);
    this.diagram.clear();
    this.AudioService.stopAudio();
    this.diagram.destroy();
  }

  ngOnDestroy(): void {
    this.diagram.clear();
    this.diagram.destroy();
    this.AudioService.stopAudio();
  }


}
