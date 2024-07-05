/**
 * Page Handler
 */
import { Button } from '@syncfusion/ej2-buttons';
import { SelectorViewModel } from './selector';
import { Ajax } from '@syncfusion/ej2-base';
import { Diagram, SnapConstraints } from '@syncfusion/ej2-diagrams';
import { MindMapUtilityMethods, MindMap } from './mindmap';
import { OrgChartUtilityMethods, OrgChartData } from './orgchart';
import { inject } from '@angular/core';
import { DataShareService } from '../service/data-share.service';

export class PageOptions {
    public name: string;
    public diagram?: any;
    public text: string;
    public templateDiagramType: string;
    public mindmapTemplateType: string;
    public orgChartTemplateType: string;
}

export class PageCreation {

    public pageOptionList: PageOptions[] = [];
    public activePage: PageOptions;
    public selectedItem: SelectorViewModel;
    public pageSwitch: boolean = false;
    constructor(selectedItem: SelectorViewModel) {
        this.selectedItem = selectedItem;
    }

    public generatePageButtons(pages: PageOptions[]): void {
        let pageOptionElement: HTMLDivElement = document.getElementById('pageOptionList') as HTMLDivElement;
        let pageContainerWidth: number = pageOptionElement.parentElement.getBoundingClientRect().width - 1;
        let buttonWidth: number = 75;
        if (pages.length * buttonWidth > pageContainerWidth) {
            buttonWidth = (pageContainerWidth - 32) / pages.length;
        }
        while (pageOptionElement.hasChildNodes()) {
            pageOptionElement.removeChild(pageOptionElement.lastChild);
        }
        for (let i: number = 0; i < pages.length; i++) {
            let pageOption: PageOptions = pages[i];
            let buttonElement: HTMLButtonElement = document.createElement('button');
            buttonElement.setAttribute('id', pageOption.name);
            buttonElement.setAttribute('style', 'width:' + buttonWidth + 'px');
            buttonElement.setAttribute('title', pageOption.text);
            buttonElement.onclick = this.showPageData.bind(this);
            pageOptionElement.appendChild(buttonElement);
            let pageButton: Button = new Button({
                content: pageOption.text
            });
            pageButton.appendTo(buttonElement);
            if (this.activePage.name === pageOption.name) {
                buttonElement.classList.add('db-active-page');
            }
        }
        let buttonElement: HTMLButtonElement = document.createElement('button');
        buttonElement.setAttribute('id', 'addNewPage');
        pageOptionElement.appendChild(buttonElement);
        buttonElement.setAttribute('style', 'width:32px');
        buttonElement.onclick = this.addNewPage.bind(this);
        let pageButton: Button = new Button({
            iconCss: 'sf-icon-Plus'
        });
        pageButton.appendTo(buttonElement);
    }

    public showPageData(evt: MouseEvent): void {
        let target: HTMLButtonElement = evt.target as HTMLButtonElement;
        let page1: PageOptions = this.findPage(target.id);
        if (page1 != null) {
            if (this.activePage) {
                let button: HTMLElement = document.getElementById(this.activePage.name);
                if (button.classList.contains('db-active-page')) {
                    button.classList.remove('db-active-page');
                }
                this.saveDiagramSettings();
            }
            this.activePage = page1;
            this.pageSwitch = true;
            this.loadDiagramSettings();
            this.pageSwitch = false;
        }
        target.classList.add('db-active-page');
    }

    public findPage(id: string): PageOptions {
        for (let i: number = 0; i < this.pageOptionList.length; i++) {
            if (this.pageOptionList[i].name === id) {
                return this.pageOptionList[i];
            }
        }
        return null;
    }

    public addNewPage(): void {
        if (this.activePage) {
            this.saveDiagramSettings();
            this.selectedItem.selectedDiagram.clear();
        }
        if (this.selectedItem.diagramType === 'MindMap') {
            MindMapUtilityMethods.createEmptyMindMap();
            this.selectedItem.selectedDiagram.doLayout();
        } else if (this.selectedItem.diagramType === 'OrgChart') {
            OrgChartUtilityMethods.createEmptyOrgChart();
            this.selectedItem.selectedDiagram.doLayout();
        }
        this.activePage = new PageOptions();
        this.activePage.name = 'page' + (this.pageOptionList.length + 1);
        this.activePage.text = 'Page' + (this.pageOptionList.length + 1);
        this.pageOptionList.push(this.activePage);
        this.generatePageButtons(this.pageOptionList);
    }

    dataService = inject(DataShareService);

    public savePage(): string {

        let diagram: Diagram = this.selectedItem.selectedDiagram;
        console.log('diagram', diagram);

        let pageData: { [key: string]: Object } = {};
        this.saveDiagramSettings();
        pageData.pageOptionList = this.pageOptionList;
        pageData.activePage = this.activePage.name;
        pageData.diagramType = this.selectedItem.diagramType;
        console.log('diagram', diagram);

        diagram.nodes.forEach(diagramElement => {
            console.log('diagramElement.annotations[0].tagName', diagramElement.annotations[0].tagName);
            pageData.pageOptionList[0].diagram.nodes.forEach(pageElement => {

                if ((diagramElement.id.includes("Shape") || diagramElement.id.includes("bit") || diagramElement.id.includes("numeric")) && pageElement.annotations[0].content == diagramElement.annotations[0].content && pageElement.id == diagramElement.id) {
                    pageElement.annotations[0].content = diagramElement.annotations[0].content ? diagramElement.annotations[0].content : "";

                    if (diagramElement.id.includes("bitImage")) {
                        pageElement.annotations[0].bitTempSource = diagramElement.shape.source;
                    }

                    pageElement.annotations[0].tagName = diagramElement.annotations[0].tagName;
                    pageElement.annotations[0].textAnalogChName = diagramElement.annotations[0].textAnalogChName;
                    pageElement.annotations[0].textTooltip = diagramElement.annotations[0].textTooltip;
                    pageElement.annotations[0].isTextInvincible = diagramElement.annotations[0].isTextInvincible;
                    pageElement.annotations[0].textLowLimitValue = diagramElement.annotations[0].textLowLimitValue;
                    pageElement.annotations[0].textLowLimitCheckColor = diagramElement.annotations[0].textLowLimitCheckColor;
                    pageElement.annotations[0].textLowLimitColorValue = diagramElement.annotations[0].textLowLimitColorValue;
                    pageElement.annotations[0].textLowLimitCheckText = diagramElement.annotations[0].textLowLimitCheckText;
                    pageElement.annotations[0].textLowLimitTextValue = diagramElement.annotations[0].textLowLimitTextValue;
                    pageElement.annotations[0].textLowLimitCheckShape = diagramElement.annotations[0].textLowLimitCheckShape;
                    pageElement.annotations[0].textLowLimitShapeValue = diagramElement.annotations[0].textLowLimitShapeValue;
                    pageElement.annotations[0].textLowLimiChecktAudio = diagramElement.annotations[0].textLowLimitCheckAudio;
                    pageElement.annotations[0].textLowLimitAudioValue = diagramElement.annotations[0].textLowLimitAudioValue;
                    pageElement.annotations[0].textLowLimitBlinkTimeCheck = diagramElement.annotations[0].textLowLimitBlinkTimeCheck;
                    pageElement.annotations[0].textLowLimitBlinkContCheck = diagramElement.annotations[0].textLowLimitBlinkContCheck;
                    pageElement.annotations[0].textLowLimitBlinkTime = diagramElement.annotations[0].textLowLimitBlinkTime;
                    pageElement.annotations[0].textHighLimitBlinkTimeCheck = diagramElement.annotations[0].textHighLimitBlinkTimeCheck;
                    pageElement.annotations[0].textHighLimitBlinkContCheck = diagramElement.annotations[0].textHighLimitBlinkContCheck;
                    pageElement.annotations[0].textHighLimitBlinkTime = diagramElement.annotations[0].textHighLimitBlinkTime;
                    pageElement.annotations[0].textHighLimitValue = diagramElement.annotations[0].textHighLimitValue;
                    pageElement.annotations[0].textHighLimitCheckColor = diagramElement.annotations[0].textHighLimitCheckColor;
                    pageElement.annotations[0].textHighLimitColorValue = diagramElement.annotations[0].textHighLimitColorValue;
                    pageElement.annotations[0].textHighLimitCheckText = diagramElement.annotations[0].textHighLimitCheckText;
                    pageElement.annotations[0].textHighLimitTextValue = diagramElement.annotations[0].textHighLimitTextValue;
                    pageElement.annotations[0].textHighLimitCheckShape = diagramElement.annotations[0].textHighLimitCheckShape;
                    pageElement.annotations[0].textHighLimitShapeValue = diagramElement.annotations[0].textHighLimitShapeValue;
                    pageElement.annotations[0].textHighLimiChecktAudio = diagramElement.annotations[0].textHighLimitCheckAudio;
                    pageElement.annotations[0].textHighLimitAudioValue = diagramElement.annotations[0].textHighLimitAudioValue;
                    pageElement.annotations[0].textAudioFile = diagramElement.annotations[0].textAudioFile;
                    pageElement.annotations[0].textCheckAudio = diagramElement.annotations[0].textCheckAudio;
                    pageElement.annotations[0].textOperation = diagramElement.annotations[0].textOperation;
                    pageElement.annotations[0].textSetValue = diagramElement.annotations[0].textSetValue;
                    pageElement.annotations[0].textCheckColor = diagramElement.annotations[0].textCheckColor;
                    pageElement.annotations[0].textSetColor = diagramElement.annotations[0].textSetColor;
                    pageElement.annotations[0].textCheckStr = diagramElement.annotations[0].textCheckStr;
                    pageElement.annotations[0].textSetStr = diagramElement.annotations[0].textSetStr;
                    pageElement.annotations[0].textContinueBlink = diagramElement.annotations[0].textContinueBlink;
                    pageElement.annotations[0].textIsChecked = diagramElement.annotations[0].textIsChecked;
                    pageElement.annotations[0].textBlinkTime = diagramElement.annotations[0].textBlinkTime;
                    pageElement.annotations[0].analogUnit = diagramElement.annotations[0].analogUnit;
                    pageElement.annotations[0].textDecimal = diagramElement.annotations[0].textDecimal;
                    pageElement.annotations[0].normalContinueBlink = diagramElement.annotations[0].normalContinueBlink;


                    pageElement.annotations[0].bitTagName = diagramElement.annotations[0].bitTagName;
                    pageElement.annotations[0].bitTextChName = diagramElement.annotations[0].bitTextChName;
                    pageElement.annotations[0].hideOnNormal = diagramElement.annotations[0].hideOnNormal;
                    pageElement.annotations[0].hideOnAbNormal = diagramElement.annotations[0].hideOnAbNormal;
                    pageElement.annotations[0].bit1Color = diagramElement.annotations[0].bit1Color;
                    pageElement.annotations[0].bit0Color = diagramElement.annotations[0].bit0Color;
                    pageElement.annotations[0].normalTimeBlink = diagramElement.annotations[0].normalTimeBlink;
                    pageElement.annotations[0].normalTimeBlinkValue = diagramElement.annotations[0].normalTimeBlinkValue;
                    pageElement.annotations[0].bitSet1asNormal = diagramElement.annotations[0].bitSet1asNormal;
                    pageElement.annotations[0].bitSet1asAbnormal = diagramElement.annotations[0].bitSet1asAbnormal;
                    pageElement.annotations[0].bitCheck1to0 = diagramElement.annotations[0].bitCheck1to0;
                    pageElement.annotations[0].bitCheck0to1 = diagramElement.annotations[0].bitCheck0to1;
                    pageElement.annotations[0].bitCondiConBlink1to0 = diagramElement.annotations[0].bitCondiConBlink1to0;
                    pageElement.annotations[0].bitCondiTimeBlink1to0 = diagramElement.annotations[0].bitCondiTimeBlink1to0;
                    pageElement.annotations[0].bitCondiBlinkTimeValue1to0 = diagramElement.annotations[0].bitCondiBlinkTimeValue1to0;
                    pageElement.annotations[0].bitCondiConBlink0to1 = diagramElement.annotations[0].bitCondiConBlink0to1;
                    pageElement.annotations[0].bitCondiTimeBlink0to1 = diagramElement.annotations[0].bitCondiTimeBlink0to1;
                    pageElement.annotations[0].bitCondiBlinkTimeValue0to1 = diagramElement.annotations[0].bitCondiBlinkTimeValue0to1;
                    pageElement.annotations[0].bitShapeColor1to0 = diagramElement.annotations[0].bitShapeColor1to0;
                    pageElement.annotations[0].bitShapeColor0to1 = diagramElement.annotations[0].bitShapeColor0to1;
                    pageElement.annotations[0].bitAudio1to0 = diagramElement.annotations[0].bitAudio1to0;
                    pageElement.annotations[0].bitAudio0to1 = diagramElement.annotations[0].bitAudio0to1;
                    pageElement.annotations[0].bitTextFor1 = diagramElement.annotations[0].bitTextFor1;
                    pageElement.annotations[0].bitTextFor0 = diagramElement.annotations[0].bitTextFor0;
                    pageElement.annotations[0].bitTextColorFor0 = diagramElement.annotations[0].bitTextColorFor0;
                    pageElement.annotations[0].bitTextColorFor1 = diagramElement.annotations[0].bitTextColorFor1;
                    pageElement.annotations[0].bitImagefor1 = diagramElement.annotations[0].bitImagefor1;
                    pageElement.annotations[0].bitImagefor0 = diagramElement.annotations[0].bitImagefor0;
                    pageElement.annotations[0].bitImageFor1to0 = diagramElement.annotations[0].bitImageFor1to0;
                    pageElement.annotations[0].bitImageFor0to1 = diagramElement.annotations[0].bitImageFor0to1;

                    pageElement.ports.forEach(element => {
                        element.constraints = 0;
                    });


                } else {
                    if (pageElement.annotations[0].content == diagramElement.annotations[0].content) {
                        pageElement.annotations[0].isChecked = diagramElement.annotations[0].blinkCheck;
                        pageElement.annotations[0].blinkTime = diagramElement.annotations[0].blinkTime
                    }
                }

            });
        })




        this.dataService.selectedAnalogChannel$.subscribe(data => {
            pageData.pageOptionList[0].diagram.analogChannel = data;
        });

        this.dataService.selectedDigitalChannel$.subscribe(data => {
            pageData.pageOptionList[0].diagram.digitalChannel = data;
        });


        pageData.pageOptionList[0].diagram.analogData = this.selectedItem.nodeProperties.analogData;
        pageData.pageOptionList[0].diagram.digitalData = this.selectedItem.nodeProperties.digitalData;

        return JSON.stringify(pageData);
    }

    public loadPage(savedData: string): void {
        let pageData: { [key: string]: Object } = JSON.parse(savedData);
        this.pageOptionList = pageData.pageOptionList as PageOptions[];
        this.activePage = this.findPage(pageData.activePage.toString());
        this.selectedItem.diagramType = pageData.diagramType.toString();
        this.generatePageButtons(this.pageOptionList);
    }

    public saveDiagramSettings(): void {
        this.activePage.diagram = JSON.parse(this.selectedItem.selectedDiagram.saveDiagram());
        if (this.selectedItem.diagramType === 'MindMap') {
            this.activePage.mindmapTemplateType = MindMapUtilityMethods.templateType;
        }
    }

    public loadDiagramSettings(): void {
        let diagram: Diagram = this.selectedItem.selectedDiagram;
        document.getElementsByClassName('sidebar')[0].className = 'sidebar show-overview';
        this.selectedItem.isLoading = true;
        diagram.loadDiagram(JSON.stringify(this.activePage.diagram));
        diagram.clearSelection();
        this.selectedItem.isLoading = false;
        document.getElementsByClassName('sidebar')[0].className = 'sidebar';
        if (this.selectedItem.diagramType === 'MindMap') {
            MindMapUtilityMethods.templateType = this.activePage.mindmapTemplateType;
            if (!this.pageSwitch && !this.selectedItem.isTemplateLoad) {
                MindMapUtilityMethods.selectedItem = this.selectedItem;
                let map: MindMap = new MindMap(this.selectedItem);
                map.createMindMap(false);
            }
            let closeIconDiv: HTMLElement = (document.getElementById('diagram').querySelector('#closeIconDiv') as HTMLElement);
            if (closeIconDiv) {
                closeIconDiv.onclick = MindMapUtilityMethods.onHideNodeClick.bind(MindMapUtilityMethods);
            }
        }
        if (this.selectedItem.diagramType === 'OrgChart') {
            if (!this.pageSwitch && !this.selectedItem.isTemplateLoad) {
                OrgChartUtilityMethods.selectedItem = this.selectedItem;
                let org: OrgChartData = new OrgChartData(this.selectedItem);
                org.createOrgChart(false);
            }
            let closeIconDiv: HTMLElement = (document.getElementById('diagram').querySelector('#closeIconDiv') as HTMLElement);
            if (closeIconDiv) {
                closeIconDiv.onclick = OrgChartUtilityMethods.onHideNodeClick.bind(OrgChartUtilityMethods);
            }
        }
        let btnView: any = document.getElementById('btnViewMenu');
        btnView = btnView.ej2_instances[0];
        if (diagram.rulerSettings) {
            btnView.items[5].iconCss = diagram.rulerSettings.showRulers ? 'sf-icon-Selection' : '';
            let containerDiv: HTMLElement = document.getElementById('diagramContainerDiv');
            if (!diagram.rulerSettings.showRulers) {
                containerDiv.classList.remove('db-show-ruler');
            } else {
                if (!containerDiv.classList.contains('db-show-ruler')) {
                    containerDiv.classList.add('db-show-ruler');
                }
            }
        }
        if (diagram.snapSettings) {
            btnView.items[6].iconCss = (diagram.snapSettings.constraints & SnapConstraints.SnapToObject) ? 'sf-icon-Selection' : '';
            btnView.items[7].iconCss = (diagram.snapSettings.constraints & SnapConstraints.ShowLines) ? 'sf-icon-Selection' : '';
            btnView.items[9].iconCss = (diagram.snapSettings.constraints & SnapConstraints.SnapToLines) ? 'sf-icon-Selection' : '';
        }
    }

    public loadJson(): void {
        if (!this.selectedItem.uniqueId) {
            this.selectedItem.uniqueId = this.selectedItem.randomIdGenerator();
        }
        if (this.selectedItem.isModified) {
            let spanElement: HTMLSpanElement = document.getElementById('diagramreport') as HTMLSpanElement;
            spanElement.innerHTML = 'Saving';
            this.selectedItem.isModified = false;
            let save: string = this.savePage();
            let ajax: Ajax = new Ajax('https://ej2services.syncfusion.com/production/web-services/api/Diagram/SaveJson', 'POST', true, 'application/json');
            let data: string = JSON.stringify({
                DiagramName: this.selectedItem.uniqueId,
                DiagramContent: save,
            });
            ajax.send(data).then();
            let context: any = this;
            ajax.onSuccess = (data: string): void => {
                //if (window.location.pathname.length === 1) {
                let uri: string = window.location.origin + this.selectedItem.getAbsolutePath() + '?id=' + this.selectedItem.uniqueId;
                window.history.replaceState(null, null, uri);
                context.isModified = false;
                spanElement.innerHTML = 'Saved';
                //}
            };
            ajax.onFailure = (args: string): void => {
                context.isModified = false;
                spanElement.innerHTML = 'Offline';
            };
            ajax.onError = (args: Event): Object => {
                context.isModified = false;
                spanElement.innerHTML = 'Offline';
                return null;
            };
        }
    }
}




