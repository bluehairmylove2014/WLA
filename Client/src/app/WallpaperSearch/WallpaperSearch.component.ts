import { Component, HostListener, OnInit, Renderer2, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxMasonryComponent, NgxMasonryOptions } from 'ngx-masonry';
import { Wallpaper } from '../common/Wallpaper';
import { ApiService } from '../Service/api.service';
import { AuthService } from '../Service/auth.service';
import { WallpaperService } from '../Service/wallpaper.service';

@Component({
  selector: 'app-WallpaperSearch',
  templateUrl: './WallpaperSearch.component.html',
  styleUrls: ['./WallpaperSearch.component.css']
})
export class WallpaperSearchComponent implements OnInit {
  @ViewChild(NgxMasonryComponent) masonry!: NgxMasonryComponent;

  // Variables
  keysearch!: string;
  typesearch!: string;
  param_sub!: any;
  total_data: any[] = [];
  result_data: any[] = [];
  user_account!: any;
  collection!: any;
  masonryOptions!: NgxMasonryOptions;

  constructor(
    private atv_route: ActivatedRoute,
    private router: Router,
    private api_service: ApiService,
    private auth_service: AuthService,
    private renderer: Renderer2,
    private wpp_service: WallpaperService
  ) { }

  @HostListener("window:scroll", ["$event"])
  onWindowScroll() {
    // Get element
    const target = document.querySelector('.homecontent-wrapper');
    if (!target) return; // Class not found, exit

    let scrollPos = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0;
    let windowHeight = window.innerHeight;
    let docHeight = target.scrollHeight;
    let pos = scrollPos + windowHeight;
    
    // pos/docHeight will give you the distance between scroll bottom and and bottom of screen in percentage.
    if (pos >= docHeight) {
      const oldLength = this.result_data.length;
      const totalLength = this.total_data.length;
      const newLength = ((oldLength + 15) >= totalLength) ?
        totalLength : oldLength + 15;

        this.total_data.slice(
        this.result_data.length,
        newLength
      ).forEach(wp => {
        this.result_data.push(wp);
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
  changeTab(btn_target: any) {
    this.router.navigate(['s', btn_target.target.id, this.keysearch])
  }
  isCurrentTab(id: string): boolean {
    return this.typesearch === id ? true : false;
  }
  isLoved(wpp_id:number):boolean {
    let ilove = false;
    this.result_data && this.result_data.forEach((wpp: Wallpaper) => {
      if(wpp.wpp_id === wpp_id && wpp.lover.includes(this.user_account?.username)) {
        ilove = true;
      }
    })
    return ilove;
  }
  isSaved(wpp_id:number):boolean {
    let result = false;
    
    this.collection && this.collection.forEach((wpp: Wallpaper) => {
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
    this.result_data.forEach((wpp: Wallpaper) => {
      if(wpp.wpp_id === event.targetId) {
        if(event.type === 'unlove') {
          wpp.lover = wpp.lover.filter((uid: string) => uid !== this.user_account.username);
        }
        else if(event.type === 'love') {
          wpp.lover.push(this.user_account.username);
        }
        return;
      }
    })
    this.collection.forEach((wpp: Wallpaper) => {
      if(wpp.wpp_id === event.targetId) {
        if(event.type === 'unlove') {
          wpp.lover = wpp.lover.filter((uid: string) => uid !== this.user_account.username);
        }
        else if(event.type === 'love') {
          wpp.lover.push(this.user_account.username);
        }
        return;
      }
    })
  }
  loveWallpaper(event:any):void {
    if(!this.auth_service.isLogin()) {
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
    if(!this.auth_service.isLogin()) {
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

  // Hooks
  ngOnInit() {
    this.masonryOptions = {
      itemSelector: '.grid-item',
      columnWidth: '.grid-item',
      initLayout: true,
      resize: true,
    };

    this.param_sub = this.atv_route.params.subscribe(param => {
      this.typesearch = param['type'] ? param['type'] : 'Photos';
      this.keysearch = param['keysearch'] ? param['keysearch'] : '';

      // Get wallpapers match keysearch
      this.api_service.searchFor(this.typesearch, this.keysearch)
        .subscribe(res => {
          if(res) {
            this.total_data = [...res];
            this.result_data = res.slice(
              0, 
              (res.length >= 15) ? 15 : res.length
            );
          }
          else {
            alert('Error get result, please try to reload page. Thanks!');
          }
        })
    })

    let username = this.auth_service.getUsername();
    if (this.auth_service.isLogin()) {
      // Get user data by username
      this.api_service.getUser(username).subscribe((user_data: any) => {
        if(user_data[0]) {
          this.user_account = user_data[0]
          // Get collection data
          this.api_service.getCollection(user_data[0].user_id).subscribe((collection:any) => {
            this.collection = collection;
          });
        }
      })
    }
  }
  ngAfterViewInit(): void {
    //Called after ngAfterContentInit when the component's view has been initialized. Applies to components only.
    
    this.reloadLayout();
  }
  ngOnDestroy(): void {
    //Called once, before the instance is destroyed.
    if(this.param_sub) {
      this.param_sub.unsubscribe()
    }
  }
}
