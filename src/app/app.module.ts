// In app.module.ts
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HttpClientModule, HttpClient } from "@angular/common/http";
import { ReactiveFormsModule } from "@angular/forms";
import { GreencrossService } from '@shared/services/greencross.service';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { AuthenticationService } from '@shared/services/authentication.service';
import { CommonModule, DatePipe } from '@angular/common';

import { CircularityLandingComponent } from './mainLanding/circularityLanding.component';
import { LandingComponent } from './landing/landing.component';  // Add this
import { UserInfoComponent } from './landing/user-info/user-info.component';  // Add this

export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http);
}

@NgModule({
  declarations: [
    AppComponent,
    CircularityLandingComponent,
    LandingComponent,      // Add this
    UserInfoComponent      // Add this
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    ReactiveFormsModule,
    CommonModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient],
      },
    }),
  ],
  providers: [
    GreencrossService, AuthenticationService, DatePipe
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }