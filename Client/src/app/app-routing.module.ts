// Module
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

// Component
import { HomeComponent } from './Home/Home.component';
import { PageNotFoundComponent } from './PageNotFound/PageNotFound.component';
import { ProfileComponent } from './Profile/Profile.component';
import { ShortNumberPipe } from './ShortNumber.pipe';

const routes: Routes = [
  {path: '', component: HomeComponent},
  {path: 'profile/:userId', component: ProfileComponent},
  {path: 'profile', component: ProfileComponent},
  {path: '**', component: PageNotFoundComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
