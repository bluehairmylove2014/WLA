// Module
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

// Guard
import { AuthGuard } from './auth.guard';
import { HomeComponent } from './Home/Home.component';

// Component
import { LoginComponent } from './Login/Login.component';
import { PageNotFoundComponent } from './PageNotFound/PageNotFound.component';
import { ProfileComponent } from './Profile/Profile.component';

const routes: Routes = [
  {path: '', component: HomeComponent},
  {path: 'login', component: LoginComponent, canActivate: [AuthGuard]},
  {path: 'profile/:username', redirectTo: 'profile/:username/gallery', pathMatch: 'full'},
  {path: 'profile/:username/:tab', component: ProfileComponent, canActivate: [AuthGuard]},
  {path: '**', component: PageNotFoundComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
