import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { AdminPanelRoutingModule } from './adminpanel-routing.module';
import { AdminPanelComponent } from './adminpanel.component';

@NgModule({
  declarations: [
    AdminPanelComponent,
  ],
  imports: [
    CommonModule,
    AdminPanelRoutingModule,
    ReactiveFormsModule
  ]
})
export class AdminPanelModule { }
