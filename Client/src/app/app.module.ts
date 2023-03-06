// Module
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxMasonryModule } from 'ngx-masonry';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';

// Component
import { HomeComponent } from './Home/Home.component';
import { AppComponent } from './app.component';
import { LoginComponent } from './Login/Login.component';
import { ProfileGalleryComponent } from './ProfileGallery/ProfileGallery.component';
import { PageNotFoundComponent } from './PageNotFound/PageNotFound.component';
import { ProfileComponent } from './Profile/Profile.component';
import { ProfileCollectionComponent } from './ProfileCollection/ProfileCollection.component';
import { FooterComponent } from './Footer/Footer.component';
import { UploadWallpaperComponent } from './UploadWallpaper/UploadWallpaper.component';
import { HeaderComponent } from './Header/Header.component';

// Pipe
import { ShortNumberPipe } from './Pipe/ShortNumber.pipe';
import { DatePipe } from '@angular/common';
import { initializeApp,provideFirebaseApp } from '@angular/fire/app';
import { environment } from '../environments/environment';
import { provideAuth,getAuth } from '@angular/fire/auth';
import { AngularFireModule } from '@angular/fire/compat';
import { AngularFireAuthModule } from '@angular/fire/compat/auth';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    ProfileGalleryComponent,
    PageNotFoundComponent,
    ProfileComponent,
    ProfileCollectionComponent,
    FooterComponent,
    ShortNumberPipe,
    UploadWallpaperComponent,
    HeaderComponent,
    HeaderComponent,
    HomeComponent,
    UploadWallpaperComponent
  ],
  imports: [
    ReactiveFormsModule,
    FormsModule,
    BrowserModule,
    AppRoutingModule,
    NgxMasonryModule,
    HttpClientModule,
    BrowserModule,
    BrowserAnimationsModule,
    provideFirebaseApp(() => initializeApp(environment)),
    provideAuth(() => getAuth()),
    AngularFireModule.initializeApp(environment),
    AngularFireAuthModule,
  ],
  providers: [
    DatePipe
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
