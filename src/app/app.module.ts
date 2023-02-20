import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './Home/Home.component';
import { FormsModule } from '@angular/forms';
import { WallpaperLibraryComponent } from './WallpaperLibrary/WallpaperLibrary.component';
import { DatePipe } from '@angular/common';

declare var $: any; // Jquery

@NgModule({
  declarations: [						
    AppComponent,
      HomeComponent,
      WallpaperLibraryComponent
   ],
  imports: [
    FormsModule,
    BrowserModule,
    AppRoutingModule
  ],
  providers: [
    DatePipe
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
