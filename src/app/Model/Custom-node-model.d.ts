import {NodeBaseModel} from '@syncfusion/ej2-diagrams/src/diagram/objects/node-base-model';
import {CustomShapeAnnotationModel} from "./Custom-annotation-model";
import {ShapeStyleModel, TextStyleModel} from "@syncfusion/ej2-diagrams/src/diagram/core/appearance-model";

import {NodeModel, SelectorModel} from "@syncfusion/ej2-angular-diagrams";
import {ShapeModel} from "@syncfusion/ej2-diagrams/src/diagram/objects/node-model";
import {RubberBandSelectionMode, SelectorConstraints, Shapes} from "@syncfusion/ej2-diagrams/src/diagram/enum/enum";
import {Container} from "@syncfusion/ej2-diagrams/src/diagram/core/containers/container";
import {ConnectorModel} from "@syncfusion/ej2-diagrams/src/diagram/objects/connector-model";
import {PointModel} from "@syncfusion/ej2-diagrams/src/diagram/primitives/point-model";
import {UserHandleModel} from "@syncfusion/ej2-diagrams/src/diagram/interaction/selector-model";

/**
 * Interface for a class Node
 */
export interface CustomNodeModel extends NodeModel{

    analogChannel?: any;
    digitalChannel?: any;
    analogData?: any;
    digitalData?: any;

    isPastedNode?: boolean;

    annotations?: CustomShapeAnnotationModel[];

    style?: ShapeStyleModel | TextStyleModel;

    shape?: CustomShapeModel;


}

export interface CustomSelectorModel extends SelectorModel{

    nodes?: CustomNodeModel[];
}

export interface CustomShapeModel extends ShapeModel {

    type?: Shapes;
    source?: string;

}

export interface CustomSelectorModel extends SelectorModel {

    nodes?: CustomNodeModel[];
}