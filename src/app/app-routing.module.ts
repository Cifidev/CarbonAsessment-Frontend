import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UserInfoGuard } from "@shared/guards/user-info.guard";

const routes: Routes = [
    { path: '', loadChildren: () => import('./landing/landing.module').then(m => m.LandingModule) },
    { path: 'test', loadChildren: () => import('./test/test.module').then(m => m.TestModule), canActivate: [UserInfoGuard] },
    { path: 'login', loadChildren: () => import('./login/login.module').then(m => m.LoginModule) },
    { path: 'adminPanel', loadChildren: () => import('./adminPanel/adminpanel.module').then(m => m.AdminPanelModule) }
  ]
;

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true, scrollPositionRestoration: 'enabled' })],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
