import { Component, ElementRef, HostListener, OnInit, Renderer2, SimpleChanges, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { NgxMasonryComponent, NgxMasonryOptions } from 'ngx-masonry';
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
  @ViewChild(NgxMasonryComponent) masonry!: NgxMasonryComponent;
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
    following: [],
    bio: ''
  };
  masonryOptions: NgxMasonryOptions = {
    itemSelector: '.grid-item',
    columnWidth: '.grid-item',
    initLayout: true,
    resize: true,
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
    private renderer: Renderer2,
    private router: Router
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
  reloadLayout():void {
    if(this.masonry) {
      
      this.masonry.reloadItems();
      this.masonry.layout();
    }
  }
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
      if(wpp.wpp_id === wpp_id && wpp.lover.includes(this.user_account.username)) {
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
    }
  }
  updateLove(event: any): void {
    this.wallpapers_data.forEach(wpp => {
      if(wpp.wpp_id === event.targetId) {
        if(event.type === 'unlove') {
          wpp.lover = wpp.lover.filter(uid => uid !== this.user_account.username);
        }
        else if(event.type === 'love') {
          wpp.lover.push(this.user_account.username);
        }
        return;
      }
    })
    this.collection_data.forEach(wpp => {
      if(wpp.wpp_id === event.targetId) {
        if(event.type === 'unlove') {
          wpp.lover = wpp.lover.filter(uid => uid !== this.user_account.username);
        }
        else if(event.type === 'love') {
          wpp.lover.push(this.user_account.username);
        }
        return;
      }
    })
  }
  loveWallpaper(event:any):void {
    if(!this.isLogin()) {
      this.router.navigate(['login'])
      return;
    }
    const wpp_element = this.renderer.parentNode(event.target);
    const icon_element = event.target.querySelector('i');
    const wppid = Number.parseInt(wpp_element.getAttribute('data-wppid'));
    
    if(icon_element.classList.contains('fi-rr-heart')) {
      this.updateLove({
        type: 'love',
        targetId: wppid
      })
      // Call api to update love in server
      this.api_service.updateLoveWallpaper(wppid, this.user_account.username, 'love');
    }
    else if(icon_element.classList.contains('fi-sr-heart')) {
      this.updateLove({
        type: 'unlove',
        targetId: wppid
      })
      // Call api to update love in server
      this.api_service.updateLoveWallpaper(wppid, this.user_account.username, 'unlove');
    }
  }  
  saveWallpaper(event:any):void {
    if(!this.isLogin()) {
      this.router.navigate(['login'])
      return;
    }
    const wpp_element = this.renderer.parentNode(event.target);
    const icon_element = event.target.querySelector('i');
    const wppid = Number.parseInt(wpp_element.getAttribute('data-wppid'));
    
    if(icon_element.classList.contains('fi-rr-bookmark')) {
      icon_element.classList.replace('fi-rr-bookmark', 'fi-sr-bookmark');
      icon_element.classList.add('bookmarkactive');

      // Call api set to collection
      this.api_service.updateSaveWallpaper(wppid, this.user_account.username, 'save');
    }
    else if(icon_element.classList.contains('fi-sr-bookmark')) {
      icon_element.classList.replace('fi-sr-bookmark', 'fi-rr-bookmark');
      icon_element.classList.remove('bookmarkactive');

      // Call api remove from collection
      this.api_service.updateSaveWallpaper(wppid, this.user_account.username, 'unsave');
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

  ngOnInit() {
    let username = this.auth_service.getUsername();
    if (this.isLogin()) {
      // Get user data by username
      this.api_service.getUser(username).subscribe((user_data: any) => {
        if(user_data[0]) {
          this.user_account = user_data[0]
          // Get collection data
          this.api_service.getCollection(user_data[0].user_id).subscribe((collection:any) => {
            this.collection_data = collection;
          });
        }
      })
    }
    // Get wallpaper data
    this.api_service.getSpotlightWallpaper(this.last_index, this.number_of_preview).subscribe((data: any) => {
      data.wpps && (this.wallpapers_data = data.wpps);
      data.total && (this.last_index = data.total);
    })
  }
  ngAfterViewInit(): void {
    //Called after ngAfterContentInit when the component's view has been initialized. Applies to components only.
    this.reloadLayout();
  }
  ngOnDestroy(): void {
    //Called once, before the instance is destroyed.
    window.removeEventListener('scroll', this.onWindowScroll);
  }
  ngOnChanges(changes: SimpleChanges): void {
    // // //Called before any other lifecycle hook. Use it to inject dependencies, but avoid any serious work here.
    // if(changes['wallpapers_data']) {
    //   this.reloadLayout();
    // }
  }
}
