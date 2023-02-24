
import {
  ChangeDetectorRef,
  Component,
  ElementRef,
  HostListener,
  Input,
  OnInit,
  ViewChild
} from '@angular/core';
import { NgxMasonryComponent } from 'ngx-masonry';
// Import Component
import { Wallpaper } from '../common/Wallpaper';
// API
import { ApiService } from '../api.service';

@Component({
  selector: 'app-WallpaperLibrary',
  templateUrl: './WallpaperLibrary.component.html',
  styleUrls: ['./WallpaperLibrary.component.css']
})
export class WallpaperLibraryComponent implements OnInit {
  @Input() wallpapers_data: Wallpaper[] = [] as Wallpaper[];
  // Referrences
  @ViewChild('wppholder') wallpaperHolder!: ElementRef;
  @ViewChild(NgxMasonryComponent) masonry!: NgxMasonryComponent;

  // Variables
  masonryOptions = {
    transitionDuration: '0.2s',
    gutter: 0,
    resize: true,
    initLayout: true
  };

  constructor(
    private cd: ChangeDetectorRef,
    private api_service: ApiService
  ) { }
  // Methods
  countArray(n: number): number[] {
    if (n > 4) {
      return Array.from({ length: n }, (_, i) => i + 1);
    }
    else {
      return Array.from({ length: n }, (_, i) => i + 1);
    }
  }
  reloadLayout():void {
    this.masonry.reloadItems();
    this.masonry.layout();
  }
  downloadWallpaper(event: any):void {
    const img_element = event.target.parentElement.querySelector('img');
    if(img_element) {
      const imageSource = img_element.src; // replace with your image source
      const fileName = 'swallpapers_image.png';
      const a = document.createElement('a');
      a.href = imageSource;
      a.download = fileName;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);

      // Call api to update download in server
      this.api_service.increaseDownloadWallpaper(img_element.getAttribute('data-wppid'));
    }
  }
  loveWallpaper(event:any):void {
    const img_element = event.target.parentElement.querySelector('img');
    const icon_element = event.target.querySelector('i');;
    const wpp_id = img_element.getAttribute('data-wppid');
    
    if(icon_element.classList.contains('fi-rr-heart')) {
      icon_element.classList.replace('fi-rr-heart', 'fi-sr-heart')
      icon_element.classList.add('loveactive')
      // Call api to update love in server
      this.api_service.increaseLoveWallpaper(wpp_id);
    }
    else if(icon_element.classList.contains('fi-sr-heart')) {
      icon_element.classList.replace('fi-sr-heart', 'fi-rr-heart')
      icon_element.classList.remove('loveactive')
      // Call api to update love in server
      this.api_service.decreaseLoveWallpaper(wpp_id);
    }
  }
  saveWallpaper(event:any):void {
    const img_element = event.target.parentElement.querySelector('img');
    const icon_element = event.target.querySelector('i');;
    const wpp_id = img_element.getAttribute('data-wppid');
    
    if(icon_element.classList.contains('fi-rr-bookmark')) {
      icon_element.classList.replace('fi-rr-bookmark', 'fi-sr-bookmark')
      icon_element.classList.add('bookmarkactive')
    }
    else if(icon_element.classList.contains('fi-sr-bookmark')) {
      icon_element.classList.replace('fi-sr-bookmark', 'fi-rr-bookmark')
      icon_element.classList.remove('bookmarkactive')
    }
  }
  
  // Hook
  ngOnInit() {
  }
  ngAfterViewInit(): void {

    this.cd.markForCheck();
  }
}
