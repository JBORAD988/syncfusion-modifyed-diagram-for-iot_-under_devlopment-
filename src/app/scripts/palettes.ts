/**
 *  Palette handler
 */

import {
  NodeModel,
  ConnectorModel,
  SymbolInfo,
  PortVisibility,
  PortConstraints,
  PaletteModel,
  SymbolPreviewModel,
  MarginModel,
} from "@syncfusion/ej2-diagrams";
import { ElectricalShapes } from "./electrical-shapes";
import { FloorplanShapes } from "./floorplan-shapes";
import { NetworkShapes } from "./network-shapes";
import { ExpandMode } from "@syncfusion/ej2-navigations";
import { NodeConstraints } from "@syncfusion/ej2-angular-diagrams";

export class Palettes {
  private electricalShapes: ElectricalShapes = new ElectricalShapes();
  private floorplans: FloorplanShapes = new FloorplanShapes();
  private networkShapes: NetworkShapes = new NetworkShapes();

  private getImageShapes(): NodeModel[] {
    let imageShapes: NodeModel[] = [
      {
        id: "Rectangle",
        shape: { type: "Basic", shape: "Rectangle" },
        style: { strokeWidth: 2 },
        annotations: [
          {
            content: "",
            offset: { x: 0.5, y: 1.2 },
            verticalAlignment: "Bottom",
          },
        ],
      }
    ];

    return imageShapes;
  }

  private getAddStation(): NodeModel[] {
    let AddStation: NodeModel[] = [
      {
        id: 'CustomImageShape',
        shape: { type: 'Image', source: 'https://img.icons8.com/?size=100&id=60983&format=png&color=000000' },
        style: { strokeWidth: 2 },
        annotations: [
          {
            content: '',
            offset: { x: 0.5, y: 1.2 },
            verticalAlignment: 'Bottom'
          }
        ]
      },
      {
        id: 'cust2',
        shape: { type: 'Image', source: '../assets/station.webp' },
        style: { strokeWidth: 2 },
        annotations: [
          {
            content: '',
            offset: { x: 0.5, y: 1.2 },
            verticalAlignment: 'Bottom'
          }
        ]
      },

    ];

    return AddStation;
  }

  private getNumeric1Shapes(): NodeModel[] {
    let numeric1Shapes: NodeModel[] = [
      {
        id: 'numeric1',
        shape: { type: 'Flow', shape: 'Process' },
        style: { strokeWidth: 2 },
        annotations: [
          {
            content: 'Enter text here',
            style: { color: '#000000', fontSize: 16 },
            offset: { x: 0.5, y: 0.5 },
            horizontalAlignment: 'Center'
          }
        ]
      },
    ];

    return numeric1Shapes;
  }

  private getNumeric2Shapes(): NodeModel[] {
    let numeric2Shapes: NodeModel[] = [
      {
        id: 'numeric2',
        shape: { type: 'Flow', shape: 'Process' },
        style: { strokeWidth: 2 },
        annotations: [
          {
            content: 'Enter text here',
            style: { color: '#000000', fontSize: 16 },
            offset: { x: 0.5, y: 0.5 },
            horizontalAlignment: 'Center'
          }
        ]
      },
    ];

    return numeric2Shapes;
  }

  private getBitDisplay1Shape(): NodeModel[] {
    let bitDisplay1Shape: NodeModel[] = [
      {
        id: 'bitDisplay1',
        shape: { type: 'Flow', shape: 'Process' },
        style: { strokeWidth: 2 },
        annotations: [
          {
            content: 'Enter text here',
            style: { color: '#000000', fontSize: 16 },
            offset: { x: 0.5, y: 0.5 },
            horizontalAlignment: 'Center'
          }
        ]
      }
    ]
    return bitDisplay1Shape;
  }

  private getConnectors(): ConnectorModel[] {
    let connectorSymbols: ConnectorModel[] = [
      {
        id: "Link1",
        type: "Orthogonal",
        sourcePoint: { x: 0, y: 0 },
        targetPoint: { x: 40, y: 40 },
        targetDecorator: { shape: "Arrow", style: { strokeWidth: 2 } },
        style: { strokeWidth: 2 },
      },
      {
        id: "Link2",
        type: "Orthogonal",
        sourcePoint: { x: 0, y: 0 },
        targetPoint: { x: 40, y: 40 },
        targetDecorator: { shape: "Arrow", style: { strokeWidth: 2 } },
        style: { strokeWidth: 2, strokeDashArray: "3,3" },
      },
      {
        id: "link3",
        type: "Orthogonal",
        sourcePoint: { x: 0, y: 0 },
        targetPoint: { x: 40, y: 40 },
        style: { strokeWidth: 2 },
        targetDecorator: { shape: "None" },
      },
      {
        id: "Link4",
        type: "Orthogonal",
        sourcePoint: { x: 0, y: 0 },
        targetPoint: { x: 40, y: 40 },
        style: { strokeWidth: 2, strokeDashArray: "3,3" },
        targetDecorator: { shape: "None" },
      },
      {
        id: "Link21",
        type: "Straight",
        sourcePoint: { x: 0, y: 0 },
        targetPoint: { x: 40, y: 40 },
        targetDecorator: { shape: "Arrow", style: { strokeWidth: 2 } },
        style: { strokeWidth: 2 },
      },
      {
        id: "Link22",
        type: "Straight",
        sourcePoint: { x: 0, y: 0 },
        targetPoint: { x: 40, y: 40 },
        targetDecorator: { shape: "Arrow", style: { strokeWidth: 2 } },
        style: { strokeWidth: 2, strokeDashArray: "3,3" },
      },
      {
        id: "link23",
        type: "Straight",
        sourcePoint: { x: 0, y: 0 },
        targetPoint: { x: 40, y: 40 },
        style: { strokeWidth: 2 },
        targetDecorator: { shape: "None" },
      },
      {
        id: "Link24",
        type: "Straight",
        sourcePoint: { x: 0, y: 0 },
        targetPoint: { x: 40, y: 40 },
        style: { strokeWidth: 2, strokeDashArray: "3,3" },
        targetDecorator: { shape: "None" },
      },
      {
        id: "link33",
        type: "Bezier",
        sourcePoint: { x: 0, y: 0 },
        targetPoint: { x: 40, y: 40 },
        style: { strokeWidth: 2 },
        targetDecorator: { shape: "None" },
      },
      {
        id: "Link34",
        type: "Bezier",
        sourcePoint: { x: 0, y: 0 },
        targetPoint: { x: 40, y: 40 },
        style: { strokeWidth: 2, strokeDashArray: "3,3" },
        targetDecorator: { shape: "None" },
      },
    ];

    return connectorSymbols;
  }

  public palettes: PaletteModel[] = [
    {
      id: "station",
      expanded: true,
      symbols: this.getAddStation(),
      title: "Add Station",
    },
    {
      id: "image",
      expanded: false,
      symbols: this.getImageShapes(),
      title: "Add Image",
    },
    {
      id: "numeric1",
      expanded: false,
      symbols: this.getNumeric1Shapes(),
      title: "Numeric1",
    },
    {
      id: "numeric2",
      expanded: false,
      symbols: this.getNumeric2Shapes(),
      title: "Numeric2",
    },
    {
      id: "bitDisplay1",
      expanded: false,
      symbols: this.getBitDisplay1Shape(),
      title: "Bit Display1",
    },
    // {
    //   id: "connectors",
    //   expanded: false,
    //   symbols: this.getConnectors(),
    //   title: "Connectors",
    // },
  ];
  public expandMode: ExpandMode = "Multiple";
  public symbolPreview: SymbolPreviewModel = { height: 100, width: 100 };
  public enableSearch: boolean = true;
  public symbolMargin: MarginModel = {
    left: 12,
    right: 12,
    top: 12,
    bottom: 12,
  };

  public getSymbolInfo(symbol: NodeModel): SymbolInfo {
    return { fit: true };
  }

  public setPaletteNodeDefaults(node: NodeModel): void {
    if (
      !(
        node.addInfo &&
        (node.addInfo as { [key: string]: Object }).type === "CustomShapes"
      ) &&
      !node.children
    ) {
      if (node.id === "Terminator" || node.id === "Process") {
        node.width = 130;
        node.height = 65;
      } else {
        node.width = 50;
        node.height = 50;
      }
      node.ports = [
        {
          offset: { x: 0, y: 0.5 },
          style: { fill: "white" },
          visibility: PortVisibility.Connect | PortVisibility.Hover,
          constraints: PortConstraints.Draw,
        },
        {
          offset: { x: 0.5, y: 0 },
          style: { fill: "white" },
          visibility: PortVisibility.Connect | PortVisibility.Hover,
          constraints: PortConstraints.Draw,
        },
        {
          offset: { x: 1, y: 0.5 },
          style: { fill: "white" },
          visibility: PortVisibility.Connect | PortVisibility.Hover,
          constraints: PortConstraints.Draw,
        },
        {
          offset: { x: 0.5, y: 1 },
          style: { fill: "white" },
          visibility: PortVisibility.Connect | PortVisibility.Hover,
          constraints: PortConstraints.Draw,
        },
      ];
      node.style.strokeColor = "#3A3A3A";
    }
  }

  public getPalettes(text: string[]): PaletteModel[] {
    let palettes: PaletteModel[] = [];
    if (text.indexOf("Station") !== -1) {
      palettes.push({
        id: "station",
        expanded: true,
        symbols: this.getAddStation(),
        title: "Add Station",
      });
    }
    if (text.indexOf("Image") !== -1) {
      palettes.push({
        id: "image",
        expanded: false,
        symbols: this.getImageShapes(),
        title: "Add Image",
      });
    }
    if (text.indexOf("Numeric1") !== -1) {
      palettes.push({
        id: "numeric1",
        expanded: false,
        symbols: this.getNumeric1Shapes(),
        title: "Numeric1",
      });
    }
    if (text.indexOf("Numeric2") !== -1) {
      palettes.push({
        id: "numeric2",
        expanded: false,
        symbols: this.getNumeric2Shapes(),
        title: "Numeric2",
      });
    }
    if (text.indexOf("bitDisplay1") !== -1) {
      palettes.push({
        id: "bitDisplay1",
        expanded: false,
        symbols: this.getNumeric2Shapes(),
        title: "Bit Display1",
      });
    }
    if (text.indexOf("Connectors") !== -1) {
      palettes.push({
        id: "connectors",
        expanded: false,
        symbols: this.getConnectors(),
        title: "Connectors",
      });
    }
    if (text.indexOf("Electrical") !== -1) {
      palettes = palettes.concat(this.electricalShapes.getElectricalShapes());
    }
    if (text.indexOf("Network") !== -1) {
      palettes.push({
        id: "network",
        expanded: false,
        symbols: this.networkShapes.getNetworkShapes(),
        title: "Network Shapes",
      });
    }
    if (text.indexOf("Floorplan") !== -1) {
      palettes.push({
        id: "floorplan",
        expanded: false,
        symbols: this.floorplans.getFloorPlans(),
        title: "Floorplan Shapes",
      });
    }
    return palettes;
  }
}
