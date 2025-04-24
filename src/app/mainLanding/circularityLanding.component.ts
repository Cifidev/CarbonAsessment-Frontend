import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-landing',
  templateUrl: './circularityLanding.component.html',
  styleUrls: ['./circularityLanding.component.scss']
})
export class CircularityLandingComponent {
  language: 'en' | 'es' = 'en';

  constructor(
    private translateService: TranslateService,
    private router: Router
  ) {
    // Set default language
    this.translateService.setDefaultLang('en');
    this.translateService.use('en');
  }

  toggleLanguage() {
    this.language = this.language === 'en' ? 'es' : 'en';
    this.translateService.use(this.language);
  }

  startAssessment() {
    console.log('Starting sustainability assessment');
    this.router.navigate(['/landing']);
  }
}