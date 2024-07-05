import { Component, Directive, OnInit } from '@angular/core';
import { CommonKeyboardCommands } from './scripts/commoncommands';

@Component({
  selector: 'app-root',
  /* tslint:disable */
  template: `
    <div class="db-container">
      <router-outlet></router-outlet>
    </div>
  `,
  /* tslint:enable */
})

export class AppComponent implements OnInit {

  ngOnInit(): void {
    CommonKeyboardCommands.initialize();
  }

}