import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HttpClientModule, HttpClient } from "@angular/common/http";
import { ReactiveFormsModule } from "@angular/forms";
import { GoogleTagManagerModule } from "angular-google-tag-manager";
import { GreencrossService } from '@shared/services/greencross.service';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { AuthenticationService } from '@shared/services/authentication.service';

export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http);
}
@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    ReactiveFormsModule,
    GoogleTagManagerModule.forRoot({
      id: 'G-FD9PXZ4KPC',
    }),
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient],
      },
    }),
  ],
  providers: [
    GreencrossService,AuthenticationService
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
