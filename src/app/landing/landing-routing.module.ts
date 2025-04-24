import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CircularityLandingComponent } from '../mainLanding/circularityLanding.component';

const routes: Routes = [{ path: '', component: CircularityLandingComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LandingRoutingModule { }
