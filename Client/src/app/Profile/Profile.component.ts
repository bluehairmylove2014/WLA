
import { Component, ElementRef, HostListener, OnInit, Renderer2, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Album } from '../common/Album';
import { User } from '../common/User';
import { Wallpaper } from '../common/Wallpaper';

// Service and Pipe
import { AuthService } from '../Service/auth.service';
import { DateService } from '../Service/date.service';

import { ShortNumberPipe } from '../Pipe/ShortNumber.pipe';
import { ApiService } from '../Service/api.service';

@Component({
  selector: 'app-Profile',
  templateUrl: './Profile.component.html',
  styleUrls: ['./Profile.component.css'],
  providers: [ShortNumberPipe]
})
export class ProfileComponent implements OnInit {
  // Variable
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
    location: {city: '', country: ''},
    follower: [],
    following: []
  };
  albums: Album[] = [];
  preview_albums: Album[] = [];
  total_wallpapers: Wallpaper[] = [] as Wallpaper[];
  img_wallpapers: Wallpaper[] = [] as Wallpaper[];
  video_wallpapers: Wallpaper[] = [] as Wallpaper[];
  cur_wallpaper: Wallpaper[] = [] as Wallpaper[];
  total_views: number = 0;
  total_love: number = 0;
  total_download: number = 0;

  constructor(
    private element_ref: ElementRef,
    private atv_router: ActivatedRoute,
    private api_service: ApiService,
    private auth_service: AuthService,
    public date_service: DateService
  ) {
  }

  // Methods
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
      const oldLength = this.cur_wallpaper.length;
      const totalLength = this.total_wallpapers.length;
      const newLength = ((oldLength + 6) >= totalLength) ?
        totalLength : oldLength + 6;

      this.total_wallpapers.slice(
        this.cur_wallpaper.length,
        newLength
      ).forEach(wp => {
        this.cur_wallpaper.push(wp);
      })
    }
  }
  compareRatio(targetId: string): boolean {
    let album_container = this.element_ref.nativeElement.querySelector('.album-avt-holder');
    let album_img = this.element_ref.nativeElement.querySelector(`#album_${targetId}`);
    
    if (album_container && album_img) {
      const holder_ratio = album_container.offsetHeight / album_container.offsetWidth;
      const img_ratio = album_img.naturalHeight / album_img.naturalWidth;
      return (holder_ratio > img_ratio) ? false : true;
    }
    else {
      return true;
    }
  }
  updateLove(event: any) {
    this.total_wallpapers.forEach(wpp => {
      if(wpp.wpp_id === event.targetId) {
        if(event.type === 'unlove') {
          wpp.lover = wpp.lover.filter(uid => uid !== this.user_account.user_id);
          this.total_love -= 1;
          
        }
        else if(event.type === 'love') {
          wpp.lover.push(this.user_account.user_id);
          this.total_love += 1;
        }
        return;
      }
    })
  }
  updateDownload(event: any) {
    this.total_download = event;
  }
  sliceArray(array:any, start: number, end:number): any {
    if(end <= start) {
      end = start + 1;
    }
    return array.slice(
      (start < array.length) ? start : array.length - 1, 
      (end <= array.length) ? end : array.length
    )
  }
  ngOnDestroy(): void {
  }
  // Hook
  ngOnInit() {
    if(this.auth_service.isLogin()) {
      let username = this.atv_router.snapshot.url[this.atv_router.snapshot.url.length - 1].path;
      this.api_service.getUser(username).subscribe((user_data:any) => {
        this.user_account = user_data[0];
        
        if(user_data[0].user_id) {
          this.api_service.getWallpapers(user_data[0].user_id).subscribe((wpps:any) => {
            this.total_wallpapers = wpps;
            this.cur_wallpaper = wpps.slice(
              0, 
              (this.total_wallpapers.length >= 6) ? 6 : this.total_wallpapers.length
            );
            wpps.forEach((wpp:any) => {
              // filter wallpaper
              if(wpp.wpp_type === 'image') {
                this.img_wallpapers.push(wpp);
              }
              else {
                this.video_wallpapers.push(wpp);
              }
              // calc total views
              this.total_views += wpp.total_views;
              this.total_love += wpp.lover.length;
              
              this.total_download += wpp.total_download;
            });
          });
          this.api_service.getAlbums(user_data[0].user_id).subscribe((albums:any) => {
            this.albums = albums;
            this.preview_albums = albums.slice(0, albums.length > 3 ? 3 : albums.length);
          });
        }
      })
    }
  }
}
