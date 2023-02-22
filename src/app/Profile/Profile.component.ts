import { DatePipe } from '@angular/common';
import { Component, ElementRef, HostListener, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Album } from '../common/Album';
import { User } from '../common/User';
import { Wallpaper } from '../common/Wallpaper';

@Component({
  selector: 'app-Profile',
  templateUrl: './Profile.component.html',
  styleUrls: ['./Profile.component.css']
})
export class ProfileComponent implements OnInit {
  @ViewChild('profile') profileRef!: ElementRef;
  @ViewChild('album_holder') album_holderRef!: ElementRef;

  user_account: User = {} as User;
  albums: Album[] = [];
  total_wallpapers: Wallpaper[] = [] as Wallpaper[];
  wallpapers: Wallpaper[] = [] as Wallpaper[];
  constructor(
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
      const oldLength = this.wallpapers.length;
      const totalLength = this.total_wallpapers.length;
      const newLength = ((oldLength + 6) >= totalLength) ?
        totalLength : oldLength + 6;

      this.total_wallpapers.slice(
        this.wallpapers.length,
        newLength
      ).forEach(wp => {
        this.wallpapers.push(wp);
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
    this.albums = [
      {
        id: 'album@1',
        userid: 1,
        name: 'Genshin Impact',
        avt: '../../assets/albums/avt/wpp(5).jpg',
        nowpp: 0,
        idwpp: []
      },
      {
        id: 'album@2',
        userid: 1,
        name: 'Nature HD',
        avt: '../../assets/albums/avt/wpp(1).jpg',
        nowpp: 1,
        idwpp: [14]
      },
      {
        id: 'album@3',
        userid: 1,
        name: 'Gaming 4K',
        avt: '../../assets/albums/avt/wpp(7).jpg',
        nowpp: 2,
        idwpp: [12, 15]
      },
    ]
    this.total_wallpapers = [
      { id: 1, userid: 1, img_path: '/assets/wallpapers/phoenix_ayaka.png' },
      { id: 2, userid: 1, img_path: '/assets/wallpapers/wpp(12).jpg' },
      { id: 3, userid: 1, img_path: '/assets/wallpapers/wpp(15).jpg' },
      { id: 4, userid: 1, img_path: '/assets/wallpapers/wpp(9).jpg' },
      { id: 5, userid: 1, img_path: '/assets/wallpapers/wpp(1).jpg' },
      { id: 6, userid: 1, img_path: '/assets/wallpapers/wpp(2).jpg' },
      { id: 7, userid: 1, img_path: '/assets/wallpapers/wpp(3).jpg' },
      { id: 8, userid: 1, img_path: '/assets/wallpapers/wpp(4).jpg' },
      { id: 9, userid: 1, img_path: '/assets/wallpapers/wpp(5).jpg' },
      { id: 10, userid: 1, img_path: '/assets/wallpapers/wpp(17).jpg' },
      { id: 11, userid: 1, img_path: '/assets/wallpapers/wpp(7).jpg' },
      { id: 12, userid: 1, img_path: '/assets/wallpapers/wpp(8).jpg' },
      { id: 13, userid: 1, img_path: '/assets/wallpapers/wpp(10).jpg' },
      { id: 14, userid: 1, img_path: '/assets/wallpapers/wpp(11).jpg' },
      { id: 15, userid: 1, img_path: '/assets/wallpapers/wpp(13).jpg' },
      { id: 16, userid: 1, img_path: '/assets/wallpapers/wpp(14).jpg' },
      { id: 17, userid: 1, img_path: '/assets/wallpapers/wpp(16).jpg' },
      { id: 18, userid: 1, img_path: '/assets/wallpapers/wpp(6).jpg' }
    ]
    this.wallpapers = [
      { id: 1, userid: 1, img_path: '/assets/wallpapers/phoenix_ayaka.png' },
      { id: 2, userid: 1, img_path: '/assets/wallpapers/wpp(12).jpg' },
      { id: 3, userid: 1, img_path: '/assets/wallpapers/wpp(15).jpg' },
      { id: 4, userid: 1, img_path: '/assets/wallpapers/wpp(9).jpg' },
      { id: 5, userid: 1, img_path: '/assets/wallpapers/wpp(1).jpg' },
      { id: 6, userid: 1, img_path: '/assets/wallpapers/wpp(2).jpg' }
    ]
    this.atv_route.paramMap.subscribe(param => {
      if (param.has('userId')) {
        this.user_account = {
          id: 'user@1',
          email: 'baphuong2014@gmail.com',
          avt: '../../assets/user/avt/bluegirl2014.png',
          usn: 'bluegirl2014',
          psw: '123456',
          name: 'Nguyễn Ba Phương',
          type: 'user',
          status: 'normal',
          createat: '5/1/2014',
          location: {
            Street: '',
            District: '',
            Province: '',
            City: 'Hanoi',
            Country: 'Vietnam'
          },
          follower: []
        };
      }
      else {
        this.router.navigate(['/pagenotfound']);
      }
    })
  }

}
