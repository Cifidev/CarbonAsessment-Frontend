import { Component } from '@angular/core';
import { NavigationEnd, Router } from "@angular/router";
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-root',
  template: '<router-outlet></router-outlet>',
})
export class AppComponent {
  constructor(translate: TranslateService, private router: Router) {
    translate.setDefaultLang('en');
    this.router.events.forEach(item => {
     
    });
  }
}
