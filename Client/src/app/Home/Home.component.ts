import { Component, ElementRef, HostListener, OnInit, Renderer2, ViewChild } from '@angular/core';
import { User } from '../common/User';
import { Wallpaper } from '../common/Wallpaper';
import { ApiService } from '../Service/api.service';
import { AuthService } from '../Service/auth.service';
import { WallpaperService } from '../Service/wallpaper.service';

@Component({
  selector: 'app-Home',
  templateUrl: './Home.component.html',
  styleUrls: ['./Home.component.css']
})
export class HomeComponent implements OnInit {
  @ViewChild('intro_input') introInputRef!: ElementRef;
  @ViewChild('bodyContent') bodyContentRef!: ElementRef;
  // Variables
  user_account: User = {
    user_id: '',
    email: '',
    avatar: '',
    username: '',
    password: '',
    display_name: '',
    account_type: '',
    account_status: '',
    createat: '',
    location: { city: '', country: '' },
    follower: [],
    following: []
  };
  masonryOptions = {
    transitionDuration: '0.2s',
    gutter: 0,
    resize: true,
    initLayout: true,
    columnWidth: '.grid-item'
  };
  wallpapers_data: Wallpaper[] = [] as Wallpaper[];
  collection_data: Wallpaper[] = [] as Wallpaper[];

  last_index: number = 0;
  number_of_preview: number = 15;
  isGettingData: boolean = false;
  isEnd: boolean = false;

  constructor(
    private auth_service: AuthService,
    private api_service: ApiService,
    private wpp_service: WallpaperService,
    private renderer: Renderer2
  ) { }
  
  @HostListener('window:scroll', ['$event'])
  onWindowScroll() {
    if(this.isEnd) return; // No more wallpaper to load
    // Get element
    const target = this.bodyContentRef.nativeElement;
    if (!target) return; // Class not found, exit

    let scrollPos = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0;
    let windowHeight = window.innerHeight;
    let docHeight = target.scrollHeight;
    let pos = scrollPos + windowHeight;
    
    // pos/docHeight will give you the distance between scroll bottom and and bottom of screen in percentage.
    if (pos >= docHeight && !this.isGettingData) {
      
      this.isGettingData = true;
      // Get addition wallpaper data
      this.api_service.getSpotlightWallpaper(this.last_index, this.number_of_preview).subscribe((data: any) => {
        (data.wpps && data.wpps.length) && (this.wallpapers_data = [...this.wallpapers_data, ...data.wpps]);
        if(data.total)
            this.last_index += data.total
        else
          this.isEnd = true;
        setTimeout(() => {
          this.isGettingData = false;
        }, 300);
      })
    }
  }
  // Methods
  isLogin(): boolean {
    return this.auth_service.isLogin();
  }
  inputOnFocus(): void {
    const placeholder = this.introInputRef.nativeElement.querySelector('p');
    const input = this.introInputRef.nativeElement.querySelector('input');
    if(input && placeholder && !input.value.trim()) {
      this.renderer.removeClass(placeholder, 'active');
    }
  }
  inputOnBlur(): void {
    const placeholder = this.introInputRef.nativeElement.querySelector('p');
    const input = this.introInputRef.nativeElement.querySelector('input');
    if(input && placeholder && !input.value.trim()) {
      this.renderer.addClass(placeholder, 'active');
    }
  }
  isLoved(wpp_id:number):boolean {
    let result = false;
    this.wallpapers_data && this.wallpapers_data.forEach((wpp: Wallpaper) => {
      if(wpp.wpp_id === wpp_id && wpp.lover.includes(this.user_account.user_id)) {
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
      this.wpp_service.download(event.target.parentElement.getAttribute('data-wppid'), img_element.src);
    }
  }
  loveWallpaper(event:any):void {
    const img_element = event.target.parentElement.querySelector('img');
    const icon_element = event.target.querySelector('i');;
    const wpp_id = img_element.getAttribute('data-wppid');
    
    if(icon_element.classList.contains('fi-rr-heart')) {
      // Call api to update love in server
      this.api_service.updateLoveWallpaper(wpp_id, this.user_account.user_id, 'love');
    }
    else if(icon_element.classList.contains('fi-sr-heart')) {
      // Call api to update love in server
      this.api_service.updateLoveWallpaper(wpp_id, this.user_account.user_id, 'unlove');
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
      this.api_service.updateSaveWallpaper(wppid, this.user_account.user_id, 'save');
    }
    else if(icon_element.classList.contains('fi-sr-bookmark')) {
      icon_element.classList.replace('fi-sr-bookmark', 'fi-rr-bookmark');
      icon_element.classList.remove('bookmarkactive');

      // Call api remove from collection
      this.api_service.updateSaveWallpaper(wppid, this.user_account.user_id, 'unsave');
    }
  }

  ngOnInit() {
    let username = this.auth_service.getUsername();
    if (this.isLogin()) {
      // Get user data by username
      this.api_service.getUser(username).subscribe((user_data: any) => {
        if(user_data[0]) {
          this.user_account = user_data[0]
          // Get wallpaper data
          this.api_service.getSpotlightWallpaper(this.last_index, this.number_of_preview).subscribe((data: any) => {
            data.wpps && (this.wallpapers_data = data.wpps);
            data.total && (this.last_index = data.total);
          })
          // Get collection data
          this.api_service.getCollection(user_data[0].user_id).subscribe((collection:any) => {
            this.collection_data = collection;
          });
        }
      })
    }
  }
  ngOnDestroy(): void {
    //Called once, before the instance is destroyed.
    window.removeEventListener('scroll', this.onWindowScroll);
  }
}
