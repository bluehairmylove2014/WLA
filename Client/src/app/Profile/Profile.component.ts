import { DatePipe } from '@angular/common';
import { Component, ElementRef, HostListener, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Album } from '../common/Album';
import { User } from '../common/User';
import { Wallpaper } from '../common/Wallpaper';

// API METHODS
import { ApiService } from '../api.service'
import { ShortNumberPipe } from '../ShortNumber.pipe';

@Component({
  selector: 'app-Profile',
  templateUrl: './Profile.component.html',
  styleUrls: ['./Profile.component.css'],
  providers: [ShortNumberPipe]
})
export class ProfileComponent implements OnInit {
  @ViewChild('profile') profileRef!: ElementRef;
  @ViewChild('album_holder') album_holderRef!: ElementRef;

  user_account: User = {
    user_id: '',
    email: null,
    avatar: null,
    username: null,
    password: null,
    display_name: null,
    account_type: null,
    account_status: null,
    createat: null,
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

  constructor(
    private api_service: ApiService,
    private datePipe: DatePipe,
    private element_ref: ElementRef,
    private atv_route: ActivatedRoute,
    private router: Router
  ) { }

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
  convertDate(date: any): string {
    if (typeof date === 'string') {
      const strDate = new Date(date);
      const rs = this.datePipe.transform(strDate, 'MMMM, yyyy');
      return rs === null ? '' : rs;
    }
    else {
      return 'not string';
    }
  }
  compareRatio(targetId: string): boolean {
    let album_container = this.element_ref.nativeElement.querySelector('.album-avt-holder');
    let album_img = this.element_ref.nativeElement.querySelector('.album-avt');

    if (album_container && album_img) {
      const holder_ratio = album_container.offsetHeight / album_container.offsetWidth;
      const img_ratio = album_img.naturalHeight / album_img.naturalWidth;
      return (holder_ratio > img_ratio) ? false : true;
    }
    else {
      return true;
    }
  }

  ngOnInit() {
    // this.atv_route.queryParams.subscribe(params => {
    //   this.user_account = JSON.parse(params['user_data']);
    // })
    const usn = this.atv_route.snapshot.queryParamMap.get('username');
    if(usn) {
      this.api_service.getUser(usn).subscribe((user_data:any) => {
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
            });
          });
          this.api_service.getAlbums(user_data[0].user_id).subscribe((albums:any) => {
            this.albums = albums;
            this.preview_albums = albums.slice(0, albums.length > 3 ? 3 : albums.length);
          });
        }
      })
    }
    else {
      this.router.navigate(['/pagenotfound'])
    }
    
  }

}
