import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-landing',
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.scss']
})
export class LandingComponent implements OnInit {
  isUserInfoVisible = false;

  constructor(public translate: TranslateService) {
    // Set default language
    this.translate.setDefaultLang('en');
    this.translate.use('en');
  }

  ngOnInit(): void {
  }

  showUserInfo() { 
    localStorage.clear();
    this.isUserInfoVisible = true;
  }

  clickEnglish() {
    this.translate.use('en');
  }

  clickSpanish() {
    this.translate.use('es');
  }
}
