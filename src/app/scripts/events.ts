import { SelectorViewModel } from "./selector";
import {
  IDraggingEventArgs,
  ISizeChangeEventArgs,
  IRotationEventArgs,
  ISelectionChangeEventArgs,
  IDragEnterEventArgs,
  Diagram,
  Node,
  Connector,
  NodeModel,
  ShapeAnnotationModel,
  TextAlign,
  HorizontalAlignment,
  VerticalAlignment,
  IHistoryChangeArgs,
  TextStyleModel,
  PathAnnotationModel,
  ShapeAnnotation,
  PathAnnotation,
  AnnotationAlignment,
  SelectorModel,
  DiagramBeforeMenuOpenEventArgs,
  IScrollChangeEventArgs,
  DiagramMenuEventArgs,
  ITextEditEventArgs,
} from "@syncfusion/ej2-diagrams";
import {
  ChangeEventArgs as DropDownChangeEventArgs,
  MultiSelectChangeEventArgs,
} from "@syncfusion/ej2-dropdowns";
import {
  ChangeEventArgs as NumericChangeEventArgs,
  ColorPickerEventArgs,
} from "@syncfusion/ej2-inputs";
import {
  ChangeEventArgs as CheckBoxChangeEventArgs,
  ChangeArgs as ButtonChangeArgs,
} from "@syncfusion/ej2-buttons";
import {
  ClickEventArgs as ToolbarClickEventArgs,
  MenuEventArgs,
} from "@syncfusion/ej2-navigations";
import { MindMapUtilityMethods } from "./mindmap";
import { OrgChartUtilityMethods } from "./orgchart";
import { TooltipEventArgs } from "@syncfusion/ej2-popups";
import { PageCreation } from "../scripts/pages";
import { DropDownListComponent } from "@syncfusion/ej2-angular-dropdowns";
import { PaperSize } from "./utilitymethods";
import {
  Component,
  ElementRef,
  Injectable,
  ViewChild,
  inject,
} from "@angular/core";
import { ConnectorConstraints, ConnectorModel, DiagramComponent, IPropertyChangeEventArgs, NodeConstraints } from "@syncfusion/ej2-angular-diagrams";
import { Observable, Subscription, subscribeOn, take } from "rxjs";
import { PopupService } from "../service/popup.service";
import { DataShareService } from "../service/data-share.service";
import { CommonKeyboardCommands } from "./commoncommands";

export class DiagramClientSideEvents {
  service = inject(PopupService);
  dataService = inject(DataShareService);
  private selectedItem: SelectorViewModel;
  public page: PageCreation;
  public ddlTextPosition: DropDownListComponent;
  public nodeData: any;
  public intervalId: any;
  public nodeAnalogData: any;
  public nodeDigitalData: any;

  constructor(selectedItem: SelectorViewModel, page: PageCreation) {
    this.selectedItem = selectedItem;
    this.page = page;
  }

  getNodeProperties() {

    this.dataService.selectedAnalogData$.subscribe(data => {
      this.nodeAnalogData = data;
    });
    this.dataService.selectedDigitalData$.subscribe(data => {
      this.nodeDigitalData = data;
    })

    return {
      analogData: this.nodeAnalogData,
      digitalData: this.nodeDigitalData
    };

  }

  public selectionChange(
    args: ISelectionChangeEventArgs,
    event: MouseEvent
  ): void {

    if (args.type === "Addition") {

      const node = args.newValue[0] as NodeModel;
      this.nodeData = node;

      const initialX = this.nodeData.offsetX;
      const initialY = this.nodeData.offsetY;

      setTimeout(() => {
        if (node && (node.shape.type === "Basic" || node.shape.type === "Image")) {
          this.service.openPopup({ x: initialX, y: initialY, nodeProperties: this.getNodeProperties() });
        }
      }, 200);
    }



    let diagram: Diagram = this.selectedItem.selectedDiagram;
    if (
      this.selectedItem.preventSelectionChange ||
      this.selectedItem.isLoading
    ) {
      return;
    }
    if (args.state === "Changed") {
      if (this.selectedItem.diagramType === "MindMap") {
        if (
          args.newValue.length === 1 &&
          diagram.selectedItems.nodes.length === 1
        ) {
          let node: Node = args.newValue[0] as Node;
          diagram.selectedItems.userHandles[0].visible = false;
          diagram.selectedItems.userHandles[1].visible = false;
          diagram.selectedItems.userHandles[2].visible = false;
          if (node.id !== "textNode" && !(node instanceof Connector)) {
            let addInfo: { [key: string]: Object } = node.addInfo as {
              [key: string]: Object;
            };
            if (node.id === "rootNode") {
              diagram.selectedItems.userHandles[0].visible = true;
              diagram.selectedItems.userHandles[1].visible = true;
            } else if (addInfo.orientation.toString() === "Left") {
              diagram.selectedItems.userHandles[0].visible = true;
              diagram.selectedItems.userHandles[2].visible = true;
              diagram.selectedItems.userHandles[2].side = "Left";
            } else {
              diagram.selectedItems.userHandles[1].visible = true;
              diagram.selectedItems.userHandles[2].visible = true;
              diagram.selectedItems.userHandles[2].side = "Right";
            }
            this.selectedItem.utilityMethods.bindMindMapProperties(
              node,
              this.selectedItem
            );
          }
          if (
            node.addInfo &&
            (node.addInfo as { [key: string]: Object }).level !== undefined
          ) {
            this.selectedItem.mindmapSettings.levelType =
              "Level" + (node.addInfo as { [key: string]: Object }).level;
          }
        }
      } else if (this.selectedItem.diagramType === "OrgChart") {
        if (args.newValue.length === 1) {
          let node: any = args.newValue[0];
          diagram.selectedItems.userHandles[0].visible = false;
          diagram.selectedItems.userHandles[1].visible = false;
          diagram.selectedItems.userHandles[2].visible = false;
          if (node.id !== "textNode" && node instanceof Node) {
            diagram.selectedItems.userHandles[0].visible = true;
            diagram.selectedItems.userHandles[1].visible = true;
            diagram.selectedItems.userHandles[2].visible = true;
          }
        }
      } else {
        let selectedItems: Object[] =
          this.selectedItem.selectedDiagram.selectedItems.nodes;
        selectedItems = selectedItems.concat(
          this.selectedItem.selectedDiagram.selectedItems.connectors
        );
        this.selectedItem.utilityMethods.enableToolbarItems(selectedItems);
        let nodeContainer: HTMLElement = document.getElementById(
          "nodePropertyContainer"
        );
        nodeContainer.classList.remove("multiple");
        nodeContainer.classList.remove("connector");
        if (selectedItems.length > 1) {
          this.multipleSelectionSettings(selectedItems);
        } else if (selectedItems.length === 1) {
          this.singleSelectionSettings(selectedItems[0]);
        } else {
          this.selectedItem.utilityMethods.objectTypeChange("diagram");
        }
      }
    }
    if (
      args.newValue.length === 1 &&
      diagram.selectedItems.nodes.length === 1
    ) {
      let node: Node = args.newValue[0] as Node;

      if (node.shape.type == 'Flow') {
        node.style.opacity = 0;
      }


    }
  }



  private multipleSelectionSettings(selectedItems: Object[]): void {
    this.selectedItem.utilityMethods.objectTypeChange("None");
    let showConnectorPanel: boolean = false,
      showNodePanel: boolean = false;
    let showTextPanel: boolean = false,
      showConTextPanel: boolean = false;
    let nodeContainer: HTMLElement = document.getElementById(
      "nodePropertyContainer"
    );
    for (let i: number = 0; i < selectedItems.length; i++) {
      let object: Object = selectedItems[i];
      if (object instanceof Node && (!showNodePanel || !showTextPanel)) {
        showNodePanel = true;
        showTextPanel =
          object.annotations.length > 0 && object.annotations[0].content
            ? true
            : false;
      } else if (
        object instanceof Connector &&
        (!showConnectorPanel || !showConTextPanel)
      ) {
        showConnectorPanel = true;
        showConTextPanel =
          object.annotations.length > 0 && object.annotations[0].content
            ? true
            : false;
      }
    }
    let selectItem1: SelectorModel =
      this.selectedItem.selectedDiagram.selectedItems;
    if (showNodePanel) {
      nodeContainer.style.display = "";
      nodeContainer.classList.add("multiple");
      if (showConnectorPanel) {
        nodeContainer.classList.add("connector");
      }
      this.selectedItem.utilityMethods.bindNodeProperties(
        selectItem1.nodes[0],
        this.selectedItem
      );
    }
    if (showConnectorPanel && !showNodePanel) {
      document.getElementById("connectorPropertyContainer").style.display = "";
      this.selectedItem.utilityMethods.bindConnectorProperties(
        selectItem1.connectors[0],
        this.selectedItem
      );
    }
    if (showTextPanel || showConTextPanel) {
      document.getElementById("textPropertyContainer").style.display = "";
      if (showTextPanel && showConTextPanel) {
        document.getElementById("textPositionDiv").style.display = "none";
        document.getElementById("textColorDiv").className =
          "col-xs-6 db-col-left";
      } else {
        document.getElementById("textPositionDiv").style.display = "";
        document.getElementById("textColorDiv").className =
          "col-xs-6 db-col-right";
        if (showConTextPanel) {
          this.ddlTextPosition.dataSource =
            this.selectedItem.textProperties.getConnectorTextPositions();
          //this.selectedItem.utilityMethods.bindTextProperties(selectItem1.connectors[0].annotations[0].style, this.selectedItem);
        } else {
          this.ddlTextPosition.dataSource =
            this.selectedItem.textProperties.getNodeTextPositions();
        }
        this.ddlTextPosition.dataBind();
      }
    }
  }

  private singleSelectionSettings(selectedObject: Object): void {
    let object: Node | Connector = null;

    if (selectedObject instanceof Node) {
      object = selectedObject as Node;

      if (object.shape.type == 'Text' || object.shape.type == 'Flow' || object.shape.type == 'Basic' || object.shape.type == 'Image') {
        if (object.shape && (object.shape.type === "Text" || object.shape.type === "Flow" || object.shape.type == 'Basic' || object.shape.type == 'Image')) {
          console.log(object);

          if (object.tooltip.content == "numeric1") {
            document.getElementById("numeric1PropertyDiv").style.display = "";
            document.getElementById("numericPropertyDiv").style.display = "";
            document.getElementById("bitDisplayPropertyDiv").style.display = "none";
            document.getElementById("numeric2PropertyDiv").style.display = "none";
          } else if (object.tooltip.content == "numeric2") {
            document.getElementById("numeric1PropertyDiv").style.display = "none";
            document.getElementById("bitDisplayPropertyDiv").style.display = "none";
            document.getElementById("numeric2PropertyDiv").style.display = "";
            document.getElementById("numericPropertyDiv").style.display = "";

          } else if (object.id.includes("bitLable")) {
            document.getElementById("bitDisplayPropertyDiv").style.display = "";
            document.getElementById("bitLablePropertyDiv").style.display = "";
            document.getElementById("bitLableOnePropertyDiv").style.display = "";
            document.getElementById("bitLableTwoPropertyDiv").style.display = "";
            document.getElementById("bitImagePropertyDiv").style.display = "none";
            document.getElementById("bitShapeOnePropertyDiv").style.display = "none";
            document.getElementById("bitShapePropertyDiv").style.display = "none";
            document.getElementById("numericPropertyDiv").style.display = "none";
            document.getElementById("numeric1PropertyDiv").style.display = "none";
            document.getElementById("numeric2PropertyDiv").style.display = "none";

          } else if (object.id.includes("Shape")) {

            document.getElementById("bitCommonConditionPropertyDiv").style.display = "";
            document.getElementById("bitDisplayPropertyDiv").style.display = "";
            document.getElementById("bitShapePropertyDiv").style.display = "";
            document.getElementById("bitShapeOnePropertyDiv").style.display = "";
            document.getElementById("bitImagePropertyDiv").style.display = "none";
            document.getElementById("bitLableOnePropertyDiv").style.display = "none";
            document.getElementById("bitLableTwoPropertyDiv").style.display = "none";
            document.getElementById("bitLablePropertyDiv").style.display = "none";
            document.getElementById("numericPropertyDiv").style.display = "none";
            document.getElementById("numeric1PropertyDiv").style.display = "none";
            document.getElementById("numeric2PropertyDiv").style.display = "none";

          } else if (object.id.includes("bitImage")) {

            document.getElementById("bitDisplayPropertyDiv").style.display = "";
            document.getElementById("bitCommonConditionPropertyDiv").style.display = "";
            document.getElementById("bitImagePropertyDiv").style.display = "";
            document.getElementById("bitShapePropertyDiv").style.display = "none";
            document.getElementById("bitShapeOnePropertyDiv").style.display = "none";
            document.getElementById("bitLableOnePropertyDiv").style.display = "none";
            document.getElementById("bitLableTwoPropertyDiv").style.display = "none";
            document.getElementById("bitLablePropertyDiv").style.display = "none";
            document.getElementById("numericPropertyDiv").style.display = "none";
            document.getElementById("numeric1PropertyDiv").style.display = "none";
            document.getElementById("numeric2PropertyDiv").style.display = "none";


          }

          document.getElementById("textPropertyContainer").style.display = "";
          document.getElementById("toolbarTextAlignmentDiv").style.display = "none";
          document.getElementById("textPositionDiv").style.display = "none";
          document.getElementById("nodePropertyContainer").style.display = "none";
          document.getElementById("diagramPropertyContainer").style.display = "none";
          document.getElementById("textColorDiv").className =
            "col-xs-6 db-col-left";
          this.selectedItem.utilityMethods.bindTextProperties(
            object.style,
            this.selectedItem
          );
        } else if (object.annotations.length > 0 && object.annotations[0].content) {
          document.getElementById("textPropertyContainer").style.display = "";
          let annotation: ShapeAnnotation | PathAnnotation = null;
          document.getElementById("toolbarTextAlignmentDiv").style.display = "";
          document.getElementById("textPositionDiv").style.display = "";
          document.getElementById("textColorDiv").className =
            "col-xs-6 db-col-right";
          this.selectedItem.utilityMethods.bindTextProperties(
            object.annotations[0].style,
            this.selectedItem
          );
          this.selectedItem.utilityMethods.updateHorVertAlign(
            object.annotations[0].horizontalAlignment,
            object.annotations[0].verticalAlignment
          );
          if (object.annotations[0] instanceof ShapeAnnotation) {
            annotation = object.annotations[0] as ShapeAnnotation;
            this.ddlTextPosition.dataSource =
              this.selectedItem.textProperties.getNodeTextPositions();
            this.ddlTextPosition.value =
              this.selectedItem.textProperties.textPosition = null;
            this.ddlTextPosition.dataBind();
            this.ddlTextPosition.value =
              this.selectedItem.textProperties.textPosition =
              this.selectedItem.utilityMethods.getPosition(annotation.offset);
            this.ddlTextPosition.dataBind();
          } else if (object.annotations[0] instanceof PathAnnotation) {
            annotation = object.annotations[0] as PathAnnotation;
            this.ddlTextPosition.dataSource =
              this.selectedItem.textProperties.getConnectorTextPositions();
            this.ddlTextPosition.value =
              this.selectedItem.textProperties.textPosition = null;
            this.ddlTextPosition.dataBind();
            this.ddlTextPosition.value =
              this.selectedItem.textProperties.textPosition = annotation.alignment;
            this.ddlTextPosition.dataBind();
          }
        }
      }
      if (object.id.includes("CustomImageShape") || object.id.includes("image")) {
        console.log("start-end");

        this.selectedItem.utilityMethods.objectTypeChange("node");
        this.selectedItem.utilityMethods.bindNodeProperties(
          object,
          this.selectedItem
        );
      }
    } else if (selectedObject instanceof Connector) {

      this.selectedItem.utilityMethods.objectTypeChange("connector");
      object = selectedObject as Connector;
      this.selectedItem.utilityMethods.bindConnectorProperties(
        object,
        this.selectedItem
      );
    }

  }

  public nodePositionChange(args: IDraggingEventArgs): void {


    this.selectedItem.preventPropertyChange = true;
    this.selectedItem.nodeProperties.offsetX =
      Math.round(args.newValue.offsetX * 100) / 100;
    this.selectedItem.nodeProperties.offsetY =
      Math.round(args.newValue.offsetY * 100) / 100;
    if (args.state === "Completed") {
      this.selectedItem.isModified = true;
      this.selectedItem.preventPropertyChange = false;
    }
  }

  public nodeSizeChange(args: ISizeChangeEventArgs): void {


    this.selectedItem.preventPropertyChange = true;
    this.selectedItem.nodeProperties.width =
      Math.round(args.newValue.width * 100) / 100;
    this.selectedItem.nodeProperties.height =
      Math.round(args.newValue.height * 100) / 100;
    if (args.state === "Completed") {
      this.selectedItem.isModified = true;
      this.selectedItem.preventPropertyChange = false;
    }
  }


  onConnectorPropertyChange(event: IPropertyChangeEventArgs) {
    const connector = event.element as Connector;
    if (connector && connector instanceof Connector) {
      // if (connector.id.includes("Link1")) {
      //   connector.targetPoint.y = connector.sourcePoint.y;
      // }
    }
  }


  public textEdit(args: ITextEditEventArgs): void {
    if (this.selectedItem.diagramType === "MindMap") {
      let context: any = this;
      setTimeout(() => {
        context.selectedItem.selectedDiagram.doLayout();
      }, 10);
    }
    this.selectedItem.isModified = true;
  }

  public scrollChange(args: IScrollChangeEventArgs): void {
    this.selectedItem.scrollSettings.currentZoom =
      (args.newValue.CurrentZoom * 100).toFixed() + "%";
  }

  public nodeRotationChange(args: IRotationEventArgs): void {
    this.selectedItem.preventPropertyChange = true;
    this.selectedItem.nodeProperties.rotateAngle =
      Math.round(args.newValue.rotateAngle * 100) / 100;
    this.selectedItem.preventPropertyChange = false;
    if (args.state === "Completed") {
      this.selectedItem.isModified = true;
    }
  }

  images: any[] = [];
  imageName = "image";
  diagram: DiagramComponent;

  public diagramContextMenuClick(args: DiagramMenuEventArgs): void {
    let diagram: Diagram = this.selectedItem.selectedDiagram;
    this.selectedItem.customContextMenu.updateBpmnShape(diagram, args.item);
    let text: string = args.item.text;
    if (
      text === "Group" ||
      text === "Un Group" ||
      text === "Undo" ||
      text === "Redo" ||
      text === "Select All"
    ) {
      this.selectedItem.isModified = true;
      if (
        this.selectedItem.diagramType === "MindMap" ||
        this.selectedItem.diagramType === "OrgChart"
      ) {
        if (text === "Undo" || text === "Redo") {
          args.cancel = true;
          if (text === "Undo") {
            this.selectedItem.utilityMethods.undoRedoLayout(
              true,
              this.selectedItem
            );
          } else if (text === "Redo") {
            this.selectedItem.utilityMethods.undoRedoLayout(
              false,
              this.selectedItem
            );
          }
        }
      }
    }
    if (
      this.selectedItem.diagramType === "MindMap" ||
      this.selectedItem.diagramType === "OrgChart"
    ) {
      if (text === "Copy") {
        this.selectedItem.utilityMethods.copyLayout(this.selectedItem);
      } else if (text === "Cut") {
        args.cancel = true;
        this.selectedItem.utilityMethods.cutLayout(this.selectedItem);
      } else if (text === "Paste") {
        args.cancel = true;
        this.selectedItem.utilityMethods.pasteLayout(this.selectedItem);
      }
    }

  }

  public diagramContextMenuOpen(args: DiagramBeforeMenuOpenEventArgs): void {
    let diagram: Diagram = this.selectedItem.selectedDiagram;
    args.hiddenItems = args.hiddenItems.concat(
      this.selectedItem.customContextMenu.getHiddenMenuItems(diagram)
    );
  }

  public dragEnter(args: IDragEnterEventArgs): void {

    let obj: NodeModel = args.element as NodeModel;
    let ratio: number = 100 / obj.width;
    obj.width = 100;
    obj.height *= ratio;
    obj.zIndex = 999;
    console.log(obj);

    console.log(obj.zIndex);

  }

  public historyChange(args: IHistoryChangeArgs): void {
    let diagram: Diagram = this.selectedItem.selectedDiagram;
    let toolbarContainer: HTMLDivElement = document.getElementsByClassName(
      "db-toolbar-container"
    )[0] as HTMLDivElement;
    toolbarContainer.classList.remove("db-undo");
    toolbarContainer.classList.remove("db-redo");


    if (diagram.historyManager.undoStack.length > 0) {
      toolbarContainer.classList.add("db-undo");
    }
    if (diagram.historyManager.redoStack.length > 0) {
      toolbarContainer.classList.add("db-redo");
    }
  }
}

export class DiagramPropertyBinding {
  dataService = inject(DataShareService);
  private selectedItem: SelectorViewModel;
  public page: PageCreation;

  constructor(selectedItem: SelectorViewModel, page: PageCreation) {
    this.selectedItem = selectedItem;
    this.page = page;
  }

  public pageBreaksChange(args: CheckBoxChangeEventArgs): void {
    if (args.event) {
      this.selectedItem.pageSettings.pageBreaks = args.checked;
      this.selectedItem.selectedDiagram.pageSettings.showPageBreaks =
        args.checked;
    }
  }

  onTextChange(event: any) {

    let diagram: Diagram = this.selectedItem.selectedDiagram;
    let selectedNode = diagram.selectedItems.nodes[0];

    selectedNode.annotations[0].textCheck = event.checked;

  }

  textTooltipChange(event: any) {
    let diagram: Diagram = this.selectedItem.selectedDiagram;
    let selectedNode = diagram.selectedItems.nodes[0];

    if (selectedNode) {
      selectedNode.annotations[0].textTooltip = event.target.value;

      diagram.dataBind();
    }
  }

  onTextAudioFileSelected(event: any) {
    let diagram: Diagram = this.selectedItem.selectedDiagram;
    let selectedNode = diagram.selectedItems.nodes[0];
    if (selectedNode) {
      const file = event.target.files[0];
      const fileName = event.target.files[0].name

      this.convertToBase64(file).then(base64 => {
        selectedNode.annotations[0].textAudioFile = base64;
      });

      selectedNode.annotations[0].textAudioFileName = fileName;

      diagram.dataBind();
    }
  }

  private convertToBase64(file: File): Promise<string> {
    return new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = error => reject(error);
    });
  }

  textCheckWaveChange(event: any) {
    let diagram: Diagram = this.selectedItem.selectedDiagram;
    let selectedNode = diagram.selectedItems.nodes[0];

    if (selectedNode) {
      selectedNode.annotations[0].textCheckAudio = event.checked;
    }

    diagram.dataBind();

  }


  onColorChange(event: any) {

    let diagram: Diagram = this.selectedItem.selectedDiagram;
    let selectedNode = diagram.selectedItems.nodes[0];

    selectedNode.annotations[0].colorCheck = event.checked;

    diagram.dataBind();

  }

  blinkIntervalId: any;
  onBlinkingChange(event: any) {

    let diagram: Diagram = this.selectedItem.selectedDiagram;
    let selectedNode = diagram.selectedItems.nodes[0];


    selectedNode.annotations[0].blinkCheck = event.checked;

    if (selectedNode.annotations[0].blinkCheck) {
      this.blinkIntervalId = setInterval(() => {
        if (selectedNode.style.opacity === 100) {
          selectedNode.style.opacity = 0;
        } else {
          selectedNode.style.opacity = 100;
        }
      }, 600);
    } else {
      clearInterval(this.blinkIntervalId);
      selectedNode.style.opacity = 100;
    }

    diagram.dataBind();

  }

  onBlinkTimeChange(event: any) {

    let diagram: Diagram = this.selectedItem.selectedDiagram;
    let selectedNode = diagram.selectedItems.nodes[0];

    selectedNode.annotations[0].blinkTime = event.target.value;

    diagram.dataBind();

  }

  private digitalDataSubscription: Subscription;

  public changeDigitalName(args: DropDownChangeEventArgs) {
    if (args.element) {
      let diagram: Diagram = this.selectedItem.selectedDiagram;
      let selectedNode = diagram.selectedItems.nodes[0];

      if (selectedNode) {
        let newContent = args.value as any;
        let copyData: any = this.selectedItem.pasteData;
        selectedNode.digitalChannel = newContent ? newContent : copyData[0].digitalChannel;

        setInterval(() => {
          if (this.digitalDataSubscription) {
            this.digitalDataSubscription.unsubscribe();
          }

          this.digitalDataSubscription = this.dataService.digitalData$.subscribe(
            (data) => {
              selectedNode.digitalData = data;
              diagram.dataBind();
            }
          );
        }, 10)
      }
    }
  }

  private analogDataSubscription: Subscription;
  public changeAnalogName(args: DropDownChangeEventArgs) {
    if (args.element) {
      let diagram: Diagram = this.selectedItem.selectedDiagram;
      let selectedNode = diagram.selectedItems.nodes[0];
      if (selectedNode) {
        let newContent = args.value as any;

        selectedNode.analogChannel = newContent;

        setInterval(() => {
          if (this.analogDataSubscription) {
            this.analogDataSubscription.unsubscribe();
          }

          this.analogDataSubscription = this.dataService.analogData$.subscribe(
            (data) => {
              selectedNode.analogData = data;
              diagram.dataBind();
            }
          );

        }, 10)
      }
    }
  }

  public changeName(args: DropDownChangeEventArgs): void {
    if (args.element) {
      let diagram: Diagram = this.selectedItem.selectedDiagram;
      let selectedNode = diagram.selectedItems.nodes[0];

      if (selectedNode) {
        let newContent = args.value as string;

        if (selectedNode.annotations && selectedNode.annotations.length > 0) {
          selectedNode.annotations[0].content = newContent;
        }

        diagram.dataBind();
      }
    }
  }



  public changeTextStation(event: any) {
    let diagram: Diagram = this.selectedItem.selectedDiagram;
    let selectedNode = diagram.selectedItems.nodes[0];

    if (selectedNode) {
      let newContent = event.value as string;

      if (selectedNode.annotations && selectedNode.annotations.length > 0) {
        selectedNode.annotations[0].tagName = newContent;
      }

      diagram.dataBind();
    }

  }

  bitImageChangeFor1(event: any) {
    let diagram: Diagram = this.selectedItem.selectedDiagram;
    let selectedNode = diagram.selectedItems.nodes[0];

    if (selectedNode) {
      const file = event.target.files[0];
      const fileName = event.target.files[0].name

      this.convertToBase64(file).then(base64 => {
        selectedNode.annotations[0].bitImagefor1 = base64;
      });

      diagram.dataBind();
    }

  }


  bitImageChangeFor0(event: any) {
    let diagram: Diagram = this.selectedItem.selectedDiagram;
    let selectedNode = diagram.selectedItems.nodes[0];

    if (selectedNode) {
      const file = event.target.files[0];
      const fileName = event.target.files[0].name

      this.convertToBase64(file).then(base64 => {
        selectedNode.annotations[0].bitImagefor0 = base64;
      });

      diagram.dataBind();
    }

  }


  public changeBitTextStation(event: any) {
    let diagram: Diagram = this.selectedItem.selectedDiagram;
    let selectedNode = diagram.selectedItems.nodes[0];

    if (selectedNode) {
      let newContent = event.value as string;

      if (selectedNode.annotations && selectedNode.annotations.length > 0) {
        selectedNode.annotations[0].bitTagName = newContent;
      }


      diagram.dataBind();
    }

  }

  bitTextChange1to0(event: any) {
    let diagram: Diagram = this.selectedItem.selectedDiagram;
    let selectedNode = diagram.selectedItems.nodes[0];

    if (selectedNode) {
      selectedNode.annotations[0].bitTextFor1to0 = event.target.value;
    }

    diagram.dataBind();
  }

  bitTextChange0to1(event: any) {
    let diagram: Diagram = this.selectedItem.selectedDiagram;
    let selectedNode = diagram.selectedItems.nodes[0];

    if (selectedNode) {
      selectedNode.annotations[0].bitTextFor0to1 = event.target.value;
    }

    diagram.dataBind();
  }

  bitTextColorFor0(event: any) {
    let diagram: Diagram = this.selectedItem.selectedDiagram;
    let selectedNode = diagram.selectedItems.nodes[0];

    if (selectedNode) {
      selectedNode.annotations[0].bitTextColorFor0 = event.value;
    }

    diagram.dataBind();
  }

  bitTextColorFor1(event: any) {
    let diagram: Diagram = this.selectedItem.selectedDiagram;
    let selectedNode = diagram.selectedItems.nodes[0];

    if (selectedNode) {
      selectedNode.annotations[0].bitTextColorFor1 = event.value as string;
    }
    diagram.dataBind();
  }


  bitCondition1to0Change(event: any) {
    let diagram: Diagram = this.selectedItem.selectedDiagram;
    let selectedNode = diagram.selectedItems.nodes[0];

    if (selectedNode) {
      selectedNode.annotations[0].bitCheck1to0 = event.checked;
      if (selectedNode.annotations[0].bitCheck1to0) {
        selectedNode.annotations[0].bitCheck0to1 = false;
      }
    }

    diagram.dataBind();
  }

  bitCondition0to1Change(event: any) {
    let diagram: Diagram = this.selectedItem.selectedDiagram;
    let selectedNode = diagram.selectedItems.nodes[0];

    if (selectedNode) {
      selectedNode.annotations[0].bitCheck0to1 = event.checked;

      if (selectedNode.annotations[0].bitCheck0to1) {
        selectedNode.annotations[0].bitCheck1to0 = false;
      }

    }

    diagram.dataBind();
  }


  textOperationChange(event: any) {
    let diagram: Diagram = this.selectedItem.selectedDiagram;
    let selectedNode = diagram.selectedItems.nodes[0];

    if (selectedNode) {
      let newContent = event.value as string;
      selectedNode.annotations[0].textOperation = newContent;
      diagram.dataBind();
    }

  }


  textOperationValueChange(event: any) {
    let diagram: Diagram = this.selectedItem.selectedDiagram;
    let selectedNode = diagram.selectedItems.nodes[0];

    if (selectedNode) {
      let newContent = event.target.value;
      selectedNode.annotations[0].textSetValue = newContent;

      diagram.dataBind();
    }
  }



  bitShapeColor1to0Change(event: any) {
    let diagram: Diagram = this.selectedItem.selectedDiagram;
    let selectedNode = diagram.selectedItems.nodes[0];

    if (selectedNode) {
      selectedNode.annotations[0].bitShapeColor1to0 = event.value;
    }

    diagram.dataBind();
  }

  bitShapeColor0to1Change(event: any) {
    let diagram: Diagram = this.selectedItem.selectedDiagram;
    let selectedNode = diagram.selectedItems.nodes[0];

    if (selectedNode) {
      selectedNode.annotations[0].bitShapeColor0to1 = event.value;
    }

    diagram.dataBind();
  }

  bitAudio1to0Change(event: any) {
    let diagram: Diagram = this.selectedItem.selectedDiagram;
    let selectedNode = diagram.selectedItems.nodes[0];
    if (selectedNode) {
      const file = event.target.files[0];
      const fileName = event.target.files[0].name

      this.convertToBase64(file).then(base64 => {
        selectedNode.annotations[0].bitAudio1to0 = base64;
      });

      diagram.dataBind();
    }
  }

  bitAudio0to1Change(event: any) {
    let diagram: Diagram = this.selectedItem.selectedDiagram;
    let selectedNode = diagram.selectedItems.nodes[0];
    if (selectedNode) {
      const file = event.target.files[0];
      const fileName = event.target.files[0].name

      this.convertToBase64(file).then(base64 => {
        selectedNode.annotations[0].bitAudio0to1 = base64;
      });

      diagram.dataBind();
    }
  }

  textOperationColorChange(event: any) {
    let diagram: Diagram = this.selectedItem.selectedDiagram;
    let selectedNode = diagram.selectedItems.nodes[0];

    if (selectedNode) {
      let newContent = event.value as string;

      selectedNode.annotations[0].textSetColor = newContent;

      diagram.dataBind();
    }
  }

  blinkTextIntervalId: any;
  textContinueBlinkChange(event: any) {

    let diagram: Diagram = this.selectedItem.selectedDiagram;
    let selectedNode = diagram.selectedItems.nodes[0];

    if (selectedNode) {
      selectedNode.annotations[0].textContinueBlink = event.checked;

      if (selectedNode.annotations[0].textContinueBlink) {
        selectedNode.annotations[0].textIsChecked = false;
        selectedNode.annotations[0].normalContinueBlink = false;
        selectedNode.annotations[0].normalTimeBlink = false;
      }
      diagram.dataBind();
    }

  }

  blinkLowTextIntervalId: any;
  textLowContinueBlinkChange(event: any) {

    let diagram: Diagram = this.selectedItem.selectedDiagram;
    let selectedNode = diagram.selectedItems.nodes[0];

    if (selectedNode) {
      selectedNode.annotations[0].textLowLimitBlinkContCheck = event.checked;

      if (selectedNode.annotations[0].textLowLimitBlinkContCheck) {
        selectedNode.annotations[0].textLowLimitBlinkTimeCheck = false;

        selectedNode.annotations[0].normalContinueBlink = false;
        selectedNode.annotations[0].normalTimeBlink = false;
      }

      diagram.dataBind();
    }

  }

  textHighContinueBlinkChange(event: any) {

    let diagram: Diagram = this.selectedItem.selectedDiagram;
    let selectedNode = diagram.selectedItems.nodes[0];

    if (selectedNode) {
      selectedNode.annotations[0].textHighLimitBlinkContCheck = event.checked;

      if (selectedNode.annotations[0].textHighLimitBlinkContCheck) {
        selectedNode.annotations[0].textHighLimitBlinkTimeCheck = false;
        selectedNode.annotations[0].normalContinueBlink = false;
        selectedNode.annotations[0].normalTimeBlink = false;
      }

      diagram.dataBind();
    }

  }

  textLowLimitChange(event: any) {
    let diagram: Diagram = this.selectedItem.selectedDiagram;
    let selectedNode = diagram.selectedItems.nodes[0];

    if (selectedNode) {
      selectedNode.annotations[0].textLowLimitValue = event.target.value;
    }
    diagram.dataBind();
  }

  textHighLimitChange(event: any) {
    let diagram: Diagram = this.selectedItem.selectedDiagram;
    let selectedNode = diagram.selectedItems.nodes[0];

    if (selectedNode) {
      selectedNode.annotations[0].textHighLimitValue = event.target.value;
    }
    diagram.dataBind();
  }

  textLowLimitCheckAudioChange(event: any) {
    let diagram: Diagram = this.selectedItem.selectedDiagram;
    let selectedNode = diagram.selectedItems.nodes[0];

    if (selectedNode) {
      selectedNode.annotations[0].textLowLimitCheckAudio = event.checked;
    }
    diagram.dataBind();
  }

  textHighLimitCheckAudioChange(event: any) {
    let diagram: Diagram = this.selectedItem.selectedDiagram;
    let selectedNode = diagram.selectedItems.nodes[0];

    if (selectedNode) {
      selectedNode.annotations[0].textHighLimitCheckAudio = event.checked;
    }
    diagram.dataBind();
  }

  textLowLimitCheckShapeChange(event: any) {
    let diagram: Diagram = this.selectedItem.selectedDiagram;
    let selectedNode = diagram.selectedItems.nodes[0];

    if (selectedNode) {
      selectedNode.annotations[0].textLowLimitCheckShape = event.checked;
    }
    diagram.dataBind();
  }

  textHighLimitCheckShapeChange(event: any) {
    let diagram: Diagram = this.selectedItem.selectedDiagram;
    let selectedNode = diagram.selectedItems.nodes[0];

    if (selectedNode) {
      selectedNode.annotations[0].textHighLimitCheckShape = event.checked;
    }
    diagram.dataBind();
  }

  textLowLimitCheckTextChange(event: any) {
    let diagram: Diagram = this.selectedItem.selectedDiagram;
    let selectedNode = diagram.selectedItems.nodes[0];

    if (selectedNode) {
      selectedNode.annotations[0].textLowLimitCheckText = event.checked;
    }
    diagram.dataBind();
  }

  textHighLimitCheckTextChange(event: any) {
    let diagram: Diagram = this.selectedItem.selectedDiagram;
    let selectedNode = diagram.selectedItems.nodes[0];

    if (selectedNode) {
      selectedNode.annotations[0].textHighLimitCheckText = event.checked;
    }
    diagram.dataBind();
  }

  textLowLimitCheckColorChange(event: any) {
    let diagram: Diagram = this.selectedItem.selectedDiagram;
    let selectedNode = diagram.selectedItems.nodes[0];

    if (selectedNode) {
      selectedNode.annotations[0].textLowLimitCheckColor = event.checked;
    }
    diagram.dataBind();
  }

  textHighLimitCheckColorChange(event: any) {
    let diagram: Diagram = this.selectedItem.selectedDiagram;
    let selectedNode = diagram.selectedItems.nodes[0];

    if (selectedNode) {
      selectedNode.annotations[0].textHighLimitCheckColor = event.checked;
    }
    diagram.dataBind();
  }


  textLowLimitColorChange(event: any) {
    let diagram: Diagram = this.selectedItem.selectedDiagram;
    let selectedNode = diagram.selectedItems.nodes[0];

    if (selectedNode) {
      selectedNode.annotations[0].textLowLimitColorValue = event.value as string;
    }
    diagram.dataBind();

  }


  textHighLimitColorChange(event: any) {
    let diagram: Diagram = this.selectedItem.selectedDiagram;
    let selectedNode = diagram.selectedItems.nodes[0];

    if (selectedNode) {
      selectedNode.annotations[0].textHighLimitColorValue = event.value as string;
    }
    diagram.dataBind();

  }

  textOnBit1ColorChange(event: any) {
    let diagram: Diagram = this.selectedItem.selectedDiagram;
    let selectedNode = diagram.selectedItems.nodes[0];

    if (selectedNode) {
      selectedNode.annotations[0].bit1Color = event.value as string;
    }
    diagram.dataBind();

  }

  textOnBit0ColorChange(event: any) {
    let diagram: Diagram = this.selectedItem.selectedDiagram;
    let selectedNode = diagram.selectedItems.nodes[0];

    if (selectedNode) {
      selectedNode.annotations[0].bit0Color = event.value as string;
    }
    diagram.dataBind();

  }

  textLowLimitTextChange(event: any) {
    let diagram: Diagram = this.selectedItem.selectedDiagram;
    let selectedNode = diagram.selectedItems.nodes[0];

    if (selectedNode) {
      selectedNode.annotations[0].textLowLimitTextValue = event.target.value;
    }
    diagram.dataBind();

  }

  textHighLimitTextChange(event: any) {
    let diagram: Diagram = this.selectedItem.selectedDiagram;
    let selectedNode = diagram.selectedItems.nodes[0];

    if (selectedNode) {
      selectedNode.annotations[0].textHighLimitTextValue = event.target.value;
    }
    diagram.dataBind();

  }

  textLowLimitShapeChange(event: any) {
    let diagram: Diagram = this.selectedItem.selectedDiagram;
    let selectedNode = diagram.selectedItems.nodes[0];

    if (selectedNode) {
      selectedNode.annotations[0].textLowLimitShapeValue = event.itemData.value;
    }
    diagram.dataBind();
  }

  textHighLimitShapeChange(event: any) {
    let diagram: Diagram = this.selectedItem.selectedDiagram;
    let selectedNode = diagram.selectedItems.nodes[0];

    if (selectedNode) {
      selectedNode.annotations[0].textHighLimitShapeValue = event.itemData.value;
    }
    diagram.dataBind();
  }

  textLowLimitAudio(event: any) {
    let diagram: Diagram = this.selectedItem.selectedDiagram;
    let selectedNode = diagram.selectedItems.nodes[0];
    if (selectedNode) {
      const file = event.target.files[0];
      const fileName = event.target.files[0].name

      this.convertToBase64(file).then(base64 => {
        selectedNode.annotations[0].textLowLimitAudioValue = base64;
      });

      selectedNode.annotations[0].textAudioFileName = fileName;

      diagram.dataBind();
    }

  }

  textHighLimitAudio(event: any) {
    let diagram: Diagram = this.selectedItem.selectedDiagram;
    let selectedNode = diagram.selectedItems.nodes[0];
    if (selectedNode) {
      const file = event.target.files[0];
      const fileName = event.target.files[0].name

      this.convertToBase64(file).then(base64 => {
        selectedNode.annotations[0].textHighLimitAudioValue = base64;
      });

      selectedNode.annotations[0].textAudioFileName = fileName;

      diagram.dataBind();
    }

  }

  public changeTextAnalog(event: any) {
    let diagram: Diagram = this.selectedItem.selectedDiagram;
    let selectedNode = diagram.selectedItems.nodes[0];

    if (selectedNode) {
      let newContent = event.value as string;
      console.log("call");


      selectedNode.annotations[0].content = newContent?.toString();

      selectedNode.annotations[0].textAnalogChName = newContent;

      diagram.dataBind();
    }

  }

  texthideOnNormalChange(event: any) {
    let diagram: Diagram = this.selectedItem.selectedDiagram;
    let selectedNode = diagram.selectedItems.nodes[0];

    if (selectedNode) {
      selectedNode.annotations[0].hideOnNormal = event.checked;
    }

    diagram.dataBind();
  }

  texthideOnAbNormalChange(event: any) {
    let diagram: Diagram = this.selectedItem.selectedDiagram;
    let selectedNode = diagram.selectedItems.nodes[0];

    if (selectedNode) {
      selectedNode.annotations[0].hideOnAbNormal = event.checked;
    }

    diagram.dataBind();
  }

  public changeTextDigital(event: any) {
    let diagram: Diagram = this.selectedItem.selectedDiagram;
    let selectedNode = diagram.selectedItems.nodes[0];

    if (selectedNode) {
      let newContent = event.value as string;

      selectedNode.annotations[0].content = newContent?.toString();

      selectedNode.annotations[0].bitTextChName = newContent;

      diagram.dataBind();
    }

  }



  normalBlinkTimeValueChange(event: any) {
    let diagram: Diagram = this.selectedItem.selectedDiagram;
    let selectedNode = diagram.selectedItems.nodes[0];

    if (selectedNode) {
      selectedNode.annotations[0].normalTimeBlinkValue = event.target.value;
    }

    diagram.dataBind();
  }

  normalTimeBlinkChange(event: any) {
    let diagram: Diagram = this.selectedItem.selectedDiagram;
    let selectedNode = diagram.selectedItems.nodes[0];

    if (selectedNode) {
      selectedNode.annotations[0].normalTimeBlink = event.checked;

      if (selectedNode.annotations[0].normalTimeBlink) {
        selectedNode.annotations[0].normalContinueBlink = false;

        selectedNode.annotations[0].textIsChecked = false;
        selectedNode.annotations[0].textContinueBlink = false;

        selectedNode.annotations[0].textLowLimitBlinkContCheck = false;
        selectedNode.annotations[0].textLowLimitBlinkTimeCheck = false;

        selectedNode.annotations[0].textHighLimitBlinkContCheck = false;
        selectedNode.annotations[0].textHighLimitBlinkTimeCheck = false;

        selectedNode.annotations[0].bitCondiConBlink1to0 = false;
        selectedNode.annotations[0].bitCondiTimeBlink1to0 = false;

        selectedNode.annotations[0].bitCondiConBlink0to1 = false;
        selectedNode.annotations[0].bitCondiTimeBlink0to1 = false;

      }

    }

    diagram.dataBind();
  }

  normalCountBlinkChange(event: any) {
    let diagram: Diagram = this.selectedItem.selectedDiagram;
    let selectedNode = diagram.selectedItems.nodes[0];

    if (selectedNode) {
      selectedNode.annotations[0].normalContinueBlink = event.checked;

      if (selectedNode.annotations[0].normalContinueBlink) {
        selectedNode.annotations[0].normalTimeBlink = false;

        selectedNode.annotations[0].textIsChecked = false;
        selectedNode.annotations[0].textContinueBlink = false;

        selectedNode.annotations[0].textLowLimitBlinkContCheck = false;
        selectedNode.annotations[0].textLowLimitBlinkTimeCheck = false;

        selectedNode.annotations[0].textHighLimitBlinkContCheck = false;
        selectedNode.annotations[0].textHighLimitBlinkTimeCheck = false;

        selectedNode.annotations[0].bitCondiConBlink1to0 = false;
        selectedNode.annotations[0].bitCondiTimeBlink1to0 = false;

        selectedNode.annotations[0].bitCondiConBlink0to1 = false;
        selectedNode.annotations[0].bitCondiTimeBlink0to1 = false;

      }

    }

    diagram.dataBind();

  }



  bitCondiCountBlink1to0(event: any) {
    let diagram: Diagram = this.selectedItem.selectedDiagram;
    let selectedNode = diagram.selectedItems.nodes[0];

    if (selectedNode) {

      selectedNode.annotations[0].bitCondiConBlink1to0 = event.checked;

      if (selectedNode.annotations[0].bitCondiConBlink1to0) {
        selectedNode.annotations[0].bitCondiTimeBlink1to0 = false;
        selectedNode.annotations[0].normalContinueBlink = false;
        selectedNode.annotations[0].normalTimeBlink = false;
      }
    }
    diagram.dataBind();
  }

  bitCondiCountBlink0to1(event: any) {
    let diagram: Diagram = this.selectedItem.selectedDiagram;
    let selectedNode = diagram.selectedItems.nodes[0];

    if (selectedNode) {

      selectedNode.annotations[0].bitCondiConBlink0to1 = event.checked;

      if (selectedNode.annotations[0].bitCondiConBlink0to1) {
        selectedNode.annotations[0].bitCondiTimeBlink0to1 = false;
        selectedNode.annotations[0].normalContinueBlink = false;
        selectedNode.annotations[0].normalTimeBlink = false;
      }
    }

    diagram.dataBind();
  }

  bitCondiTimeBlink1to0(event: any) {
    let diagram: Diagram = this.selectedItem.selectedDiagram;
    let selectedNode = diagram.selectedItems.nodes[0];

    if (selectedNode) {
      selectedNode.annotations[0].bitCondiTimeBlink1to0 = event.checked;

      if (selectedNode.annotations[0].bitCondiTimeBlink1to0) {
        selectedNode.annotations[0].bitCondiConBlink1to0 = false;

        selectedNode.annotations[0].normalContinueBlink = false;
        selectedNode.annotations[0].normalTimeBlink = false;
      }
    }

    diagram.dataBind();
  }

  bitCondiTimeBlink0to1(event: any) {
    let diagram: Diagram = this.selectedItem.selectedDiagram;
    let selectedNode = diagram.selectedItems.nodes[0];

    if (selectedNode) {
      selectedNode.annotations[0].bitCondiTimeBlink0to1 = event.checked;

      if (selectedNode.annotations[0].bitCondiTimeBlink0to1) {
        selectedNode.annotations[0].bitCondiConBlink0to1 = false;
        selectedNode.annotations[0].normalContinueBlink = false;
        selectedNode.annotations[0].normalTimeBlink = false;
      }
    }

    diagram.dataBind();
  }

  bitCondiBlinkTimeChange1to0(event: any) {
    let diagram: Diagram = this.selectedItem.selectedDiagram;
    let selectedNode = diagram.selectedItems.nodes[0];

    if (selectedNode) {
      selectedNode.annotations[0].bitCondiBlinkTimeValue1to0 = event.target.value;
    }

    diagram.dataBind();
  }

  bitCondiBlinkTimeChange0to1(event: any) {
    let diagram: Diagram = this.selectedItem.selectedDiagram;
    let selectedNode = diagram.selectedItems.nodes[0];

    if (selectedNode) {
      selectedNode.annotations[0].bitCondiBlinkTimeValue0to1 = event.target.value;
    }

    diagram.dataBind();
  }


  bitText1Change(event: any) {
    let diagram: Diagram = this.selectedItem.selectedDiagram;
    let selectedNode = diagram.selectedItems.nodes[0];

    console.log(event.target.value);

    if (selectedNode) {
      selectedNode.annotations[0].bitTextFor1 = event.target.value;
    }

    diagram.dataBind();
  }


  bitText0Change(event: any) {
    let diagram: Diagram = this.selectedItem.selectedDiagram;
    let selectedNode = diagram.selectedItems.nodes[0];

    if (selectedNode) {
      selectedNode.annotations[0].bitTextFor0 = event.target.value;
    }

    diagram.dataBind();
  }

  bitSetValue1asNormal(event: any) {
    let diagram: Diagram = this.selectedItem.selectedDiagram;
    let selectedNode = diagram.selectedItems.nodes[0];

    if (selectedNode) {
      selectedNode.annotations[0].bitSet1asNormal = event.checked;

      if (selectedNode.annotations[0].bitSet1asNormal) {
        selectedNode.annotations[0].bitSet1asAbnormal = false;
      }

    }

    diagram.dataBind();
  }

  bitSetValue1asAbnormal(event: any) {
    let diagram: Diagram = this.selectedItem.selectedDiagram;
    let selectedNode = diagram.selectedItems.nodes[0];

    if (selectedNode) {
      selectedNode.annotations[0].bitSet1asAbnormal = event.checked;

      if (selectedNode.annotations[0].bitSet1asAbnormal) {
        selectedNode.annotations[0].bitSet1asNormal = false;
      }
    }

    diagram.dataBind();
  }

  textSetTimeBlinkChange(event: any) {

    let diagram: Diagram = this.selectedItem.selectedDiagram;
    let selectedNode = diagram.selectedItems.nodes[0];

    if (selectedNode) {
      selectedNode.annotations[0].textIsChecked = event.checked;

      if (selectedNode.annotations[0].textIsChecked) {
        selectedNode.annotations[0].textContinueBlink = false;
        selectedNode.annotations[0].normalContinueBlink = false;
        selectedNode.annotations[0].normalTimeBlink = false;

      }
    }

    diagram.dataBind();

  }





  textLowSetTimeBlinkChange(event: any) {

    let diagram: Diagram = this.selectedItem.selectedDiagram;
    let selectedNode = diagram.selectedItems.nodes[0];

    if (selectedNode) {
      selectedNode.annotations[0].textLowLimitBlinkTimeCheck = event.checked;

      if (selectedNode.annotations[0].textLowLimitBlinkTimeCheck) {
        selectedNode.annotations[0].textLowLimitBlinkContCheck = false;
        selectedNode.annotations[0].normalContinueBlink = false;
        selectedNode.annotations[0].normalTimeBlink = false;
      }
    }

    diagram.dataBind();

  }

  textHighSetTimeBlinkChange(event: any) {

    let diagram: Diagram = this.selectedItem.selectedDiagram;
    let selectedNode = diagram.selectedItems.nodes[0];

    if (selectedNode) {
      selectedNode.annotations[0].textHighLimitBlinkTimeCheck = event.checked;

      if (selectedNode.annotations[0].textHighLimitBlinkTimeCheck) {
        selectedNode.annotations[0].textHighLimitBlinkContCheck = false;
        selectedNode.annotations[0].normalContinueBlink = false;
        selectedNode.annotations[0].normalTimeBlink = false;
      }
    }

    diagram.dataBind();

  }


  isTextInvincible(event: any): void {
    this.selectedItem.isModified = true;
    let diagram: Diagram = this.selectedItem.selectedDiagram;
    let selectedNode = diagram.selectedItems.nodes[0];
    let connector: ConnectorModel = diagram.selectedItems.connectors[0];
    let invincible = event.checked;
    selectedNode.annotations[0].isTextInvincible = event.checked;
    if (selectedNode.annotations[0].isTextInvincible) {
      selectedNode.annotations[0].style.opacity = 0;
    } else {
      selectedNode.annotations[0].style.opacity = 100;
    }


    diagram.dataBind();
  }




  onTextBlinkTimeChange(event: any) {

    let diagram: Diagram = this.selectedItem.selectedDiagram;
    let selectedNode = diagram.selectedItems.nodes[0];

    if (selectedNode) {
      selectedNode.annotations[0].textBlinkTime = event.target.value;

      diagram.dataBind();
    }

  }

  onTextLowBlinkTimeChange(event: any) {

    let diagram: Diagram = this.selectedItem.selectedDiagram;
    let selectedNode = diagram.selectedItems.nodes[0];

    if (selectedNode) {
      selectedNode.annotations[0].textLowLimitBlinkTime = event.target.value;

      diagram.dataBind();
    }

  }


  onTextHighBlinkTimeChange(event: any) {

    let diagram: Diagram = this.selectedItem.selectedDiagram;
    let selectedNode = diagram.selectedItems.nodes[0];

    if (selectedNode) {
      selectedNode.annotations[0].textHighLimitBlinkTime = event.target.value;

      diagram.dataBind();
    }

  }

  changeTextUnitAnalog(event: any) {
    let diagram: Diagram = this.selectedItem.selectedDiagram;
    let selectedNode = diagram.selectedItems.nodes[0];
    if (selectedNode) {
      selectedNode.annotations[0].analogUnit = event.value;
    }

    diagram.dataBind();
  }

  textCheckColorChange(event: any) {
    let diagram: Diagram = this.selectedItem.selectedDiagram;
    let selectedNode = diagram.selectedItems.nodes[0];

    if (selectedNode) {
      selectedNode.annotations[0].textCheckColor = event.checked;
    }

    diagram.dataBind();
  }

  textCheckStrChange(event: any) {
    let diagram: Diagram = this.selectedItem.selectedDiagram;
    let selectedNode = diagram.selectedItems.nodes[0];

    if (selectedNode) {
      selectedNode.annotations[0].textCheckStr = event.checked;
    }

    diagram.dataBind();
  }

  textStrChange(event: any) {
    let diagram: Diagram = this.selectedItem.selectedDiagram;
    let selectedNode = diagram.selectedItems.nodes[0];

    if (selectedNode) {
      selectedNode.annotations[0].textSetStr = event.target.value;
    }

    diagram.dataBind();
  }

  textDecimalValueChange(event: any) {
    let diagram: Diagram = this.selectedItem.selectedDiagram;

    console.log("call");

    let selectedNode = diagram.selectedItems.nodes[0];
    if (selectedNode) {
      selectedNode.annotations[0].textDecimal = event?.target.value;
    }

    diagram.dataBind();

  }

  public paperListChange(args: DropDownChangeEventArgs): void {
    if (args.element) {
      let diagram: Diagram = this.selectedItem.selectedDiagram;
      document.getElementById("pageDimension").style.display = "none";
      document.getElementById("pageOrientation").style.display = "";
      this.selectedItem.pageSettings.paperSize = args.value as string;
      let paperSize: PaperSize = this.selectedItem.utilityMethods.getPaperSize(
        this.selectedItem.pageSettings.paperSize
      );
      let pageWidth: number = paperSize.pageWidth;
      let pageHeight: number = paperSize.pageHeight;
      if (pageWidth && pageHeight) {
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
        diagram.pageSettings.width = pageWidth;
        diagram.pageSettings.height = pageHeight;
        this.selectedItem.pageSettings.pageWidth = pageWidth;
        this.selectedItem.pageSettings.pageHeight = pageHeight;
        diagram.dataBind();
      } else {
        document.getElementById("pageOrientation").style.display = "none";
        document.getElementById("pageDimension").style.display = "";
      }
    }
  }

  public pageDimensionChange(args: NumericChangeEventArgs): void {
    if (args.event) {
      let pageWidth: number = Number(this.selectedItem.pageSettings.pageWidth);
      let pageHeight: number = Number(
        this.selectedItem.pageSettings.pageHeight
      );
      let target: HTMLInputElement = args.event.target as HTMLInputElement;
      if (target.tagName.toLowerCase() === "span") {
        target = target.parentElement.children[0] as HTMLInputElement;
      }
      let diagram: Diagram = this.selectedItem.selectedDiagram;
      if (target.id === "pageWidth") {
        pageWidth = Number(target.value);
      } else {
        pageHeight = Number(target.value);
      }
      if (pageWidth && pageHeight) {
        if (pageWidth > pageHeight) {
          this.selectedItem.pageSettings.isPortrait = false;
          this.selectedItem.pageSettings.isLandscape = true;
          diagram.pageSettings.orientation = "Landscape";
        } else {
          this.selectedItem.pageSettings.isPortrait = true;
          this.selectedItem.pageSettings.isLandscape = false;
          diagram.pageSettings.orientation = "Portrait";
        }
        this.selectedItem.pageSettings.pageWidth = diagram.pageSettings.width =
          pageWidth;
        this.selectedItem.pageSettings.pageHeight =
          diagram.pageSettings.height = pageHeight;
        diagram.dataBind();
      }
    }
  }

  public pageOrientationChange(args: ButtonChangeArgs): void {
    if (args.event) {
      let pageWidth: number = Number(this.selectedItem.pageSettings.pageWidth);
      let pageHeight: number = Number(
        this.selectedItem.pageSettings.pageHeight
      );
      let target: HTMLElement = args.event.target as HTMLElement;
      let diagram: Diagram = this.selectedItem.selectedDiagram;
      switch (target.id) {
        case "pagePortrait":
          this.selectedItem.pageSettings.isPortrait = true;
          this.selectedItem.pageSettings.isLandscape = false;
          diagram.pageSettings.orientation = "Portrait";
          break;
        case "pageLandscape":
          this.selectedItem.pageSettings.isPortrait = false;
          this.selectedItem.pageSettings.isLandscape = true;
          diagram.pageSettings.orientation = "Landscape";
          break;
      }
      diagram.dataBind();
      this.selectedItem.pageSettings.pageWidth = diagram.pageSettings.width;
      this.selectedItem.pageSettings.pageHeight = diagram.pageSettings.height;
    }
  }

  public pageBackgroundChange1(args: ColorPickerEventArgs): void {
    if (args.currentValue) {
      let diagram: Diagram = this.selectedItem.selectedDiagram;
      diagram.pageSettings.background = {
        color: args.currentValue.rgba,
      };
      diagram.dataBind();
    }
  }
  public pageBackgroundImageChange(): void {
    this.openImageUploadBox((imageUrl: string) => {
      let diagram: Diagram = this.selectedItem.selectedDiagram;

      diagram.pageSettings.background.source = imageUrl
      diagram.dataBind();
    });
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

  public textPositionChange(args: DropDownChangeEventArgs): void {
    if (args.value !== null) {
      this.textPropertyChange("textPosition", args.value);
    }
  }

  public toolbarTextStyleChange(args: ToolbarClickEventArgs): void {
    this.textPropertyChange(args.item.tooltipText, false);
  }

  public toolbarTextSubAlignChange(args: ToolbarClickEventArgs): void {
    let propertyName: string = args.item.tooltipText.replace(/[' ']/g, "");
    this.textPropertyChange(propertyName, propertyName);
  }

  public toolbarTextAlignChange(args: ToolbarClickEventArgs): void {
    let propertyName: string = args.item.tooltipText.replace("Align ", "");
    this.textPropertyChange(propertyName, propertyName);
  }

  public textPropertyChange(propertyName: string, propertyValue: Object): void {
    if (!this.selectedItem.preventPropertyChange) {
      let diagram: Diagram = this.selectedItem.selectedDiagram;
      let selectedObjects: Object[] = diagram.selectedItems.nodes;
      selectedObjects = selectedObjects.concat(
        diagram.selectedItems.connectors
      );
      propertyName = propertyName.toLowerCase();
      if (selectedObjects.length > 0) {
        for (let i: number = 0; i < selectedObjects.length; i++) {
          let node: Object = selectedObjects[i];
          if (node instanceof Node || node instanceof Connector) {
            if (node.annotations.length > 0) {
              for (let j: number = 0; j < node.annotations.length; j++) {
                let annotation: ShapeAnnotationModel | PathAnnotationModel =
                  null;
                if (node.annotations[j] instanceof ShapeAnnotation) {
                  annotation = node.annotations[j] as ShapeAnnotationModel;
                  if (propertyName === "textposition") {
                    this.selectedItem.textProperties.textPosition =
                      propertyValue.toString();
                    annotation.offset =
                      this.selectedItem.utilityMethods.getOffset(
                        propertyValue as string
                      );
                  }
                } else if (node.annotations[j] instanceof PathAnnotation) {
                  annotation = node.annotations[j] as PathAnnotationModel;
                  if (propertyName === "textposition") {
                    this.selectedItem.textProperties.textPosition =
                      propertyValue.toString();
                    annotation.alignment = this.selectedItem.textProperties
                      .textPosition as AnnotationAlignment;
                  }
                }
                if (
                  propertyName === "left" ||
                  propertyName === "right" ||
                  propertyName === "center"
                ) {
                  annotation.horizontalAlignment =
                    propertyValue as HorizontalAlignment;
                  this.selectedItem.utilityMethods.updateHorVertAlign(
                    annotation.horizontalAlignment,
                    annotation.verticalAlignment
                  );
                } else if (
                  propertyName === "top" ||
                  propertyName === "bottom"
                ) {
                  annotation.verticalAlignment =
                    propertyValue as VerticalAlignment;
                  this.selectedItem.utilityMethods.updateHorVertAlign(
                    annotation.horizontalAlignment,
                    annotation.verticalAlignment
                  );
                } else if (propertyName === "middle") {
                  annotation.verticalAlignment = "Center";
                  this.selectedItem.utilityMethods.updateHorVertAlign(
                    annotation.horizontalAlignment,
                    annotation.verticalAlignment
                  );
                } else {
                  this.updateTextProperties(
                    propertyName,
                    propertyValue,
                    annotation.style
                  );
                }
              }
            } else if (node.shape && node.shape.type === "Text") {
              this.updateTextProperties(
                propertyName,
                propertyValue,
                node.style
              );
            }
          }
        }
        diagram.dataBind();
        this.selectedItem.isModified = true;
      }
    }
  }

  public updateTextProperties(
    propertyName: string,
    propertyValue: Object,
    annotation: TextStyleModel
  ): void {
    switch (propertyName) {
      case "bold":
        annotation.bold = !annotation.bold;
        this.updateToolbarState("toolbarTextStyle", annotation.bold, 0);
        break;
      case "italic":
        annotation.italic = !annotation.italic;
        this.updateToolbarState("toolbarTextStyle", annotation.italic, 1);
        break;
      case "underline":
        this.selectedItem.textProperties.textDecoration =
          !this.selectedItem.textProperties.textDecoration;
        annotation.textDecoration =
          annotation.textDecoration === "None" || !annotation.textDecoration
            ? "Underline"
            : "None";
        this.updateToolbarState(
          "toolbarTextStyle",
          this.selectedItem.textProperties.textDecoration,
          2
        );
        break;
      case "aligntextleft":
      case "aligntextright":
      case "aligntextcenter":
        annotation.textAlign = propertyValue
          .toString()
          .replace("AlignText", "") as TextAlign;
        this.selectedItem.utilityMethods.updateTextAlign(annotation.textAlign);
        break;
    }
  }

  private updateToolbarState(
    toolbarName: string,
    isSelected: boolean,
    index: number
  ) {
    let toolbarTextStyle: any = document.getElementById(toolbarName);
    if (toolbarTextStyle) {
      toolbarTextStyle = toolbarTextStyle.ej2_instances[0];
    }
    if (toolbarTextStyle) {
      let cssClass: string = toolbarTextStyle.items[index].cssClass;
      toolbarTextStyle.items[index].cssClass = isSelected
        ? cssClass + " tb-item-selected"
        : cssClass.replace(" tb-item-selected", "");
      toolbarTextStyle.dataBind();
    }
  }
}

export class MindMapPropertyBinding {
  private selectedItem: SelectorViewModel;

  constructor(selectedItem: SelectorViewModel) {
    this.selectedItem = selectedItem;
  }

  public mindmapTextStyleChange(args: ToolbarClickEventArgs): void {
    this.updateMindMapTextStyle(args.item.tooltipText.toLowerCase(), false);
  }

  public updateMindMapTextStyle(
    propertyName: string,
    propertyValue: Object
  ): void {
    let diagram: Diagram = this.selectedItem.selectedDiagram;
    if (diagram.nodes.length > 0) {
      for (let i: number = 0; i < diagram.nodes.length; i++) {
        let node: Node = diagram.nodes[i] as Node;
        if (node.addInfo && node.annotations.length > 0) {
          let annotation: TextStyleModel = node.annotations[0].style;
          let addInfo: { [key: string]: Object } = node.addInfo as {
            [key: string]: Object;
          };
          let levelType: string = this.selectedItem.mindmapSettings.levelType;
          if (
            "Level" + addInfo.level === levelType ||
            addInfo.level === levelType
          ) {
            switch (propertyName) {
              case "bold":
                annotation.bold = !annotation.bold;
                break;
              case "italic":
                annotation.italic = !annotation.italic;
                break;
              case "underline":
                annotation.textDecoration =
                  annotation.textDecoration === "None" ||
                    !annotation.textDecoration
                    ? "Underline"
                    : "None";
                break;
            }
          }
        }
        diagram.dataBind();
        this.selectedItem.isModified = true;
      }
    }
  }

  public mindmapPatternChange(args: MouseEvent): void {
    let target: HTMLDivElement = args.target as HTMLDivElement;
    let diagram: Diagram = this.selectedItem.selectedDiagram;
    diagram.historyManager.startGroupAction();
    for (
      let i: number = 0;
      i < this.selectedItem.selectedDiagram.nodes.length;
      i++
    ) {
      let node: Node = this.selectedItem.selectedDiagram.nodes[i] as Node;
      if (node.id !== "textNode") {
        if (target.className === "mindmap-pattern-style mindmap-pattern1") {
          if (node.id === "rootNode") {
            node.height = 50;
          } else {
            node.height = 20;
          }
        } else {
          node.height = 50;
        }
      }
      this.selectedItem.selectedDiagram.dataBind();
    }
    for (
      let i: number = 0;
      i < this.selectedItem.selectedDiagram.connectors.length;
      i++
    ) {
      let connector: Connector = this.selectedItem.selectedDiagram.connectors[
        i
      ] as Connector;
      switch (target.className) {
        case "mindmap-pattern-style mindmap-pattern1":
          connector.type = "Bezier";
          MindMapUtilityMethods.templateType = "template1";
          break;
        case "mindmap-pattern-style mindmap-pattern2":
          connector.type = "Bezier";
          MindMapUtilityMethods.templateType = "template4";
          break;
        case "mindmap-pattern-style mindmap-pattern3":
          connector.type = "Orthogonal";
          MindMapUtilityMethods.templateType = "template2";
          break;
        case "mindmap-pattern-style mindmap-pattern4":
          connector.type = "Straight";
          MindMapUtilityMethods.templateType = "template3";
          break;
      }
      this.selectedItem.selectedDiagram.dataBind();
    }
    diagram.historyManager.endGroupAction();
    this.selectedItem.selectedDiagram.doLayout();
    this.selectedItem.isModified = true;
  }
}

export class OrgChartPropertyBinding {
  private selectedItem: SelectorViewModel;

  constructor(selectedItem: SelectorViewModel) {
    this.selectedItem = selectedItem;
  }

  public orgDropDownChange(args: DropDownChangeEventArgs): void {
    if (args.element) {
      let value: string = args.value ? args.value.toString() : "";
      if (args.element.id === "employeeId") {
        this.selectedItem.orgDataSettings.id = value;
      } else if (args.element.id === "superVisorId") {
        this.selectedItem.orgDataSettings.parent = value;
      } else if (args.element.id === "orgNameField") {
        this.selectedItem.orgDataSettings.nameField = value;
      } else if (args.element.id === "orgImageField") {
        this.selectedItem.orgDataSettings.imageField = value;
      }
    }
  }

  public orgMultiSelectChange(args: MultiSelectChangeEventArgs): void {
    if (args.element) {
      if (args.element.id === "orgAdditionalField") {
        this.selectedItem.orgDataSettings.additionalFields =
          args.value as string[];
      } else if (args.element.id === "orgBindingFields") {
        this.selectedItem.orgDataSettings.bindingFields =
          args.value as string[];
      }
    }
  }

  public orgChartSpacingChange(args: NumericChangeEventArgs): void {
    if (args.event) {
      let target: HTMLInputElement = args.event.target as HTMLInputElement;
      if (target.tagName.toLowerCase() === "span") {
        target = target.parentElement.children[0] as HTMLInputElement;
      }
      if (target.id === "orgHorizontalSpacing") {
        this.selectedItem.selectedDiagram.layout.horizontalSpacing = args.value;
      } else {
        this.selectedItem.selectedDiagram.layout.verticalSpacing = args.value;
      }
    }
  }

  public orgChartAligmentChange(args: ToolbarClickEventArgs): void {
    let diagram: Diagram = this.selectedItem.selectedDiagram;
    let commandType: string = args.item.tooltipText
      .replace(/[' ']/g, "")
      .toLowerCase();
    switch (commandType) {
      case "alignleft":
        diagram.layout.horizontalAlignment = "Left";
        break;
      case "alignright":
        diagram.layout.horizontalAlignment = "Right";
        break;
      case "aligncenter":
        diagram.layout.horizontalAlignment = "Center";
        break;
      case "aligntop":
        diagram.layout.verticalAlignment = "Top";
        break;
      case "alignmiddle":
        diagram.layout.verticalAlignment = "Center";
        break;
      case "alignbottom":
        diagram.layout.verticalAlignment = "Bottom";
        break;
    }
    this.selectedItem.isModified = true;
  }

  public layoutOrientationChange(args: MouseEvent): void {
    let target: HTMLDivElement = args.target as HTMLDivElement;
    switch (target.className) {
      case "org-pattern-style org-pattern-1 vertical-alternate":
        OrgChartUtilityMethods.subTreeAlignments = "Alternate";
        OrgChartUtilityMethods.subTreeOrientation = "Vertical";
        break;
      case "org-pattern-style org-pattern-2 vertical-left":
        OrgChartUtilityMethods.subTreeAlignments = "Left";
        OrgChartUtilityMethods.subTreeOrientation = "Vertical";
        break;
      case "org-pattern-style org-pattern-3 vertical-right":
        OrgChartUtilityMethods.subTreeAlignments = "Right";
        OrgChartUtilityMethods.subTreeOrientation = "Vertical";
        break;
      case "org-pattern-style org-pattern-4 horizontal-center":
        OrgChartUtilityMethods.subTreeAlignments = "Center";
        OrgChartUtilityMethods.subTreeOrientation = "Horizontal";
        break;
      case "org-pattern-style org-pattern-5 horizontal-right":
        OrgChartUtilityMethods.subTreeAlignments = "Right";
        OrgChartUtilityMethods.subTreeOrientation = "Horizontal";
        break;
      case "org-pattern-style org-pattern-6 horizontal-left":
        OrgChartUtilityMethods.subTreeAlignments = "Left";
        OrgChartUtilityMethods.subTreeOrientation = "Horizontal";
        break;
    }
    this.selectedItem.selectedDiagram.doLayout();
    this.selectedItem.isModified = true;
  }

  public layoutPatternChange(args: MouseEvent): void {
    let target: HTMLDivElement = args.target as HTMLDivElement;
    let bindingFields: boolean =
      target.id === "orgPattern2" || target.id === "orgPattern4" ? true : false;
    let imageField: boolean =
      target.id === "orgPattern3" || target.id === "orgPattern4" ? true : false;
    this.selectedItem.utilityMethods.updateLayout(
      this.selectedItem,
      bindingFields,
      imageField
    );
  }

  public getTooltipContent(args: TooltipEventArgs): string {
    if (args.target) {
      if (args.target.classList.contains("db-employee-id")) {
        return "Defines a unique column from the data source.";
      } else if (args.target.classList.contains("db-supervisor-id")) {
        return "Defines a column that is used to identify the person to whom the employee reports to.";
      } else if (args.target.classList.contains("db-nameField-id")) {
        return "Defines a column that has an employee name, and it appears at the top of the shapes.";
      } else if (args.target.classList.contains("db-bindingField-id")) {
        return "Defines columns that have employees’ contact information, and appear after the employees’ names in the shape.";
      } else if (args.target.classList.contains("db-imageField-id")) {
        return "Defines a column that has the picture of an employee.";
      } else if (args.target.classList.contains("db-additionalField-id")) {
        return "Defines columns that should be displayed through a tooltip.";
      }
    }
    return "";
  }
}
