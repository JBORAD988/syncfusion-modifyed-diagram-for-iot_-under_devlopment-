import { Injectable, ViewChild } from "@angular/core";
import { HomeComponent } from "../home/home.component";
import { BehaviorSubject, Observable } from "rxjs";
import { Router } from "@angular/router";

@Injectable({
  providedIn: "root",
})
export class DataShareService {
  private analogDataSubject = new BehaviorSubject<any>(null);
  private digitalDataSubject = new BehaviorSubject<any>(null);

  analogData$ = this.analogDataSubject.asObservable();
  digitalData$ = this.digitalDataSubject.asObservable();

  constructor(private route: Router) { }

  sendAnalogData(data: any) {
    this.analogDataSubject.next(data);
  }

  sendDigitalData(data: any) {
    this.digitalDataSubject.next(data);
  }

  private canvasDataSubject = new BehaviorSubject<any>(null);
  canvasData$ = this.canvasDataSubject.asObservable();


  sendCanvasData(data: any) {
    this.canvasDataSubject.next(data);
    this.route.navigate(['/canvas']);
  }

  private diagramDataSubject = new BehaviorSubject<any>(null);
  diagramData$ = this.diagramDataSubject.asObservable();

  sendDiagramData(data: any) {
    this.diagramDataSubject.next(data);
  }

  private selectedAnalogChannelSubject = new BehaviorSubject<any>(null);
  selectedAnalogChannel$ = this.selectedAnalogChannelSubject.asObservable();
  sendSelectedAnalogChannel(data: any) {
    this.selectedAnalogChannelSubject.next(data);
  }

  private selectedDigitalChannelSubject = new BehaviorSubject<any>(null);
  selectedDigitalChannel$ = this.selectedDigitalChannelSubject.asObservable();
  sendSelectedDigitalChannel(data: any) {
    this.selectedDigitalChannelSubject.next(data);
  }

  private selectedAnalogDataSubject = new BehaviorSubject<any>(null);
  selectedAnalogData$ = this.selectedAnalogDataSubject.asObservable();
  sendSelectedAnalogData(data: any) {
    this.selectedAnalogDataSubject.next(data);
  }

  private selectedDigitalDataSubject = new BehaviorSubject<any>(null);
  selectedDigitalData$ = this.selectedDigitalDataSubject.asObservable();
  sendSelectedDigitalData(data: any) {
    this.selectedDigitalDataSubject.next(data);
  }

}
