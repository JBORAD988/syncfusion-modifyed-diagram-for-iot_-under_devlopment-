/**
 * Selector Handler
 */
import {
  Diagram,
  NodeModel,
  Node,
  NodeConstraints,
  ConnectorModel,
  Connector,
  Segments,
  DecoratorShapes,
  ConnectorConstraints,
  TextStyleModel,
} from "@syncfusion/ej2-diagrams";
import { UtilityMethods } from "./utilitymethods";
import { CustomContextMenuItems } from "./customcontextmenuitems";
import { Input, Injectable, ViewChild } from "@angular/core";
import { isNullOrUndefined } from "@syncfusion/ej2-base";
import { MindMapUtilityMethods } from "./mindmap";
import { inputs } from "@syncfusion/ej2-angular-diagrams/src/diagram/diagram.component";
import { DropDownListComponent } from "@syncfusion/ej2-angular-dropdowns";

@Injectable()
export class NodeProperties {
  private m_offsetX: number = 0;
  public get offsetX(): number {
    return this.m_offsetX;
  }

  @Input()
  public set offsetX(offsetX: number) {
    if (this.m_offsetX !== offsetX) {
      this.m_offsetX = offsetX;
      this.triggerPropertyChange("offsetX", offsetX);
    }
  }

  private m_annotationText: any = {
    tagName: ''
  }

  public get textAnnotationsTagName(): string {
    return this.m_annotationText.tagName;
  }

  @Input() public set textAnnotationsTagName(tagName: string) {
    this.m_annotationText.tagName = tagName;
    this.triggerPropertyChange("tagName", this.m_annotationText.tagName);
  }


  private m_annotationBitText: any = {
    bitTagName: ''
  }

  public get bitTagName(): string {
    return this.m_annotationBitText.bitTagName;
  }

  @Input() public set bitTagName(bitTagName: string) {
    this.m_annotationBitText.bitTagName = bitTagName;
    this.triggerPropertyChange("bitTagName", this.m_annotationBitText.bitTagName);
  }

  private m_annotationTextChName: any = {
    textChName: ''
  }

  public get textAnalogChName(): string {
    return this.m_annotationTextChName.textChName;
  }

  @Input() public set textAnalogChName(tagName: string) {
    this.m_annotationTextChName.textChName = tagName;
    this.triggerPropertyChange("textChName", this.m_annotationTextChName.textChName);
  }


  private m_annotationTextbit1Color: any = {
    bit1Color: ''
  }

  public get bit1Color(): string {
    return this.m_annotationTextbit1Color.bit1Color;
  }

  @Input() public set bit1Color(bit1Color: string) {
    this.m_annotationTextbit1Color.bit1Color = bit1Color;
    this.triggerPropertyChange("bit1Color", this.m_annotationTextbit1Color.bit1Color);
  }

  private m_annotationTextbit0Color: any = {
    bit0Color: ''
  }

  public get bit0Color(): string {
    return this.m_annotationTextbit0Color.bit0Color;
  }

  @Input() public set bit0Color(bit0Color: string) {
    this.m_annotationTextbit0Color.bit0Color = bit0Color;
    this.triggerPropertyChange("bit0Color", this.m_annotationTextbit0Color.bit0Color);
  }



  private m_annotationTexthideOn1: any = {
    hideOn1: false
  }

  public get hideOn1(): boolean {
    return this.m_annotationTexthideOn1.hideOn1;
  }

  @Input() public set hideOn1(hideOn1: boolean) {
    this.m_annotationTexthideOn1.hideOn1 = hideOn1;
    this.triggerPropertyChange("hideOn1", this.m_annotationTexthideOn1.hideOn1);
  }


  private m_annotationTexthideOn0: any = {
    hideOn0: false
  }

  public get hideOn0(): boolean {
    return this.m_annotationTexthideOn0.hideOn0;
  }

  @Input() public set hideOn0(hideOn0: boolean) {
    this.m_annotationTexthideOn0.hideOn0 = hideOn0;
    this.triggerPropertyChange("hideOn0", this.m_annotationTexthideOn0.hideOn0);
  }



  private m_annotationBitTextChName: any = {
    bitTextChName: ''
  }

  public get bitTextChName(): string {
    return this.m_annotationBitTextChName.bitTextChName;
  }

  @Input() public set bitTextChName(bitTextChName: string) {
    this.m_annotationBitTextChName.bitTextChName = bitTextChName;
    this.triggerPropertyChange("bitTextChName", this.m_annotationBitTextChName.bitTextChName);
  }

  private m_textOperation: any = {
    textOperation: ''
  }

  public get textOperation(): string {
    return this.m_textOperation.textOperation;
  }

  private m_textAudioFile: any = {
    textAudioFile: ''
  }

  public get textAudioFile(): string {
    return this.m_textAudioFile.textAudioFile;
  }

  @Input() public set textAudioFile(textAudioFile: string) {
    this.m_textAudioFile.textAudioFile = textAudioFile;
    this.triggerPropertyChange("textAudioFile", this.m_textAudioFile.textAudioFile);
  }

  private m_textAudioFileName: any = {
    textAudioFileName: ''
  }

  public get textAudioFileName(): any {
    return this.m_textAudioFileName.textAudioFileName;
  }

  @Input() public set textAudioFileName(textAudioFileName: any) {
    this.m_textAudioFileName.textAudioFileName = textAudioFileName;
    this.triggerPropertyChange("textAudioFileName", this.m_textAudioFileName.textAudioFileName);
  }

  @Input() public set textOperation(textOperation: string) {
    this.m_textOperation.textOperation = textOperation;
    this.triggerPropertyChange("textOperation", this.m_textOperation.textOperation);
  }

  private m_textSetValue: any = {
    textSetValue: 0
  }

  public get textSetValue(): number {
    return this.m_textSetValue.textSetValue;
  }

  @Input() public set textSetValue(textSetValue: number) {
    this.m_textSetValue.textSetValue = textSetValue;
    this.triggerPropertyChange("textSetValue", this.m_textSetValue.textSetValue);
  }



  private m_textLowLimitCheckColor: any = {
    textLowLimitCheckColor: false
  }

  public get textLowLimitCheckColor(): boolean {
    return this.m_textLowLimitCheckColor.textLowLimitCheckColor;
  }

  @Input() public set textLowLimitCheckColor(textLowLimitCheckColor: boolean) {
    this.m_textLowLimitCheckColor.textLowLimitCheckColor = textLowLimitCheckColor;
    this.triggerPropertyChange("textLowLimitCheckColor", this.m_textLowLimitCheckColor.textLowLimitCheckColor);
  }


  private m_textHighLimitCheckColor: any = {
    textHighLimitCheckColor: false
  }

  public get textHighLimitCheckColor(): boolean {
    return this.m_textHighLimitCheckColor.textHighLimitCheckColor;
  }

  @Input() public set textHighLimitCheckColor(textHighLimitCheckColor: boolean) {
    this.m_textHighLimitCheckColor.textHighLimitCheckColor = textHighLimitCheckColor;
    this.triggerPropertyChange("textHighLimitCheckColor", this.m_textHighLimitCheckColor.textHighLimitCheckColor);
  }

  private m_textLowLimitCheckText: any = {
    textLowLimitCheckText: false
  }

  public get textLowLimitCheckText(): boolean {
    return this.m_textLowLimitCheckText.textLowLimitCheckText;
  }

  @Input() public set textLowLimitCheckText(textLowLimitCheckText: boolean) {
    this.m_textLowLimitCheckText.textLowLimitCheckText = textLowLimitCheckText;
    this.triggerPropertyChange("textLowLimitCheckText", this.m_textLowLimitCheckText.textLowLimitCheckText);
  }

  private m_textHighLimitCheckText: any = {
    textHighLimitCheckText: false
  }

  public get textHighLimitCheckText(): boolean {
    return this.m_textHighLimitCheckText.textHighLimitCheckText;
  }

  @Input() public set textHighLimitCheckText(textHighLimitCheckText: boolean) {
    this.m_textHighLimitCheckText.textHighLimitCheckText = textHighLimitCheckText;
    this.triggerPropertyChange("textHighLimitCheckText", this.m_textHighLimitCheckText.textHighLimitCheckText);
  }



  private m_textLowLimitCheckShape: any = {
    textLowLimitCheckShape: false
  }

  public get textLowLimitCheckShape(): boolean {
    return this.m_textLowLimitCheckShape.textLowLimitCheckShape;
  }

  @Input() public set textLowLimitCheckShape(textLowLimitCheckShape: boolean) {
    this.m_textLowLimitCheckShape.textLowLimitCheckShape = textLowLimitCheckShape;
    this.triggerPropertyChange("textLowLimitCheckShape", this.m_textLowLimitCheckShape.textLowLimitCheckShape);
  }



  private m_textHighLimitCheckShape: any = {
    textHighLimitCheckShape: false
  }

  public get textHighLimitCheckShape(): boolean {
    return this.m_textHighLimitCheckShape.textHighLimitCheckShape;
  }

  @Input() public set textHighLimitCheckShape(textHighLimitCheckShape: boolean) {
    this.m_textHighLimitCheckShape.textHighLimitCheckShape = textHighLimitCheckShape;
    this.triggerPropertyChange("textHighLimitCheckShape", this.m_textHighLimitCheckShape.textHighLimitCheckShape);
  }



  private m_textLowLimitCheckAudio: any = {
    textLowLimitCheckAudio: false
  }

  public get textLowLimitCheckAudio(): boolean {
    return this.m_textLowLimitCheckAudio.textLowLimitCheckAudio;
  }

  @Input() public set textLowLimitCheckAudio(textLowLimitCheckAudio: boolean) {
    this.m_textLowLimitCheckAudio.textLowLimitCheckAudio = textLowLimitCheckAudio;
    this.triggerPropertyChange("textLowLimitCheckAudio", this.m_textLowLimitCheckAudio.textLowLimitCheckAudio);
  }




  private m_textHighLimitCheckAudio: any = {
    textHighLimitCheckAudio: false
  }

  public get textHighLimitCheckAudio(): boolean {
    return this.m_textHighLimitCheckAudio.textHighLimitCheckAudio;
  }

  @Input() public set textHighLimitCheckAudio(textHighLimitCheckAudio: boolean) {
    this.m_textHighLimitCheckAudio.textHighLimitCheckAudio = textHighLimitCheckAudio;
    this.triggerPropertyChange("textHighLimitCheckAudio", this.m_textHighLimitCheckAudio.textHighLimitCheckAudio);
  }



  private m_textLowLimitColorValue: any = {
    textLowLimitColorValue: ''
  }

  public get textLowLimitColorValue(): string {
    return this.m_textLowLimitColorValue.textLowLimitColorValue;
  }

  @Input() public set textLowLimitColorValue(textLowLimitColorValue: string) {
    this.m_textLowLimitColorValue.textLowLimitColorValue = textLowLimitColorValue;
    this.triggerPropertyChange("textLowLimitColorValue", this.m_textLowLimitColorValue.textLowLimitColorValue);
  }



  private m_textHighLimitColorValue: any = {
    textHighLimitColorValue: ''
  }

  public get textHighLimitColorValue(): string {
    return this.m_textHighLimitColorValue.textHighLimitColorValue;
  }

  @Input() public set textHighLimitColorValue(textHighLimitColorValue: string) {
    this.m_textHighLimitColorValue.textHighLimitColorValue = textHighLimitColorValue;
    this.triggerPropertyChange("textHighLimitColorValue", this.m_textHighLimitColorValue.textHighLimitColorValue);
  }

  private m_textLowLimitTextValue: any = {
    textLowLimitTextValue: ''
  }

  public get textLowLimitTextValue(): string {
    return this.m_textLowLimitTextValue.textLowLimitTextValue;
  }

  @Input() public set textLowLimitTextValue(textLowLimitTextValue: string) {
    this.m_textLowLimitTextValue.textLowLimitTextValue = textLowLimitTextValue;
    this.triggerPropertyChange("textLowLimitTextValue", this.m_textLowLimitTextValue.textLowLimitTextValue);
  }




  private m_textHighLimitTextValue: any = {
    textHighLimitTextValue: ''
  }

  public get textHighLimitTextValue(): string {
    return this.m_textHighLimitTextValue.textHighLimitTextValue;
  }

  @Input() public set textHighLimitTextValue(textHighLimitTextValue: string) {
    this.m_textHighLimitTextValue.textHighLimitTextValue = textHighLimitTextValue;
    this.triggerPropertyChange("textHighLimitTextValue", this.m_textHighLimitTextValue.textHighLimitTextValue);
  }

  private m_textLowLimitShapeValue: any = {
    textLowLimitShapeValue: ''
  }

  public get textLowLimitShapeValue(): string {
    return this.m_textLowLimitShapeValue.textLowLimitShapeValue;
  }

  @Input() public set textLowLimitShapeValue(textLowLimitShapeValue: string) {
    this.m_textLowLimitShapeValue.textLowLimitShapeValue = textLowLimitShapeValue;
    this.triggerPropertyChange("textLowLimitShapeValue", this.m_textLowLimitShapeValue.textLowLimitShapeValue);
  }



  private m_textHighLimitShapeValue: any = {
    textLowLimitShapeValue: ''
  }

  public get textHighLimitShapeValue(): string {
    return this.m_textHighLimitShapeValue.textHighLimitShapeValue;
  }

  @Input() public set textHighLimitShapeValue(textHighLimitShapeValue: string) {
    this.m_textHighLimitShapeValue.textHighLimitShapeValue = textHighLimitShapeValue;
    this.triggerPropertyChange("textHighLimitShapeValue", this.m_textHighLimitShapeValue.textHighLimitShapeValue);
  }

  private m_textLowLimitAudioValue: any = {
    textLowLimitAudioValue: ''
  }

  public get textLowLimitAudioValue(): string {
    return this.m_textLowLimitAudioValue.textLowLimitAudioValue;
  }

  @Input() public set textLowLimitAudioValue(textLowLimitAudioValue: string) {
    this.m_textLowLimitAudioValue.textLowLimitAudioValue = textLowLimitAudioValue;
    this.triggerPropertyChange("textLowLimitAudioValue", this.m_textLowLimitAudioValue.textLowLimitAudioValue);
  }


  private m_textHighLimitAudioValue: any = {
    textLowLimitAudioValue: ''
  }

  public get textHighLimitAudioValue(): string {
    return this.m_textHighLimitAudioValue.textHighLimitAudioValue;
  }

  @Input() public set textHighLimitAudioValue(textHighLimitAudioValue: string) {
    this.m_textHighLimitAudioValue.textHighLimitAudioValue = textHighLimitAudioValue;
    this.triggerPropertyChange("textHighLimitAudioValue", this.m_textHighLimitAudioValue.textHighLimitAudioValue);
  }


  private m_textLowLimitValue: any = {
    textLowLimitValue: 0
  }

  public get textLowLimitValue(): number {
    return this.m_textLowLimitValue.textLowLimitValue;
  }

  @Input() public set textLowLimitValue(textLowLimitValue: number) {
    this.m_textLowLimitValue.textLowLimitValue = textLowLimitValue;
    this.triggerPropertyChange("textLowLimitValue", this.m_textLowLimitValue.textLowLimitValue);
  }





  private m_textHighLimitValue: any = {
    textHighLimitValue: 0
  }

  public get textHighLimitValue(): number {
    return this.m_textHighLimitValue.textHighLimitValue;
  }

  @Input() public set textHighLimitValue(textHighLimitValue: number) {
    this.m_textHighLimitValue.textHighLimitValue = textHighLimitValue;
    this.triggerPropertyChange("textHighLimitValue", this.m_textHighLimitValue.textHighLimitValue);
  }



  private m_textSetColor: any = {
    textSetColor: ''
  }

  public get textSetColor(): string {
    return this.m_textSetColor.textSetColor;
  }

  @Input() public set textSetColor(textSetColor: string) {
    this.m_textSetColor.textSetColor = textSetColor;
    this.triggerPropertyChange("textSetColor", this.m_textSetColor.textSetColor);
  }

  private m_textTooltip: any = {
    textTooltip: ''
  }

  public get textTooltip(): string {
    return this.m_textTooltip.textTooltip;
  }

  @Input() public set textTooltip(textTooltip: string) {
    this.m_textTooltip.textTooltip = textTooltip;
    this.triggerPropertyChange("textTooltip", this.m_textTooltip.textTooltip);
  }

  private m_textContinueBlink: any = {
    textContinueBlink: false
  }

  public get textContinueBlink(): boolean {
    return this.m_textContinueBlink.textContinueBlink;
  }

  @Input() public set textContinueBlink(textContinueBlink: boolean) {
    this.m_textContinueBlink.textContinueBlink = textContinueBlink;
    this.triggerPropertyChange("textContinueBlink", this.m_textContinueBlink.textContinueBlink);
  }

  private m_textCheckAudio: any = {
    textCheckAudio: false
  }

  public get textCheckAudio(): boolean {
    return this.m_textCheckAudio.textCheckAudio;
  }

  @Input() public set textCheckAudio(textCheckAudio: boolean) {
    this.m_textCheckAudio.textCheckAudio = textCheckAudio;
    this.triggerPropertyChange("textCheckAudio", this.m_textCheckAudio.textCheckAudio);
  }




  private m_textLowLimitBlinkContCheck: any = {
    textLowLimitBlinkContCheck: false
  }

  public get textLowLimitBlinkContCheck(): boolean {
    return this.m_textLowLimitBlinkContCheck.textLowLimitBlinkContCheck;
  }

  @Input() public set textLowLimitBlinkContCheck(textLowLimitBlinkContCheck: boolean) {
    this.m_textLowLimitBlinkContCheck.textLowLimitBlinkContCheck = textLowLimitBlinkContCheck;
    this.triggerPropertyChange("textLowLimitBlinkContCheck", this.m_textLowLimitBlinkContCheck.textLowLimitBlinkContCheck);
  }

  private m_textHighLimitBlinkContCheck: any = {
    textHighLimitBlinkContCheck: false
  }

  public get textHighLimitBlinkContCheck(): boolean {
    return this.m_textHighLimitBlinkContCheck.textHighLimitBlinkContCheck;
  }

  @Input() public set textHighLimitBlinkContCheck(textHighLimitBlinkContCheck: boolean) {
    this.m_textHighLimitBlinkContCheck.textHighLimitBlinkContCheck = textHighLimitBlinkContCheck;
    this.triggerPropertyChange("textHighLimitBlinkContCheck", this.m_textHighLimitBlinkContCheck.textHighLimitBlinkContCheck);
  }


  private m_textLowLimitBlinkTimeCheck: any = {
    textLowLimitBlinkTimeCheck: false
  }

  public get textLowLimitBlinkTimeCheck(): boolean {
    return this.m_textLowLimitBlinkTimeCheck.textLowLimitBlinkTimeCheck;
  }

  @Input() public set textLowLimitBlinkTimeCheck(textLowLimitBlinkTimeCheck: boolean) {
    this.m_textLowLimitBlinkTimeCheck.textLowLimitBlinkTimeCheck = textLowLimitBlinkTimeCheck;
    this.triggerPropertyChange("textLowLimitBlinkTimeCheck", this.m_textLowLimitBlinkTimeCheck.textLowLimitBlinkTimeCheck);
  }


  private m_textHighLimitBlinkTimeCheck: any = {
    textHighLimitBlinkTimeCheck: false
  }

  public get textHighLimitBlinkTimeCheck(): boolean {
    return this.m_textHighLimitBlinkTimeCheck.textHighLimitBlinkTimeCheck;
  }

  @Input() public set textHighLimitBlinkTimeCheck(textHighLimitBlinkTimeCheck: boolean) {
    this.m_textHighLimitBlinkTimeCheck.textHighLimitBlinkTimeCheck = textHighLimitBlinkTimeCheck;
    this.triggerPropertyChange("textHighLimitBlinkTimeCheck", this.m_textHighLimitBlinkTimeCheck.textHighLimitBlinkTimeCheck);
  }


  private m_isTextInvincible: any = {
    isTextInvincible: false
  }

  public get isTextInvincible(): boolean {
    return this.m_isTextInvincible.isTextInvincible;
  }

  @Input() public set isTextInvincible(isTextInvincible: boolean) {
    this.m_isTextInvincible.isTextInvincible = isTextInvincible;
    this.triggerPropertyChange("isInvincible", this.m_isTextInvincible.isTextInvincible);
  }


  private m_textLowLimitBlinkTime: any = {
    textLowLimitBlinkTime: 0
  }

  public get textLowLimitBlinkTime(): number {
    return this.m_textLowLimitBlinkTime.textLowLimitBlinkTime;
  }

  @Input() public set textLowLimitBlinkTime(textLowLimitBlinkTime: number) {
    this.m_textLowLimitBlinkTime.textLowLimitBlinkTime = textLowLimitBlinkTime;
    this.triggerPropertyChange("textLowLimitBlinkTime", this.m_textLowLimitBlinkTime.textLowLimitBlinkTime);
  }


  private m_textHighLimitBlinkTime: any = {
    textHighLimitBlinkTime: 0
  }

  public get textHighLimitBlinkTime(): number {
    return this.m_textHighLimitBlinkTime.textHighLimitBlinkTime;
  }

  @Input() public set textHighLimitBlinkTime(textHighLimitBlinkTime: number) {
    this.m_textHighLimitBlinkTime.textHighLimitBlinkTime = textHighLimitBlinkTime;
    this.triggerPropertyChange("textHighLimitBlinkTime", this.m_textHighLimitBlinkTime.textHighLimitBlinkTime);
  }


  private m_textIsChecked: any = {
    textIsChecked: ''
  }

  public get textIsChecked(): boolean {
    return this.m_textIsChecked.textIsChecked;
  }

  @Input() public set textIsChecked(textIsChecked: boolean) {
    this.m_textIsChecked.textIsChecked = textIsChecked;
    this.triggerPropertyChange("textIsChecked", this.m_textIsChecked.textIsChecked);
  }


  private m_textBlinkTime: any = {
    textBlinkTime: 0
  }

  public get textBlinkTime(): number {
    return this.m_textBlinkTime.textBlinkTime;
  }

  @Input() public set textBlinkTime(textBlinkTime: number) {
    this.m_textBlinkTime.textBlinkTime = textBlinkTime;
    this.triggerPropertyChange("textBlinkTime", this.m_textBlinkTime.textBlinkTime);
  }

  private m_analogUnit: any = {
    analogUnit: ''
  }

  public get analogUnit(): string {
    return this.m_analogUnit.analogUnit;
  }

  @Input() public set analogUnit(analogUnit: string) {
    this.m_analogUnit.analogUnit = analogUnit;
    this.triggerPropertyChange("analogUnit", this.m_analogUnit.analogUnit);
  }

  private m_textCheckColor: any = {
    textCheckColor: ''
  }

  public get textCheckColor(): boolean {
    return this.m_textCheckColor.textCheckColor;
  }

  @Input() public set textCheckColor(textCheckColor: boolean) {
    this.m_textCheckColor.textCheckColor = textCheckColor;
    this.triggerPropertyChange("textCheckColor", this.m_textCheckColor.textCheckColor);
  }

  private m_textCheckStr: any = {
    textCheckStr: ''
  }

  public get textCheckStr(): boolean {
    return this.m_textCheckStr.textCheckStr;
  }

  @Input() public set textCheckStr(textCheckStr: boolean) {
    this.m_textCheckStr.textCheckStr = textCheckStr;
    this.triggerPropertyChange("textCheckStr", this.m_textCheckStr.textCheckStr);
  }

  private m_textSetStr: any = {
    textSetStr: ''
  }

  public get textSetStr(): string {
    return this.m_textSetStr.textSetStr;
  }

  @Input() public set textSetStr(textSetStr: string) {
    this.m_textSetStr.textSetStr = textSetStr;
    this.triggerPropertyChange("textSetStr", this.m_textSetStr.textSetStr);
  }





  private m_textDecimal: any = {
    textDecimal: 0
  }

  public get textDecimal(): number {
    return this.m_textDecimal.textDecimal;
  }

  @Input() public set textDecimal(textDecimal: number) {
    this.m_textDecimal.textDecimal = textDecimal;
    this.triggerPropertyChange("textDecimal", this.m_textDecimal.textDecimal);
  }

  private m_offsetY: number = 0;
  public get offsetY(): number {
    return this.m_offsetY;
  }

  @Input()
  public set offsetY(offsetY: number) {
    if (this.m_offsetY !== offsetY) {
      this.m_offsetY = offsetY;
      this.triggerPropertyChange("offsetY", offsetY);
    }
  }

  private m_width: number = 0;
  public get width(): number {
    return this.m_width;
  }

  @Input()
  public set width(width: number) {
    if (this.m_width !== width) {
      this.m_width = width || 3;
      this.triggerPropertyChange("width", width);
    }
  }

  private m_analogData: any;

  public get analogData(): any {
    return this.m_analogData;
  }

  @Input() public set analogData(analogData: any) {
    this.m_analogData = analogData || null;
    this.triggerPropertyChange("analogData", this.m_analogData);
  }

  private m_digitalData: any;

  public get digitalData(): any {
    return this.m_digitalData;
  }

  @Input() public set digitalData(digitalData: any) {
    this.m_digitalData = digitalData || null;
    this.triggerPropertyChange("digitalData", this.m_digitalData);
  }

  private m_digital: any;

  public get digitalChannel(): any {
    return this.m_digital;
  }

  @Input() public set digitalChannel(digital: any) {
    this.m_digital = digital || null;
    this.triggerPropertyChange("digital", this.m_digital);
  }

  private m_analog: any;

  public get analogChannel(): any {
    return this.m_analog;
  }

  @Input() public set analogChannel(analog: any) {
    this.m_analog = analog || null;
    this.triggerPropertyChange("analog", this.m_analog);
  }

  private m_annotations: any = {
    content: "",
  };

  get annotationContent(): string {
    return this.m_annotations.content;
  }

  @Input()
  set annotationContent(content: string) {
    this.m_annotations.content = content || "";
    this.triggerPropertyChange("annotations", this.m_annotations.content);
  }

  private m_height: number = 0;
  public get height(): number {
    return this.m_height;
  }

  @Input()
  public set height(height: number) {
    if (this.m_height !== height) {
      this.m_height = height || 3;
      this.triggerPropertyChange("height", height);
    }
  }

  private m_rotateAngle: number = 0;
  public get rotateAngle(): number {
    return this.m_rotateAngle;
  }

  @Input()
  public set rotateAngle(rotateAngle: number) {
    if (this.m_rotateAngle !== rotateAngle) {
      this.m_rotateAngle = rotateAngle;
      this.triggerPropertyChange("rotateAngle", rotateAngle);
    }
  }

  private m_fillColor: string = "#ffffff";
  public get fillColor(): string {
    return this.m_fillColor;
  }

  @Input()
  public set fillColor(fillColor: string) {
    if (this.m_fillColor !== fillColor) {
      this.m_fillColor = fillColor;
      this.triggerPropertyChange("fillColor", fillColor);
    }
  }

  private m_strokeColor: string = "#000000";
  public get strokeColor(): string {
    return this.m_strokeColor;
  }

  @Input()
  public set strokeColor(strokeColor: string) {
    if (this.m_strokeColor !== strokeColor) {
      this.m_strokeColor = strokeColor;
      this.triggerPropertyChange("strokeColor", strokeColor);
    }
  }

  private m_strokeStyle: string = "None";
  public get strokeStyle(): string {
    return this.m_strokeStyle;
  }

  @Input()
  public set strokeStyle(strokeStyle: string) {
    if (this.m_strokeStyle !== strokeStyle) {
      this.m_strokeStyle = strokeStyle;
      this.triggerPropertyChange("strokeStyle", strokeStyle);
    }
  }

  private m_strokeWidth: number = 1;
  public get strokeWidth(): number {
    return this.m_strokeWidth;
  }

  @Input()
  public set strokeWidth(strokeWidth: number) {
    if (this.m_strokeWidth !== strokeWidth) {
      this.m_strokeWidth = strokeWidth;
      this.triggerPropertyChange("strokeWidth", strokeWidth);
    }
  }

  private m_blinkCheckbox: any = {
    isChecked: false,
  };
  public get blinkCheck(): any {
    return this.m_blinkCheckbox.isChecked;
  }

  @Input() public set blinkCheck(blinkCheckbox: boolean) {
    this.m_blinkCheckbox.isChecked = blinkCheckbox;
    this.triggerPropertyChange("blinkCheckbox", this.m_blinkCheckbox.isChecked);
  }

  private m_blinkTime: any = {
    blinkTime: 0
  };
  public get blinkTime(): number {
    return this.m_blinkTime.blinkTime;
  }

  @Input() public set blinkTime(blinkTime: number) {
    this.m_blinkTime.blinkTime = blinkTime;
    this.triggerPropertyChange("blinkTime", this.m_blinkTime.blinkTime);
  }

  private m_colorCheckbox: any = {
    colorCheck: false
  };
  public get colorCheck(): boolean {
    return this.m_colorCheckbox.colorCheck;
  }

  @Input() public set colorCheck(colorCheckbox: boolean) {
    this.m_colorCheckbox.colorCheck = colorCheckbox;
    this.triggerPropertyChange("colorCheckbox", this.m_colorCheckbox.colorCheck);
  }


  private m_textCheckbox: any = {
    textCheck: false
  };
  public get textCheck(): boolean {
    return this.m_textCheckbox.textCheck
  }

  @Input() public set textCheck(textCheckbox: boolean) {
    this.m_textCheckbox.textCheck = textCheckbox;
    this.triggerPropertyChange("textCheckbox", this.m_textCheckbox.textCheck);
  }

  private m_opacity: number = 0;

  public get opacity(): number {
    return this.m_opacity;
  }

  @Input()
  public set opacity(opacity: number) {
    if (this.m_opacity !== opacity) {
      this.m_opacity = opacity;
      this.triggerPropertyChange("opacity", opacity);
    }
  }


  public opacityText: string = "0%";

  public tooltip: string;

  private m_aspectRatio: boolean = false;
  public get aspectRatio(): boolean {
    return this.m_aspectRatio;
  }

  @Input()
  public set aspectRatio(aspectRatio: boolean) {
    if (this.m_aspectRatio !== aspectRatio) {
      this.m_aspectRatio = aspectRatio;
      this.triggerPropertyChange("aspectRatio", aspectRatio);
    }
  }

  private m_gradient: boolean = false;
  public get gradient(): boolean {
    return this.m_gradient;
  }

  @Input()
  public set gradient(gradient: boolean) {
    if (this.m_gradient !== gradient) {
      this.m_gradient = gradient;
      let gradientElement: HTMLElement =
        document.getElementById("gradientStyle");
      if (gradient) {
        gradientElement.className = "row db-prop-row db-gradient-style-show";
      } else {
        gradientElement.className = "row db-prop-row db-gradient-style-hide";
      }
      this.triggerPropertyChange("gradient", gradient);
    }
  }

  private m_gradientDirection: string = "BottomToTop";
  public get gradientDirection(): string {
    return this.m_gradientDirection;
  }

  @Input()
  public set gradientDirection(gradientDirection: string) {
    if (this.m_gradientDirection !== gradientDirection) {
      this.m_gradientDirection = gradientDirection;
      this.triggerPropertyChange("gradient", true);
    }
  }

  private m_gradientColor: string = "#ffffff";
  public get gradientColor(): string {
    return this.m_gradientColor;
  }

  @Input()
  public set gradientColor(gradientColor: string) {
    if (this.m_gradientColor !== gradientColor) {
      this.m_gradientColor = gradientColor;
      this.triggerPropertyChange("gradient", true);
    }
  }

  public propertyChange: Function;

  public triggerPropertyChange(
    propertyName: string,
    propertyValue: Object
  ): void {
    if (!isNullOrUndefined(this.propertyChange)) {
      this.propertyChange.call(this, {
        propertyName: propertyName,
        propertyValue: propertyValue,
      });
    }
  }

  public getGradient(node: Node): void {
    let gradientValue: { [key: string]: number } =
      this.getGradientDirectionValue(this.gradientDirection);
    node.style.gradient = {
      type: "Linear",
      x1: gradientValue.x1,
      x2: gradientValue.x2,
      y1: gradientValue.y1,
      y2: gradientValue.y2,
      stops: [
        { color: node.style.fill, offset: 0 },
        { color: this.getColor(this.gradientColor), offset: 1 },
      ],
    };
  }

  public getGradientDirectionValue(direction: string): {
    [key: string]: number;
  } {
    let gradientValue: { [key: string]: number } = {};
    let x1: number = 0,
      x2: number = 0,
      y1: number = 0,
      y2: number = 0;
    if (direction === "LeftToRight") {
      x1 = 100;
    } else if (direction === "BottomToTop") {
      y2 = 100;
    } else if (direction === "RightToLeft") {
      x2 = 100;
    } else {
      y1 = 100;
    }
    gradientValue = { x1: x1, y1: y1, x2: x2, y2: y2 };
    return gradientValue;
  }

  private getColor(colorName: string): string {
    if ((window.navigator as any).msSaveBlob && colorName.length === 9) {
      return colorName.substring(0, 7);
    }
    return colorName;
  }
}

@Injectable()
export class ConnectorProperties {
  private m_lineColor: string = "#ffffff";
  public get lineColor(): string {
    return this.m_lineColor;
  }

  @Input()
  public set lineColor(lineColor: string) {
    if (this.m_lineColor !== lineColor) {
      this.m_lineColor = lineColor;
      this.triggerPropertyChange("lineColor", lineColor);
    }
  }

  private m_lineWidth: number;
  public get lineWidth(): number {
    return this.m_lineWidth;
  }

  @Input()
  public set lineWidth(lineWidth: number) {
    if (this.m_lineWidth !== lineWidth) {
      this.m_lineWidth = lineWidth;
      this.triggerPropertyChange("lineWidth", lineWidth);
    }
  }

  private m_lineStyle: string;
  public get lineStyle(): string {
    return this.m_lineStyle;
  }

  @Input()
  public set lineStyle(lineStyle: string) {
    if (this.m_lineStyle !== lineStyle) {
      this.m_lineStyle = lineStyle;
      this.triggerPropertyChange("lineStyle", lineStyle);
    }
  }

  private m_lineType: string;
  public get lineType(): string {
    return this.m_lineType;
  }

  @Input()
  public set lineType(lineType: string) {
    if (this.m_lineType !== lineType) {
      this.m_lineType = lineType;
      this.triggerPropertyChange("lineType", lineType);
    }
  }

  private m_lineJump: boolean;
  public get lineJump(): boolean {
    return this.m_lineJump;
  }

  @Input()
  public set lineJump(lineJump: boolean) {
    if (this.m_lineJump !== lineJump) {
      this.m_lineJump = lineJump;
      if (lineJump) {
        document.getElementById("lineJumpSizeDiv").style.display = "";
      } else {
        document.getElementById("lineJumpSizeDiv").style.display = "none";
      }
      this.triggerPropertyChange("lineJump", lineJump);
    }
  }

  private m_lineJumpSize: number;
  public get lineJumpSize(): number {
    return this.m_lineJumpSize;
  }

  @Input()
  public set lineJumpSize(lineJumpSize: number) {
    if (this.m_lineJumpSize !== lineJumpSize) {
      this.m_lineJumpSize = lineJumpSize;
      this.triggerPropertyChange("lineJumpSize", lineJumpSize);
    }
  }

  private m_sourceType: string;
  public get sourceType(): string {
    return this.m_sourceType;
  }

  @Input()
  public set sourceType(sourceType: string) {
    if (this.m_sourceType !== sourceType) {
      this.m_sourceType = sourceType;
      this.triggerPropertyChange("sourceType", sourceType);
    }
  }

  private m_targetType: string;
  public get targetType(): string {
    return this.m_targetType;
  }

  @Input()
  public set targetType(targetType: string) {
    if (this.m_targetType !== targetType) {
      this.m_targetType = targetType;
      this.triggerPropertyChange("targetType", targetType);
    }
  }

  private m_sourceSize: number;
  public get sourceSize(): number {
    return this.m_sourceSize;
  }

  @Input()
  public set sourceSize(sourceSize: number) {
    if (this.m_sourceSize !== sourceSize) {
      this.m_sourceSize = sourceSize;
      this.triggerPropertyChange("sourceSize", sourceSize);
    }
  }

  private m_targetSize: number;
  public get targetSize(): number {
    return this.m_targetSize;
  }

  @Input()
  public set targetSize(targetSize: number) {
    if (this.m_targetSize !== targetSize) {
      this.m_targetSize = targetSize;
      this.triggerPropertyChange("targetSize", targetSize);
    }
  }

  private m_opacity: number;
  public get opacity(): number {
    return this.m_opacity;
  }

  @Input()
  public set opacity(opacity: number) {
    if (this.m_opacity !== opacity) {
      this.m_opacity = opacity;
      this.triggerPropertyChange("opacity", opacity);
    }
  }

  public opacityText: string;

  public propertyChange: Function;

  public triggerPropertyChange(
    propertyName: string,
    propertyValue: Object
  ): void {
    if (!isNullOrUndefined(this.propertyChange)) {
      this.propertyChange.call(this, {
        propertyName: propertyName,
        propertyValue: propertyValue,
      });
    }
  }
}

@Injectable()
export class TextProperties {

  private m_textPosition: string = "";
  public get textPosition(): string {
    return this.m_textPosition;
  }

  @Input()
  public set textPosition(textPosition: string) {
    if (this.m_textPosition !== textPosition) {
      this.m_textPosition = textPosition;
      this.triggerPropertyChange("textPosition", textPosition);
    }
  }


  private m_fontFamily: string = "Arial";
  public get fontFamily(): string {
    return this.m_fontFamily;
  }

  @Input()
  public set fontFamily(fontFamily: string) {
    if (this.m_fontFamily !== fontFamily) {
      this.m_fontFamily = fontFamily;
      this.triggerPropertyChange("fontFamily", fontFamily);
    }
  }

  private m_fontSize: number;
  public get fontSize(): number {
    return this.m_fontSize;
  }

  @Input()
  public set fontSize(fontSize: number) {
    if (this.m_fontSize !== fontSize) {
      this.m_fontSize = fontSize;
      this.triggerPropertyChange("fontSize", fontSize);
    }
  }

  private m_fontColor: string = "#ffffff";
  public get fontColor(): string {
    return this.m_fontColor;
  }

  @Input()
  public set fontColor(fontColor: string) {
    if (this.m_fontColor !== fontColor) {
      this.m_fontColor = fontColor;
      this.triggerPropertyChange("fontColor", fontColor);
    }
  }

  private m_opacity: number;
  public get opacity(): number {
    return this.m_opacity;
  }

  @Input()
  public set opacity(opacity: number) {
    if (this.m_opacity !== opacity) {
      this.m_opacity = opacity;
      this.triggerPropertyChange("opacity", opacity);
    }
  }

  public opacityText: string;

  public textDecoration: boolean;

  public bold: boolean;

  public italic: boolean;

  public textAlign: string;

  public horizontalAlign: string;

  public verticalAlign: string;

  public textPositionDataSource: { [key: string]: Object }[] =
    this.getNodeTextPositions();

  public getNodeTextPositions(): { [key: string]: Object }[] {
    return [
      { text: "TopLeft", value: "TopLeft" },
      { text: "TopCenter", value: "TopCenter" },
      { text: "TopRight", value: "TopRight" },
      { text: "MiddleLeft", value: "MiddleLeft" },
      { text: "Center", value: "Center" },
      { text: "MiddleRight", value: "MiddleRight" },
      { text: "BottomLeft", value: "BottomLeft" },
      { text: "BottomCenter", value: "BottomCenter" },
      { text: "BottomRight", value: "BottomRight" },
    ];
  }

  public getConnectorTextPositions(): { [key: string]: Object }[] {
    return [
      { text: "Before", value: "Before" },
      { text: "Center", value: "Center" },
      { text: "After", value: "After" },
    ];
  }

  public propertyChange: Function;

  public triggerPropertyChange(
    propertyName: string,
    propertyValue: Object
  ): void {
    if (!isNullOrUndefined(this.propertyChange)) {
      this.propertyChange.call(this, {
        propertyName: propertyName,
        propertyValue: propertyValue,
      });
    }
  }
}

@Injectable()
export class ExportSettings {
  private m_fileName: string = "Diagram";
  public get fileName(): string {
    return this.m_fileName;
  }

  @Input()
  public set fileName(fileName: string) {
    this.m_fileName = fileName;
  }

  private m_format: string = "JPG";
  public get format(): string {
    return this.m_format;
  }

  @Input()
  public set format(format: string) {
    this.m_format = format;
  }

  private m_region: string = "PageSettings";
  public get region(): string {
    return this.m_region;
  }

  @Input()
  public set region(region: string) {
    this.m_region = region;
  }
}

@Injectable()
export class PrintSettings {
  private m_region: string = "PageSettings";
  public get region(): string {
    return this.m_region;
  }

  @Input()
  public set region(region: string) {
    this.m_region = region;
  }

  private m_pageWidth: number = 0;
  public get pageWidth(): number {
    return this.m_pageWidth;
  }

  @Input()
  public set pageWidth(pageWidth: number) {
    this.m_pageWidth = pageWidth;
  }

  private m_pageHeight: number = 0;
  public get pageHeight(): number {
    return this.m_pageHeight;
  }

  @Input()
  public set pageHeight(pageHeight: number) {
    this.m_pageHeight = pageHeight;
  }

  private m_isPortrait: boolean = true;
  public get isPortrait(): boolean {
    return this.m_isPortrait;
  }

  @Input()
  public set isPortrait(isPortrait: boolean) {
    this.m_isPortrait = isPortrait;
  }

  private m_isLandscape: boolean = false;
  public get isLandscape(): boolean {
    return this.m_isLandscape;
  }

  @Input()
  public set isLandscape(isLandscape: boolean) {
    this.m_isLandscape = isLandscape;
  }

  private m_multiplePage: boolean = false;
  public get multiplePage(): boolean {
    return this.m_multiplePage;
  }

  @Input()
  public set multiplePage(multiplePage: boolean) {
    this.m_multiplePage = multiplePage;
  }

  private m_paperSize: string = "Letter";
  public get paperSize(): string {
    return this.m_paperSize;
  }

  @Input()
  public set paperSize(paperSize: string) {
    this.m_paperSize = paperSize;
    document.getElementById("printCustomSize").style.display = "none";
    document.getElementById("printOrientation").style.display = "none";
    if (paperSize === "Custom") {
      document.getElementById("printCustomSize").style.display = "";
    } else {
      document.getElementById("printOrientation").style.display = "";
    }
  }
}

@Injectable()
export class PageSettings {
  public pageWidth: number = 1056;
  public pageHeight: number = 816;
  public showPageBreaks: boolean;
  public backgroundColor: string = "#ffffff";
  public isPortrait: boolean = false;
  public isLandscape: boolean = true;
  public paperSize: string = "Letter";
  public pageBreaks: boolean = false;
}

@Injectable()
export class ScrollSettings {
  public currentZoom: string = "100%";
}

@Injectable()
export class MindMapSettings {
  private m_levelType: string = "Level0";
  public get levelType(): string {
    return this.m_levelType;
  }

  @Input()
  public set levelType(levelType: string) {
    if (this.m_levelType !== levelType) {
      this.m_levelType = levelType;
      this.triggerPropertyChange("levelType", levelType);
    }
  }

  private m_fill: string = "white";
  public get fill(): string {
    return this.m_fill;
  }

  @Input()
  public set fill(fill: string) {
    if (this.m_fill !== fill) {
      this.m_fill = fill;
      this.triggerPropertyChange("fill", fill);
    }
  }

  private m_stroke: string = "white";
  public get stroke(): string {
    return this.m_stroke;
  }

  @Input()
  public set stroke(stroke: string) {
    if (this.m_stroke !== stroke) {
      this.m_stroke = stroke;
      this.triggerPropertyChange("stroke", stroke);
    }
  }

  private m_strokeStyle: string = "None";
  public get strokeStyle(): string {
    return this.m_strokeStyle;
  }

  @Input()
  public set strokeStyle(strokeStyle: string) {
    if (this.m_strokeStyle !== strokeStyle) {
      this.m_strokeStyle = strokeStyle;
      this.triggerPropertyChange("strokeStyle", strokeStyle);
    }
  }

  private m_strokeWidth: number = 1;
  public get strokeWidth(): number {
    return this.m_strokeWidth;
  }

  @Input()
  public set strokeWidth(strokeWidth: number) {
    if (this.m_strokeWidth !== strokeWidth) {
      this.m_strokeWidth = strokeWidth;
      this.triggerPropertyChange("strokeWidth", strokeWidth);
    }
  }

  private m_opacity: number;
  public get opacity(): number {
    return this.m_opacity;
  }

  @Input()
  public set opacity(opacity: number) {
    if (this.m_opacity !== opacity) {
      this.m_opacity = opacity;
      this.triggerPropertyChange("opacity", opacity);
    }
  }
  public opacityText: string;

  private m_fontFamily: string = "Arial";
  public get fontFamily(): string {
    return this.m_fontFamily;
  }

  @Input()
  public set fontFamily(fontFamily: string) {
    if (this.m_fontFamily !== fontFamily) {
      this.m_fontFamily = fontFamily;
      this.triggerPropertyChange("fontFamily", fontFamily);
    }
  }

  private m_fontSize: number;
  public get fontSize(): number {
    return this.m_fontSize;
  }

  @Input()
  public set fontSize(fontSize: number) {
    if (this.m_fontSize !== fontSize) {
      this.m_fontSize = fontSize;
      this.triggerPropertyChange("fontSize", fontSize);
    }
  }

  private m_fontColor: string = "#ffffff";
  public get fontColor(): string {
    return this.m_fontColor;
  }

  @Input()
  public set fontColor(fontColor: string) {
    if (this.m_fontColor !== fontColor) {
      this.m_fontColor = fontColor;
      this.triggerPropertyChange("fontColor", fontColor);
    }
  }

  private m_textOpacity: number;
  public get textOpacity(): number {
    return this.m_textOpacity;
  }

  @Input()
  public set textOpacity(textOpacity: number) {
    if (this.m_textOpacity !== textOpacity) {
      this.m_textOpacity = textOpacity;
      this.triggerPropertyChange("textOpacity", textOpacity);
    }
  }

  public textOpacityText: string;

  public propertyChange: Function;

  public triggerPropertyChange(
    propertyName: string,
    propertyValue: Object
  ): void {
    if (!isNullOrUndefined(this.propertyChange)) {
      this.propertyChange.call(this, {
        propertyName: propertyName,
        propertyValue: propertyValue,
      });
    }
  }
}

@Injectable()
export class OrgDataSettings {
  public dataSourceColumns: { [key: string]: Object }[] = [];
  public id: string = "";
  public parent: string = "";
  public nameField: string = "";
  public bindingFields: string[] = [];
  public imageField: string = "";
  public additionalFields: string[] = [];
  public fileformat: string = "";
  public extensionType: string = ".csv";
  public buttonContent: string = "Download Example CSV";
}

@Injectable()
export class SelectorViewModel {
  public selectedDiagram: Diagram;
  public isCopyLayoutElement: boolean = false;
  public themeStyle: string;
  public pastedFirstItem: Node;
  public currentDiagramName: string = "";
  public preventPropertyChange: boolean = false;
  public diagramType: string;
  public isModified: boolean = false;
  public uniqueId: string = null;
  public preventSelectionChange: boolean = false;
  public pasteData: Object[] = [];
  public isLoading: boolean = false;
  public isTemplateLoad: boolean = false;

  public nodeProperties: NodeProperties = new NodeProperties();
  public textProperties: TextProperties = new TextProperties();
  public connectorProperties: ConnectorProperties = new ConnectorProperties();
  public exportSettings: ExportSettings = new ExportSettings();
  public printSettings: PrintSettings = new PrintSettings();
  public pageSettings: PageSettings = new PageSettings();
  public utilityMethods: UtilityMethods = new UtilityMethods();
  public mindmapSettings: MindMapSettings = new MindMapSettings();
  public orgDataSettings: OrgDataSettings = new OrgDataSettings();
  public scrollSettings: ScrollSettings = new ScrollSettings();
  public customContextMenu: CustomContextMenuItems =
    new CustomContextMenuItems();

  public randomIdGenerator() {
    return Math.random()
      .toString(36)
      .replace(/[^a-z]+/g, "")
      .substr(2, 10);
  }

  public getAbsolutePath() {
    return window.location.pathname;
  }

  constructor() {
    this.nodeProperties.propertyChange = this.nodePropertyChange.bind(this);
    this.connectorProperties.propertyChange =
      this.connectorPropertyChange.bind(this);
    this.textProperties.propertyChange = this.textPropertyChange.bind(this);
    this.mindmapSettings.propertyChange = this.mindMapPropertyChange.bind(this);
  }

  public nodePropertyChange(args: { [key: string]: Object }): void {
    if (!this.preventPropertyChange) {
      let diagram: Diagram = this.selectedDiagram;
      if (diagram) {
        if (diagram.selectedItems.nodes.length > 0) {
          let selectedNodes: NodeModel[] =
            this.selectedDiagram.selectedItems.nodes;
          for (let i: number = 0; i < selectedNodes.length; i++) {
            let node: Node = selectedNodes[i] as Node;
            let propertyName1: string = args.propertyName
              .toString()
              .toLowerCase();
            switch (propertyName1) {
              case "offsetx":
                node.offsetX = this.nodeProperties.offsetX;
                break;
              case "offsety":
                node.offsetY = this.nodeProperties.offsetY;
                break;
              case "width":
                node.width = this.nodeProperties.width;
                break;
              case "height":
                node.height = this.nodeProperties.height;
                break;
              case "rotateangle":
                node.rotateAngle = this.nodeProperties.rotateAngle;
                break;
              case "aspectratio":
                node.constraints =
                  node.constraints ^ NodeConstraints.AspectRatio;
                break;
            }
            if (!node.children) {
              this.applyNodeStyle(propertyName1, node);
            } else {
              for (let j: number = 0; j < node.children.length; j++) {
                this.applyNodeStyle(
                  propertyName1,
                  diagram.getObject(node.children[j]) as Node
                );
              }
            }
          }
          this.isModified = true;
        }
        if (diagram.connectors.length > 0) {
          let selectedNodes: ConnectorModel[] =
            diagram.selectedItems.connectors;
          for (let i: number = 0; i < selectedNodes.length; i++) {
            switch (args.propertyName.toString().toLowerCase()) {
              case "strokecolor":
                this.connectorProperties.lineColor = this.getColor(
                  this.nodeProperties.strokeColor
                );
                break;
              case "strokewidth":
                this.connectorProperties.lineWidth =
                  this.nodeProperties.strokeWidth;
                break;
              case "strokestyle":
                this.connectorProperties.lineStyle =
                  this.nodeProperties.strokeStyle;
                break;
              case "opacity":
                this.connectorProperties.opacity = this.nodeProperties.opacity;
                break;
            }
          }
          this.isModified = true;
        }
        diagram.dataBind();
      }
    }
  }

  private applyNodeStyle(propertyName: string, node: Node): void {
    let addInfo: any = node.addInfo || {};
    switch (propertyName) {
      case "fillcolor":
        node.style.fill = this.getColor(this.nodeProperties.fillColor);
        if (this.nodeProperties.gradient) {
          this.nodeProperties.getGradient(node);
        }
        break;
      case "strokecolor":
        node.style.strokeColor = this.getColor(this.nodeProperties.strokeColor);
        break;
      case "strokewidth":
        node.style.strokeWidth = this.nodeProperties.strokeWidth;
        break;
      case "strokestyle":
        node.style.strokeDashArray = this.nodeProperties.strokeStyle;
        break;
      case "opacity":
        node.style.opacity = this.nodeProperties.opacity / 100;
        this.nodeProperties.opacityText = this.nodeProperties.opacity + "%";
        break;
      case "gradient":
        if (!this.nodeProperties.gradient) {
          node.style.gradient.type = "None";
        } else {
          this.nodeProperties.getGradient(node);
        }
        break;
    }
  }

  public connectorPropertyChange(args: { [key: string]: Object }): void {
    if (!this.preventPropertyChange) {
      let diagram: Diagram = this.selectedDiagram;
      if (diagram && diagram.selectedItems.connectors.length > 0) {
        let selectedNodes: ConnectorModel[] = diagram.selectedItems.connectors;
        for (let i: number = 0; i < selectedNodes.length; i++) {
          let connector: Connector = selectedNodes[i] as Connector;
          switch (args.propertyName.toString().toLowerCase()) {
            case "linecolor":
              connector.style.strokeColor = this.getColor(
                this.connectorProperties.lineColor
              );
              connector.sourceDecorator.style = {
                fill: connector.style.strokeColor,
                strokeColor: connector.style.strokeColor,
              };
              connector.targetDecorator.style = {
                fill: connector.style.strokeColor,
                strokeColor: connector.style.strokeColor,
              };
              break;
            case "linewidth":
              connector.style.strokeWidth = this.connectorProperties.lineWidth;
              if (connector.sourceDecorator.style) {
                connector.sourceDecorator.style.strokeWidth =
                  connector.style.strokeWidth;
              } else {
                connector.sourceDecorator.style = {
                  strokeWidth: connector.style.strokeWidth,
                };
              }
              if (connector.targetDecorator.style) {
                connector.targetDecorator.style.strokeWidth =
                  connector.style.strokeWidth;
              } else {
                connector.targetDecorator.style = {
                  strokeWidth: connector.style.strokeWidth,
                };
              }
              break;
            case "linestyle":
              connector.style.strokeDashArray =
                this.connectorProperties.lineStyle;
              break;
            case "linetype":
              connector.type = this.connectorProperties.lineType as Segments;
              break;
            case "sourcetype":
              connector.sourceDecorator.shape = this.connectorProperties
                .sourceType as DecoratorShapes;
              break;
            case "targettype":
              connector.targetDecorator.shape = this.connectorProperties
                .targetType as DecoratorShapes;
              break;
            case "sourcesize":
              connector.sourceDecorator.width =
                connector.sourceDecorator.height =
                this.connectorProperties.sourceSize;
              break;
            case "targetsize":
              connector.targetDecorator.width =
                connector.targetDecorator.height =
                this.connectorProperties.targetSize;
              break;
            case "opacity":
              connector.style.opacity = this.connectorProperties.opacity / 100;
              connector.targetDecorator.style.opacity = connector.style.opacity;
              connector.sourceDecorator.style.opacity = connector.style.opacity;
              this.connectorProperties.opacityText =
                this.connectorProperties.opacity + "%";
              break;
            case "linejump":
              if (this.connectorProperties.lineJump) {
                connector.constraints =
                  connector.constraints | ConnectorConstraints.Bridging;
              } else {
                connector.constraints =
                  connector.constraints & ~ConnectorConstraints.Bridging;
              }
              break;
            case "linejumpsize":
              connector.bridgeSpace = this.connectorProperties.lineJumpSize;
              break;
          }
        }
        diagram.dataBind();
        this.isModified = true;
      }
    }
  }

  public textPropertyChange(args: { [key: string]: Object }): void {
    if (!this.preventPropertyChange) {
      let diagram: Diagram = this.selectedDiagram;
      if (diagram) {
        let selectedObjects: Object[] = diagram.selectedItems.nodes;
        selectedObjects = selectedObjects.concat(
          diagram.selectedItems.connectors
        );
        let propertyName: string = args.propertyName.toString().toLowerCase();
        if (selectedObjects.length > 0) {
          for (let i: number = 0; i < selectedObjects.length; i++) {
            let node: Object = selectedObjects[i];
            if (node instanceof Node || node instanceof Connector) {
              if (node.annotations.length > 0) {
                for (let j: number = 0; j < node.annotations.length; j++) {
                  let annotation: TextStyleModel = node.annotations[j].style;
                  this.updateTextProperties(propertyName, annotation);
                }
              } else if (node.shape && node.shape.type === "Text") {
                this.updateTextProperties(propertyName, node.style);
              }
            }
          }
          diagram.dataBind();
          this.isModified = true;
        }
      }
    }
  }

  public updateTextProperties(
    propertyName: string,
    annotation: TextStyleModel
  ): void {
    switch (propertyName) {
      case "fontfamily":
        annotation.fontFamily = this.textProperties.fontFamily;
        break;
      case "fontsize":
        annotation.fontSize = this.textProperties.fontSize;
        break;
      case "fontcolor":
        annotation.color = this.getColor(this.textProperties.fontColor);
        break;
      case "opacity":
        annotation.opacity = this.textProperties.opacity / 100;
        this.textProperties.opacityText = this.textProperties.opacity + "%";
        break;
    }
  }

  public mindMapPropertyChange(args: { [key: string]: Object }): void {
    if (!this.preventPropertyChange) {
      let diagram: Diagram = this.selectedDiagram;
      if (diagram && diagram.nodes.length > 0) {
        for (let i: number = 0; i < diagram.nodes.length; i++) {
          let node: Node = diagram.nodes[i] as Node;
          if (node.addInfo) {
            let addInfo: { [key: string]: Object } = node.addInfo as {
              [key: string]: Object;
            };
            let levelType: string = this.mindmapSettings.levelType;
            if (
              "Level" + addInfo.level === levelType ||
              addInfo.level === levelType
            ) {
              switch (args.propertyName.toString().toLowerCase()) {
                case "fill":
                  node.style.fill = this.getColor(this.mindmapSettings.fill);
                  break;
                case "stroke":
                  node.style.strokeColor = this.getColor(
                    this.mindmapSettings.stroke
                  );
                  if (node.inEdges.length > 0) {
                    let connector: Connector =
                      MindMapUtilityMethods.getConnector(
                        diagram.connectors,
                        node.inEdges[0]
                      );
                    connector.style.strokeColor = node.style.strokeColor;
                  }
                  break;
                case "strokewidth":
                  node.style.strokeWidth = this.mindmapSettings.strokeWidth;
                  if (node.inEdges.length > 0) {
                    let connector: Connector =
                      MindMapUtilityMethods.getConnector(
                        diagram.connectors,
                        node.inEdges[0]
                      );
                    connector.style.strokeWidth =
                      this.mindmapSettings.strokeWidth;
                  }
                  break;
                case "strokestyle":
                  node.style.strokeDashArray = this.mindmapSettings.strokeStyle;
                  if (node.inEdges.length > 0) {
                    let connector: Connector =
                      MindMapUtilityMethods.getConnector(
                        diagram.connectors,
                        node.inEdges[0]
                      );
                    connector.style.strokeDashArray =
                      this.mindmapSettings.strokeStyle;
                  }
                  break;
                case "opacity":
                  node.style.opacity = this.mindmapSettings.opacity / 100;
                  this.mindmapSettings.opacityText =
                    this.mindmapSettings.opacity + "%";
                  break;
                default:
                  this.updateMindMapTextStyle(
                    node,
                    args.propertyName.toString().toLowerCase()
                  );
                  break;
              }
            }
          }
          diagram.dataBind();
          this.isModified = true;
        }
      }
    }
  }

  public updateMindMapTextStyle(node: Node, propertyName: string): void {
    let diagram: Diagram = this.selectedDiagram;
    if (node.addInfo && node.annotations.length > 0) {
      let annotation: TextStyleModel = node.annotations[0].style;
      switch (propertyName) {
        case "fontfamily":
          annotation.fontFamily = this.mindmapSettings.fontFamily;
          break;
        case "fontsize":
          annotation.fontSize = this.mindmapSettings.fontSize;
          break;
        case "fontcolor":
          annotation.color = this.getColor(this.mindmapSettings.fontColor);
          break;
        case "textopacity":
          annotation.opacity = this.mindmapSettings.textOpacity / 100;
          this.mindmapSettings.textOpacityText =
            this.mindmapSettings.textOpacity + "%";
          break;
      }
    }
    diagram.dataBind();
    this.isModified = true;
  }

  public getColor(colorName: string): string {
    if ((window.navigator as any).msSaveBlob && colorName.length === 9) {
      return colorName.substring(0, 7);
    }
    return colorName;
  }
}
