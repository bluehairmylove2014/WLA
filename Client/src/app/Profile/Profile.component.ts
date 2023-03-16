
import { Component, ElementRef, HostListener, OnInit, Renderer2, SimpleChanges, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Album } from '../common/Album';
import { User } from '../common/User';
import { Wallpaper } from '../common/Wallpaper';

import Cropper from 'cropperjs';
// Service and Pipe
import { AuthService } from '../Service/auth.service';
import { DateService } from '../Service/date.service';

import { ShortNumberPipe } from '../Pipe/ShortNumber.pipe';
import { ApiService } from '../Service/api.service';
import { Subscription } from 'rxjs';
import { FormControl, FormGroup } from '@angular/forms';
import { WallpaperService } from '../Service/wallpaper.service';

@Component({
  selector: 'app-Profile',
  templateUrl: './Profile.component.html',
  styleUrls: ['./Profile.component.css'],
  providers: [ShortNumberPipe]
})
export class ProfileComponent implements OnInit {
  @ViewChild('changeError') changeErrorRef!: ElementRef;
  @ViewChild('notiWrapper') notiWrapperRef!: ElementRef;
  @ViewChild('editHolder') editHolderRef!: ElementRef;
  @ViewChild('ud') udRef!: ElementRef;

  @ViewChild('dragdropfield') ddfRef!: ElementRef;
  @ViewChild('btn_wrapper') btnWrapperRef!: ElementRef;
  @ViewChild('previewImg') previewImgRef!: ElementRef;
  @ViewChild('notiHolder') notiHolderRef!: ElementRef;
  @ViewChild('uploadmain') componentBodyRef!: ElementRef;
  private sub!: Subscription;

  // Variable
  cropper!: Cropper;
  imageUrl: string | null = null;
  fileUpload: any;
  listener = () => { }
  pi_name: string = '';
  pi_tags: string = '';
  pi_des: string = '';

  own_id: string = '';
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

  // Form
  userDetailForm = new FormGroup({
    fullname: new FormControl(''),
    username: new FormControl(''),
    bio: new FormControl(''),
    city: new FormControl(''),
    country: new FormControl(''),
  });

  albums: Album[] = [];
  preview_albums: Album[] = [];

  total_wallpapers: Wallpaper[] = [] as Wallpaper[];
  img_wallpapers: Wallpaper[] = [] as Wallpaper[];
  video_wallpapers: Wallpaper[] = [] as Wallpaper[];
  cur_wallpaper: Wallpaper[] = [] as Wallpaper[];

  collection: Wallpaper[] = [] as Wallpaper[];
  selfCollection: Wallpaper[] = [] as Wallpaper[];
  cur_collection: Wallpaper[] = [] as Wallpaper[];

  total_views: number = 0;
  total_love: number = 0;
  total_download: number = 0;

  cur_tab = 'gallery';
  cur_editTab = 'Information'
  auth = {
    islogin: false,
    is_own: false
  }
  typeFilterOption = 'pav';
  rateFilterOption = 'recency';

  typeOptions = [
    { name: 'Photos and videos', value: 'pav' },
    { name: 'Photos', value: 'photos' },
    { name: 'Videos', value: 'videos' }
  ]
  rateOptions = [
    { name: 'Popularity', value: 'popularity' },
    { name: 'Recency', value: 'recency' }
  ]

  constructor(
    private element_ref: ElementRef,
    private atv_router: ActivatedRoute,
    private api_service: ApiService,
    private auth_service: AuthService,
    public date_service: DateService,
    private router: Router,
    private renderer: Renderer2
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
      const tw_applied = this.applyFilter(this.total_wallpapers);
      const oldLength = this.cur_wallpaper.length;
      const totalLength = tw_applied.length;
      const newLength = ((oldLength + 15) >= totalLength) ?
        totalLength : oldLength + 15;

      tw_applied.slice(
        this.cur_wallpaper.length,
        newLength
      ).forEach(wp => {
        this.cur_wallpaper.push(wp);
      })
    }
  }

  changeInformation() {
    let changeVals: any[] = [];
    let isempty = false;
    const notiRef = this.notiWrapperRef.nativeElement.querySelector('.noti-holder');
    Object.keys(this.userDetailForm.value)
      .filter((key: string) => {
        
        const val = this.userDetailForm.value[key as keyof typeof this.userDetailForm.value];
        if (key === 'fullname' && val !== this.user_account.display_name) {
          if(val === '') {
            this.renderer.setProperty(
              this.changeErrorRef.nativeElement, 
              'innerHTML', 
              'Please fill fullname.'
            );
            isempty = true;
          }
          else {
            changeVals.push({ key: 'display_name', val });
          }
        }
        else if (key === 'username' && val !== this.user_account.username) {
          if(val === '') {
            this.renderer.setProperty(
              this.changeErrorRef.nativeElement, 
              'innerHTML', 
              'Please fill username.'
            );
            isempty = true;
          }
          else 
            changeVals.push({ key, val });
        }
        else if (key === 'bio')
          changeVals.push({ key, val });
        else if (key === 'city')
          changeVals.push({ key, val });
        else if (key === 'country')
          changeVals.push({ key, val });
      });
      
    if(!isempty) {
      let isvalid = true;
      let username = changeVals.find(item => item.key === 'username')
      if(username) {
        // Check username exist
        this.api_service.getUser(username.val).subscribe(res => {
          if(res.length > 0) {
            this.renderer.setProperty(
              this.changeErrorRef.nativeElement, 
              'innerHTML', 
              'Username already exists'
            );
            isvalid = false;
          }
        })
      }
      if(isvalid) {
        this.api_service.changeInfor(this.user_account.user_id, changeVals).subscribe(res => {
          // change username in localstorage
          username && username.val && this.auth_service.setUsername(username.val);
          this.user_account.username = username.val;
          console.log(username.val);
          
          // change link

          this.renderer.addClass(this.notiWrapperRef.nativeElement, 'active');
          this.renderer.addClass(notiRef, 'active');
        })
      }
    }

  }
  onClickContinue(): void {
    const notiRef = this.notiWrapperRef.nativeElement.querySelector('.noti-holder');
    this.renderer.removeClass(this.notiWrapperRef.nativeElement, 'active');
    this.renderer.removeClass(notiRef, 'active');
    console.log(this.user_account.username);
    
    this.router.navigate(['profile', this.user_account.username, 'gallery']);
    setTimeout(() => {
      location.reload();
    }, 500)
  }
  generateRandomVersion(): string {
    const length = Math.floor(Math.random() * 10) + 5; // độ dài từ 5 đến 14 ký tự
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    const charactersLength = characters.length;
    for (let i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
  }
  applyFilter(wpp_list: any) {
    let wpplist_applied = [...wpp_list];
    switch (this.typeFilterOption) {
      case 'pav': {
        wpplist_applied = wpp_list;
        break;
      }
      case 'photos': {
        wpplist_applied = wpp_list.filter((wpp: Wallpaper) => wpp.wpp_type.includes('image'));
        break;
      }
      case 'videos': {
        wpplist_applied = wpp_list.filter((wpp: Wallpaper) => wpp.wpp_type.includes('video'));
        break;
      }
    }
    switch (this.rateFilterOption) {
      case 'popularity': {
        // Sắp xếp danh sách theo trường lover.length và total_download
        wpplist_applied.sort((a, b) => {
          const popularityA = a.lover.length + a.total_download;
          const popularityB = b.lover.length + b.total_download;
          return -1 * (popularityA - popularityB);
        });
        break;
      }
      case 'recency': {
        // Sắp xếp danh sách theo trường createat
        wpplist_applied.sort((a, b) => {
          const createatA = new Date(a.createat).getTime();
          const createatB = new Date(b.createat).getTime();
          return -1 * (createatA - createatB);
        });
        break;
      }
    }
    return wpplist_applied;
  }
  reapplyFilter():void {
    if (this.cur_tab === 'gallery') {
      const tw_applied = this.applyFilter(this.total_wallpapers);
      this.cur_wallpaper = [...tw_applied.slice(
        0,
        (tw_applied.length >= 15) ? 15 : tw_applied.length
      )];
    }
    else if (this.cur_tab === 'collection') {
      const tw_applied = this.applyFilter(this.selfCollection);
      this.cur_collection = [...tw_applied.slice(
        0,
        (tw_applied.length >= 15) ? 15 : tw_applied.length
      )];
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
  updateLove(event: any):void {
    this.total_wallpapers.forEach(wpp => {
      if (wpp.wpp_id === event.targetId) {
        if (event.type === 'unlove') {
          wpp.lover = wpp.lover.filter(uid => uid !== this.auth_service.getUsername());
          this.total_love -= 1;

        }
        else if (event.type === 'love') {
          wpp.lover.push(this.auth_service.getUsername());
          this.total_love += 1;
        }
        return;
      }
    })
    this.collection.forEach(wpp => {
      if (wpp.wpp_id === event.targetId) {
        if (event.type === 'unlove') {
          wpp.lover = wpp.lover.filter(uid => uid !== this.auth_service.getUsername());
          this.total_love -= 1;

        }
        else if (event.type === 'love') {
          wpp.lover.push(this.auth_service.getUsername());
          this.total_love += 1;
        }
        return;
      }
    })
  }
  updateDownload(new_totalDownload: number) {
    this.total_download = new_totalDownload;
  }
  updateSave(data_pkg: any):void {
    const wpp_id = data_pkg.wpp_id;
    const type = data_pkg.type;

    if (type && type === 'save') {
      // Set wpp to local collection variable
      if (this.auth.is_own) {
        this.collection.push(this.total_wallpapers.filter(wpp => wpp.wpp_id === wpp_id)[0]);
      }
      else if (this.cur_tab === 'gallery') {
        this.selfCollection.push(this.total_wallpapers.filter(wpp => wpp.wpp_id === wpp_id)[0]);
      }
      else if (this.cur_tab === 'collection') {
        this.selfCollection.push(this.collection.filter(wpp => wpp.wpp_id === wpp_id)[0]);
      }

    }
    else if (type && type === 'unsave') {
      // Set wpp to local collection variable
      this.auth.is_own && (this.collection = this.collection.filter(wpp => wpp.wpp_id !== wpp_id));
      !this.auth.is_own && (this.selfCollection = this.selfCollection.filter(wpp => wpp.wpp_id !== wpp_id));
    }
  }
  sliceArray(array: any, start: number, end: number): any {
    if (end <= start) {
      end = start + 1;
    }
    return array.slice(
      (start < array.length) ? start : array.length - 1,
      (end <= array.length) ? end : array.length
    )
  }
  isCurrentTab(id: string): boolean {
    return this.cur_tab === id ? true : false;
  }
  changeTab(btn_target: any):void {
    this.router.navigate(['profile', this.user_account.username, btn_target.target.id])
  }
  onUnfollow(): void {
    this.api_service.updateFollow(this.own_id, this.user_account.user_id, -1).subscribe(res => {
      this.user_account.follower = this.user_account.follower.filter(id => id !== this.own_id);
    });
  }
  onFollow(): void {
    this.api_service.updateFollow(this.own_id, this.user_account.user_id, 1).subscribe(res => {
      this.user_account.follower.push(this.own_id);
    });
  }
  showEditProfile():void {
    this.renderer.addClass(this.editHolderRef.nativeElement, 'active')
  }
  hideEditProfile():void {
    this.renderer.removeClass(this.editHolderRef.nativeElement, 'active')
  }
  changeEditTab(tab: string):void {
    this.cur_editTab = tab;
  }
  chooseTypeFilter(event: any):void {

  }
  chooseOptionFilter(event: any):void {

  }
  editAvatar():void {
    this.renderer.removeClass(this.udRef.nativeElement, 'active');
    this.renderer.addClass(this.componentBodyRef.nativeElement, 'active');
    const interval = setInterval(() => {
      if (this.previewImgRef) {
        this.cropper = new Cropper(this.previewImgRef.nativeElement, {
          aspectRatio: 1,
          viewMode: 1,
          dragMode: 'move',
          cropBoxResizable: false,
        });
        clearInterval(interval);
      }
    }, 100);
  }
  // ---------------------------
  isTagValid(): boolean {
    let valid = true;
    !this.pi_tags.trim().length && (valid = false);
    return valid;
  }
  onClickContinueUploadAvatar(): void {
    location.reload();
  }
  onClickUpload() {
    this.cropAndUpload();
    this.renderer.addClass(this.notiHolderRef.nativeElement, 'active');
  }
  onCancelUpload() {
    this.renderer.removeClass(this.componentBodyRef.nativeElement, 'active');
    this.renderer.addClass(this.udRef.nativeElement, 'active');
    this.imageUrl = null;
  }
  browseWallpaper() {

    let input = document.createElement('input');
    input.type = 'file';
    input.accept = "image/jpeg, image/png";
    input.onchange = _ => {
      // // you can use this method to get file and perform respective operations
      this.fileUpload = input.files && input.files[0];
      const reader = new FileReader();
      reader.onload = () => {
        this.imageUrl = reader.result as string;
      };
      this.fileUpload && reader.readAsDataURL(this.fileUpload);
    };
    input.click();
  }
  previewWallpaper() {
    const input = this.ddfRef.nativeElement.querySelector('.drag-drop-input');
    this.fileUpload = input.files && input.files[0];

    const reader = new FileReader();
    reader.onload = () => {
      this.imageUrl = reader.result as string;

      const browse_btn = this.btnWrapperRef.nativeElement.querySelector('.browse-btn');
      browse_btn && (browse_btn.style.display = 'block');

      const upload_btn = this.btnWrapperRef.nativeElement.querySelector('.upload-btn');
      upload_btn && (upload_btn.style.cursor = 'pointer');
    };
    this.fileUpload && reader.readAsDataURL(this.fileUpload);
  }
  onDragOver(event: DragEvent) {
    event.preventDefault();
  }
  onDrop(event: DragEvent) {
    event.preventDefault();
    let cur_target = event.target as HTMLElement;
    const files = event.dataTransfer?.files;
    if (files && files.length) {
      this.fileUpload = files[0];
      if (!this.fileUpload.type.match(/(png|jpg)$/)) {
        if (cur_target) {
          cur_target.style.backgroundColor = 'transparent';
          const browse_btn = cur_target.querySelector('.drag-drop-img');
          browse_btn && this.renderer.removeClass(browse_btn, 'unactive');
          alert('Only PNG and JPG images are supported.');
        }
        return;
      }
      const reader = new FileReader();
      reader.readAsDataURL(this.fileUpload);
      reader.onload = (event) => {
        this.imageUrl = event.target?.result as string;

        const browse_btn = this.btnWrapperRef.nativeElement.querySelector('.browse-btn');
        browse_btn && (browse_btn.style.display = 'block');

        const upload_btn = this.btnWrapperRef.nativeElement.querySelector('.upload-btn');
        upload_btn && (upload_btn.style.cursor = 'pointer');
      };
    }
  }
  onDragEnter(event: DragEvent) {
    let curTarget = event.target as HTMLElement;
    if (curTarget) {
      if (curTarget.tagName === 'BUTTON') {
        curTarget = curTarget.parentElement || curTarget;
      }
      const browseBtn = curTarget.querySelector('.drag-drop-img');
      browseBtn && this.renderer.addClass(browseBtn, 'unactive');
      curTarget.style.backgroundColor = 'rgb(228, 218, 218)';
    }
  }
  onDragLeave(event: DragEvent) {
    let cur_target = event.target as HTMLElement;
    // event target tagname is on uppercase 
    if (cur_target) {
      if (cur_target.tagName === 'BUTTON') {
        cur_target = cur_target.parentElement ? cur_target.parentElement : cur_target;
      }
      const browse_btn = cur_target.querySelector('.drag-drop-img');
      browse_btn && this.renderer.removeClass(browse_btn, 'unactive');
      cur_target.style.backgroundColor = 'transparent';
    }
  }
  cropAndUpload() {
    const canvas = this.cropper.getCroppedCanvas();
    
    canvas && canvas.toBlob((blob) => {
      let blodFile: any = blob;
      let fileExt = blob ? blob.type.split('/')[1] : 'jpg';

      blodFile.lastModifiedDate = new Date();
      blodFile.name = `${this.user_account.username}.${fileExt}`;
      
      let formData = new FormData();
      formData.append('username', this.user_account.username);
      formData.append('file', blodFile, blodFile.name);
  
      this.api_service.uploadAvatar(formData).subscribe(
        (res: any) => {console.log(res);
        }
      );

      this.api_service.getUser(this.user_account.username).subscribe((user_data: any) => {
        if(user_data[0]) {
          user_data[0].avatar += `?v=${this.generateRandomVersion()}`;
          this.user_account = user_data[0]
        }
      })
    });
  }

  // Hook
  ngOnInit() {
    // Check login
    this.auth.islogin = this.auth_service.isLogin();
    if (this.auth.islogin) {
      // Get username from link
      this.sub = this.atv_router.params.subscribe(param => {
        let username = param['username'];
        this.cur_tab = param['tab'];

        this.auth.is_own = this.auth_service.isOwn(username);

        // Get user data by username
        this.api_service.getUser(username).subscribe((user_data: any) => {
          if(user_data[0]) {
            user_data[0].avatar += `?v=${this.generateRandomVersion()}`;
            this.user_account = user_data[0]
          }
          
          this.auth.is_own && (this.userDetailForm = new FormGroup({
            fullname: new FormControl(user_data[0].display_name),
            username: new FormControl(user_data[0].username),
            bio: new FormControl(user_data[0].bio),
            city: new FormControl(user_data[0].location.city),
            country: new FormControl(user_data[0].location.country),
          }));
          
          if (user_data[0].user_id) {
            // Get wallpaper data by user_id
            this.api_service.getWallpapers(user_data[0].user_id).subscribe((wpps: any) => {
              this.total_wallpapers = wpps;
              const tw_applied = this.applyFilter(wpps);
              this.cur_wallpaper = this.applyFilter(tw_applied).slice(
                0,
                (tw_applied.length >= 15) ? 15 : tw_applied.length
              );
              // Split wpp type to img_wallpapers and video_wallpapers
              this.total_love = 0;
              this.total_download = 0;
              this.total_views = 0;
              this.img_wallpapers = [];
              this.video_wallpapers = [];
              wpps.forEach((wpp: any) => {
                // filter wallpaper
                if (wpp.wpp_type.includes('image')) {
                  this.img_wallpapers.push(wpp);
                }
                else {
                  this.video_wallpapers.push(wpp);
                }
                // calc total views, love, download
                this.total_views += wpp.total_views;
                this.total_love += wpp.lover.length;
                this.total_download += wpp.total_download;
              });
            });
            // // Get albums data by user_id
            // this.api_service.getAlbums(user_data[0].user_id).subscribe((albums:any) => {
            //   this.albums = albums;
            //   this.preview_albums = albums.slice(0, albums.length > 3 ? 3 : albums.length);
            // });
            // Get collection data by user_id
            this.api_service.getCollection(user_data[0].user_id).subscribe((collection: any) => {
              this.collection = collection;
              this.cur_collection = collection.slice(
                0,
                (this.collection.length >= 15) ? 15 : this.collection.length
              );
            });
            if (!this.auth.is_own) {
              this.api_service.getUser(this.auth_service.getUsername()).subscribe(data => {
                if (data[0]) {
                  this.api_service.getCollection(data[0].user_id).subscribe((collection: any) => {
                    this.selfCollection = collection;
                  });
                  this.own_id = data[0].user_id;
                }
              })
            }
          }
        })
      })
    }
  }

  ngOnDestroy(): void {
    //Called once, before the instance is destroyed.
    this.cropper && this.cropper.destroy();
    this.sub && this.sub.unsubscribe();
  }
}
