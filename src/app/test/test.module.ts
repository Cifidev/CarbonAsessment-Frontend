import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { TestRoutingModule } from './test-routing.module';
import { TestComponent } from './test.component';
import { ReactiveFormsModule } from "@angular/forms";


@NgModule({
  declarations: [
    TestComponent
  ],
  imports: [
    CommonModule,
    TestRoutingModule,
    ReactiveFormsModule, 
    TranslateModule
  ]
})
export class TestModule {
}
