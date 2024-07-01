import { Injectable } from "@angular/core";


@Injectable({
  providedIn: "root",
})
export class PopupService {
  isVisible: boolean = false;
  positionX: number = 0;
  positionY: number = 0;

  constructor() { }
  popups: any[] = [];


  openPopup(popupData: any) {

    this.isVisible = true;

    const isUnique = !(this.popups.filter(popup => popup.x === popupData.x && popup.y === popupData.y).length > 0);

    if (popupData.x !== 0 && popupData.y !== 0 && isUnique && popupData.nodeProperties.analogData != null && popupData.nodeProperties.digitalData != null) {
      this.popups.push(popupData);
    }


  }

  closePopup(popupData: any) {
    const index = this.popups.indexOf(popupData);
    if (index > -1) {
      this.popups.splice(index, 1);
    }
  }

  getPopups() {
    return this.popups;
  }

  showPopup(x: number, y: number) {
    this.positionX = x;
    this.positionY = y;
    this.isVisible = true;
  }


  hidePopup() {
    this.isVisible = false;
  }

  isPopupVisible(): boolean {
    return this.isVisible;
  }

  getPopupPosition(): { x: number; y: number } {
    return { x: this.positionX, y: this.positionY };
  }
}
