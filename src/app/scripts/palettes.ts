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
        id: "image",
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
        id: 'CustomImageShape1',
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
        id: 'CustomImageShape2',
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

  private getLimit1ValueShapes(): NodeModel[] {
    let Limit1ValueShapes: NodeModel[] = [
      {
        id: 'Limit1Value',
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

    return Limit1ValueShapes;
  }

  private getLimit2ValueShapes(): NodeModel[] {
    let Limit2ValueShapes: NodeModel[] = [
      {
        id: 'Limit2Value',
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

    return Limit2ValueShapes;
  }

  private getLimit1TextShapes(): NodeModel[] {
    let getSelectionShapes: NodeModel[] = [

      {
        id: 'Limit1Text1', shape: { type: 'Basic', shape: 'Rectangle' }, style: { strokeWidth: 2 }, annotations: [
          {
            content: 'Enter text here',
            style: { color: '#000000', fontSize: 16 },
            offset: { x: 0.5, y: 0.5 },
            horizontalAlignment: 'Center'
          }
        ]
      },
      {
        id: 'Limit1Text2', shape: { type: 'Basic', shape: 'Ellipse' }, style: { strokeWidth: 2 }, annotations: [
          {
            content: 'Enter text here',
            style: { color: '#000000', fontSize: 16 },
            offset: { x: 0.5, y: 0.5 },
            horizontalAlignment: 'Center'
          }
        ]
      },
      {
        id: 'Limit1Text3', shape: { type: 'Basic', shape: 'Hexagon' }, style: { strokeWidth: 2 }, annotations: [
          {
            content: 'Enter text here',
            style: { color: '#000000', fontSize: 16 },
            offset: { x: 0.5, y: 0.5 },
            horizontalAlignment: 'Center'
          }
        ]
      },
      {
        id: 'Limit1Text4', shape: { type: 'Basic', shape: 'Parallelogram' }, style: { strokeWidth: 2 }, annotations: [
          {
            content: 'Enter text here',
            style: { color: '#000000', fontSize: 16 },
            offset: { x: 0.5, y: 0.5 },
            horizontalAlignment: 'Center'
          }
        ]
      },
      {
        id: 'Limit1Text5', shape: { type: 'Basic', shape: 'Triangle' }, style: { strokeWidth: 2 }, annotations: [
          {
            content: 'Enter text here',
            style: { color: '#000000', fontSize: 16 },
            offset: { x: 0.5, y: 0.5 },
            horizontalAlignment: 'Center'
          }
        ]
      },
      {
        id: 'Limit1Text6', shape: { type: 'Basic', shape: 'Plus' }, style: { strokeWidth: 2 }, annotations: [
          {
            content: 'Enter text here',
            style: { color: '#000000', fontSize: 16 },
            offset: { x: 0.5, y: 0.5 },
            horizontalAlignment: 'Center'
          }
        ]
      },
      {
        id: 'Limit1Text7', shape: { type: 'Basic', shape: 'Star' }, style: { strokeWidth: 2 }, annotations: [
          {
            content: 'Enter text here',
            style: { color: '#000000', fontSize: 16 },
            offset: { x: 0.5, y: 0.5 },
            horizontalAlignment: 'Center'
          }
        ]
      },
      {
        id: 'Limit1Text8', shape: { type: 'Basic', shape: 'Pentagon' }, style: { strokeWidth: 2 }, annotations: [
          {
            content: 'Enter text here',
            style: { color: '#000000', fontSize: 16 },
            offset: { x: 0.5, y: 0.5 },
            horizontalAlignment: 'Center'
          }
        ]
      },
      {
        id: 'Limit1Text9', shape: { type: 'Basic', shape: 'Heptagon' }, style: { strokeWidth: 2 }, annotations: [
          {
            content: 'Enter text here',
            style: { color: '#000000', fontSize: 16 },
            offset: { x: 0.5, y: 0.5 },
            horizontalAlignment: 'Center'
          }
        ]
      },
      {
        id: 'Limit1Text10', shape: { type: 'Basic', shape: 'Octagon' }, style: { strokeWidth: 2 }, annotations: [
          {
            content: 'Enter text here',
            style: { color: '#000000', fontSize: 16 },
            offset: { x: 0.5, y: 0.5 },
            horizontalAlignment: 'Center'
          }
        ]
      },
      {
        id: 'Limit1Text11', shape: { type: 'Basic', shape: 'Trapezoid' }, style: { strokeWidth: 2 }, annotations: [
          {
            content: 'Enter text here',
            style: { color: '#000000', fontSize: 16 },
            offset: { x: 0.5, y: 0.5 },
            horizontalAlignment: 'Center'
          }
        ]
      },
      {
        id: 'Limit1Text12', shape: { type: 'Basic', shape: 'Decagon' }, style: { strokeWidth: 2 }, annotations: [
          {
            content: 'Enter text here',
            style: { color: '#000000', fontSize: 16 },
            offset: { x: 0.5, y: 0.5 },
            horizontalAlignment: 'Center'
          }
        ]
      },
      {
        id: 'Limit1Text13', shape: { type: 'Basic', shape: 'RightTriangle' }, style: { strokeWidth: 2 }, annotations: [
          {
            content: 'Enter text here',
            style: { color: '#000000', fontSize: 16 },
            offset: { x: 0.5, y: 0.5 },
            horizontalAlignment: 'Center'
          }
        ]
      },
      {
        id: 'Limit1Text14', shape: { type: 'Basic', shape: 'Cylinder' }, style: { strokeWidth: 2 }, annotations: [
          {
            content: 'Enter text here',
            style: { color: '#000000', fontSize: 16 },
            offset: { x: 0.5, y: 0.5 },
            horizontalAlignment: 'Center'
          }
        ]
      },
      {
        id: 'Limit1Text15', shape: { type: 'Basic', shape: 'Diamond' }, style: { strokeWidth: 2 }, annotations: [
          {
            content: 'Enter text here',
            style: { color: '#000000', fontSize: 16 },
            offset: { x: 0.5, y: 0.5 },
            horizontalAlignment: 'Center'
          }
        ]
      },
    ];
    return getSelectionShapes;
  }

  private getLimit1Shapes(): NodeModel[] {
    let getSelectionShapes: NodeModel[] = [

      {
        id: 'Limit1Shape1', shape: { type: 'Basic', shape: 'Rectangle' }, style: { strokeWidth: 2 }, annotations: [
          {
            content: 'Enter text here',
            style: { color: '#000000', fontSize: 16 },
            offset: { x: 0.5, y: 0.5 },
            horizontalAlignment: 'Center'
          }
        ]
      },
      {
        id: 'Limit1Shape2', shape: { type: 'Basic', shape: 'Ellipse' }, style: { strokeWidth: 2 }, annotations: [
          {
            content: 'Enter text here',
            style: { color: '#000000', fontSize: 16 },
            offset: { x: 0.5, y: 0.5 },
            horizontalAlignment: 'Center'
          }
        ]
      },
      {
        id: 'Limit1Shape3', shape: { type: 'Basic', shape: 'Hexagon' }, style: { strokeWidth: 2 }, annotations: [
          {
            content: 'Enter text here',
            style: { color: '#000000', fontSize: 16 },
            offset: { x: 0.5, y: 0.5 },
            horizontalAlignment: 'Center'
          }
        ]
      },
      {
        id: 'Limit1Shape4', shape: { type: 'Basic', shape: 'Parallelogram' }, style: { strokeWidth: 2 }, annotations: [
          {
            content: 'Enter text here',
            style: { color: '#000000', fontSize: 16 },
            offset: { x: 0.5, y: 0.5 },
            horizontalAlignment: 'Center'
          }
        ]
      },
      {
        id: 'Limit1Shape5', shape: { type: 'Basic', shape: 'Triangle' }, style: { strokeWidth: 2 }, annotations: [
          {
            content: 'Enter text here',
            style: { color: '#000000', fontSize: 16 },
            offset: { x: 0.5, y: 0.5 },
            horizontalAlignment: 'Center'
          }
        ]
      },
      {
        id: 'Limit1Shape6', shape: { type: 'Basic', shape: 'Plus' }, style: { strokeWidth: 2 }, annotations: [
          {
            content: 'Enter text here',
            style: { color: '#000000', fontSize: 16 },
            offset: { x: 0.5, y: 0.5 },
            horizontalAlignment: 'Center'
          }
        ]
      },
      {
        id: 'Limit1Shape7', shape: { type: 'Basic', shape: 'Star' }, style: { strokeWidth: 2 }, annotations: [
          {
            content: 'Enter text here',
            style: { color: '#000000', fontSize: 16 },
            offset: { x: 0.5, y: 0.5 },
            horizontalAlignment: 'Center'
          }
        ]
      },
      {
        id: 'Limit1Shape8', shape: { type: 'Basic', shape: 'Pentagon' }, style: { strokeWidth: 2 }, annotations: [
          {
            content: 'Enter text here',
            style: { color: '#000000', fontSize: 16 },
            offset: { x: 0.5, y: 0.5 },
            horizontalAlignment: 'Center'
          }
        ]
      },
      {
        id: 'Limit1Shape9', shape: { type: 'Basic', shape: 'Heptagon' }, style: { strokeWidth: 2 }, annotations: [
          {
            content: 'Enter text here',
            style: { color: '#000000', fontSize: 16 },
            offset: { x: 0.5, y: 0.5 },
            horizontalAlignment: 'Center'
          }
        ]
      },
      {
        id: 'Limit1Shape10', shape: { type: 'Basic', shape: 'Octagon' }, style: { strokeWidth: 2 }, annotations: [
          {
            content: 'Enter text here',
            style: { color: '#000000', fontSize: 16 },
            offset: { x: 0.5, y: 0.5 },
            horizontalAlignment: 'Center'
          }
        ]
      },
      {
        id: 'Limit1Shape11', shape: { type: 'Basic', shape: 'Trapezoid' }, style: { strokeWidth: 2 }, annotations: [
          {
            content: 'Enter text here',
            style: { color: '#000000', fontSize: 16 },
            offset: { x: 0.5, y: 0.5 },
            horizontalAlignment: 'Center'
          }
        ]
      },
      {
        id: 'Limit1Shape12', shape: { type: 'Basic', shape: 'Decagon' }, style: { strokeWidth: 2 }, annotations: [
          {
            content: 'Enter text here',
            style: { color: '#000000', fontSize: 16 },
            offset: { x: 0.5, y: 0.5 },
            horizontalAlignment: 'Center'
          }
        ]
      },
      {
        id: 'Limit1Shape13', shape: { type: 'Basic', shape: 'RightTriangle' }, style: { strokeWidth: 2 }, annotations: [
          {
            content: 'Enter text here',
            style: { color: '#000000', fontSize: 16 },
            offset: { x: 0.5, y: 0.5 },
            horizontalAlignment: 'Center'
          }
        ]
      },
      {
        id: 'Limit1Shape14', shape: { type: 'Basic', shape: 'Cylinder' }, style: { strokeWidth: 2 }, annotations: [
          {
            content: 'Enter text here',
            style: { color: '#000000', fontSize: 16 },
            offset: { x: 0.5, y: 0.5 },
            horizontalAlignment: 'Center'
          }
        ]
      },
      {
        id: 'Limit1Shape15', shape: { type: 'Basic', shape: 'Diamond' }, style: { strokeWidth: 2 }, annotations: [
          {
            content: 'Enter text here',
            style: { color: '#000000', fontSize: 16 },
            offset: { x: 0.5, y: 0.5 },
            horizontalAlignment: 'Center'
          }
        ]
      },
    ];
    return getSelectionShapes;
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

  private getbitLableShape(): NodeModel[] {
    let bitLableShape: NodeModel[] = [
      {
        id: 'bitLable',
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
    return bitLableShape;
  }

  private getDateTimeShape(): NodeModel[] {
    let dateTime: NodeModel[] = [
      {
        id: 'dateTime',
        shape: { type: 'Flow', shape: 'Process' },
        style: { strokeWidth: 2 },
        annotations: [
          {
            content: 'Enter Station',
            style: { color: '#000000', fontSize: 16 },
            offset: { x: 0.5, y: 0.5 },
            horizontalAlignment: 'Center'
          }
        ]
      }
    ]
    return dateTime;
  }

  private getBitDisplay2Shape(): NodeModel[] {
    let bitDisplay2Shape: NodeModel[] = [
      {
        id: 'bitDisplay2',
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
    return bitDisplay2Shape;
  }

  private getConnectors(): ConnectorModel[] {
    let connectorSymbols: ConnectorModel[] = [
      {
        id: "Link1",
        type: "Straight",
        sourcePoint: { x: 200, y: 100 },
        targetPoint: { x: 400, y: 100 },
        targetDecorator: { shape: "None", style: { strokeWidth: 2 } },
        style: { strokeWidth: 2 }
      },
      {
        id: "Link2",
        type: "Straight",
        sourcePoint: { x: 0, y: 0 },
        targetPoint: { x: 0, y: 400 },
        targetDecorator: { shape: "None", style: { strokeWidth: 2 } },
        style: { strokeWidth: 2 },
      },
    ];

    return connectorSymbols;
  }

  private getBitShapes(): NodeModel[] {
    let getSelectionShapes: NodeModel[] = [

      {
        id: 'Shape1', shape: { type: 'Basic', shape: 'Rectangle' }, style: { strokeWidth: 2 }, annotations: [
          {
            content: 'Enter text here',
            style: { color: '#000000', fontSize: 16 },
            offset: { x: 0.5, y: 0.5 },
            horizontalAlignment: 'Center'
          }
        ]
      },
      {
        id: 'Shape2', shape: { type: 'Basic', shape: 'Ellipse' }, style: { strokeWidth: 2 }, annotations: [
          {
            content: 'Enter text here',
            style: { color: '#000000', fontSize: 16 },
            offset: { x: 0.5, y: 0.5 },
            horizontalAlignment: 'Center'
          }
        ]
      },
      {
        id: 'Shape3', shape: { type: 'Basic', shape: 'Hexagon' }, style: { strokeWidth: 2 }, annotations: [
          {
            content: 'Enter text here',
            style: { color: '#000000', fontSize: 16 },
            offset: { x: 0.5, y: 0.5 },
            horizontalAlignment: 'Center'
          }
        ]
      },
      {
        id: 'Shape4', shape: { type: 'Basic', shape: 'Parallelogram' }, style: { strokeWidth: 2 }, annotations: [
          {
            content: 'Enter text here',
            style: { color: '#000000', fontSize: 16 },
            offset: { x: 0.5, y: 0.5 },
            horizontalAlignment: 'Center'
          }
        ]
      },
      {
        id: 'Shape5', shape: { type: 'Basic', shape: 'Triangle' }, style: { strokeWidth: 2 }, annotations: [
          {
            content: 'Enter text here',
            style: { color: '#000000', fontSize: 16 },
            offset: { x: 0.5, y: 0.5 },
            horizontalAlignment: 'Center'
          }
        ]
      },
      {
        id: 'Shape6', shape: { type: 'Basic', shape: 'Plus' }, style: { strokeWidth: 2 }, annotations: [
          {
            content: 'Enter text here',
            style: { color: '#000000', fontSize: 16 },
            offset: { x: 0.5, y: 0.5 },
            horizontalAlignment: 'Center'
          }
        ]
      },
      {
        id: 'Shape7', shape: { type: 'Basic', shape: 'Star' }, style: { strokeWidth: 2 }, annotations: [
          {
            content: 'Enter text here',
            style: { color: '#000000', fontSize: 16 },
            offset: { x: 0.5, y: 0.5 },
            horizontalAlignment: 'Center'
          }
        ]
      },
      {
        id: 'Shape8', shape: { type: 'Basic', shape: 'Pentagon' }, style: { strokeWidth: 2 }, annotations: [
          {
            content: 'Enter text here',
            style: { color: '#000000', fontSize: 16 },
            offset: { x: 0.5, y: 0.5 },
            horizontalAlignment: 'Center'
          }
        ]
      },
      {
        id: 'Shape9', shape: { type: 'Basic', shape: 'Heptagon' }, style: { strokeWidth: 2 }, annotations: [
          {
            content: 'Enter text here',
            style: { color: '#000000', fontSize: 16 },
            offset: { x: 0.5, y: 0.5 },
            horizontalAlignment: 'Center'
          }
        ]
      },
      {
        id: 'Shape10', shape: { type: 'Basic', shape: 'Octagon' }, style: { strokeWidth: 2 }, annotations: [
          {
            content: 'Enter text here',
            style: { color: '#000000', fontSize: 16 },
            offset: { x: 0.5, y: 0.5 },
            horizontalAlignment: 'Center'
          }
        ]
      },
      {
        id: 'Shape11', shape: { type: 'Basic', shape: 'Trapezoid' }, style: { strokeWidth: 2 }, annotations: [
          {
            content: 'Enter text here',
            style: { color: '#000000', fontSize: 16 },
            offset: { x: 0.5, y: 0.5 },
            horizontalAlignment: 'Center'
          }
        ]
      },
      {
        id: 'Shape12', shape: { type: 'Basic', shape: 'Decagon' }, style: { strokeWidth: 2 }, annotations: [
          {
            content: 'Enter text here',
            style: { color: '#000000', fontSize: 16 },
            offset: { x: 0.5, y: 0.5 },
            horizontalAlignment: 'Center'
          }
        ]
      },
      {
        id: 'Shape13', shape: { type: 'Basic', shape: 'RightTriangle' }, style: { strokeWidth: 2 }, annotations: [
          {
            content: 'Enter text here',
            style: { color: '#000000', fontSize: 16 },
            offset: { x: 0.5, y: 0.5 },
            horizontalAlignment: 'Center'
          }
        ]
      },
      {
        id: 'Shape14', shape: { type: 'Basic', shape: 'Cylinder' }, style: { strokeWidth: 2 }, annotations: [
          {
            content: 'Enter text here',
            style: { color: '#000000', fontSize: 16 },
            offset: { x: 0.5, y: 0.5 },
            horizontalAlignment: 'Center'
          }
        ]
      },
      {
        id: 'Shape15', shape: { type: 'Basic', shape: 'Diamond' }, style: { strokeWidth: 2 }, annotations: [
          {
            content: 'Enter text here',
            style: { color: '#000000', fontSize: 16 },
            offset: { x: 0.5, y: 0.5 },
            horizontalAlignment: 'Center'
          }
        ]
      },
    ];
    return getSelectionShapes;
  }

  private getBitImage(): NodeModel[] {
    let imageShapes: NodeModel[] = [
      {
        id: "bitImage1",
        shape: { type: "Image", source: "" },
        style: { strokeWidth: 2 },
        annotations: [
          {
            content: "Enter Text Here",
            style: { color: '#000000', fontSize: 16 },
            offset: { x: 0.5, y: 1.2 },
            horizontalAlignment: 'Center'
          },
        ],
      }
    ];

    return imageShapes;
  }

  private getLimit1ImageShape(): NodeModel[] {
    let imageShapes: NodeModel[] = [
      {
        id: "Limit1Image",
        shape: { type: "Image", source: "" },
        style: { strokeWidth: 2 },
        annotations: [
          {
            content: "Enter Text Here",
            style: { color: '#000000', fontSize: 16 },
            offset: { x: 0.5, y: 1.2 },
            horizontalAlignment: 'Center'
          },
        ],
      }
    ];

    return imageShapes;
  }

  public palettes: PaletteModel[] = [

    // {
    //   id: "station",
    //   expanded: true,
    //   symbols: this.getAddStation(),
    //   title: "Add Station",
    // },
    // {
    //   id: "image",
    //   expanded: false,
    //   symbols: this.getImageShapes(),
    //   title: "Add Image",
    // },

    {
      id: "connectors",
      expanded: false,
      symbols: this.getConnectors(),
      title: "Line",
    },
    {
      id: "dateTime",
      expanded: false,
      symbols: this.getDateTimeShape(),
      title: "DateTime"
    },
    {
      id: "Limit1Value",
      expanded: false,
      symbols: this.getLimit1ValueShapes(),
      title: "Limit1Value",
    },
    {
      id: "Limit1Text",
      expanded: false,
      symbols: this.getLimit1TextShapes(),
      title: "Limit1Text",
    },
    {
      id: "Limit1Shape",
      expanded: false,
      symbols: this.getLimit1Shapes(),
      title: "Limit1Shape",
    },
    {
      id: "Limit1Image",
      expanded: false,
      symbols: this.getLimit1ImageShape(),
      title: "Limit1Image",
    },
    {
      id: "Limit2Value",
      expanded: false,
      symbols: this.getLimit2ValueShapes(),
      title: "Limit2Value",
    },
    // {
    //   id: "numeric2",
    //   expanded: false,
    //   symbols: this.getNumeric2Shapes(),
    //   title: "Numeric2",
    // },
    {
      id: "bitLable",
      expanded: false,
      symbols: this.getbitLableShape(),
      title: "Bit Lable",
    },
    {
      id: "bitShape",
      expanded: false,
      symbols: this.getBitShapes(),
      title: "Bit Shapes"
    },
    {
      id: "bitImage",
      expanded: false,
      symbols: this.getBitImage(),
      title: "Bit Image"
    },

    // {
    //   id: "bitDisplay2",
    //   expanded: false,
    //   symbols: this.getBitDisplay2Shape(),
    //   title: "Bit Display2",
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
    if (text.indexOf("Limit1Value") !== -1) {
      palettes.push({
        id: "Limit1Value",
        expanded: false,
        symbols: this.getLimit1ValueShapes(),
        title: "Limit1Value",
      });
    }

    if (text.indexOf("Limit2Value") !== -1) {
      palettes.push({
        id: "Limit2Value",
        expanded: false,
        symbols: this.getLimit2ValueShapes(),
        title: "Limit2Value",
      });
    }

    if (text.indexOf("Limit1Text") !== -1) {
      palettes.push({
        id: "Limit1Text",
        expanded: false,
        symbols: this.getLimit1TextShapes(),
        title: "Limit1Text",
      });
    }
    if (text.indexOf("Limit1Shape") !== -1) {
      palettes.push({
        id: "Limit1Shape",
        expanded: false,
        symbols: this.getLimit1Shapes(),
        title: "Limit1Shape",
      });
    }

    if (text.indexOf("Limit1Image") !== -1) {
      palettes.push({
        id: "Limit1Image",
        expanded: false,
        symbols: this.getLimit1ImageShape(),
        title: "Limit1Image",
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
    if (text.indexOf("bitLable") !== -1) {
      palettes.push({
        id: "bitLable",
        expanded: false,
        symbols: this.getbitLableShape(),
        title: "Bit Display1",
      });
    }
    // if (text.indexOf("bitDisplay2") !== -1) {
    //   palettes.push({
    //     id: "bitDisplay2",
    //     expanded: false,
    //     symbols: this.getNumeric2Shapes(),
    //     title: "Bit Display2",
    //   });
    // }
    if (text.indexOf("bitShape") !== -1) {
      palettes.push({
        id: "bitShape",
        expanded: false,
        symbols: this.getBitShapes(),
        title: "Bit Shapes",
      });
    }
    if (text.indexOf("bitImage") !== -1) {
      palettes.push({
        id: "bitImage",
        expanded: false,
        symbols: this.getBitImage(),
        title: "Bit Image",
      });
    }
    if (text.indexOf("dateTime") !== -1) {
      palettes.push({
        id: "dateTime",
        expanded: false,
        symbols: this.getDateTimeShape(),
        title: "DateTime",
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
