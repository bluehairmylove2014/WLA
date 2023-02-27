// Module
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { FormsModule } from '@angular/forms';
import { NgxMasonryModule } from 'ngx-masonry';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';
// Service
import { DatePipe } from '@angular/common';

// Component
import { AppComponent } from './app.component';
import { LoginComponent } from './Login/Login.component';
import { ProfileGalleryComponent } from './ProfileGallery/ProfileGallery.component';
import { PageNotFoundComponent } from './PageNotFound/PageNotFound.component';
import { ProfileComponent } from './Profile/Profile.component';
import { ProfileCollectionComponent } from './ProfileCollection/ProfileCollection.component';
import { ProfileStatisticsComponent } from './ProfileStatistics/ProfileStatistics.component';
import { ProfileFollowersComponent } from './ProfileFollowers/ProfileFollowers.component';
import { ProfileFollowingComponent } from './ProfileFollowing/ProfileFollowing.component';
import { FooterComponent } from './Footer/Footer.component';
import { UploadWallpaperComponent } from './UploadWallpaper/UploadWallpaper.component';
import { HeaderComponent } from './Header/Header.component';
// Pipe
import { ShortNumberPipe } from './Pipe/ShortNumber.pipe';
import { HomeComponent } from './Home/Home.component';

@NgModule({
  declarations: [																			
    AppComponent,
    LoginComponent,
    ProfileGalleryComponent,
    PageNotFoundComponent,
    ProfileComponent,
    ProfileCollectionComponent,
    ProfileStatisticsComponent,
    ProfileFollowersComponent,
    ProfileFollowingComponent,
    FooterComponent,

    ShortNumberPipe,
      UploadWallpaperComponent,
      HeaderComponent,
      HeaderComponent,
      HomeComponent,
      UploadWallpaperComponent
   ],
  imports: [
    FormsModule,
    BrowserModule,
    AppRoutingModule,
    NgxMasonryModule,
    HttpClientModule,
    BrowserModule, 
    BrowserAnimationsModule,
  ],
  providers: [
    DatePipe
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
