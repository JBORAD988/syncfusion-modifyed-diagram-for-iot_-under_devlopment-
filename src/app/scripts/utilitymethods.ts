/**
 *  Home page handler
 */

import {
  NodeModel,
  NodeConstraints,
  PointModel,
  ConnectorModel,
  LinearGradient,
  Diagram,
  ConnectorConstraints,
  Node,
  TextStyle,
  TextStyleModel,
  SelectorConstraints,
  TextAlign,
  HorizontalAlignment,
  VerticalAlignment,
  Connector,
  ShapeAnnotationModel,
} from "@syncfusion/ej2-diagrams";
import { SelectorViewModel } from "./selector";
import { Dialog } from "@syncfusion/ej2-angular-popups";
import { MindMapUtilityMethods, MindMap } from "./mindmap";
import { OrgChartUtilityMethods, OrgChartData } from "./orgchart";
import { Ajax } from "@syncfusion/ej2-base";
import {
  Toolbar,
  ContextMenu,
  MenuItemModel,
} from "@syncfusion/ej2-angular-navigations";
import { PageCreation } from "./pages";
import { CommonKeyboardCommands } from "./commoncommands";
import { inject } from "@angular/core";
import { DataShareService } from "../service/data-share.service";

export class PaperSize {
  public pageWidth: number;
  public pageHeight: number;
}

export class UtilityMethods {
  public page: PageCreation;
  public tempDialog: Dialog;
  public toolbarEditor: Toolbar;
  dataService = inject(DataShareService);
  digitalIntervalId: any;
  analogIntervalId: any;
  annotationIntervalId: any;
  digitalChannelIntervalId: any;
  mainDataIntervalId: any;
  analogDataIntervalId: any;
  digitalDataIntervalId: any;
  analogChIntervalId: any;
  analogChannel: any[] = [];
  digitalChannel: any[] = [];
  mainData: any;
  mainAnalogData: any[] = [];
  setAnalogData: any[] = [];
  setDigitalData: any[] = [];
  mainDigitalData: any[] = [];
  selectedAnalogChannel: any[] = [];
  selectedDigitalChannel: any[] = [];
  selectedAnalogData: any[] = [];
  selectedDigitalData: any[] = [];
  blinkIntervalId: any;

  public bindNodeProperties(
    node: NodeModel,
    selectedItem: SelectorViewModel
  ): void {
    selectedItem.preventPropertyChange = true;
    selectedItem.nodeProperties.offsetX = Math.round(node.offsetX * 100) / 100;
    selectedItem.nodeProperties.offsetY = Math.round(node.offsetY * 100) / 100;
    selectedItem.nodeProperties.width = node.width
      ? Math.round(node.width * 100) / 100
      : Math.round(node.minWidth * 100) / 100;
    selectedItem.nodeProperties.height = node.height
      ? Math.round(node.height * 100) / 100
      : Math.round(node.minHeight * 100) / 100;
    selectedItem.nodeProperties.rotateAngle = node.rotateAngle;
    selectedItem.nodeProperties.strokeColor = this.getHexColor(
      node.style.strokeColor
    );
    selectedItem.nodeProperties.strokeStyle = node.style.strokeDashArray
      ? node.style.strokeDashArray
      : "None";
    selectedItem.nodeProperties.strokeWidth = node.style.strokeWidth;
    selectedItem.nodeProperties.fillColor = this.getHexColor(node.style.fill);
    selectedItem.nodeProperties.opacity = node.style.opacity * 100;
    selectedItem.nodeProperties.opacityText =
      selectedItem.nodeProperties.opacity + "%";
    selectedItem.nodeProperties.aspectRatio =
      node.constraints & NodeConstraints.AspectRatio ? true : false;
    selectedItem.nodeProperties.gradient =
      node.style.gradient.type !== "None" ? true : false;

    let copyNode: any = selectedItem.pasteData;

    if (node.id.includes(copyNode[0]?.id) && node.id != copyNode[0].id) {
      node.isPastedNode = true;
    }

    if (node.isPastedNode) {
      selectedItem.nodeProperties.colorCheck = node.annotations[0].colorCheck ? node.annotations[0].colorCheck : copyNode[0].annotations[0].colorCheck;
      selectedItem.nodeProperties.textCheck = node.annotations[0].textCheck ? node.annotations[0].textCheck : copyNode[0].annotations[0].textCheck;
      selectedItem.nodeProperties.blinkCheck = node.annotations[0].blinkCheck ? node.annotations[0].blinkCheck : copyNode[0].annotations[0].blinkCheck;
      selectedItem.nodeProperties.blinkTime = node.annotations[0].blinkTime ? node.annotations[0].blinkTime : copyNode[0].annotations[0].blinkTime;
      selectedItem.nodeProperties.opacity = node.style.opacity ? node.style.opacity : copyNode[0].style.opacity;
    } else {
      selectedItem.nodeProperties.colorCheck = node.annotations[0]?.colorCheck ? node.annotations[0].colorCheck : false;
      selectedItem.nodeProperties.textCheck = node.annotations[0]?.textCheck ? node.annotations[0].textCheck : false;
      selectedItem.nodeProperties.blinkCheck = node.annotations[0]?.blinkCheck ? node.annotations[0].blinkCheck : false;
      selectedItem.nodeProperties.blinkTime = node.annotations[0]?.blinkTime ? node.annotations[0].blinkTime : null;
      selectedItem.nodeProperties.opacity = node.style.opacity ? node.style.opacity : 100;
    }





    if (this.annotationIntervalId) {
      clearInterval(this.annotationIntervalId);
    }


    this.annotationIntervalId = setInterval(() => {
      if (node.isPastedNode) {
        selectedItem.nodeProperties.annotationContent = node.annotations[0].content ? node.annotations[0].content : copyNode[0].annotations[0].content;
      } else {
        selectedItem.nodeProperties.annotationContent = node.annotations[0].content ? node.annotations[0].content : null;
      }
    }, 10);


    if (this.analogChIntervalId) {
      clearInterval(this.analogChIntervalId);
    }

    this.analogChIntervalId = setInterval(() => {
      if (CommonKeyboardCommands.diagramData) {
        selectedItem.nodeProperties.analogChannel = this.selectedAnalogChannel ? this.selectedAnalogChannel : null;
      } else {
        if (node.isPastedNode) {
          selectedItem.nodeProperties.analogChannel = node.analogChannel ? node.analogChannel : copyNode[0].analogChannel;
        } else {
          selectedItem.nodeProperties.analogChannel = node.analogChannel ? node.analogChannel : null;
        }
        let isThere = this.analogChannel.filter(e => e == selectedItem.nodeProperties.analogChannel).length > 0;
        if (selectedItem.nodeProperties.analogChannel && !isThere) {
          this.analogChannel.push(selectedItem.nodeProperties.analogChannel);
          this.dataService.sendSelectedAnalogChannel(this.analogChannel);
        }
      }
    }, 10)



    if (this.digitalChannelIntervalId) {
      clearInterval(this.digitalChannelIntervalId);
    }

    this.digitalChannelIntervalId = setInterval(() => {
      if (CommonKeyboardCommands.diagramData) {
        selectedItem.nodeProperties.digitalChannel = this.selectedDigitalChannel ? this.selectedDigitalChannel : null;

      } else {
        if (node.isPastedNode) {
          selectedItem.nodeProperties.digitalChannel = node.digitalChannel ? node.digitalChannel : copyNode[0].digitalChannel;
        } else {
          selectedItem.nodeProperties.digitalChannel = node.digitalChannel ? node.digitalChannel : null;
        }
        let isThere = this.digitalChannel.filter(e => e == selectedItem.nodeProperties.digitalChannel).length > 0;
        if (selectedItem.nodeProperties.digitalChannel && !isThere) {
          this.digitalChannel.push(selectedItem.nodeProperties.digitalChannel);
          this.dataService.sendSelectedDigitalChannel(this.digitalChannel);
        }
      }
    }, 10)



    if (this.mainDataIntervalId) {
      clearInterval(this.mainDataIntervalId);
    }


    this.mainDataIntervalId = setInterval(() => {

      this.mainData = [];
      this.mainAnalogData = [];
      this.mainDigitalData = [];
      this.selectedAnalogChannel = [];
      this.selectedDigitalChannel = [];

      this.dataService.diagramData$.subscribe(data => {
        this.mainData = data;

        if (this.mainData) {
          this.mainData.forEach(element => {
            if (element.TagName == selectedItem.nodeProperties.annotationContent) {
              CommonKeyboardCommands.diagramData?.pageOptionList[0]?.diagram.analogChannel.flat().forEach(ana => {
                element.Analog.forEach(el => {
                  if (el.chName == ana && !(this.selectedAnalogChannel.filter(e => e == el.chName).length > 0)) {
                    this.selectedAnalogChannel.push(el.chName);
                  }
                });
              });

              CommonKeyboardCommands.diagramData?.pageOptionList[0]?.diagram.digitalChannel.flat().forEach(ana => {
                element.digital.forEach(el => {
                  if (el.chName == ana && !(this.selectedDigitalChannel.filter(e => e == el.chName).length > 0)) {
                    this.selectedDigitalChannel.push(el.chName);
                  }
                });
              });
            }

            element.Analog.forEach(el => {
              this.mainAnalogData.push(el);
            });
            element.digital.forEach(el => {
              this.mainDigitalData.push(el);
            });
          });

        }
      });
    }, 10);

    if (this.analogDataIntervalId) {
      clearInterval(this.analogDataIntervalId);
    }

    this.analogDataIntervalId = setInterval(() => {
      this.setAnalogData = [];
      if (CommonKeyboardCommands.diagramData?.pageOptionList[0]?.diagram.analogChannel) {
        CommonKeyboardCommands.diagramData?.pageOptionList[0]?.diagram.analogChannel.flat().forEach(element => {
          if (this.mainAnalogData) {
            this.mainAnalogData.forEach(el => {
              if (element == el.chName) {
                this.setAnalogData.push(el);
              }
            });
          }
        });

        this.selectedAnalogData = [];
        this.setAnalogData.forEach(element => {
          selectedItem.nodeProperties.analogChannel.forEach(el => {
            if (element.chName == el) {
              this.selectedAnalogData.push(element);
            }
          });
        });
      }

      this.dataService.sendSelectedAnalogData(this.selectedAnalogData);
    }, 100);

    if (this.digitalDataIntervalId) {
      clearInterval(this.digitalDataIntervalId);
    }

    this.digitalDataIntervalId = setInterval(() => {
      this.setDigitalData = [];
      if (CommonKeyboardCommands.diagramData?.pageOptionList[0]?.diagram.digitalChannel) {
        CommonKeyboardCommands.diagramData?.pageOptionList[0]?.diagram.digitalChannel.flat().forEach(element => {
          if (this.mainDigitalData) {
            this.mainDigitalData.forEach(el => {
              if (element == el.chName) {
                this.setDigitalData.push(el);
              }
            });
          }
        });

        this.selectedDigitalData = [];
        this.setDigitalData.forEach(element => {

          selectedItem.nodeProperties.digitalChannel.forEach(el => {
            if (element.chName == el) {
              this.selectedDigitalData.push(element);
            }
          });
        });
        this.dataService.sendSelectedDigitalData(this.selectedDigitalData);

      }
    }, 100);

    if (this.analogIntervalId) {
      clearInterval(this.analogIntervalId);
    }

    this.analogIntervalId = setInterval(() => {
      if (CommonKeyboardCommands.diagramData) {
        selectedItem.nodeProperties.analogData = this.selectedAnalogData ? this.selectedAnalogData : null;
      } else {
        if (node.isPastedNode) {
          selectedItem.nodeProperties.analogData = node.analogData ? node.analogData : copyNode[0].analogData;
        } else {
          selectedItem.nodeProperties.analogData = node.analogData ? node.analogData : null;
        }
      }
    }, 10);


    if (this.digitalIntervalId) {
      clearInterval(this.digitalIntervalId);
    }

    this.digitalIntervalId = setInterval(() => {
      if (CommonKeyboardCommands.diagramData) {
        selectedItem.nodeProperties.digitalData = this.selectedDigitalData ? this.selectedDigitalData : null;
      } else {
        if (node.isPastedNode) {
          selectedItem.nodeProperties.digitalData = node.analogData ? node.digitalData : copyNode[0].digitalData;
        } else {
          selectedItem.nodeProperties.digitalData = node.analogData ? node.digitalData : null;
        }
      }
    }, 10);

    let gradientElement: HTMLElement = document.getElementById("gradientStyle");
    if (selectedItem.nodeProperties.gradient) {
      gradientElement.className = "row db-prop-row db-gradient-style-show";
      selectedItem.nodeProperties.gradientColor =
        node.style.gradient.stops[1].color;
      let gradient: LinearGradient = node.style.gradient as LinearGradient;
      if (gradient.x1) {
        selectedItem.nodeProperties.gradientDirection = "North";
      } else if (gradient.x2) {
        selectedItem.nodeProperties.gradientDirection = "East";
      } else if (gradient.y1) {
        selectedItem.nodeProperties.gradientDirection = "West";
      } else if (gradient.y2) {
        selectedItem.nodeProperties.gradientDirection = "South";
      }
    } else {
      gradientElement.className = "row db-prop-row db-gradient-style-hide";
      selectedItem.nodeProperties.gradientColor = "#ffffff";
      selectedItem.nodeProperties.gradientDirection = "South";
    }
    selectedItem.preventPropertyChange = false;
  }
  analogChannelIntervalId(analogChannelIntervalId: any) {
    throw new Error("Method not implemented.");
  }

  public bindMindMapProperties(
    node: NodeModel,
    selectedItem: SelectorViewModel
  ): void {
    selectedItem.preventPropertyChange = true;
    selectedItem.mindmapSettings.stroke = node.style.strokeColor;
    selectedItem.mindmapSettings.strokeStyle = node.style.strokeDashArray
      ? node.style.strokeDashArray
      : "None";
    selectedItem.mindmapSettings.strokeWidth = node.style.strokeWidth;
    selectedItem.mindmapSettings.fill = node.style.fill;
    selectedItem.mindmapSettings.opacity = (node.style.opacity || 1) * 100;
    selectedItem.mindmapSettings.opacityText =
      (selectedItem.mindmapSettings.opacity || "100") + "%";
    if (node.annotations.length > 0) {
      let annotation: TextStyle = node.annotations[0].style as TextStyle;
      selectedItem.mindmapSettings.fontFamily = annotation.fontFamily;
      selectedItem.mindmapSettings.fontColor = annotation.color;
      selectedItem.mindmapSettings.fontSize = annotation.fontSize;
      selectedItem.mindmapSettings.textOpacity =
        (annotation.opacity || 1) * 100;
      selectedItem.mindmapSettings.textOpacityText =
        (selectedItem.mindmapSettings.textOpacity || "100") + "%";
    }
    selectedItem.preventPropertyChange = false;
  }

  textTagIntervalId: any;
  public bindTextProperties(
    text: TextStyleModel,
    selectedItem: SelectorViewModel
  ): void {

    let diagram: Diagram = selectedItem.selectedDiagram;
    let copyNode: any = selectedItem.pasteData;


    selectedItem.preventPropertyChange = true;
    selectedItem.textProperties.opacity = text.opacity * 100;
    selectedItem.textProperties.opacityText =
      selectedItem.textProperties.opacity + "%";



    diagram.selectedItems.nodes.forEach(selectedNode => {

      if (this.textTagIntervalId) {
        clearInterval(this.textTagIntervalId);
      }


      this.textTagIntervalId = setInterval(() => {

        selectedItem.textProperties.fontFamily = selectedNode.annotations[0].style.fontFamily ? selectedNode.annotations[0].style.fontFamily : text.fontFamily;
        selectedItem.textProperties.fontSize = selectedNode.annotations[0].style.fontSize ? selectedNode.annotations[0].style.fontSize : text.fontSize;
        selectedItem.textProperties.fontColor = selectedNode.annotations[0].style.color ? selectedNode.annotations[0].style.color : this.getHexColor(text.color);

        if (selectedNode.id.includes(copyNode[0]?.id) && selectedNode.id != copyNode[0].id) {
          selectedNode.isPastedNode = true;
        }

        if (selectedNode.isPastedNode) {

          if (selectedNode.shape.type === "Flow") {
            selectedItem.nodeProperties.annotationContent = selectedNode.annotations[0].content ? selectedNode.annotations[0].content : copyNode[0].annotations[0].content;
          }

          selectedItem.nodeProperties.textAnnotationsTagName = selectedNode.annotations[0].tagName ? selectedNode.annotations[0].tagName : copyNode[0].annotations[0].tagName;
          if (!selectedNode.annotations[0].tagName) {
            selectedNode.annotations[0].tagName = selectedItem.nodeProperties.textAnnotationsTagName;
          }
          selectedItem.nodeProperties.analogUnit = selectedNode.annotations[0].analogUnit ? selectedNode.annotations[0].analogUnit : copyNode[0].annotations[0].analogUnit;
          if (!selectedNode.annotations[0].analogUnit) {
            selectedNode.annotations[0].analogUnit = selectedItem.nodeProperties.analogUnit;
          }
          selectedItem.nodeProperties.textAnalogChName = selectedNode.annotations[0].textAnalogChName ? selectedNode.annotations[0].textAnalogChName : copyNode[0].annotations[0].textAnalogChName;
          if (!selectedNode.annotations[0].textAnalogChName) {
            selectedNode.annotations[0].textAnalogChName = selectedItem.nodeProperties.textAnalogChName;
          }
          selectedItem.nodeProperties.textOperation = selectedNode.annotations[0].textOperation ? selectedNode.annotations[0].textOperation : copyNode[0].annotations[0].textOperation;
          if (!selectedNode.annotations[0].textOperation) {
            selectedNode.annotations[0].textOperation = selectedItem.nodeProperties.textOperation;
          }
          selectedItem.nodeProperties.textSetValue = selectedNode.annotations[0].textSetValue ? selectedNode.annotations[0].textSetValue : copyNode[0].annotations[0].textSetValue;
          if (!selectedNode.annotations[0].textSetValue) {
            selectedNode.annotations[0].textSetValue = selectedItem.nodeProperties.textSetValue;
          }

          selectedItem.nodeProperties.textTooltip = selectedNode.annotations[0].textTooltip ? selectedNode.annotations[0].textTooltip : copyNode[0].annotations[0].textTooltip;
          if (!selectedNode.annotations[0].textTooltip) {
            selectedNode.annotations[0].textTooltip = selectedItem.nodeProperties.textTooltip;
          }
          selectedItem.nodeProperties.textContinueBlink = selectedNode.annotations[0].textContinueBlink ? selectedNode.annotations[0].textContinueBlink : copyNode[0].annotations[0].textContinueBlink;
          if (!selectedNode.annotations[0].textContinueBlink) {
            selectedNode.annotations[0].textContinueBlink = selectedItem.nodeProperties.textContinueBlink;
          }
          selectedItem.nodeProperties.textIsChecked = selectedNode.annotations[0].textIsChecked ? selectedNode.annotations[0].textIsChecked : copyNode[0].annotations[0].textIsChecked;
          if (!selectedNode.annotations[0].textIsChecked) {
            selectedNode.annotations[0].textIsChecked = selectedItem.nodeProperties.textIsChecked;
          }
          selectedItem.nodeProperties.textCheckColor = selectedNode.annotations[0].textCheckColor ? selectedNode.annotations[0].textCheckColor : copyNode[0].annotations[0].textCheckColor;
          if (!selectedNode.annotations[0].textCheckColor) {
            selectedNode.annotations[0].textCheckColor = selectedItem.nodeProperties.textCheckColor;
          }
          selectedItem.nodeProperties.textCheckStr = selectedNode.annotations[0].textCheckStr ? selectedNode.annotations[0].textCheckStr : copyNode[0].annotations[0].textCheckStr;
          if (!selectedNode.annotations[0].textCheckStr) {
            selectedNode.annotations[0].textCheckStr = selectedItem.nodeProperties.textCheckStr;
          }
          selectedItem.nodeProperties.textCheckAudio = selectedNode.annotations[0].textCheckAudio ? selectedNode.annotations[0].textCheckAudio : copyNode[0].annotations[0].textCheckAudio;
          if (!selectedNode.annotations[0].textCheckAudio) {
            selectedNode.annotations[0].textCheckAudio = selectedItem.nodeProperties.textCheckAudio;
          }
          selectedItem.nodeProperties.textBlinkTime = selectedNode.annotations[0].textBlinkTime ? selectedNode.annotations[0].textBlinkTime : copyNode[0].annotations[0].textBlinkTime;
          if (!selectedNode.annotations[0].textBlinkTime) {
            selectedNode.annotations[0].textBlinkTime = selectedItem.nodeProperties.textBlinkTime;
          }
          selectedItem.nodeProperties.textSetStr = selectedNode.annotations[0].textSetStr ? selectedNode.annotations[0].textSetStr : copyNode[0].annotations[0].textSetStr;
          if (!selectedNode.annotations[0].textSetStr) {
            selectedNode.annotations[0].textSetStr = selectedItem.nodeProperties.textSetStr;
          }
          selectedItem.nodeProperties.textDecimal = selectedNode.annotations[0].textDecimal ? selectedNode.annotations[0].textDecimal : 2;
          if (!selectedNode.annotations[0].textDecimal) {
            selectedNode.annotations[0].textDecimal = selectedItem.nodeProperties.textDecimal;
          }
          selectedItem.nodeProperties.textAudioFile = selectedNode.annotations[0].textAudioFile ? selectedNode.annotations[0].textAudioFile : copyNode[0].annotations[0].textAudioFile;
          if (!selectedNode.annotations[0].textAudioFile) {
            selectedNode.annotations[0].textAudioFile = selectedItem.nodeProperties.textAudioFile;
          }
          selectedItem.nodeProperties.textAudioFileName = selectedNode.annotations[0].textAudioFileName ? selectedNode.annotations[0].textAudioFileName : copyNode[0].annotations[0].textAudioFileName;
          if (!selectedNode.annotations[0].textAudioFileName) {
            selectedNode.annotations[0].textAudioFileName = selectedItem.nodeProperties.textAudioFileName;
          }
          selectedItem.nodeProperties.textLowLimitCheckColor = selectedNode.annotations[0].textLowLimitCheckColor ? selectedNode.annotations[0].textLowLimitCheckColor : copyNode[0].annotations[0].textLowLimitCheckColor;
          if (!selectedNode.annotations[0].textLowLimitCheckColor) {
            selectedNode.annotations[0].textLowLimitCheckColor = selectedItem.nodeProperties.textLowLimitCheckColor;
          }
          selectedItem.nodeProperties.textLowLimitCheckText = selectedNode.annotations[0].textLowLimitCheckText ? selectedNode.annotations[0].textLowLimitCheckText : copyNode[0].annotations[0].textLowLimitCheckText;
          if (!selectedNode.annotations[0].textLowLimitCheckText) {
            selectedNode.annotations[0].textLowLimitCheckText = selectedItem.nodeProperties.textLowLimitCheckText;
          }
          selectedItem.nodeProperties.textLowLimitCheckShape = selectedNode.annotations[0].textLowLimitCheckShape ? selectedNode.annotations[0].textLowLimitCheckShape : copyNode[0].annotations[0].textLowLimitCheckShape;
          if (!selectedNode.annotations[0].textLowLimitCheckShape) {
            selectedNode.annotations[0].textLowLimitCheckShape = selectedItem.nodeProperties.textLowLimitCheckShape;
          }
          selectedItem.nodeProperties.textLowLimitCheckAudio = selectedNode.annotations[0].textLowLimitCheckAudio ? selectedNode.annotations[0].textLowLimitCheckAudio : copyNode[0].annotations[0].textLowLimitCheckAudio;
          if (!selectedNode.annotations[0].textLowLimitCheckAudio) {
            selectedNode.annotations[0].textLowLimitCheckAudio = selectedItem.nodeProperties.textLowLimitCheckAudio;
          }
          selectedItem.nodeProperties.textLowLimitValue = selectedNode.annotations[0].textLowLimitValue ? selectedNode.annotations[0].textLowLimitValue : copyNode[0].annotations[0].textLowLimitValue;
          if (!selectedNode.annotations[0].textLowLimitValue) {
            selectedNode.annotations[0].textLowLimitValue = selectedItem.nodeProperties.textLowLimitValue;
          }
          selectedItem.nodeProperties.textLowLimitColorValue = selectedNode.annotations[0].textLowLimitColorValue ? selectedNode.annotations[0].textLowLimitColorValue : copyNode[0].annotations[0].textLowLimitColorValue;
          if (!selectedNode.annotations[0].textLowLimitColorValue) {
            selectedNode.annotations[0].textLowLimitColorValue = selectedItem.nodeProperties.textLowLimitColorValue;
          }
          selectedItem.nodeProperties.textLowLimitTextValue = selectedNode.annotations[0].textLowLimitTextValue ? selectedNode.annotations[0].textLowLimitTextValue : copyNode[0].annotations[0].textLowLimitTextValue;
          if (!selectedNode.annotations[0].textLowLimitTextValue) {
            selectedNode.annotations[0].textLowLimitTextValue = selectedItem.nodeProperties.textLowLimitTextValue;
          }
          selectedItem.nodeProperties.textLowLimitShapeValue = selectedNode.annotations[0].textLowLimitShapeValue ? selectedNode.annotations[0].textLowLimitShapeValue : copyNode[0].annotations[0].textLowLimitShapeValue;
          if (!selectedNode.annotations[0].textLowLimitShapeValue) {
            selectedNode.annotations[0].textLowLimitShapeValue = selectedItem.nodeProperties.textLowLimitShapeValue;
          }
          selectedItem.nodeProperties.textLowLimitAudioValue = selectedNode.annotations[0].textLowLimitAudioValue ? selectedNode.annotations[0].textLowLimitAudioValue : copyNode[0].annotations[0].textLowLimitAudioValue;
          if (!selectedNode.annotations[0].textLowLimitAudioValue) {
            selectedNode.annotations[0].textLowLimitAudioValue = selectedItem.nodeProperties.textLowLimitAudioValue;
          }
          selectedItem.nodeProperties.textHighLimitValue = selectedNode.annotations[0].textHighLimitValue ? selectedNode.annotations[0].textHighLimitValue : copyNode[0].annotations[0].textHighLimitValue;
          if (!selectedNode.annotations[0].textHighLimitValue) {
            selectedNode.annotations[0].textHighLimitValue = selectedItem.nodeProperties.textHighLimitValue;
          }
          selectedItem.nodeProperties.textHighLimitCheckColor = selectedNode.annotations[0].textHighLimitCheckColor ? selectedNode.annotations[0].textHighLimitCheckColor : copyNode[0].annotations[0].textHighLimitCheckColor;
          if (!selectedNode.annotations[0].textHighLimitCheckColor) {
            selectedNode.annotations[0].textHighLimitCheckColor = selectedItem.nodeProperties.textHighLimitCheckColor;
          }
          selectedItem.nodeProperties.textHighLimitCheckText = selectedNode.annotations[0].textHighLimitCheckText ? selectedNode.annotations[0].textHighLimitCheckText : copyNode[0].annotations[0].textHighLimitCheckText;
          if (!selectedNode.annotations[0].textHighLimitCheckText) {
            selectedNode.annotations[0].textHighLimitCheckText = selectedItem.nodeProperties.textHighLimitCheckText;
          }
          selectedItem.nodeProperties.textHighLimitCheckShape = selectedNode.annotations[0].textHighLimitCheckShape ? selectedNode.annotations[0].textHighLimitCheckShape : copyNode[0].annotations[0].textHighLimitCheckShape;
          if (!selectedNode.annotations[0].textHighLimitCheckShape) {
            selectedNode.annotations[0].textHighLimitCheckShape = selectedItem.nodeProperties.textHighLimitCheckShape;
          }
          selectedItem.nodeProperties.textHighLimitCheckAudio = selectedNode.annotations[0].textHighLimitCheckAudio ? selectedNode.annotations[0].textHighLimitCheckAudio : copyNode[0].annotations[0].textHighLimitCheckAudio;
          if (!selectedNode.annotations[0].textHighLimitCheckAudio) {
            selectedNode.annotations[0].textHighLimitCheckAudio = selectedItem.nodeProperties.textHighLimitCheckAudio;
          }
          selectedItem.nodeProperties.textHighLimitColorValue = selectedNode.annotations[0].textHighLimitColorValue ? selectedNode.annotations[0].textHighLimitColorValue : copyNode[0].annotations[0].textHighLimitColorValue;
          if (!selectedNode.annotations[0].textHighLimitColorValue) {
            selectedNode.annotations[0].textHighLimitColorValue = selectedItem.nodeProperties.textHighLimitColorValue;
          }
          selectedItem.nodeProperties.textHighLimitTextValue = selectedNode.annotations[0].textHighLimitTextValue ? selectedNode.annotations[0].textHighLimitTextValue : copyNode[0].annotations[0].textHighLimitTextValue;
          if (!selectedNode.annotations[0].textHighLimitTextValue) {
            selectedNode.annotations[0].textHighLimitTextValue = selectedItem.nodeProperties.textHighLimitTextValue;
          }
          selectedItem.nodeProperties.textHighLimitShapeValue = selectedNode.annotations[0].textHighLimitShapeValue ? selectedNode.annotations[0].textHighLimitShapeValue : copyNode[0].annotations[0].textHighLimitShapeValue;
          if (!selectedNode.annotations[0].textHighLimitShapeValue) {
            selectedNode.annotations[0].textHighLimitShapeValue = selectedItem.nodeProperties.textHighLimitShapeValue;
          }
          selectedItem.nodeProperties.textHighLimitAudioValue = selectedNode.annotations[0].textHighLimitAudioValue ? selectedNode.annotations[0].textHighLimitAudioValue : copyNode[0].annotations[0].textHighLimitAudioValue;
          if (!selectedNode.annotations[0].textHighLimitAudioValue) {
            selectedNode.annotations[0].textHighLimitAudioValue = selectedItem.nodeProperties.textHighLimitAudioValue;
          }
          selectedItem.nodeProperties.textLowLimitBlinkContCheck = selectedNode.annotations[0].textLowLimitBlinkContCheck ? selectedNode.annotations[0].textLowLimitBlinkContCheck : copyNode[0].annotations[0].textLowLimitBlinkContCheck;
          if (!selectedNode.annotations[0].textLowLimitBlinkContCheck) {
            selectedNode.annotations[0].textLowLimitBlinkContCheck = selectedItem.nodeProperties.textLowLimitBlinkContCheck;
          }
          selectedItem.nodeProperties.textLowLimitBlinkTimeCheck = selectedNode.annotations[0].textLowLimitBlinkTimeCheck ? selectedNode.annotations[0].textLowLimitBlinkTimeCheck : copyNode[0].annotations[0].textLowLimitBlinkTimeCheck;
          if (!selectedNode.annotations[0].textLowLimitBlinkTimeCheck) {
            selectedNode.annotations[0].textLowLimitBlinkTimeCheck = selectedItem.nodeProperties.textLowLimitBlinkTimeCheck;
          }
          selectedItem.nodeProperties.textLowLimitBlinkTime = selectedNode.annotations[0].textLowLimitBlinkTime ? selectedNode.annotations[0].textLowLimitBlinkTime : copyNode[0].annotations[0].textLowLimitBlinkTime;
          if (!selectedNode.annotations[0].textLowLimitBlinkTime) {
            selectedNode.annotations[0].textLowLimitBlinkTime = selectedItem.nodeProperties.textLowLimitBlinkTime;
          }
          selectedItem.nodeProperties.textHighLimitBlinkContCheck = selectedNode.annotations[0].textHighLimitBlinkContCheck ? selectedNode.annotations[0].textHighLimitBlinkContCheck : copyNode[0].annotations[0].textHighLimitBlinkContCheck;
          if (!selectedNode.annotations[0].textHighLimitBlinkContCheck) {
            selectedNode.annotations[0].textHighLimitBlinkContCheck = selectedItem.nodeProperties.textHighLimitBlinkContCheck;
          }
          selectedItem.nodeProperties.textHighLimitBlinkTimeCheck = selectedNode.annotations[0].textHighLimitBlinkTimeCheck ? selectedNode.annotations[0].textHighLimitBlinkTimeCheck : copyNode[0].annotations[0].textHighLimitBlinkTimeCheck;
          if (!selectedNode.annotations[0].textHighLimitBlinkTimeCheck) {
            selectedNode.annotations[0].textHighLimitBlinkTimeCheck = selectedItem.nodeProperties.textHighLimitBlinkTimeCheck;
          }
          selectedItem.nodeProperties.textHighLimitBlinkTime = selectedNode.annotations[0].textHighLimitBlinkTime ? selectedNode.annotations[0].textHighLimitBlinkTime : copyNode[0].annotations[0].textHighLimitBlinkTime;
          if (!selectedNode.annotations[0].textHighLimitBlinkTime) {
            selectedNode.annotations[0].textHighLimitBlinkTime = selectedItem.nodeProperties.textHighLimitBlinkTime;
          }
          selectedItem.nodeProperties.textCheckBackgroundColor = selectedNode.annotations[0].textCheckBackgroundColor ? selectedNode.annotations[0].textCheckBackgroundColor : copyNode[0].annotations[0].textCheckBackgroundColor;
          if (!selectedNode.annotations[0].textCheckBackgroundColor) {
            selectedNode.annotations[0].textCheckBackgroundColor = selectedItem.nodeProperties.textCheckBackgroundColor;
          }
          selectedItem.nodeProperties.normalBackgroundColor = selectedNode.annotations[0].normalBackgroundColor ? selectedNode.annotations[0].normalBackgroundColor : copyNode[0].annotations[0].normalBackgroundColor;
          if (!selectedNode.annotations[0].normalBackgroundColor) {
            selectedNode.annotations[0].normalBackgroundColor = selectedItem.nodeProperties.normalBackgroundColor;
          }
          selectedItem.nodeProperties.abNormalBackgroundColor = selectedNode.annotations[0].abNormalBackgroundColor ? selectedNode.annotations[0].abNormalBackgroundColor : copyNode[0].annotations[0].abNormalBackgroundColor;
          if (!selectedNode.annotations[0].abNormalBackgroundColor) {
            selectedNode.annotations[0].abNormalBackgroundColor = selectedItem.nodeProperties.abNormalBackgroundColor;
          }

          selectedItem.nodeProperties.textSetNormal = selectedNode.annotations[0].textSetNormal ? selectedNode.annotations[0].textSetNormal : copyNode[0].annotations[0].textSetNormal;
          if (!selectedNode.annotations[0].textSetNormal) {
            selectedNode.annotations[0].textSetNormal = selectedItem.nodeProperties.textSetNormal;
          }
          selectedItem.nodeProperties.textSetAbnormal = selectedNode.annotations[0].textSetAbnormal ? selectedNode.annotations[0].textSetAbnormal : copyNode[0].annotations[0].textSetAbnormal;
          if (!selectedNode.annotations[0].textSetAbnormal) {
            selectedNode.annotations[0].textSetAbnormal = selectedItem.nodeProperties.textSetAbnormal;
          }
          selectedItem.nodeProperties.limitImageCheck = selectedNode.annotations[0].limitImageCheck ? selectedNode.annotations[0].textSetAbnormal : copyNode[0].annotations[0].limitImageCheck;
          if (!selectedNode.annotations[0].limitImageCheck) {
            selectedNode.annotations[0].limitImageCheck = selectedItem.nodeProperties.limitImageCheck;
          }

          selectedItem.nodeProperties.normalImage = selectedNode.annotations[0].normalImage ? selectedNode.annotations[0].normalImage : copyNode[0].annotations[0].normalImage;
          if (!selectedNode.annotations[0].normalImage) {
            selectedNode.annotations[0].normalImage = selectedItem.nodeProperties.normalImage;
          }
          selectedItem.nodeProperties.abNormalImage = selectedNode.annotations[0].abNormalImage ? selectedNode.annotations[0].abNormalImage : copyNode[0].annotations[0].abNormalImage;
          if (!selectedNode.annotations[0].abNormalImage) {
            selectedNode.annotations[0].abNormalImage = selectedItem.nodeProperties.abNormalImage;
          }




          // bit-display

          selectedItem.nodeProperties.bitTagName = selectedNode.annotations[0].bitTagName ? selectedNode.annotations[0].bitTagName : copyNode[0].annotations[0].bitTagName;
          if (!selectedNode.annotations[0].bitTagName) {
            selectedNode.annotations[0].bitTagName = selectedItem.nodeProperties.bitTagName;
          }
          selectedItem.nodeProperties.bitTextChName = selectedNode.annotations[0].bitTextChName ? selectedNode.annotations[0].bitTextChName : copyNode[0].annotations[0].bitTextChName;
          if (!selectedNode.annotations[0].bitTextChName) {
            selectedNode.annotations[0].bitTextChName = selectedItem.nodeProperties.bitTextChName;
          }
          selectedItem.nodeProperties.hideOnNormal = selectedNode.annotations[0].hideOnNormal ? selectedNode.annotations[0].hideOnNormal : copyNode[0].annotations[0].hideOnNormal;
          if (!selectedNode.annotations[0].hideOnNormal) {
            selectedNode.annotations[0].hideOnNormal = selectedItem.nodeProperties.hideOnNormal;
          }
          selectedItem.nodeProperties.hideOnAbNormal = selectedNode.annotations[0].hideOnAbNormal ? selectedNode.annotations[0].hideOnAbNormal : copyNode[0].annotations[0].hideOnAbNormal;
          if (!selectedNode.annotations[0].hideOnAbNormal) {
            selectedNode.annotations[0].hideOnAbNormal = selectedItem.nodeProperties.hideOnAbNormal;
          }
          selectedItem.nodeProperties.bit1Color = selectedNode.annotations[0].bit1Color ? selectedNode.annotations[0].bit1Color : copyNode[0].annotations[0].bit1Color;
          if (!selectedNode.annotations[0].bit1Color) {
            selectedNode.annotations[0].bit1Color = selectedItem.nodeProperties.bit1Color;
          }
          selectedItem.nodeProperties.bit0Color = selectedNode.annotations[0].bit0Color ? selectedNode.annotations[0].bit0Color : copyNode[0].annotations[0].bit0Color;
          if (!selectedNode.annotations[0].bit0Color) {
            selectedNode.annotations[0].bit0Color = selectedItem.nodeProperties.bit0Color;
          }
          selectedItem.nodeProperties.normalContinueBlink = selectedNode.annotations[0].normalContinueBlink ? selectedNode.annotations[0].normalContinueBlink : copyNode[0].annotations[0].normalContinueBlink;
          if (!selectedNode.annotations[0].normalContinueBlink) {
            selectedNode.annotations[0].normalContinueBlink = selectedItem.nodeProperties.normalContinueBlink;
          }
          selectedItem.nodeProperties.normalTimeBlink = selectedNode.annotations[0].normalTimeBlink ? selectedNode.annotations[0].normalTimeBlink : copyNode[0].annotations[0].normalTimeBlink;
          if (!selectedNode.annotations[0].normalTimeBlink) {
            selectedNode.annotations[0].normalTimeBlink = selectedItem.nodeProperties.normalTimeBlink;
          }
          selectedItem.nodeProperties.normalTimeBlinkValue = selectedNode.annotations[0].normalTimeBlinkValue ? selectedNode.annotations[0].normalTimeBlinkValue : copyNode[0].annotations[0].normalTimeBlinkValue;
          if (!selectedNode.annotations[0].normalTimeBlinkValue) {
            selectedNode.annotations[0].normalTimeBlinkValue = selectedItem.nodeProperties.normalTimeBlinkValue;
          }
          selectedItem.nodeProperties.bitSet1asNormal = selectedNode.annotations[0].bitSet1asNormal ? selectedNode.annotations[0].bitSet1asNormal : copyNode[0].annotations[0].bitSet1asNormal;
          if (!selectedNode.annotations[0].bitSet1asNormal) {
            selectedNode.annotations[0].bitSet1asNormal = selectedItem.nodeProperties.bitSet1asNormal;
          }
          selectedItem.nodeProperties.bitSet1asAbnormal = selectedNode.annotations[0].bitSet1asAbnormal ? selectedNode.annotations[0].bitSet1asAbnormal : copyNode[0].annotations[0].bitSet1asAbnormal;
          if (!selectedNode.annotations[0].bitSet1asAbnormal) {
            selectedNode.annotations[0].bitSet1asAbnormal = selectedItem.nodeProperties.bitSet1asAbnormal;
          }
          selectedItem.nodeProperties.bitCheck1to0 = selectedNode.annotations[0].bitCheck1to0 ? selectedNode.annotations[0].bitCheck1to0 : copyNode[0].annotations[0].bitCheck1to0;
          if (!selectedNode.annotations[0].bitCheck1to0) {
            selectedNode.annotations[0].bitCheck1to0 = selectedItem.nodeProperties.bitCheck1to0;
          }
          selectedItem.nodeProperties.bitCheck0to1 = selectedNode.annotations[0].bitCheck0to1 ? selectedNode.annotations[0].bitCheck0to1 : copyNode[0].annotations[0].bitCheck0to1;
          if (!selectedNode.annotations[0].bitCheck0to1) {
            selectedNode.annotations[0].bitCheck0to1 = selectedItem.nodeProperties.bitCheck0to1;
          }
          selectedItem.nodeProperties.bitCondiConBlink1to0 = selectedNode.annotations[0].bitCondiConBlink1to0 ? selectedNode.annotations[0].bitCondiConBlink1to0 : copyNode[0].annotations[0].bitCondiConBlink1to0;
          if (!selectedNode.annotations[0].bitCondiConBlink1to0) {
            selectedNode.annotations[0].bitCondiConBlink1to0 = selectedItem.nodeProperties.bitCondiConBlink1to0;
          }
          selectedItem.nodeProperties.bitCondiTimeBlink1to0 = selectedNode.annotations[0].bitCondiTimeBlink1to0 ? selectedNode.annotations[0].bitCondiTimeBlink1to0 : copyNode[0].annotations[0].bitCondiTimeBlink1to0;
          if (!selectedNode.annotations[0].bitCondiTimeBlink1to0) {
            selectedNode.annotations[0].bitCondiTimeBlink1to0 = selectedItem.nodeProperties.bitCondiTimeBlink1to0;
          }
          selectedItem.nodeProperties.bitCondiBlinkTimeValue1to0 = selectedNode.annotations[0].bitCondiBlinkTimeValue1to0 ? selectedNode.annotations[0].bitCondiBlinkTimeValue1to0 : copyNode[0].annotations[0].bitCondiBlinkTimeValue1to0;
          if (!selectedNode.annotations[0].bitCondiBlinkTimeValue1to0) {
            selectedNode.annotations[0].bitCondiBlinkTimeValue1to0 = selectedItem.nodeProperties.bitCondiBlinkTimeValue1to0;
          }

          selectedItem.nodeProperties.bitCondiConBlink0to1 = selectedNode.annotations[0].bitCondiConBlink0to1 ? selectedNode.annotations[0].bitCondiConBlink0to1 : copyNode[0].annotations[0].bitCondiConBlink0to1;
          if (!selectedNode.annotations[0].bitCondiConBlink0to1) {
            selectedNode.annotations[0].bitCondiConBlink0to1 = selectedItem.nodeProperties.bitCondiConBlink0to1;
          }
          selectedItem.nodeProperties.bitCondiTimeBlink0to1 = selectedNode.annotations[0].bitCondiTimeBlink0to1 ? selectedNode.annotations[0].bitCondiTimeBlink0to1 : copyNode[0].annotations[0].bitCondiTimeBlink0to1;
          if (!selectedNode.annotations[0].bitCondiTimeBlink0to1) {
            selectedNode.annotations[0].bitCondiTimeBlink0to1 = selectedItem.nodeProperties.bitCondiTimeBlink0to1;
          }
          selectedItem.nodeProperties.bitCondiBlinkTimeValue0to1 = selectedNode.annotations[0].bitCondiBlinkTimeValue0to1 ? selectedNode.annotations[0].bitCondiBlinkTimeValue0to1 : copyNode[0].annotations[0].bitCondiBlinkTimeValue0to1;
          if (!selectedNode.annotations[0].bitCondiBlinkTimeValue0to1) {
            selectedNode.annotations[0].bitCondiBlinkTimeValue0to1 = selectedItem.nodeProperties.bitCondiBlinkTimeValue0to1;
          }
          selectedItem.nodeProperties.bitShapeColor1to0 = selectedNode.annotations[0].bitShapeColor1to0 ? selectedNode.annotations[0].bitShapeColor1to0 : copyNode[0].annotations[0].bitShapeColor1to0
          if (!selectedNode.annotations[0].bitShapeColor1to0) {
            selectedNode.annotations[0].bitShapeColor1to0 = selectedItem.nodeProperties.bitShapeColor1to0;
          }
          selectedItem.nodeProperties.bitShapeColor0to1 = selectedNode.annotations[0].bitShapeColor0to1 ? selectedNode.annotations[0].bitShapeColor0to1 : copyNode[0].annotations[0].bitShapeColor0to1
          if (!selectedNode.annotations[0].bitShapeColor0to1) {
            selectedNode.annotations[0].bitShapeColor0to1 = selectedItem.nodeProperties.bitShapeColor0to1;
          }
          selectedItem.nodeProperties.bitAudio1to0 = selectedNode.annotations[0].bitAudio1to0 ? selectedNode.annotations[0].bitAudio1to0 : copyNode[0].annotations[0].bitAudio1to0;
          if (!selectedNode.annotations[0].bitAudio1to0) {
            selectedNode.annotations[0].bitAudio1to0 = selectedItem.nodeProperties.bitAudio1to0;
          }
          selectedItem.nodeProperties.bitAudio0to1 = selectedNode.annotations[0].bitAudio0to1 ? selectedNode.annotations[0].bitAudio0to1 : copyNode[0].annotations[0].bitAudio0to1;
          if (!selectedNode.annotations[0].bitAudio0to1) {
            selectedNode.annotations[0].bitAudio0to1 = selectedItem.nodeProperties.bitAudio0to1;
          }
          selectedItem.nodeProperties.bitTextFor1 = selectedNode.annotations[0].bitTextFor1 ? selectedNode.annotations[0].bitTextFor1 : copyNode[0].annotations[0].bitTextFor1;
          if (!selectedNode.annotations[0].bitTextFor1) {
            selectedNode.annotations[0].bitTextFor1 = selectedItem.nodeProperties.bitTextFor1;
          }
          selectedItem.nodeProperties.bitTextFor0 = selectedNode.annotations[0].bitTextFor0 ? selectedNode.annotations[0].bitTextFor0 : copyNode[0].annotations[0].bitTextFor0;
          if (!selectedNode.annotations[0].bitTextFor0) {
            selectedNode.annotations[0].bitTextFor0 = selectedItem.nodeProperties.bitTextFor0;
          }
          selectedItem.nodeProperties.bitTextColorFor0 = selectedNode.annotations[0].bitTextColorFor0 ? selectedNode.annotations[0].bitTextColorFor0 : copyNode[0].annotations[0].bitTextColorFor0;
          if (!selectedNode.annotations[0].bitTextColorFor0) {
            selectedNode.annotations[0].bitTextColorFor0 = selectedItem.nodeProperties.bitTextColorFor0;
          }

          selectedItem.nodeProperties.bitTextColorFor1 = selectedNode.annotations[0].bitTextColorFor1 ? selectedNode.annotations[0].bitTextColorFor1 : copyNode[0].annotations[0].bitTextColorFor1;
          if (!selectedNode.annotations[0].bitTextColorFor1) {
            selectedNode.annotations[0].bitTextColorFor1 = selectedItem.nodeProperties.bitTextColorFor1;
          }
          selectedItem.nodeProperties.bitTextFor1to0 = selectedNode.annotations[0].bitTextFor1to0 ? selectedNode.annotations[0].bitTextFor1to0 : copyNode[0].annotations[0].bitTextFor1to0;
          if (!selectedNode.annotations[0].bitTextFor1to0) {
            selectedNode.annotations[0].bitTextFor1to0 = selectedItem.nodeProperties.bitTextFor1to0;
          }
          selectedItem.nodeProperties.bitTextFor0to1 = selectedNode.annotations[0].bitTextFor0to1 ? selectedNode.annotations[0].bitTextFor0to1 : copyNode[0].annotations[0].bitTextFor0to1;
          if (!selectedNode.annotations[0].bitTextFor0to1) {
            selectedNode.annotations[0].bitTextFor0to1 = selectedItem.nodeProperties.bitTextFor0to1;
          }
          selectedItem.nodeProperties.bitImagefor1 = selectedNode.annotations[0].bitImagefor1 ? selectedNode.annotations[0].bitImagefor1 : copyNode[0].annotations[0].bitImagefor1;
          if (!selectedNode.annotations[0].bitImagefor1) {
            selectedNode.annotations[0].bitImagefor1 = selectedItem.nodeProperties.bitImagefor1;
          }
          selectedItem.nodeProperties.bitImagefor0 = selectedNode.annotations[0].bitImagefor0 ? selectedNode.annotations[0].bitImagefor0 : copyNode[0].annotations[0].bitImagefor0;
          if (!selectedNode.annotations[0].bitImagefor0) {
            selectedNode.annotations[0].bitImagefor0 = selectedItem.nodeProperties.bitImagefor0;
          }
          selectedItem.nodeProperties.bitImageFor1to0 = selectedNode.annotations[0].bitImageFor1to0 ? selectedNode.annotations[0].bitImageFor1to0 : copyNode[0].annotations[0].bitImageFor1to0;
          if (!selectedNode.annotations[0].bitImageFor1to0) {
            selectedNode.annotations[0].bitImageFor1to0 = selectedItem.nodeProperties.bitImageFor1to0;
          }
          selectedItem.nodeProperties.bitImageFor0to1 = selectedNode.annotations[0].bitImageFor0to1 ? selectedNode.annotations[0].bitImageFor0to1 : copyNode[0].annotations[0].bitImageFor0to1;
          if (!selectedNode.annotations[0].bitImageFor0to1) {
            selectedNode.annotations[0].bitImageFor0to1 = selectedItem.nodeProperties.bitImageFor0to1;
          }
          selectedItem.nodeProperties.normalColor = selectedNode.annotations[0].normalColor ? selectedNode.annotations[0].normalColor : copyNode[0].annotations[0].normalColor;
          if (!selectedNode.annotations[0].normalColor) {
            selectedNode.annotations[0].normalColor = selectedItem.nodeProperties.normalColor;
          }
          selectedItem.nodeProperties.abNormalColor = selectedNode.annotations[0].abNormalColor ? selectedNode.annotations[0].abNormalColor : copyNode[0].annotations[0].abNormalColor;
          if (!selectedNode.annotations[0].abNormalColor) {
            selectedNode.annotations[0].abNormalColor = selectedItem.nodeProperties.abNormalColor;
          }

          // dateTime


          selectedItem.nodeProperties.dateChannel = selectedNode.annotations[0].dateChannel ? selectedNode.annotations[0].dateChannel : copyNode[0].annotations[0].dateChannel;
          if (!selectedNode.annotations[0].dateChannel) {
            selectedNode.annotations[0].dateChannel = selectedItem.nodeProperties.dateChannel;
          }
          selectedItem.nodeProperties.dateTimeFormat = selectedNode.annotations[0].dateTimeFormat ? selectedNode.annotations[0].dateTimeFormat : copyNode[0].annotations[0].dateTimeFormat;
          if (!selectedNode.annotations[0].dateTimeFormat) {
            selectedNode.annotations[0].dateTimeFormat = selectedItem.nodeProperties.dateTimeFormat;
          }




        } else {

          if (selectedNode.shape.type === "Flow" || selectedNode.shape.type === "Basic" || selectedNode.shape.type === "Image") {
            if (selectedNode.id.includes("numeric")) {
              selectedItem.nodeProperties.annotationContent = selectedNode.annotations[0].textAnalogChName ? selectedNode.annotations[0].textAnalogChName : null;
            }
            if (selectedNode.id.includes("bitImage") || selectedNode.id.includes("Shape") || selectedNode.id.includes("dateTime") || selectedNode.id.includes("itLable"))
              selectedItem.nodeProperties.annotationContent = selectedNode.annotations[0].bitTextChName ? selectedNode.annotations[0].bitTextChName : null;
          }

          selectedItem.nodeProperties.textAnnotationsTagName = selectedNode.annotations[0].tagName ? selectedNode.annotations[0].tagName : null;
          selectedItem.nodeProperties.analogUnit = selectedNode.annotations[0].analogUnit ? selectedNode.annotations[0].analogUnit : null;
          selectedItem.nodeProperties.textAnalogChName = selectedNode.annotations[0].textAnalogChName ? selectedNode.annotations[0].textAnalogChName : null;
          selectedItem.nodeProperties.textOperation = selectedNode.annotations[0].textOperation ? selectedNode.annotations[0].textOperation : null;
          selectedItem.nodeProperties.textSetValue = selectedNode.annotations[0].textSetValue ? selectedNode.annotations[0].textSetValue : null;
          selectedItem.nodeProperties.textTooltip = selectedNode.annotations[0].textTooltip ? selectedNode.annotations[0].textTooltip : null;
          selectedItem.nodeProperties.textContinueBlink = selectedNode.annotations[0].textContinueBlink ? selectedNode.annotations[0].textContinueBlink : false;
          selectedItem.nodeProperties.textIsChecked = selectedNode.annotations[0]?.textIsChecked ? selectedNode.annotations[0]?.textIsChecked : false;
          selectedItem.nodeProperties.textCheckColor = selectedNode.annotations[0].textCheckColor ? selectedNode.annotations[0].textCheckColor : false;
          selectedItem.nodeProperties.textCheckStr = selectedNode.annotations[0].textCheckStr ? selectedNode.annotations[0].textCheckStr : false;
          selectedItem.nodeProperties.textCheckAudio = selectedNode.annotations[0].textCheckAudio ? selectedNode.annotations[0].textCheckAudio : false;
          selectedItem.nodeProperties.textBlinkTime = selectedNode.annotations[0].textBlinkTime ? selectedNode.annotations[0].textBlinkTime : null;
          selectedItem.nodeProperties.textSetStr = selectedNode.annotations[0].textSetStr ? selectedNode.annotations[0].textSetStr : null;
          selectedItem.nodeProperties.textDecimal = selectedNode.annotations[0].textDecimal ? selectedNode.annotations[0].textDecimal : 2;
          selectedItem.nodeProperties.textAudioFile = selectedNode.annotations[0].textAudioFile ? selectedNode.annotations[0].textAudioFile : null;
          selectedItem.nodeProperties.textAudioFileName = selectedNode.annotations[0].textAudioFileName ? selectedNode.annotations[0].textAudioFileName : null;
          selectedItem.nodeProperties.textLowLimitCheckColor = selectedNode.annotations[0].textLowLimitCheckColor ? selectedNode.annotations[0].textLowLimitCheckColor : false;
          selectedItem.nodeProperties.textLowLimitCheckText = selectedNode.annotations[0].textLowLimitCheckText ? selectedNode.annotations[0].textLowLimitCheckText : false;
          selectedItem.nodeProperties.textLowLimitCheckShape = selectedNode.annotations[0].textLowLimitCheckShape ? selectedNode.annotations[0].textLowLimitCheckShape : false;
          selectedItem.nodeProperties.textLowLimitCheckAudio = selectedNode.annotations[0].textLowLimitCheckAudio ? selectedNode.annotations[0].textLowLimitCheckAudio : false;
          selectedItem.nodeProperties.textLowLimitValue = selectedNode.annotations[0].textLowLimitValue ? selectedNode.annotations[0].textLowLimitValue : null;
          selectedItem.nodeProperties.textLowLimitColorValue = selectedNode.annotations[0].textLowLimitColorValue ? selectedNode.annotations[0].textLowLimitColorValue : 'transparent';
          selectedItem.nodeProperties.textLowLimitTextValue = selectedNode.annotations[0].textLowLimitTextValue ? selectedNode.annotations[0].textLowLimitTextValue : null;
          selectedItem.nodeProperties.textLowLimitShapeValue = selectedNode.annotations[0].textLowLimitShapeValue ? selectedNode.annotations[0].textLowLimitShapeValue : null;
          selectedItem.nodeProperties.textLowLimitAudioValue = selectedNode.annotations[0].textLowLimitAudioValue ? selectedNode.annotations[0].textLowLimitAudioValue : null;
          selectedItem.nodeProperties.textHighLimitValue = selectedNode.annotations[0].textHighLimitValue ? selectedNode.annotations[0].textHighLimitValue : null;
          selectedItem.nodeProperties.textHighLimitCheckColor = selectedNode.annotations[0].textHighLimitCheckColor ? selectedNode.annotations[0].textHighLimitCheckColor : false;
          selectedItem.nodeProperties.textHighLimitCheckText = selectedNode.annotations[0].textHighLimitCheckText ? selectedNode.annotations[0].textHighLimitCheckText : false;
          selectedItem.nodeProperties.textHighLimitCheckShape = selectedNode.annotations[0].textHighLimitCheckShape ? selectedNode.annotations[0].textHighLimitCheckShape : false;
          selectedItem.nodeProperties.textHighLimitCheckAudio = selectedNode.annotations[0].textHighLimitCheckAudio ? selectedNode.annotations[0].textHighLimitCheckAudio : false;
          selectedItem.nodeProperties.textHighLimitColorValue = selectedNode.annotations[0].textHighLimitColorValue ? selectedNode.annotations[0].textHighLimitColorValue : 'transparent';
          selectedItem.nodeProperties.textHighLimitTextValue = selectedNode.annotations[0].textHighLimitTextValue ? selectedNode.annotations[0].textHighLimitTextValue : null;
          selectedItem.nodeProperties.textHighLimitShapeValue = selectedNode.annotations[0].textHighLimitShapeValue ? selectedNode.annotations[0].textHighLimitShapeValue : null;
          selectedItem.nodeProperties.textHighLimitAudioValue = selectedNode.annotations[0].textHighLimitAudioValue ? selectedNode.annotations[0].textHighLimitAudioValue : null;
          selectedItem.nodeProperties.textLowLimitBlinkContCheck = selectedNode.annotations[0].textLowLimitBlinkContCheck ? selectedNode.annotations[0].textLowLimitBlinkContCheck : false;
          selectedItem.nodeProperties.textLowLimitBlinkTimeCheck = selectedNode.annotations[0].textLowLimitBlinkTimeCheck ? selectedNode.annotations[0].textLowLimitBlinkTimeCheck : false;
          selectedItem.nodeProperties.textLowLimitBlinkTime = selectedNode.annotations[0].textLowLimitBlinkTime ? selectedNode.annotations[0].textLowLimitBlinkTime : null;
          selectedItem.nodeProperties.textHighLimitBlinkContCheck = selectedNode.annotations[0].textHighLimitBlinkContCheck ? selectedNode.annotations[0].textHighLimitBlinkContCheck : false;
          selectedItem.nodeProperties.textHighLimitBlinkTimeCheck = selectedNode.annotations[0].textHighLimitBlinkTimeCheck ? selectedNode.annotations[0].textHighLimitBlinkTimeCheck : false;
          selectedItem.nodeProperties.textHighLimitBlinkTime = selectedNode.annotations[0].textHighLimitBlinkTime ? selectedNode.annotations[0].textHighLimitBlinkTime : null;

          selectedItem.nodeProperties.textCheckBackgroundColor = selectedNode.annotations[0].textCheckBackgroundColor ? selectedNode.annotations[0].textCheckBackgroundColor : false;
          selectedItem.nodeProperties.normalColor = selectedNode.annotations[0].normalColor ? selectedNode.annotations[0].normalColor : 'transparent';
          selectedItem.nodeProperties.abNormalColor = selectedNode.annotations[0].abNormalColor ? selectedNode.annotations[0].abNormalColor : 'transparent';
          selectedItem.nodeProperties.normalBackgroundColor = selectedNode.annotations[0].normalBackgroundColor ? selectedNode.annotations[0].normalBackgroundColor : 'transparent';
          selectedItem.nodeProperties.abNormalBackgroundColor = selectedNode.annotations[0].abNormalBackgroundColor ? selectedNode.annotations[0].abNormalBackgroundColor : 'transparent';
          selectedItem.nodeProperties.textSetNormal = selectedNode.annotations[0].textSetNormal ? selectedNode.annotations[0].textSetNormal : null;
          selectedItem.nodeProperties.textSetAbnormal = selectedNode.annotations[0].textSetAbnormal ? selectedNode.annotations[0].textSetAbnormal : null;
          selectedItem.nodeProperties.limitImageCheck = selectedNode.annotations[0].limitImageCheck ? selectedNode.annotations[0].limitImageCheck : false;

          selectedItem.nodeProperties.normalImage = selectedNode.annotations[0].normalImage ? selectedNode.annotations[0].normalImage : null;
          selectedItem.nodeProperties.abNormalImage = selectedNode.annotations[0].normalImage ? selectedNode.annotations[0].abNormalImage : null;

          // bit-display
          selectedItem.nodeProperties.bitTagName = selectedNode.annotations[0].bitTagName ? selectedNode.annotations[0].bitTagName : null;
          selectedItem.nodeProperties.bitTextChName = selectedNode.annotations[0].bitTextChName ? selectedNode.annotations[0].bitTextChName : null;
          selectedItem.nodeProperties.hideOnNormal = selectedNode.annotations[0].hideOnNormal ? selectedNode.annotations[0].hideOnNormal : null;
          selectedItem.nodeProperties.hideOnAbNormal = selectedNode.annotations[0].hideOnAbNormal ? selectedNode.annotations[0].hideOnAbNormal : null;
          selectedItem.nodeProperties.bit1Color = selectedNode.annotations[0].bit1Color ? selectedNode.annotations[0].bit1Color : 'transparent';
          selectedItem.nodeProperties.bit0Color = selectedNode.annotations[0].bit0Color ? selectedNode.annotations[0].bit0Color : 'transparent';
          selectedItem.nodeProperties.normalContinueBlink = selectedNode.annotations[0].normalContinueBlink ? selectedNode.annotations[0].normalContinueBlink : false;
          selectedItem.nodeProperties.normalTimeBlink = selectedNode.annotations[0].normalTimeBlink ? selectedNode.annotations[0].normalTimeBlink : false;
          selectedItem.nodeProperties.normalTimeBlinkValue = selectedNode.annotations[0].normalTimeBlinkValue ? selectedNode.annotations[0].normalTimeBlinkValue : null;
          selectedItem.nodeProperties.bitSet1asNormal = selectedNode.annotations[0].bitSet1asNormal ? selectedNode.annotations[0].bitSet1asNormal : false;
          selectedItem.nodeProperties.bitSet1asAbnormal = selectedNode.annotations[0].bitSet1asAbnormal ? selectedNode.annotations[0].bitSet1asAbnormal : false;
          selectedItem.nodeProperties.bitCheck1to0 = selectedNode.annotations[0].bitCheck1to0 ? selectedNode.annotations[0].bitCheck1to0 : false;
          selectedItem.nodeProperties.bitCheck0to1 = selectedNode.annotations[0].bitCheck0to1 ? selectedNode.annotations[0].bitCheck0to1 : false;
          selectedItem.nodeProperties.bitCondiConBlink1to0 = selectedNode.annotations[0].bitCondiConBlink1to0 ? selectedNode.annotations[0].bitCondiConBlink1to0 : false;
          selectedItem.nodeProperties.bitCondiTimeBlink1to0 = selectedNode.annotations[0].bitCondiTimeBlink1to0 ? selectedNode.annotations[0].bitCondiTimeBlink1to0 : false;
          selectedItem.nodeProperties.bitCondiBlinkTimeValue1to0 = selectedNode.annotations[0].bitCondiBlinkTimeValue1to0 ? selectedNode.annotations[0].bitCondiBlinkTimeValue1to0 : 0;
          selectedItem.nodeProperties.bitCondiConBlink0to1 = selectedNode.annotations[0].bitCondiConBlink0to1 ? selectedNode.annotations[0].bitCondiConBlink0to1 : false;
          selectedItem.nodeProperties.bitCondiTimeBlink0to1 = selectedNode.annotations[0].bitCondiTimeBlink0to1 ? selectedNode.annotations[0].bitCondiTimeBlink0to1 : false;
          selectedItem.nodeProperties.bitCondiBlinkTimeValue0to1 = selectedNode.annotations[0].bitCondiBlinkTimeValue0to1 ? selectedNode.annotations[0].bitCondiBlinkTimeValue0to1 : 0;
          selectedItem.nodeProperties.bitShapeColor1to0 = selectedNode.annotations[0].bitShapeColor1to0 ? selectedNode.annotations[0].bitShapeColor1to0 : 'transparent';
          selectedItem.nodeProperties.bitShapeColor0to1 = selectedNode.annotations[0].bitShapeColor0to1 ? selectedNode.annotations[0].bitShapeColor0to1 : 'transparent';
          selectedItem.nodeProperties.bitAudio1to0 = selectedNode.annotations[0].bitAudio1to0 ? selectedNode.annotations[0].bitAudio1to0 : null;
          selectedItem.nodeProperties.bitAudio0to1 = selectedNode.annotations[0].bitAudio0to1 ? selectedNode.annotations[0].bitAudio0to1 : null;
          selectedItem.nodeProperties.bitTextFor1 = selectedNode.annotations[0].bitTextFor1 ? selectedNode.annotations[0].bitTextFor1 : null;
          selectedItem.nodeProperties.bitTextFor0 = selectedNode.annotations[0].bitTextFor0 ? selectedNode.annotations[0].bitTextFor0 : null;
          selectedItem.nodeProperties.bitTextColorFor0 = selectedNode.annotations[0].bitTextColorFor0 ? selectedNode.annotations[0].bitTextColorFor0 : 'transparent';
          selectedItem.nodeProperties.bitTextColorFor1 = selectedNode.annotations[0].bitTextColorFor1 ? selectedNode.annotations[0].bitTextColorFor1 : 'transparent';
          selectedItem.nodeProperties.bitTextFor1to0 = selectedNode.annotations[0].bitTextFor1to0 ? selectedNode.annotations[0].bitTextFor1to0 : null;
          selectedItem.nodeProperties.bitTextFor0to1 = selectedNode.annotations[0].bitTextFor0to1 ? selectedNode.annotations[0].bitTextFor0to1 : null;
          selectedItem.nodeProperties.bitImagefor1 = selectedNode.annotations[0].bitImagefor1 ? selectedNode.annotations[0].bitImagefor1 : null;
          selectedItem.nodeProperties.bitImagefor0 = selectedNode.annotations[0].bitImagefor0 ? selectedNode.annotations[0].bitImagefor0 : null;
          selectedItem.nodeProperties.bitImageFor1to0 = selectedNode.annotations[0].bitImageFor1to0 ? selectedNode.annotations[0].bitImageFor1to0 : null;
          selectedItem.nodeProperties.bitImageFor0to1 = selectedNode.annotations[0].bitImageFor0to1 ? selectedNode.annotations[0].bitImageFor0to1 : null;


          // dateTime

          selectedItem.nodeProperties.dateChannel = selectedNode.annotations[0].dateChannel ? selectedNode.annotations[0].dateChannel : null;
          selectedItem.nodeProperties.dateTimeFormat = selectedNode.annotations[0].dateTimeFormat ? selectedNode.annotations[0].dateTimeFormat : null;

        }



        const fileInput = document.getElementById('textAudioFile') as HTMLInputElement;
        if (selectedItem.nodeProperties.textAudioFileName) {
          fileInput.value = "";
          console.log("File Input Works", fileInput.value)
        }

      }, 10);

    });


    let toolbarTextStyle: any = document.getElementById("toolbarTextStyle");
    if (toolbarTextStyle) {
      toolbarTextStyle = toolbarTextStyle.ej2_instances[0];
    }
    if (toolbarTextStyle) {
      toolbarTextStyle.items[0].cssClass = text.bold
        ? "tb-item-start tb-item-selected"
        : "tb-item-start";
      toolbarTextStyle.items[1].cssClass = text.italic
        ? "tb-item-middle tb-item-selected"
        : "tb-item-middle";
      toolbarTextStyle.items[2].cssClass =
        text.textDecoration === "Underline"
          ? "tb-item-end tb-item-selected"
          : "tb-item-end";
    }
    this.updateTextAlign(text.textAlign);
    selectedItem.preventPropertyChange = false;
  }

  public updateTextAlign(textAlign: TextAlign): void {
    let toolbarTextSubAlignment: any = document.getElementById(
      "toolbarTextSubAlignment"
    );
    if (toolbarTextSubAlignment) {
      toolbarTextSubAlignment = toolbarTextSubAlignment.ej2_instances[0];
    }
    if (toolbarTextSubAlignment) {
      for (let i: number = 0; i < toolbarTextSubAlignment.items.length; i++) {
        toolbarTextSubAlignment.items[i].cssClass =
          toolbarTextSubAlignment.items[i].cssClass.replace(
            " tb-item-selected",
            ""
          );
      }
      let index: number =
        textAlign === "Left" ? 0 : textAlign === "Center" ? 1 : 2;
      toolbarTextSubAlignment.items[index].cssClass =
        toolbarTextSubAlignment.items[index].cssClass + " tb-item-selected";
    }
  }

  public updateHorVertAlign(
    horizontalAlignment: HorizontalAlignment,
    verticalAlignment: VerticalAlignment
  ): void {
    let toolbarHorVerAlignment: any = document.getElementById(
      "toolbarTextAlignment"
    );
    if (toolbarHorVerAlignment) {
      toolbarHorVerAlignment = toolbarHorVerAlignment.ej2_instances[0];
    }
    if (toolbarHorVerAlignment) {
      for (let i: number = 0; i < toolbarHorVerAlignment.items.length; i++) {
        toolbarHorVerAlignment.items[i].cssClass = toolbarHorVerAlignment.items[
          i
        ].cssClass.replace(" tb-item-selected", "");
      }
      let index: number =
        horizontalAlignment === "Right"
          ? 0
          : horizontalAlignment === "Center"
            ? 1
            : 2;
      toolbarHorVerAlignment.items[index].cssClass =
        toolbarHorVerAlignment.items[index].cssClass + " tb-item-selected";
      index =
        verticalAlignment === "Bottom"
          ? 3
          : verticalAlignment === "Center"
            ? 4
            : 5;
      toolbarHorVerAlignment.items[index].cssClass =
        toolbarHorVerAlignment.items[index].cssClass + " tb-item-selected";
    }
  }

  public bindConnectorProperties(
    connector: ConnectorModel,
    selectedItem: SelectorViewModel
  ): void {
    selectedItem.preventPropertyChange = true;
    selectedItem.connectorProperties.lineColor = this.getHexColor(
      connector.style.strokeColor
    );
    selectedItem.connectorProperties.lineStyle = connector.style.strokeDashArray
      ? connector.style.strokeDashArray
      : "None";
    selectedItem.connectorProperties.lineType = connector.type;
    selectedItem.connectorProperties.lineWidth = connector.style.strokeWidth;
    selectedItem.connectorProperties.sourceType =
      connector.sourceDecorator.shape;
    selectedItem.connectorProperties.targetType =
      connector.targetDecorator.shape;
    selectedItem.connectorProperties.opacity = connector.style.opacity * 100;
    selectedItem.connectorProperties.opacityText =
      selectedItem.connectorProperties.opacity + "%";
    selectedItem.connectorProperties.lineJumpSize = connector.bridgeSpace;
    selectedItem.connectorProperties.lineJump =
      connector.constraints & ConnectorConstraints.Bridging ? true : false;
    if (selectedItem.connectorProperties.lineJump) {
      document.getElementById("lineJumpSizeDiv").style.display = "";
    } else {
      document.getElementById("lineJumpSizeDiv").style.display = "none";
    }
    selectedItem.connectorProperties.targetSize =
      connector.targetDecorator.width;
    selectedItem.connectorProperties.sourceSize =
      connector.sourceDecorator.width;
    selectedItem.preventPropertyChange = false;
  }

  public getHexColor(colorStr: string): string {
    let a: HTMLDivElement = document.createElement("div");
    a.style.color = colorStr;
    let colors: number[] = window
      .getComputedStyle(document.body.appendChild(a))
      .color.match(/\d+/g)
      .map((a: string): number => {
        return parseInt(a, 10);
      });
    document.body.removeChild(a);
    return colors.length >= 3
      ? "#" +
      ((1 << 24) + (colors[0] << 16) + (colors[1] << 8) + colors[2])
        .toString(16)
        .substr(1)
      : "";
  }

  public getOffset(position: string): PointModel {
    switch (position.toLowerCase()) {
      case "topleft":
        return { x: 0, y: 0 };
      case "topcenter":
        return { x: 0.5, y: 0 };
      case "topright":
        return { x: 1, y: 0 };
      case "middleleft":
        return { x: 0, y: 0.5 };
      default:
        return { x: 0.5, y: 0.5 };
      case "middleright":
        return { x: 1, y: 0.5 };
      case "bottomleft":
        return { x: 0, y: 1 };
      case "bottomcenter":
        return { x: 0.5, y: 1 };
      case "bottomright":
        return { x: 1, y: 1 };
    }
  }

  public getPosition(offset: PointModel): string {
    if (offset.x === 0 && offset.y === 0) {
      return "TopLeft";
    } else if (offset.x === 0.5 && offset.y === 0) {
      return "TopCenter";
    } else if (offset.x === 1 && offset.y === 0) {
      return "TopRight";
    } else if (offset.x === 0 && offset.y === 0.5) {
      return "MiddleLeft";
    } else if (offset.x === 1 && offset.y === 0.5) {
      return "MiddleRight";
    } else if (offset.x === 0 && offset.y === 1) {
      return "BottomLeft";
    } else if (offset.x === 0.5 && offset.y === 1) {
      return "BottomCenter";
    } else if (offset.x === 1 && offset.y === 1) {
      return "BottomRight";
    } else {
      return "Center";
    }
  }

  public hideElements(
    elementType: string,
    diagram?: Diagram,
    diagramType?: string
  ): void {
    let diagramContainer: HTMLElement = document.getElementsByClassName(
      "diagrambuilder-container"
    )[0] as HTMLElement;
    if (diagramContainer.classList.contains(elementType)) {
      if (
        !(
          diagramType === "mindmap-diagram" ||
          diagramType === "orgchart-diagram"
        )
      ) {
        diagramContainer.classList.remove(elementType);
      }
    } else {
      diagramContainer.classList.add(elementType);
    }
    if (diagram) {
      diagram.updateViewPort();
    }
  }

  public hideAllElements(
    elementType: string,
    diagram?: Diagram,
  ): void {
    let diagramContainer: HTMLElement = document.getElementsByClassName(
      "diagrambuilder-container"
    )[0] as HTMLElement;
    const elementTypeAlreadyAdded = diagramContainer.classList.contains(elementType);
    if (!elementTypeAlreadyAdded) {
      diagramContainer.classList.add(elementType);

    }

    if (diagram) {
      diagram.updateViewPort();
    }
  }
  public objectTypeChange(objectType: string): void {
    document.getElementById("diagramPropertyContainer").style.display = "none";
    document.getElementById("nodePropertyContainer").style.display = "none";
    document.getElementById("textPropertyContainer").style.display = "none";
    document.getElementById("connectorPropertyContainer").style.display =
      "none";
    switch (objectType) {
      case "diagram":
        document.getElementById("diagramPropertyContainer").style.display = "";
        break;
      case "node":
        document.getElementById("nodePropertyContainer").style.display = "";
        break;
      case "connector":
        document.getElementById("connectorPropertyContainer").style.display =
          "";
        break;
    }
  }

  public getDefaultDiagramTemplates1(
    selectedItem: SelectorViewModel,
    tempCount?: number,
    backgroundColor?: string,
    parentId?: string
  ): void {
    tempCount = tempCount ? tempCount : 4;
    backgroundColor = backgroundColor ? backgroundColor : "red";
    parentId = parentId ? parentId : "Flow Chart";
    let parentDiv: HTMLDivElement = document.getElementById(
      "diagramTemplateDiv1"
    ) as HTMLDivElement;
    parentDiv = parentDiv.cloneNode(true) as HTMLDivElement;
    parentDiv.id = "";
    parentDiv.style.display = "";

    let parentElements: HTMLCollectionOf<HTMLDivElement> =
      parentDiv.getElementsByClassName(
        "db-diagram-template-parent-text"
      ) as HTMLCollectionOf<HTMLDivElement>;

    for (let i: number = 0; i < parentElements.length; i++) {
      if (parentElements[i].children[0].innerHTML.trim() === parentId) {
        parentElements[i].classList.add("active");
      }
      parentElements[i].onclick = this.showDiagramTemplates.bind(
        this,
        selectedItem
      );
    }

    let diagramTemplatesDiv: HTMLDivElement = parentDiv.getElementsByClassName(
      "diagramTemplates"
    )[0] as HTMLDivElement;
    diagramTemplatesDiv.appendChild(
      this.generateDiagramTemplates(
        tempCount,
        backgroundColor,
        parentId,
        selectedItem
      )
    );
    this.tempDialog.content = parentDiv.outerHTML;
    this.triggerTemplateEvent(selectedItem);
  }

  public generateDiagramTemplates(
    tempCount: number,
    backgroundColor: string,
    parentId: string,
    selectedItem: SelectorViewModel
  ): HTMLDivElement {
    let parentTemplateDiv: HTMLDivElement = document.createElement("div");
    parentTemplateDiv.classList.add("class", "db-parent-diagram-template");

    let divElement: HTMLDivElement = document.getElementById(
      "diagramTemplateDiv"
    ) as HTMLDivElement;
    for (let i: number = 0; i < tempCount; i++) {
      let cloneTemplateDiv: HTMLDivElement = divElement.cloneNode(
        true
      ) as HTMLDivElement;
      cloneTemplateDiv.style.display = "";
      cloneTemplateDiv.id = "";
      let imageDiv: HTMLDivElement = cloneTemplateDiv
        .children[0] as HTMLDivElement;
      imageDiv.setAttribute(
        "id",
        parentId.replace(" ", "").toLowerCase() + "_child" + i
      );
      imageDiv.onclick = this.generateDiagram.bind(this, selectedItem);
      let diagramType: { [key: string]: string } = this.getImageSource(
        parentId,
        i
      );
      (imageDiv.children[0] as HTMLDivElement).style.backgroundImage =
        "url(" + diagramType.source + ")";
      if (diagramType.type) {
        if (diagramType.type === "svg_blank") {
          (imageDiv.children[0] as HTMLDivElement).className =
            "db-diagram-template-svg-blank-image";
        } else {
          (imageDiv.children[0] as HTMLDivElement).className =
            "db-diagram-template-svg-image";
        }
      } else {
        (imageDiv.children[0] as HTMLDivElement).className =
          "db-diagram-template-image";
      }
      cloneTemplateDiv.children[1].children[0].innerHTML = diagramType.name;
      parentTemplateDiv.appendChild(cloneTemplateDiv);
    }
    return parentTemplateDiv;
  }

  public triggerTemplateEvent(selectedItem: SelectorViewModel): void {
    let parentElements: HTMLCollectionOf<HTMLDivElement> =
      document.getElementsByClassName(
        "db-diagram-template-parent-text"
      ) as HTMLCollectionOf<HTMLDivElement>;
    for (let i: number = 0; i < parentElements.length; i++) {
      parentElements[i].onclick = this.showDiagramTemplates.bind(
        this,
        selectedItem
      );
    }

    let parentElements1: HTMLCollectionOf<HTMLDivElement> =
      document.getElementsByClassName(
        "db-diagram-template-image-div"
      ) as HTMLCollectionOf<HTMLDivElement>;
    for (let i: number = 0; i < parentElements1.length; i++) {
      parentElements1[i].onclick = this.generateDiagram.bind(
        this,
        selectedItem
      );
    }
  }

  public flowChartImage: { [key: string]: string }[] = [
    {
      source: "./assets/dbstyle/common_images/blank_diagram.svg",
      name: "Blank Diagram",
      type: "svg_blank",
    },
    {
      source: "./assets/dbstyle/flowchart_Images/Credit_Card_Processing.svg",
      name: "Credit Card Processing",
      type: "svg_image",
    },
    {
      source: "./assets/dbstyle/flowchart_Images/Bank_Teller_Flow.svg",
      name: "Banking Teller Process Flow",
      type: "svg_image",
    },
    {
      source: "./assets/dbstyle/flowchart_Images/Developer_Workflow.SVG",
      name: 'Agile"s Developer Workflow',
      type: "svg_image",
    },
  ];

  public mindMapImage: { [key: string]: string }[] = [
    {
      source: "./assets/dbstyle/common_images/blank_diagram_mind.svg",
      name: "Blank Diagram",
      type: "svg_image",
    },
    {
      source: "./assets/dbstyle/mindmap_images/BusinessPlanning.SVG",
      name: "Business Planning",
      type: "svg_image",
    },
    {
      source: "./assets/dbstyle/mindmap_images/TQM.SVG",
      name: "Quality Management",
      type: "svg_image",
    },
    {
      source: "./assets/dbstyle/mindmap_images/SoftwareLifeCycle.SVG",
      name: "Software Life Cycle",
      type: "svg_image",
    },
  ];

  public orgChartImage: { [key: string]: string }[] = [
    {
      source: "./assets/dbstyle/common_images/blank_diagram_org.svg",
      name: "Blank Diagram",
      type: "svg_image",
    },
    {
      source: "./assets/dbstyle/orgchart_images/OrgRenderingStyle_1.svg",
      name: "Org Template Style - 1",
      type: "svg_image",
    },
    {
      source: "./assets/dbstyle/orgchart_images/OrgRenderingStyle_2.svg",
      name: "Org Template Style - 2",
      type: "svg_image",
    },
    {
      source: "./assets/dbstyle/orgchart_images/OrgRenderingStyle_3.svg",
      name: "Org Template Style - 3",
      type: "svg_image",
    },
  ];

  public bpmnImage: { [key: string]: string }[] = [
    {
      source: "./assets/dbstyle/common_images/blank_diagram.svg",
      name: "Blank Diagram",
      type: "svg_blank",
    },
    {
      source: "./assets/dbstyle/bpmn_images/Template1.png",
      name: "BPMN Diagram 1",
    },
    {
      source: "./assets/dbstyle/bpmn_images/Template1.png",
      name: "BPMN Diagram 2",
    },
    {
      source: "./assets/dbstyle/bpmn_images/Template1.png",
      name: "BPMN Diagram 3",
    },
  ];

  public getImageSource(
    diagramType: string,
    index: number
  ): { [key: string]: string } {
    switch (diagramType) {
      case "Flow Chart":
        return this.flowChartImage[index];
      case "Mind Map":
        return this.mindMapImage[index];
      case "Org Chart":
        return this.orgChartImage[index];
      default:
        return this.bpmnImage[index];
    }
  }

  public readTextFile(file: string, selectedItem: SelectorViewModel): void {
    (
      document.getElementsByClassName("sb-content-overlay")[0] as HTMLDivElement
    ).style.display = "";
    let ajax: Ajax = new Ajax(file, "GET", true);
    ajax.send().then();
    let context: any = this;
    ajax.onSuccess = (data: string): void => {
      selectedItem.preventSelectionChange = true;
      selectedItem.isTemplateLoad = true;
      this.page.loadPage(data);
      this.page.loadDiagramSettings();
      selectedItem.isTemplateLoad = false;
      if (selectedItem.diagramType === "MindMap") {
        let rootNode: Node = MindMapUtilityMethods.getNode(
          selectedItem.selectedDiagram.nodes,
          "rootNode"
        );
        selectedItem.utilityMethods.bindMindMapProperties(
          rootNode,
          selectedItem
        );
      }
      if (selectedItem.diagramType === "OrgChart") {
        selectedItem.selectedDiagram.layout.getLayoutInfo =
          OrgChartUtilityMethods.getLayoutInfo.bind(OrgChartUtilityMethods);
        selectedItem.selectedDiagram.selectedItems.userHandles =
          OrgChartUtilityMethods.handle;
        selectedItem.selectedDiagram.selectedItems.constraints =
          SelectorConstraints.UserHandle;
        selectedItem.selectedDiagram.dataBind();
      }
      selectedItem.preventSelectionChange = false;
      (
        document.getElementsByClassName(
          "sb-content-overlay"
        )[0] as HTMLDivElement
      ).style.display = "none";
    };
    ajax.onFailure = (data: string): void => {
      (
        document.getElementsByClassName(
          "sb-content-overlay"
        )[0] as HTMLDivElement
      ).style.display = "none";
    };
    ajax.onError = (evt: Event): object => {
      (
        document.getElementsByClassName(
          "sb-content-overlay"
        )[0] as HTMLDivElement
      ).style.display = "none";
      return null;
    };
  }

  public generateDiagram(
    selectedItem: SelectorViewModel,
    evt: MouseEvent
  ): void {
    let diagramContainer: HTMLElement = document.getElementsByClassName(
      "diagrambuilder-container"
    )[0] as HTMLElement;
    let target: HTMLDivElement = evt.target as HTMLDivElement;
    if (target.id.startsWith("mindmap")) {
      selectedItem.diagramType = "MindMap";
      MindMapUtilityMethods.selectedItem = selectedItem;
      let mindMapObject: MindMap = new MindMap(selectedItem);
      if (target.id === "mindmap_child0") {
        mindMapObject.createMindMap(true);
        MindMapUtilityMethods.templateType = "template1";
      } else if (target.id === "mindmap_child1") {
        mindMapObject.createMindMap(false);
        this.readTextFile(
          "./assets/dbstyle/mindmap_images/BusinessPlanning.json",
          selectedItem
        );
        MindMapUtilityMethods.templateType = "template1";
      } else if (target.id === "mindmap_child2") {
        mindMapObject.createMindMap(false);
        this.readTextFile(
          "./assets/dbstyle/mindmap_images/TQM.json",
          selectedItem
        );
        MindMapUtilityMethods.templateType = "template2";
      } else if (target.id === "mindmap_child3") {
        mindMapObject.createMindMap(false);
        this.readTextFile(
          "./assets/dbstyle/mindmap_images/SoftwareDevelopmentLifeCycle.json",
          selectedItem
        );
        MindMapUtilityMethods.templateType = "template1";
      }
      this.hideMenuItems();
      diagramContainer.classList.add("custom-diagram");
    } else if (target.id.startsWith("orgchart")) {
      selectedItem.diagramType = "OrgChart";
      OrgChartUtilityMethods.selectedItem = selectedItem;
      let orgChartObject: OrgChartData = new OrgChartData(selectedItem);
      if (target.id === "orgchart_child0") {
        orgChartObject.createOrgChart(true);
      } else {
        OrgChartUtilityMethods.subTreeOrientation = "Horizontal";
        OrgChartUtilityMethods.subTreeAlignments = "Center";
        if (target.id === "orgchart_child1") {
          orgChartObject.createOrgChart(false);
          this.readTextFile(
            "./assets/dbstyle/orgchart_images/OrgTemplateStyle1.json",
            selectedItem
          );
        } else if (target.id === "orgchart_child2") {
          orgChartObject.createOrgChart(false);
          this.readTextFile(
            "./assets/dbstyle/orgchart_images/OrgTemplateStyle2.json",
            selectedItem
          );
        } else if (target.id === "orgchart_child3") {
          orgChartObject.createOrgChart(false);
          this.readTextFile(
            "./assets/dbstyle/orgchart_images/OrgTemplateStyle3.json",
            selectedItem
          );
        }
      }
      this.hideMenuItems();
      diagramContainer.classList.add("custom-diagram");
    } else if (target.id.startsWith("flowchart")) {
      if (target.id === "flowchart_child0") {
        selectedItem.selectedDiagram.clear();
      } else if (target.id === "flowchart_child1") {
        this.readTextFile(
          "./assets/dbstyle/flowchart_Images/CreditCardFlow.json",
          selectedItem
        );
      } else if (target.id === "flowchart_child2") {
        this.readTextFile(
          "./assets/dbstyle/flowchart_Images/BankingTellerProcess.json",
          selectedItem
        );
      } else if (target.id === "flowchart_child3") {
        this.readTextFile(
          "./assets/dbstyle/flowchart_Images/Developer_Workflow.json",
          selectedItem
        );
      }
      selectedItem.diagramType = "GeneralDiagram";
      diagramContainer.classList.add("general-diagram");
    } else {
      selectedItem.selectedDiagram.clear();
      selectedItem.diagramType = "GeneralDiagram";
      diagramContainer.classList.add("general-diagram");
    }
    let diagramName: string =
      target.parentElement.children[1].children[0].innerHTML;
    if (diagramName !== "Blank Diagram") {
      document.getElementById("diagramName").innerHTML = diagramName;
    }
    this.tempDialog.hide();
  }

  private hideMenuItems(): void {
    let btnWindow: any = document.getElementById("btnWindowMenu");
    btnWindow.ej2_instances[0].items[1].iconCss = "";

    let btnView: any = document.getElementById("btnViewMenu");
    btnView.ej2_instances[0].items[7].iconCss = "";
  }
  public currentDiagramVisibility(
    diagramname: string,
    selectedItem: SelectorViewModel
  ): void {
    if (
      diagramname === "mindmap-diagram" ||
      diagramname === "orgchart-diagram"
    ) {
      selectedItem.utilityMethods.hideElements(
        "hide-palette",
        null,
        diagramname
      );

      let diagramContainer: HTMLDivElement = document.getElementsByClassName(
        "db-current-diagram-container"
      )[0] as HTMLDivElement;
      diagramContainer.classList.add(diagramname);

      let propertyContainer: HTMLDivElement = document.getElementsByClassName(
        "db-property-editor-container"
      )[0] as HTMLDivElement;
      if (diagramname === "mindmap-diagram") {
        propertyContainer.classList.remove("orgchart-diagram");
      } else {
        propertyContainer.classList.remove("mindmap-diagram");
      }
      propertyContainer.classList.add(diagramname);
    }
  }
  public showDiagramTemplates(
    selectedItem: SelectorViewModel,
    evt: MouseEvent
  ): void {
    let target: HTMLDivElement = evt.target as HTMLDivElement;
    if (target.tagName.toLowerCase() === "span") {
      target = target.parentElement as HTMLDivElement;
    }
    switch (target.children[0].innerHTML.trim()) {
      case "Flow Chart":
        this.getDefaultDiagramTemplates1(selectedItem, 4, "red", "Flow Chart");
        break;
      case "Mind Map":
        this.getDefaultDiagramTemplates1(selectedItem, 4, "blue", "Mind Map");
        break;
      case "Org Chart":
        this.getDefaultDiagramTemplates1(
          selectedItem,
          4,
          "orange",
          "Org Chart"
        );
        break;
      case "BPMN":
        this.getDefaultDiagramTemplates1(selectedItem, 4, "brown", "BPMN");
        break;
    }
  }

  public enableToolbarItems(selectedItems: Object[]): void {
    let toolbarContainer: HTMLDivElement = document.getElementsByClassName(
      "db-toolbar-container"
    )[0] as HTMLDivElement;
    let toolbarClassName: string = "db-toolbar-container";
    if (toolbarContainer.classList.contains("db-undo")) {
      toolbarClassName += " db-undo";
    }
    if (toolbarContainer.classList.contains("db-redo")) {
      toolbarClassName += " db-redo";
    }
    toolbarContainer.className = toolbarClassName;
    if (selectedItems.length === 1) {
      toolbarContainer.className = toolbarContainer.className + " db-select";
      if (selectedItems[0] instanceof Node) {
        if ((selectedItems[0] as Node).children) {
          if ((selectedItems[0] as Node).children.length > 2) {
            toolbarContainer.className =
              toolbarContainer.className +
              " db-select db-double db-multiple db-node db-group";
          } else {
            toolbarContainer.className =
              toolbarContainer.className +
              " db-select db-double db-node db-group";
          }
        } else {
          toolbarContainer.className =
            toolbarContainer.className + " db-select db-node";
        }
      }
    } else if (selectedItems.length === 2) {
      toolbarContainer.className =
        toolbarContainer.className + " db-select db-double";
    } else if (selectedItems.length > 2) {
      toolbarContainer.className =
        toolbarContainer.className + " db-select db-double db-multiple";
    }
    if (selectedItems.length > 1) {
      let isNodeExist: boolean = false;
      for (let i: number = 0; i < selectedItems.length; i++) {
        if (selectedItems[i] instanceof Node) {
          toolbarContainer.className =
            toolbarContainer.className + " db-select db-node";
          break;
        }
      }
    }
  }

  public enableMenuItems(
    itemText: string,
    selectedItem: SelectorViewModel
  ): boolean {
    let selectedItems: Object[] =
      selectedItem.selectedDiagram.selectedItems.nodes;
    selectedItems = selectedItems.concat(
      selectedItem.selectedDiagram.selectedItems.connectors
    );
    if (itemText) {
      let commandType: string = itemText.replace(/[' ']/g, "");
      if (
        selectedItems.length === 0 ||
        selectedItem.diagramType !== "GeneralDiagram"
      ) {
        switch (commandType.toLowerCase()) {
          case "edittooltip":
            let disable: boolean = false;
            if (!(selectedItems.length === 1)) {
              disable = true;
            }
            return disable;
          case "cut":
            return true;
          case "copy":
            return true;
          case "delete":
            return true;
          case "duplicate":
            return true;
        }
      }
      if (selectedItems.length > 1) {
        switch (commandType.toLowerCase()) {
          case "edittooltip":
            return true;
        }
      }
      if (selectedItem.pasteData.length === 0 && itemText === "Paste") {
        return true;
      }
      if (
        itemText === "Undo" &&
        selectedItem.selectedDiagram.historyManager.undoStack.length === 0
      ) {
        return true;
      }
      if (
        itemText === "Redo" &&
        selectedItem.selectedDiagram.historyManager.redoStack.length === 0
      ) {
        return true;
      }
      if (itemText === "Select All") {
        if (
          selectedItem.diagramType !== "GeneralDiagram" ||
          (selectedItem.selectedDiagram.nodes.length === 0 &&
            selectedItem.selectedDiagram.connectors.length === 0)
        ) {
          return true;
        }
      }
      if (selectedItem.diagramType !== "GeneralDiagram") {
        if (
          itemText === "Themes" ||
          itemText === "Paste" ||
          itemText === "Show Rulers" ||
          itemText === "Show Guides" ||
          itemText === "Show Grid" ||
          itemText === "Snap To Grid" ||
          itemText === "Show Stencil"
        ) {
          return true;
        }
      }
    }
    return false;
  }

  public enableArrangeMenuItems(selectedItem: SelectorViewModel): void {
    let contextInstance: any = document.getElementById("arrangeContextMenu");
    let contextMenu: ContextMenu = contextInstance
      .ej2_instances[0] as ContextMenu;
    let selectedItems: Object[] =
      selectedItem.selectedDiagram.selectedItems.nodes;
    selectedItems = selectedItems.concat(
      selectedItem.selectedDiagram.selectedItems.connectors
    );
    for (let i: number = 0; i < contextMenu.items.length; i++) {
      contextMenu.enableItems(
        [(contextMenu.items[i] as MenuItemModel).text],
        false
      );
    }
    if (selectedItem.diagramType === "GeneralDiagram") {
      if (selectedItems.length > 1) {
        contextMenu.enableItems(
          [
            "Align Objects",
            "Distribute Objects",
            "Match Size",
            "Lock",
            "Unlock",
            "Group",
          ],
          true
        );
      } else if (selectedItems.length === 1) {
        contextMenu.enableItems([
          "Send To Back",
          "Bring To Front",
          "Send Backward",
          "Bring Forward",
        ]);
        let object: Object = selectedItems[0];
        if (object instanceof Node) {
          if (object.children && object.children.length > 0) {
            contextMenu.enableItems(["Ungroup"]);
          }
          if (object.constraints & NodeConstraints.Drag) {
            contextMenu.enableItems(["Lock"], true);
          } else {
            contextMenu.enableItems(["Unlock"], true);
          }
        }
      }
    }
  }

  public fillColorCode: string[] = [
    "#C4F2E8",
    "#F7E0B3",
    "#E5FEE4",
    "#E9D4F1",
    "#D4EFED",
    "#DEE2FF",
  ];

  public borderColorCode: string[] = [
    "#8BC1B7",
    "#E2C180",
    "#ACCBAA",
    "#D1AFDF",
    "#90C8C2",
    "#BBBFD6",
  ];

  public getPaperSize(paperName: string): PaperSize {
    let paperSize: PaperSize = new PaperSize();
    switch (paperName) {
      case "Letter":
        paperSize.pageWidth = 816;
        paperSize.pageHeight = 1056;
        break;
      case "Legal":
        paperSize.pageWidth = 816;
        paperSize.pageHeight = 1344;
        break;
      case "Tabloid":
        paperSize.pageWidth = 1056;
        paperSize.pageHeight = 1632;
        break;
      case "A3":
        paperSize.pageWidth = 1122;
        paperSize.pageHeight = 1587;
        break;
      case "A4":
        paperSize.pageWidth = 793;
        paperSize.pageHeight = 1122;
        break;
      case "A5":
        paperSize.pageWidth = 559;
        paperSize.pageHeight = 793;
        break;
      case "A6":
        paperSize.pageWidth = 396;
        paperSize.pageHeight = 559;
        break;
    }
    return paperSize;
  }

  public removeChild(selectedItem: SelectorViewModel): void {
    let diagram: Diagram = selectedItem.selectedDiagram;
    if (diagram.selectedItems.nodes.length > 0) {
      selectedItem.preventPropertyChange = true;
      diagram.historyManager.startGroupAction();
      this.removeSubChild(diagram.selectedItems.nodes[0] as Node, selectedItem);
      diagram.historyManager.endGroupAction();
      diagram.doLayout();
      selectedItem.preventPropertyChange = false;
    }
    selectedItem.isModified = true;
  }

  private removeSubChild(node: Node, selectedItem: SelectorViewModel): void {
    let diagram: Diagram = selectedItem.selectedDiagram;
    for (let i: number = node.outEdges.length - 1; i >= 0; i--) {
      let connector: Connector = MindMapUtilityMethods.getConnector(
        diagram.connectors,
        node.outEdges[i]
      );
      let childNode: Node = MindMapUtilityMethods.getNode(
        diagram.nodes,
        connector.targetID
      );
      if (childNode != null && childNode.outEdges.length > 0) {
        this.removeSubChild(childNode, selectedItem);
      } else {
        diagram.remove(childNode);
      }
    }
    for (let j: number = node.inEdges.length - 1; j >= 0; j--) {
      let connector: Connector = MindMapUtilityMethods.getConnector(
        diagram.connectors,
        node.inEdges[j]
      );
      let childNode: Node = MindMapUtilityMethods.getNode(
        diagram.nodes,
        connector.sourceID
      );
      let index: number = childNode.outEdges.indexOf(connector.id);
      if (childNode.outEdges.length > 1 && index === 0) {
        index = childNode.outEdges.length;
      }
      if (index > 0) {
        let node1: string = childNode.outEdges[index - 1] as string;
        let connector1: any = diagram.getObject(node1);
        let node2: Node = MindMapUtilityMethods.getNode(
          diagram.nodes,
          connector1.targetID
        );
        diagram.select([node2]);
      } else {
        diagram.select([childNode]);
      }
    }
    diagram.remove(node);
  }

  public cutLayout(selectedItem: SelectorViewModel): void {
    let diagram: Diagram = selectedItem.selectedDiagram;
    if (diagram.selectedItems.nodes.length) {
      selectedItem.utilityMethods.copyLayout(selectedItem);
      selectedItem.utilityMethods.removeChild(selectedItem);
      diagram.doLayout();
      selectedItem.isModified = true;
    }
  }
  public copyLayout(selectedItem: SelectorViewModel): void {
    let diagram: Diagram = selectedItem.selectedDiagram;
    let selectedNode: Node = diagram.selectedItems.nodes[0] as Node;
    if (selectedNode.id !== "rootNode") {
      selectedItem.pasteData =
        CommonKeyboardCommands.cloneSelectedItemswithChildElements();
    }
  }

  public pasteLayout(selectedItem: SelectorViewModel): void {
    selectedItem.isCopyLayoutElement = true;
    if (selectedItem.diagramType === "MindMap") {
      MindMapUtilityMethods.mindmapPaste();
    } else if (selectedItem.diagramType === "OrgChart") {
      OrgChartUtilityMethods.orgchartPaste();
    }
    selectedItem.isCopyLayoutElement = false;
    selectedItem.isModified = true;
  }

  public undoRedoLayout(
    isundo: boolean,
    selectedItem: SelectorViewModel
  ): void {
    let diagram: Diagram = selectedItem.selectedDiagram;
    if (isundo) {
      diagram.undo();
    } else {
      diagram.redo();
    }
    if (diagram.selectedItems.nodes.length === 0) {
      this.updateSectionforNode(selectedItem);
    }
    diagram.doLayout();
    selectedItem.isModified = true;
  }

  public updateSectionforNode(selectedItem: SelectorViewModel): void {
    let diagram: Diagram = selectedItem.selectedDiagram;
    for (let i: number = 0; i < diagram.nodes.length; i++) {
      let newselection: Node = diagram.nodes[i] as Node;
      if (newselection.id === "rootNode") {
        selectedItem.preventPropertyChange = true;
        diagram.select([newselection]);
        selectedItem.preventPropertyChange = false;
      }
    }
  }

  public updateLayout(
    selectedItem: SelectorViewModel,
    bindBindingFields?: boolean,
    imageField?: boolean
  ): void {
    for (
      let i: number = 0;
      i < selectedItem.selectedDiagram.nodes.length;
      i++
    ) {
      let node: Node = selectedItem.selectedDiagram.nodes[i] as Node;
      if (node.id !== "textNode") {
        let nodeInfo: any = node.addInfo as { [key: string]: Object };
        let keys: string[] = Object.keys(nodeInfo);
        let bindingFields: string[] = [];
        let additionalFields: string[] = [];
        let propName: string = "Name";
        if (nodeInfo[propName] && nodeInfo[propName].checked) {
          bindingFields.push(propName);
        }

        for (let i: number = 0; i < keys.length; i++) {
          let keyValue: any = nodeInfo[keys[i]];
          if (keyValue.type === "bindingField") {
            if (keyValue.checked) {
              if (bindBindingFields) {
                bindingFields.push(keys[i]);
              }
            } else {
              additionalFields.push(keys[i]);
            }
          }
        }

        selectedItem.selectedDiagram.removeLabels(node, node.annotations);
        propName = "Image URL";
        if (!imageField) {
          node.minWidth = 150;
          node.minHeight = 50;
          node.maxHeight = 50;
          selectedItem.selectedDiagram.dataBind();
          node.shape = { type: "Basic", shape: "Rectangle", cornerRadius: 5 };
          selectedItem.selectedDiagram.dataBind();
        } else if (imageField) {
          node.minWidth = 300;
          node.minHeight = 100;
          node.maxHeight = 100;
          selectedItem.selectedDiagram.dataBind();
          node.shape = {
            type: "Image",
            source:
              nodeInfo[propName] && nodeInfo[propName].value
                ? nodeInfo[propName].value.toString()
                : "./assets/dbstyle/orgchart_images/blank-male.jpg",
            align: "XMinYMin",
            scale: "Meet",
          };
          selectedItem.selectedDiagram.dataBind();
        }
        let annotations: ShapeAnnotationModel[] = [];
        let startY: number = 0.5 - (bindingFields.length - 1) / 10;
        for (let i: number = 0; i < bindingFields.length; i++) {
          let annotation1: ShapeAnnotationModel = {
            content: nodeInfo[bindingFields[i]].value.toString(),
            offset: { x: 0.5, y: startY },
          };
          if (node.shape && node.shape.type === "Image") {
            annotation1.offset.x = 0;
            annotation1.margin = { left: 110 };
            annotation1.horizontalAlignment = "Left";
          }
          if (i === 0) {
            annotation1.style = { fontSize: 14, bold: true };
          }
          startY += 0.2;
          annotations.push(annotation1);
        }
        if (annotations.length > 0) {
          selectedItem.selectedDiagram.addLabels(node, annotations);
        }
        let content: string = "";
        if (additionalFields.length > 0) {
          for (let i: number = 0; i < additionalFields.length; i++) {
            if (nodeInfo[additionalFields[i]].value) {
              content =
                content +
                additionalFields[i] +
                ":" +
                nodeInfo[additionalFields[i]].value +
                "\n";
            }
          }
        }
        if (content) {
          node.tooltip = {
            content: content,
            position: "BottomCenter",
            relativeMode: "Object",
          };
          node.constraints = NodeConstraints.Default | NodeConstraints.Tooltip;
        } else {
          node.constraints = NodeConstraints.Default & ~NodeConstraints.Tooltip;
        }
      }
    }
    selectedItem.selectedDiagram.dataBind();
    selectedItem.selectedDiagram.doLayout();
    selectedItem.isModified = true;
  }
}
