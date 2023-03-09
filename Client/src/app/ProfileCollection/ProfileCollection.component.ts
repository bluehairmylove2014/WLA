import { Component, EventEmitter, Input, OnInit, Output, Renderer2, SimpleChanges, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { NgxMasonryComponent, NgxMasonryOptions } from 'ngx-masonry';
import { Wallpaper } from '../common/Wallpaper';
import { ApiService } from '../Service/api.service';
import { AuthService } from '../Service/auth.service';
import { WallpaperService } from '../Service/wallpaper.service';

@Component({
  selector: 'app-ProfileCollection',
  templateUrl: './ProfileCollection.component.html',
  styleUrls: ['./ProfileCollection.component.css']
})
export class ProfileCollectionComponent implements OnInit {
  @Input() collection_data: Wallpaper[] = [] as Wallpaper[];
  @Input() selfCollection_data: Wallpaper[] = [] as Wallpaper[];
  @Input() download_count: number = 0;
  @Input() auth_data!: any;

  @Output() loveManagement = new EventEmitter<object>();
  @Output() downloadManagement = new EventEmitter<number>();
  @Output() saveManagement = new EventEmitter<object>();

  @ViewChild(NgxMasonryComponent) masonry!: NgxMasonryComponent;

  // Variables
  username!: string;
  masonryOptions: NgxMasonryOptions = {
    itemSelector: '.grid-item',
    columnWidth: '.grid-item',
    initLayout: true,
    resize: true,
  };

  constructor(
    private api_service: ApiService,
    private auth_service: AuthService,
    private wpp_service: WallpaperService,
    private renderer: Renderer2,
    private router: Router
  ) { }

  // Methods
  isLoved(wpp_id:number):boolean {
    let result = false;
    
    if(!this.auth_data.is_own) {
      this.selfCollection_data && this.selfCollection_data.forEach((wpp: Wallpaper) => {
        if(wpp.wpp_id === wpp_id && wpp.lover.includes(this.username)) {
          result = true;
        }
      })
    }
    else {
      this.collection_data && this.collection_data.forEach((wpp: Wallpaper) => {
        if(wpp.wpp_id === wpp_id && wpp.lover.includes(this.username)) {
          result = true;
        }
      })
    }
    return result;
  }
  isSaved(wpp_id:number):boolean {
    let result = false;
    
    if(!this.auth_data.is_own) {
      
      this.selfCollection_data && this.selfCollection_data.forEach((wpp: Wallpaper) => {
        if(wpp.wpp_id === wpp_id) {
          result = true;
        }
      })
    }
    else {
      this.collection_data && this.collection_data.forEach((wpp: Wallpaper) => {
        if(wpp.wpp_id === wpp_id) {
          result = true;
        }
      })
    }
    return result;
  }
  downloadWallpaper(event: any):void {
    const img_element = event.target.parentElement.querySelector('img');
    if(img_element) {
      const loader = event.target.parentElement.querySelector('.loading');
      const wrapper = event.target.parentElement;
      
      // Enable loader
      wrapper && this.renderer.setStyle(wrapper, 'pointer-events', 'none');
      loader && this.renderer.addClass(loader, 'active');
      // Download
      this.wpp_service.download(event.target.parentElement.getAttribute('data-wppid'), img_element.src)
        .then(isDownload => {
          if(isDownload) {
            // Disable loader
            wrapper && this.renderer.setStyle(wrapper, 'pointer-events', 'all');
            loader && this.renderer.removeClass(loader, 'active');
          }
        })
        .catch(error => {
          alert("Error download file, please refresh page and redownload. Thanks!");
        })
      // Update total download in Profile component (parent)
      this.downloadManagement.emit(this.download_count + 1)
    }
  }
  loveWallpaper(event:any):void {
    const wpp_element = this.renderer.parentNode(event.target);
    const icon_element = event.target.querySelector('i');
    const wppid = Number.parseInt(wpp_element.getAttribute('data-wppid'));
    
    
    if(icon_element.classList.contains('fi-rr-heart')) {
      // Update total love in Profile component (parent)
      this.loveManagement.emit({
        type: 'love',
        targetId: wppid
      });
      // Call api to update love in server
      this.api_service.updateLoveWallpaper(wppid, this.username, 'love');
    }
    else if(icon_element.classList.contains('fi-sr-heart')) {
      // Update total love in Profile component (parent)
      this.loveManagement.emit({
        type: 'unlove',
        targetId: wppid
      });
      // Call api to update love in server
      this.api_service.updateLoveWallpaper(wppid, this.username, 'unlove');
    }
  }
  saveWallpaper(event:any):void {
    const wpp_element = this.renderer.parentNode(event.target);
    const icon_element = event.target.querySelector('i');
    const wppid = Number.parseInt(wpp_element.getAttribute('data-wppid'));
    
    
    if(icon_element.classList.contains('fi-rr-bookmark')) {
      icon_element.classList.replace('fi-rr-bookmark', 'fi-sr-bookmark');
      icon_element.classList.add('bookmarkactive');

      // Call api set to collection
      this.api_service.updateSaveWallpaper(wppid, this.username, 'save');
      // Set wpp to local collection variable
      this.saveManagement.emit({
        wpp_id: wppid,
        type: 'save'
      });
    }
    else if(icon_element.classList.contains('fi-sr-bookmark')) {
      icon_element.classList.replace('fi-sr-bookmark', 'fi-rr-bookmark');
      icon_element.classList.remove('bookmarkactive');

      // Call api remove from collection
      this.api_service.updateSaveWallpaper(wppid, this.username, 'unsave');
      // Set wpp to local collection variable
      this.saveManagement.emit({
        wpp_id: wppid,
        type: 'unsave'
      });
    }
  }
  goProfileById(user_id: string): void {
    this.api_service.getUsernameById(user_id).subscribe(res => {
      if(res.length && res[0].username) {
        this.router.navigate(['profile', res[0].username, 'gallery']);
      }
      else {
        console.error(`Error get username home click ${res}`);
      }
    })
  }
  reloadLayout():void {
    if(this.masonry) {
      this.masonry.reloadItems();
      this.masonry.layout();
    }
  }

  ngOnInit() {
    let usn = this.auth_service.getUsername();
    this.auth_data.islogin && (this.username = usn);
  }
  ngAfterViewInit(): void {
    //Called after ngAfterContentInit when the component's view has been initialized. Applies to components only.
    this.reloadLayout();
  }
  ngOnChanges(changes: SimpleChanges): void {
    // // //Called before any other lifecycle hook. Use it to inject dependencies, but avoid any serious work here.
    // if(changes['selfCollection_data']) {
    //   console.log(this.selfCollection_data);
      
    //   this.reloadLayout();
    // }
  }
}
