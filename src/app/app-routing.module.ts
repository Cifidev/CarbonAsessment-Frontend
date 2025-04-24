import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from '@shared/guards/auth.guard';
import { UserInfoGuard } from "@shared/guards/user-info.guard";
import { CircularityLandingComponent } from './mainLanding/circularityLanding.component';
import { LandingComponent } from './landing/landing.component';

const routes: Routes = [
    { path: '', component: CircularityLandingComponent },
    { path: 'landing', component: LandingComponent },
    { path: 'test', loadChildren: () => import('./test/test.module').then(m => m.TestModule), canActivate: [UserInfoGuard] },
    { path: 'viewTest', loadChildren: () => import('./test/test.module').then(m => m.TestModule)},
    { path: 'login', loadChildren: () => import('./login/login.module').then(m => m.LoginModule) },
    { path: 'adminPanel', loadChildren: () => import('./adminPanel/adminpanel.module').then(m => m.AdminPanelModule), canActivate: [AuthGuard] }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true, scrollPositionRestoration: 'enabled' })],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
