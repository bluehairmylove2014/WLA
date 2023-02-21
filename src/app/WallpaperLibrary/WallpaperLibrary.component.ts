import { DatePipe } from '@angular/common';
import { ChangeDetectorRef, Component, ElementRef, Input, NgZone, OnInit, Renderer2, ViewChild } from '@angular/core';
import { Album } from '../common/Album';
import { Wallpaper } from '../common/Wallpaper';

@Component({
  selector: 'app-WallpaperLibrary',
  templateUrl: './WallpaperLibrary.component.html',
  styleUrls: ['./WallpaperLibrary.component.css']
})
export class WallpaperLibraryComponent implements OnInit {
  @Input() user_account: any;
  @ViewChild('wallpapers') wallpaper_holderRef!: ElementRef;
  @ViewChild('album_holder') album_holderRef!: ElementRef;

  wallpapers: Wallpaper[] = [];
  albums: Album[] = [];
  maxWallpaperPerPage: number = 6;
  currentPage:number = 1;
  availablePages:number = 0;

  constructor(
    private cd: ChangeDetectorRef, 
    private renderer: Renderer2, 
    private ngZone: NgZone,
    private datePipe: DatePipe,
    private element_ref: ElementRef
  ) { }

  // Methods
  generateWallpaperPreview(
    wallpaper_list: any, 
    start:number, 
    end:number
):string {
  let wallpapers = wallpaper_list.slice(start, end).map((w: any) => {
    return (
      `
        <div class='animate-fadein-toleft col-4 mb-4'>
          <div class='wpp'>
            <div class='wpp-hover-bg'></div>
            <img src=${w.img_path} class='img-fluid wpp-img'>
            <button
              type='button'
              class='wpp-interact-btn download'
            >
              <i class="fi fi-rr-download"></i>
            </button>
            <button
              type='button'
              class='wpp-interact-btn love'
            >
              <i class="fi fi-rr-heart"></i>
            </button>
            <button
              type='button'
              class='wpp-interact-btn save'
            >
              <i class="fi fi-rr-bookmark"></i>
            </button>
          </div>
        </div>
      `
    )
  });
  return wallpapers.join('');
  }
  countArray(n: number): number[] {
    if(n > 4) {
      return Array.from({length: n}, (_, i) => i + 1);
    }
    else {
      return Array.from({length: n}, (_, i) => i + 1);
    }
  }
  moveToPage(tarPage: number):void {
    if (tarPage <= this.availablePages && tarPage > 0) {
      this.currentPage = tarPage;
      let startIndex = (this.currentPage - 1) * 6;
      let endIndex = startIndex + 6;

      const nextWallpapers = this.generateWallpaperPreview(
        this.wallpapers,
        startIndex,
        endIndex
      );

      const wppElements = this.wallpaper_holderRef.nativeElement.querySelectorAll('.wpp');

      this.ngZone.run(() => {
        wppElements.forEach((el: any) => {
          this.renderer.setStyle(el, 'transition', 'all 0.3s ease-in-out');
          this.renderer.setStyle(el, 'transform', 'translateX(-3em)');
          this.renderer.setStyle(el, 'opacity', '0');
        });
        setTimeout(() => {
          this.renderer.setProperty(this.wallpaper_holderRef.nativeElement, 'innerHTML', nextWallpapers);
        }, 300);
      });
    }
  }
  convertDate(date: string): string {
    const strDate = new Date(date);
    const rs = this.datePipe.transform(strDate, 'MMMM, yyyy');
    return rs === null ? '' : rs;
  }
  compareRatio(targetId: string): boolean {
    let album_container = this.element_ref.nativeElement.querySelector('.album-avt-holder');
    let album_img = this.element_ref.nativeElement.querySelector('.album-avt');
    
    if(album_container && album_img) {
      const holder_ratio = album_container.offsetHeight / album_container.offsetWidth;
      const img_ratio = album_img.naturalHeight / album_img.naturalWidth;
      return (holder_ratio > img_ratio) ? false : true;
    }
    else {
      return true;
    }
  }
  ngOnInit() {
    this.wallpapers = [
      {id:1, userid: 1, img_path:'/assets/wallpapers/phoenix_ayaka.png'},
      {id:2, userid: 1, img_path:'/assets/wallpapers/wpp(12).jpg'},
      {id:3, userid: 1, img_path:'/assets/wallpapers/wpp(15).jpg'},
      {id:4, userid: 1, img_path:'/assets/wallpapers/wpp(9).jpg'},
      {id:5, userid: 1, img_path:'/assets/wallpapers/wpp(1).jpg'},
      {id:6, userid: 1, img_path:'/assets/wallpapers/wpp(2).jpg'},
      {id:7, userid: 1, img_path:'/assets/wallpapers/wpp(3).jpg'},
      {id:8, userid: 1, img_path:'/assets/wallpapers/wpp(4).jpg'},
      {id:9, userid: 1, img_path:'/assets/wallpapers/wpp(5).jpg'},
      {id:10, userid: 1, img_path:'/assets/wallpapers/wpp(6).jpg'},
      {id:11, userid: 1, img_path:'/assets/wallpapers/wpp(7).jpg'},
      {id:12, userid: 1, img_path:'/assets/wallpapers/wpp(8).jpg'},
      {id:13, userid: 1, img_path:'/assets/wallpapers/wpp(10).jpg'},
      {id:14, userid: 1, img_path:'/assets/wallpapers/wpp(11).jpg'},
      {id:15, userid: 1, img_path:'/assets/wallpapers/wpp(13).jpg'},
      {id:16, userid: 1, img_path:'/assets/wallpapers/wpp(14).jpg'},
      {id:17, userid: 1, img_path:'/assets/wallpapers/wpp(16).jpg'},

      {id:3, userid: 1, img_path:'/assets/wallpapers/wpp(15).jpg'},
      {id:4, userid: 1, img_path:'/assets/wallpapers/wpp(17).jpg'},
      {id:5, userid: 1, img_path:'/assets/wallpapers/wpp(1).jpg'},
      {id:6, userid: 1, img_path:'/assets/wallpapers/wpp(2).jpg'},
      {id:7, userid: 1, img_path:'/assets/wallpapers/wpp(3).jpg'},
      {id:8, userid: 1, img_path:'/assets/wallpapers/wpp(4).jpg'},
      {id:9, userid: 1, img_path:'/assets/wallpapers/wpp(5).jpg'},
      {id:10, userid: 1, img_path:'/assets/wallpapers/wpp(6).jpg'},
      {id:11, userid: 1, img_path:'/assets/wallpapers/wpp(7).jpg'},
      {id:12, userid: 1, img_path:'/assets/wallpapers/wpp(8).jpg'},
      {id:13, userid: 1, img_path:'/assets/wallpapers/wpp(10).jpg'},
      {id:14, userid: 1, img_path:'/assets/wallpapers/wpp(11).jpg'},
      {id:15, userid: 1, img_path:'/assets/wallpapers/wpp(13).jpg'},
      {id:16, userid: 1, img_path:'/assets/wallpapers/wpp(14).jpg'},
      {id:17, userid: 1, img_path:'/assets/wallpapers/wpp(16).jpg'}
    ]
    this.albums = [
      {
        id:'album@1', 
        userid: 1,
        name:'Genshin Impact', 
        avt:'../../assets/albums/avt/wpp(5).jpg', 
        nowpp:0, 
        idwpp:[]
      },
      {
        id:'album@2', 
        userid: 1,
        name:'Nature HD', 
        avt:'../../assets/albums/avt/wpp(1).jpg', 
        nowpp:1, 
        idwpp:[14]
      },
      {
        id:'album@3', 
        userid: 1,
        name:'Gaming 4K', 
        avt:'../../assets/albums/avt/wpp(7).jpg', 
        nowpp:2, 
        idwpp:[12, 15]
      },
    ]
    this.availablePages = Math.ceil(this.wallpapers.length / this.maxWallpaperPerPage)
  }
  ngAfterViewInit(): void {
    if(this.wallpaper_holderRef) {
      this.renderer.setProperty(
        this.wallpaper_holderRef.nativeElement,
        'innerHTML',
        this.generateWallpaperPreview(this.wallpapers, 0, 6)
      )
    }
    this.cd.markForCheck();
  }
}
