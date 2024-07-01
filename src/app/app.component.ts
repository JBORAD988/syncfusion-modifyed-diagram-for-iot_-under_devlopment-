import { Component, OnInit } from '@angular/core';
import { CommonKeyboardCommands } from './scripts/commoncommands';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit{
  title = 'migration-demo';

  ngOnInit(): void {
    CommonKeyboardCommands.initialize();
  }


}
