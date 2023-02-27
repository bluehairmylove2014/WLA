
import {
  ChangeDetectorRef,
  Component,
  ElementRef,
  EventEmitter,
  HostListener,
  Input,
  OnInit,
  Output,
  ViewChild
} from '@angular/core';
import { NgxMasonryComponent } from 'ngx-masonry';
// Import Component
import { Wallpaper } from '../common/Wallpaper';
// API
import { ApiService } from '../Service/api.service';

@Component({
  selector: 'app-ProfileGallery',
  templateUrl: './ProfileGallery.component.html',
  styleUrls: ['./ProfileGallery.component.css']
})
export class ProfileGalleryComponent implements OnInit {
  @Input() wallpapers_data: Wallpaper[] = [] as Wallpaper[];
  @Input() download_count: number = 0;
  @Input() user_id: string = '';
  @Output() loveManagement = new EventEmitter<object>();
  @Output() downloadManagement = new EventEmitter<number>();
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
  reloadLayout():void {
    this.masonry.reloadItems();
    this.masonry.layout();
  }
  isLoved(wpp_id:number):boolean {
    let result = false;
    this.wallpapers_data.forEach(wpp => {
      if(wpp.wpp_id === wpp_id && wpp.lover.includes(this.user_id)) {
        result = true;
      }
    })
    return result;
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

      // Update total download in Profile component (parent)
      this.downloadManagement.emit(this.download_count + 1)
      // Call api to update download in server
      this.api_service.increaseDownloadWallpaper(img_element.getAttribute('data-wppid'));
    }
  }
  loveWallpaper(event:any):void {
    const img_element = event.target.parentElement.querySelector('img');
    const icon_element = event.target.querySelector('i');;
    const wpp_id = img_element.getAttribute('data-wppid');
    
    if(icon_element.classList.contains('fi-rr-heart')) {
      // Update total love in Profile component (parent)
      this.loveManagement.emit({
        type: 'love',
        targetId: Number.parseInt(wpp_id)
      });
      // Call api to update love in server
      this.api_service.updateLoveWallpaper(wpp_id, this.user_id, 'love');
    }
    else if(icon_element.classList.contains('fi-sr-heart')) {
      // Update total love in Profile component (parent)
      this.loveManagement.emit({
        type: 'unlove',
        targetId: Number.parseInt(wpp_id)
      });
      // Call api to update love in server
      this.api_service.updateLoveWallpaper(wpp_id, this.user_id, 'unlove');
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
