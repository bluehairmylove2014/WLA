import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Wallpaper } from '../common/Wallpaper';
import { ApiService } from '../Service/api.service';
import { WallpaperService } from '../Service/wallpaper.service';

@Component({
  selector: 'app-ProfileCollection',
  templateUrl: './ProfileCollection.component.html',
  styleUrls: ['./ProfileCollection.component.css']
})
export class ProfileCollectionComponent implements OnInit {
  @Input() collection_data: Wallpaper[] = [] as Wallpaper[];
  @Input() download_count: number = 0;
  @Input() user_id: string = '';

  @Output() loveManagement = new EventEmitter<object>();
  @Output() downloadManagement = new EventEmitter<number>();

  // Variables
  masonryOptions = {
    transitionDuration: '0.2s',
    gutter: 0,
    resize: true,
    initLayout: true
  };

  constructor(
    private api_service: ApiService,
    private wpp_service: WallpaperService
  ) { }

  // Methods
  isLoved(wpp_id:number):boolean {
    let result = false;
    this.collection_data && this.collection_data.forEach((wpp: Wallpaper) => {
      if(wpp.wpp_id === wpp_id && wpp.lover.includes(this.user_id)) {
        result = true;
      }
    })
    return result;
  }
  isSaved(wpp_id:number):boolean {
    let result = false;
    
    this.collection_data && this.collection_data.forEach((wpp: Wallpaper) => {
      if(wpp.wpp_id === wpp_id) {
        result = true;
      }
    })
    return result;
  }
  downloadWallpaper(event: any):void {
    const img_element = event.target.parentElement.querySelector('img');
    if(img_element) {
      this.wpp_service.download(img_element.getAttribute('data-wppid'), img_element.src);
      // Update total download in Profile component (parent)
      this.downloadManagement.emit(this.download_count + 1)
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

      // Call api set to collection
      this.api_service.updateSaveWallpaper(wpp_id, this.user_id, 'save')
    }
    else if(icon_element.classList.contains('fi-sr-bookmark')) {
      icon_element.classList.replace('fi-sr-bookmark', 'fi-rr-bookmark')
      icon_element.classList.remove('bookmarkactive')

      // Call api remove from collection
      this.api_service.updateSaveWallpaper(wpp_id, this.user_id, 'unsave')
    }
  }

  ngOnInit() {
  }

}
