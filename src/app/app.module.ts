// Module
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { FormsModule } from '@angular/forms';
import { NgxMasonryModule } from 'ngx-masonry';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
// Service
import { DatePipe } from '@angular/common';

// Component
import { AppComponent } from './app.component';
import { HomeComponent } from './Home/Home.component';
import { WallpaperLibraryComponent } from './WallpaperLibrary/WallpaperLibrary.component';
import { PageNotFoundComponent } from './PageNotFound/PageNotFound.component';
import { ProfileComponent } from './Profile/Profile.component';
import { ProfileCollectionComponent } from './ProfileCollection/ProfileCollection.component';
import { ProfileStatisticsComponent } from './ProfileStatistics/ProfileStatistics.component';
import { ProfileFollowersComponent } from './ProfileFollowers/ProfileFollowers.component';
import { ProfileFollowingComponent } from './ProfileFollowing/ProfileFollowing.component';
import { FooterComponent } from './Footer/Footer.component';

declare var $: any; // Jquery

@NgModule({
  declarations: [														
    AppComponent,
      HomeComponent,
      WallpaperLibraryComponent,
      PageNotFoundComponent,
      ProfileComponent,
      ProfileCollectionComponent,
      ProfileStatisticsComponent,
      ProfileFollowersComponent,
      ProfileFollowingComponent,
      FooterComponent
   ],
  imports: [
    FormsModule,
    BrowserModule,
    AppRoutingModule,
    NgxMasonryModule,

    BrowserModule, 
    BrowserAnimationsModule,
  ],
  providers: [
    DatePipe
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
