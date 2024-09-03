import {Diagram} from "@syncfusion/ej2-diagrams/src/diagram/diagram";
import {CustomNodeModel, CustomSelectorModel} from "./Custom-node-model";

export class CustomDiagram extends Diagram {

    nodes: CustomNodeModel[];

    selectedItems: CustomSelectorModel;

}

