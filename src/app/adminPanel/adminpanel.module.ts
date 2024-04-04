import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { AdminPanelRoutingModule } from './adminpanel-routing.module';
import { AdminPanelComponent } from './adminpanel.component';
import { TranslateModule } from '@ngx-translate/core';
@NgModule({
  declarations: [
    AdminPanelComponent,
  ],
  imports: [
    CommonModule,
    AdminPanelRoutingModule,
    ReactiveFormsModule,
    TranslateModule,
    
  ]
})
export class AdminPanelModule { }
