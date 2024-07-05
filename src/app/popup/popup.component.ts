import { Component } from '@angular/core';
import { SelectorViewModel } from '../scripts/selector';
import { PopupService } from '../service/popup.service';

@Component({
  selector: 'app-popup',
  templateUrl: './popup.component.html',
  styleUrls: ['./popup.component.css']
})
export class PopupComponent {

  public selectedItem: SelectorViewModel = new SelectorViewModel();

  constructor(public popupService: PopupService) { }

}
