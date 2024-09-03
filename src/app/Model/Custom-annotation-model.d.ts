import {AnnotationModel} from "@syncfusion/ej2-angular-diagrams";
import {PointModel} from "@syncfusion/ej2-diagrams/src/diagram/primitives/point-model";


/**
 * Interface for a class CustomeAnnotation
 */
export interface CustomAnnotationModel extends AnnotationModel {

    // dateTime


    dateChannel?: string;
    dateTimeFormat?: string;

// dateTime

    /**
     * Sets the textual description of the node/connector
     *
     * @default ''
     */
    content?: string;

    blinkCheck?: any
    blinkTime?: number

// text-properties

// bit

    textSetNormal?: string;
    textSetAbnormal?: string;

    isTextInvincible?: boolean;


    bitTagName?: string;
    bitDigitalChannel?: string;
    bitTextChName?: string;
    hideOnNormal?: boolean;
    hideOnAbNormal?: boolean;
    bit1Color?: string;
    bit0Color?: string;
    bitSet1asNormal?: boolean;
    bitSet1asAbnormal?: boolean;
    bitCheck1to0?: boolean;
    bitCheck0to1?: boolean;
    bitCondiConBlink1to0?: boolean;
    bitCondiTimeBlink1to0?: boolean;
    bitCondiBlinkTimeValue1to0?: number;

    bitCondiConBlink0to1?: boolean;
    bitCondiTimeBlink0to1?: boolean;
    bitCondiBlinkTimeValue0to1?: number;

    bitShapeColor1to0?: string;
    bitShapeColor0to1?: string;

    bitAudio1to0?: string;
    bitAudio0to1?: string;

    bitTextFor1?: string;
    bitTextFor0?: string;

    bitTextColorFor0?: string;
    bitTextColorFor1?: string;

    bitTextFor1to0?: string;
    bitTextFor0to1?: string;

    bitImagefor1?: string;
    bitImagefor0?: string;

    bitImageFor1to0?: string;
    bitImageFor0to1?: string;


    normalContinueBlink?: boolean;
    normalTimeBlink?: boolean;
    normalTimeBlinkValue?: number;

    bitTempSource?: string;



// bit

    textSetColor? :string;


    normalColor?: string;
    abNormalColor?: string;

    normalBackgroundColor?: string;
    abNormalBackgroundColor?: string;

    normalImage?: string;
    abNormalImage?: string;

    limitImageCheck?: boolean;

    textCheckColor?: boolean;
    textCheckBackgroundColor?: boolean;
    textSetStr?: string;
    textCheckStr?: boolean;
    textContinueBlink?: boolean;
    textIsChecked?: boolean;
    textBlinkTime?: number;

    textOperation?: string;
    textSetValue?: any;

    textAudioFile?: string;
    textCheckAudio?: boolean;



    textHighLimitValue?: number;
    textHighLimitBlinkTime?: number;
    textHighLimitBlinkTimeCheck?: boolean;
    textHighLimitBlinkContCheck?: boolean;
    textHighLimitColorValue?: string;
    textHighLimitCheckColor?: boolean;
    textHighLimitTextValue?: string;
    textHighLimitCheckText?: boolean;
    textHighLimitShapeValue?: string;
    textHighLimitCheckShape?: boolean;
    textHighLimitAudioValue?: string;
    textHighLimitCheckAudio?: boolean;


    textLowLimitValue?: number;
    textLowLimitBlinkTimeCheck?: boolean;
    textLowLimitBlinkContCheck?: boolean;
    textLowLimitBlinkTime?: number;
    textLowLimitAudioValue?: string;
    textLowLimitCheckAudio?: boolean;
    textLowLimitShapeValue?: string;
    textLowLimitCheckShape?: boolean;
    textLowLimitTextValue?: string;
    textLowLimitCheckText?: boolean;
    textLowLimitColorValue?: string;
    textLowLimitCheckColor?: boolean;


    textTooltip?: string;

    colorCheck?: boolean;

    textAudioFileName?: any;

    textCheck?: boolean;

    tagName?: string;

    textAnalogChName?: any;



    textSetTimeBlink?: any;

    analogUnit?: string;

    textDecimal?: any;




}


export interface CustomShapeAnnotationModel extends CustomAnnotationModel{

    /**
     * Sets the position of the annotation with respect to its parent bounds
     *
     * @default { x: 0.5, y: 0.5 }
     * @blazorType NodeAnnotationOffset
     */
    offset?: PointModel;

}


export interface  CustomShapeAnnotationModel extends CustomAnnotationModel{



}